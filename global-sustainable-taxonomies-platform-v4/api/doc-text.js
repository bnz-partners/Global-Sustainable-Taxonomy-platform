/* /api/doc-text.js — Vercel serverless function (Node.js runtime)
 *
 * Returns the RAW extracted text of an official taxonomy document, exactly as
 * it appears in the source. No AI, no translation, no summarising.
 *
 * Why this exists alongside translate-pdf.js: that endpoint is for readers —
 * it machine-translates a document into the site's language, and caps the
 * document at ~150k characters because every chunk costs an AI call. This
 * endpoint is for building the platform's own activity-level dataset, where
 * the requirement is the opposite: the text must be verbatim (so a criterion
 * can be quoted and checked against the source), and nothing may be dropped
 * (the technical screening criteria of a taxonomy are usually in an annex at
 * the very back — exactly the part a 150k cap cuts off). Slicing here is pure
 * string work, so the cap can be far higher and costs nothing.
 *
 * It deliberately duplicates translate-pdf.js's fetch-and-extract logic rather
 * than refactoring it into a shared module: that logic is load-bearing in
 * production and has been hardened against a long tail of awkward government
 * sources (browser-like headers, PDF signature sniffing, a reader-proxy
 * fallback, known-blocked URLs). Copying it leaves the working endpoint
 * untouched. If it is ever changed, change it in both places.
 *
 * POST { url, probeOnly?, sliceIndex?, sliceChars? }
 *
 *   probeOnly: true   -> metadata only, no text. Use this to survey many
 *                        documents cheaply: does it fetch, does it have a real
 *                        text layer, how many pages, how many slices.
 *     -> { ok, url, kind, pages, totalChars, sliceCount, hasTextLayer, note }
 *
 *   otherwise         -> one slice of the raw text
 *     -> { ok, url, kind, pages, totalChars, sliceIndex, sliceCount, text }
 *
 * A document that cannot be fetched, or that turns out to be a scan with no
 * embedded text, is reported honestly (ok:false or hasTextLayer:false) rather
 * than returned as empty or partial text that would look like a real result.
 */

const idnTkbiV3Faq = require("./_lib/known-documents/idn-tkbi-v3-faq.js");

/* Slicing is free here (no AI per slice), so the only cap is a sanity bound
   against a pathologically huge file exhausting the function's memory. */
const MAX_TOTAL_CHARS = 1200000;
const DEFAULT_SLICE_CHARS = 60000;
const MAX_SLICE_CHARS = 120000;

/* Same known-source handling as translate-pdf.js — see the notes there. */
const KNOWN_NO_TEXT_URLS = new Set([
  "http://publication.pravo.gov.ru/Document/View/0001202109240043",
  "https://publication.pravo.gov.ru/Document/View/0001202109240043"
]);

const KNOWN_DOCUMENT_TEXTS = {
  "https://ojk.go.id/id/Publikasi/Roadmap-dan-Pedoman/Sektor-Jasa-Keuangan/Keuangan-Berkelanjutan/Documents/FAQ%20Taksonomi%20untuk%20Keuangan%20Berkelanjutan%20Indonesia%20(TKBI)%20Versi%203.pdf":
    idnTkbiV3Faq,
  "https://www.ojk.go.id/id/Publikasi/Roadmap-dan-Pedoman/Sektor-Jasa-Keuangan/Keuangan-Berkelanjutan/Documents/FAQ%20Taksonomi%20untuk%20Keuangan%20Berkelanjutan%20Indonesia%20(TKBI)%20Versi%203.pdf":
    idnTkbiV3Faq
};

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, " ")
    .trim();
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError") throw new Error(`timed out after ${timeoutMs / 1000}s`);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function withTimeout(promise, timeoutMs, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs / 1000}s`)), timeoutMs))
  ]);
}

async function fetchDirect(url) {
  let origin = "";
  try { origin = new URL(url).origin + "/"; } catch (e) { /* leave blank */ }
  const upstream = await fetchWithTimeout(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "application/pdf,text/html,application/xhtml+xml,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      ...(origin ? { Referer: origin } : {})
    }
  }, 12000);
  if (!upstream.ok) throw new Error(`HTTP ${upstream.status}`);

  const contentType = upstream.headers.get("content-type") || "";
  const buffer = Buffer.from(await upstream.arrayBuffer());
  const headerWindow = buffer.subarray(0, 1024).toString("latin1");
  const isPdfBySignature = headerWindow.includes("%PDF-");

  if (contentType.includes("pdf") || url.toLowerCase().split("?")[0].endsWith(".pdf") || isPdfBySignature) {
    const pdfParse = require("pdf-parse");
    const parsed = await pdfParse(buffer);
    return { text: (parsed.text || "").trim(), kind: "pdf", pages: parsed.numpages || null };
  }
  return { text: stripHtml(buffer.toString("utf8")), kind: "html", pages: null };
}

async function fetchViaReaderProxy(url) {
  const proxied = await fetchWithTimeout("https://r.jina.ai/" + url, {
    headers: { "Accept": "text/plain" }
  }, 28000);
  if (!proxied.ok) throw new Error(`reader proxy HTTP ${proxied.status}`);
  return { text: (await proxied.text() || "").trim(), kind: "proxy-text", pages: null };
}

/* Same binary/scaffolding detector as translate-pdf.js: a PDF whose "text" is
   really font and colour definitions is not a document we can quote from. */
function looksLikeBinaryGarbage(text) {
  const sample = text.slice(0, 2000);
  if (!sample) return false;
  let bad = 0;
  for (let i = 0; i < sample.length; i++) {
    const code = sample.charCodeAt(i);
    if (code === 0xfffd || (code < 32 && code !== 9 && code !== 10 && code !== 13)) bad++;
  }
  if (bad / sample.length > 0.02) return true;
  const structuralTokens = /\b(obj|endobj|stream|endstream|xref|trailer|xmp|xmpmeta|rdf|cmyk|gotham|illustrator|colorswatch|flatedecode|sandoll)\b/gi;
  const tokenMatches = sample.match(structuralTokens) || [];
  if (tokenMatches.join("").length / sample.length > 0.05) return true;
  return false;
}

const extractionCache = new Map();
const EXTRACTION_CACHE_MAX_AGE_MS = 10 * 60 * 1000;

async function extractText(url) {
  const cached = extractionCache.get(url);
  if (cached && Date.now() - cached.at < EXTRACTION_CACHE_MAX_AGE_MS) return cached.result;

  const knownText = KNOWN_DOCUMENT_TEXTS[url];
  if (knownText) {
    const result = { text: knownText.trim(), kind: "known-text", pages: null };
    extractionCache.set(url, { result, at: Date.now() });
    return result;
  }
  if (KNOWN_NO_TEXT_URLS.has(url)) {
    const result = { text: "", kind: "no-text-layer", pages: null };
    extractionCache.set(url, { result, at: Date.now() });
    return result;
  }

  let result;
  try {
    result = await withTimeout(fetchDirect(url), 35000, "Direct fetch + parse");
  } catch (directErr) {
    try {
      result = await withTimeout(fetchViaReaderProxy(url), 30000, "Reader-proxy fetch");
    } catch (proxyErr) {
      throw new Error(`direct: ${directErr.message}; proxy: ${proxyErr.message}`);
    }
  }
  extractionCache.set(url, { result, at: Date.now() });
  return result;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ ok: false, error: "Method not allowed. Use POST." });
      return;
    }

    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};

    const url = String(body.url || "").trim();
    if (!/^https?:\/\//i.test(url)) {
      res.status(400).json({ ok: false, error: "A document url (http/https) is required." });
      return;
    }

    let extracted;
    try {
      extracted = await extractText(url);
    } catch (err) {
      res.status(200).json({
        ok: false, url,
        error: "Could not fetch the document. The source may block automated requests.",
        detail: String(err.message || err).slice(0, 300)
      });
      return;
    }

    let text = extracted.text || "";
    const garbage = looksLikeBinaryGarbage(text);
    /* A handful of real characters is a scan or a nav-chrome page, not a
       document — say so rather than returning a plausible-looking stub. */
    const hasTextLayer = !garbage && text.trim().length >= 500;

    let note = "";
    if (garbage) {
      note = "Extraction returned PDF scaffolding rather than prose — likely an image-only or design-tool PDF.";
      text = "";
    } else if (!hasTextLayer) {
      note = "Almost no extractable text — likely a scanned document with no embedded text layer.";
      text = "";
    }

    let truncated = false;
    if (text.length > MAX_TOTAL_CHARS) {
      text = text.slice(0, MAX_TOTAL_CHARS);
      truncated = true;
      note = (note ? note + " " : "") + `Document exceeded ${MAX_TOTAL_CHARS} characters and was cut at that point.`;
    }

    const sliceChars = Math.min(
      Math.max(parseInt(body.sliceChars, 10) || DEFAULT_SLICE_CHARS, 1000),
      MAX_SLICE_CHARS
    );
    const sliceCount = text ? Math.ceil(text.length / sliceChars) : 0;

    const base = {
      ok: true, url,
      kind: extracted.kind,
      pages: extracted.pages,
      totalChars: text.length,
      sliceChars,
      sliceCount,
      hasTextLayer,
      truncated,
      note: note || undefined
    };

    if (body.probeOnly) {
      /* Enough of a fingerprint to tell, without pulling the whole document,
         whether this source is worth extracting in full. */
      base.head = text.slice(0, 400);
      res.status(200).json(base);
      return;
    }

    const sliceIndex = Math.max(parseInt(body.sliceIndex, 10) || 0, 0);
    if (sliceCount && sliceIndex >= sliceCount) {
      res.status(400).json({ ...base, ok: false, error: `sliceIndex ${sliceIndex} is past the last slice (${sliceCount - 1}).` });
      return;
    }

    base.sliceIndex = sliceIndex;
    base.text = text.slice(sliceIndex * sliceChars, (sliceIndex + 1) * sliceChars);
    res.status(200).json(base);
  } catch (err) {
    res.status(500).json({ ok: false, error: "Unexpected server error.", detail: String(err && err.message || err).slice(0, 300) });
  }
};
