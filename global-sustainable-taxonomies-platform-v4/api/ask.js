/* /api/ask.js — Vercel serverless function (Node.js runtime)
 *
 * This is the ONLY place the AI provider's API key is used. It reads the
 * key from an environment variable (ANTHROPIC_API_KEY) set in the Vercel
 * project settings — it is never sent to, or visible in, the browser.
 *
 * The front end (advisor.js, "Ask AI" tab) POSTs { question, history, lang }
 * here and gets back { answer }. This function builds a system prompt from
 * the compiled taxonomy dataset (taxonomy-data.json) so the model answers
 * using this site's data rather than only its own general knowledge. `lang`
 * is the site's currently selected UI language (one of the 8 language codes
 * used across the site's static i18n) — it's used to instruct the model to
 * reply in that language, so the "Ask AI" tab honours the same language
 * selector as the rest of the site rather than only mirroring whatever
 * language the question happened to be typed in.
 */

const fs = require("fs");
const path = require("path");

let TAXONOMY_DATA = null;
function loadData() {
  if (!TAXONOMY_DATA) {
    const raw = fs.readFileSync(path.join(__dirname, "taxonomy-data.json"), "utf8");
    TAXONOMY_DATA = JSON.parse(raw);
  }
  return TAXONOMY_DATA;
}

/* ---------------------------------------------------------------------------
   Activity-level detail (currently South Korea only)

   The reference data above is one line per jurisdiction — enough to compare
   countries, but far too coarse to answer "does my hydrogen plant qualify
   under the K-Taxonomy?". kr-taxonomy-activities.json holds all 100 K-Taxonomy
   economic activities with their verbatim determining criteria.

   Sending all 100 in full on every question would add ~90k characters to the
   prompt, so this file is used in two tiers:
     tier 1 — a compact index of all 100 activities (~8k characters), added
              only when the question is about Korea;
     tier 2 — the full criteria for up to MAX_DETAIL activities whose text
              matches the question's keywords.
   The copy read here is produced by build.py from the root
   kr-taxonomy-activities.json, so the two can never drift apart.
   --------------------------------------------------------------------------- */

let KR_ACTIVITIES = null;
function loadKrActivities() {
  if (KR_ACTIVITIES === null) {
    try {
      const raw = fs.readFileSync(path.join(__dirname, "kr-taxonomy-activities.json"), "utf8");
      KR_ACTIVITIES = JSON.parse(raw);
    } catch (e) {
      console.warn("K-Taxonomy activity data unavailable:", e.message);
      KR_ACTIVITIES = [];
    }
  }
  return KR_ACTIVITIES;
}

const KR_TRIGGERS = [
  "korea", "korean", "k-taxonomy", "ktaxonomy", "kor", "seoul", "mcee",
  "k-green", "kepco", "k-ets",
  "한국", "한국형", "녹색분류체계", "케이택소노미", "기후에너지환경부", "환경부"
];

/* Very small stop-word list so that "the", "for", "of" don't match every
   activity. Korean is matched on raw substrings instead of tokens. */
const STOP = new Set([
  "the", "and", "for", "are", "is", "of", "in", "on", "to", "a", "an", "or",
  "does", "do", "what", "which", "how", "can", "under", "with", "my", "our",
  "this", "that", "it", "be", "i", "we", "taxonomy", "korea", "korean",
  "activity", "activities", "criteria", "green"
]);

const MAX_DETAIL = 6;

function mentionsKorea(text) {
  const low = text.toLowerCase();
  return KR_TRIGGERS.some(k => low.includes(k));
}

function krIndexLines(acts) {
  return acts.map(a =>
    `- ${a.code_en} | ${a.name_en} | ${a.section_en} / ${a.objective_en} / ${a.field_en}`
  ).join("\n");
}

function krActivityDetail(a) {
  const exclusion = (a.exclusion_en || [])
    .map(r => `    - ${r.objective}: ${r.text}`).join("\n");
  return [
    `### ${a.code_en} ${a.name_en} (${a.section_en} — ${a.objective_en} — ${a.field_en})`,
    `  Activity criteria: ${a.activity_en}`,
    `  Recognition criteria (technical thresholds):`,
    (a.recognition_en || []).map(line => `    - ${line}`).join("\n"),
    `  Exclusion criteria (DNSH):`,
    exclusion,
    `  Protection criteria: ${a.protection_en}`
  ].join("\n");
}

/* Picks the activities most likely to be relevant to the question by counting
   how many of the question's keywords appear in each activity's text. */
function pickKrActivities(acts, question) {
  const low = question.toLowerCase();
  const words = low.match(/[a-z0-9][a-z0-9-]{2,}/g) || [];
  const terms = Array.from(new Set(words.filter(w => !STOP.has(w))));

  /* Korean compounds don't split on spaces — a user types "해상풍력" while the
     guideline says "풍력 기반 에너지 생산". Matching whole words alone would
     miss that, so each Korean chunk also contributes its 2- and 3-character
     substrings, scored lower than a whole-word hit. */
  const korean = low.match(/[가-힣]{2,}/g) || [];
  const koParts = new Set();
  korean.forEach(w => {
    for (let n = 3; n >= 2; n--) {
      for (let i = 0; i + n <= w.length; i++) koParts.add(w.slice(i, i + n));
    }
  });
  korean.forEach(w => koParts.delete(w));

  const scored = acts.map(a => {
    const hayEn = (a.name_en + " " + a.field_en + " " + a.activity_en + " " +
      (a.recognition_en || []).join(" ")).toLowerCase();
    const hayKo = a.name_ko + " " + a.field_ko + " " + a.activity_ko + " " +
      (a.recognition_ko || []).join(" ");
    let score = 0;
    terms.forEach(term => {
      if (a.name_en.toLowerCase().includes(term)) score += 3;
      else if (hayEn.includes(term)) score += 1;
    });
    korean.forEach(term => {
      if (a.name_ko.includes(term)) score += 3;
      else if (hayKo.includes(term)) score += 1;
    });
    koParts.forEach(part => {
      if (a.name_ko.includes(part)) score += 1;
    });
    return { a, score };
  }).filter(x => x.score > 0);

  scored.sort((x, y) => y.score - x.score);
  return scored.slice(0, MAX_DETAIL).map(x => x.a);
}

function krDetailBlock(question) {
  const acts = loadKrActivities();
  if (!acts.length) return "";

  const matches = pickKrActivities(acts, question);
  let block = [
    "",
    "SOUTH KOREA — K-TAXONOMY ACTIVITY LIST (전체 100개 경제활동, 31 Dec 2025 guideline).",
    "Codes read as objective-sector-number, e.g. 1-B-(3) = objective 1 (GHG reduction), sector B (Power Generation and Energy), activity 3.",
    "Green Area holds 93 activities, the Transitional Area 7 (marked with a leading T).",
    krIndexLines(acts)
  ].join("\n");

  if (matches.length) {
    block += "\n\nFULL DETERMINING CRITERIA for the activities most relevant to this question " +
      "(verbatim from the official English edition of the guideline — quote the thresholds exactly, " +
      "and say plainly when the user's case is not covered by these entries):\n" +
      matches.map(krActivityDetail).join("\n\n");
  }
  return block;
}

const LANGUAGE_NAMES = {
  en: "English",
  sv: "Swedish (Svenska)",
  ko: "Korean (한국어)",
  es: "Spanish (Español)",
  fr: "French (Français)",
  de: "German (Deutsch)",
  ja: "Japanese (日本語)",
  zh: "Chinese (中文)"
};

function buildSystemPrompt(langCode, question, countryIso) {
  const data = loadData();
  const lines = Object.entries(data).map(([iso, e]) => {
    const parts = [
      `${e.name} (${iso})`,
      `status: ${e.status}`,
      e.taxonomy ? `taxonomy name: ${e.taxonomy}` : null,
      e.year ? `year published: ${e.year}` : null,
      e.region ? `region: ${e.region}` : null,
      e.regulator ? `regulator: ${e.regulator}` : null,
      e.source ? `source: ${e.source}` : null,
      e.note ? `notes: ${e.note}` : null,
      e.sectors && e.sectors.length ? `sectors covered: ${e.sectors.join(", ")}` : null,
      e.facts ? `facts: ${JSON.stringify(e.facts)}` : null,
      e.objectives && e.objectives.length ? `environmental objectives: ${e.objectives.map(o => o.label).join(", ")}` : null,
      e.overlays && e.overlays.length ? `also applies: ${e.overlays.map(o => o.name).join(", ")}` : null
    ].filter(Boolean);
    return "- " + parts.join(" | ");
  });

  const languageName = LANGUAGE_NAMES[langCode];
  const languageLine = languageName
    ? `Respond in ${languageName} — this is the language the user has selected for the site's interface. If the user's question is clearly written in a different language, respond in that language instead.`
    : "Respond in the same language the user's question is written in.";

  const staticPrompt = [
    "You are the AI Assistant for the Global Sustainable Taxonomies website — available both as the Advisor page's dedicated chat and as a persistent assistant widget on every page of the site.",
    "You help users understand and compare countries' sustainable finance taxonomies (green/sustainable activity classification frameworks), explain taxonomy terminology and concepts, and guide users to the relevant section of the platform for what they're trying to do. You should be equally useful to a seasoned sustainable finance professional and to a student encountering taxonomies for the first time — adjust the depth of your explanation to the question, and don't assume prior jargon knowledge unless the question demonstrates it.",
    "Answer using the reference data listed below, plus your general knowledge of how sustainable finance taxonomies typically work (e.g. explaining what DNSH or minimum safeguards mean in general).",
    "If asked to compare two or more countries, structure your answer clearly (e.g. short paragraphs or a simple comparison), highlighting concrete differences: status, year, scope/sectors, DNSH, minimum safeguards, mandatory vs voluntary.",
    "If the data needed to answer isn't in the reference data below, say so plainly instead of guessing or inventing specifics.",
    "For South Korea the reference data goes down to individual economic activities. When you use it, cite the activity by its code and name (e.g. \"1-B-(3) Production of Hydrogen\"), quote thresholds exactly as written rather than rounding or paraphrasing them, and remind the user that the four steps — activity, recognition, exclusion and protection criteria — must all be satisfied. If an activity the user describes is not on the list, say so rather than stretching a neighbouring activity to fit; point them to the country page's objective drill-down for the full list.",
    "This is an informational tool, not legal, financial, or regulatory advice — if the user asks for a compliance determination for a specific transaction, remind them to confirm against official sources.",
    "Keep answers concise and readable in a chat widget — avoid long walls of text.",
    "",
    "SITE STRUCTURE (use this to direct users to the right place when relevant):",
    "- Interactive Global Map (index.html): a world map of every country's taxonomy status, with search and advanced filtering by environmental objective/sector, plus a 'Matching Countries' results list.",
    "- Country pages (country.html?iso=XX): a detailed research report per country — taxonomy overview, official documents, environmental objectives, technical screening criteria, and a side-by-side comparison tool with another country.",
    "- AI Advisor (advisor.html): four tabs — 'Multi-Country Comparison' (describe an activity, see a table of which countries' taxonomies match), 'Country-Specific Advisor' (pick a country + describe an activity, get a detailed DNSH/criteria breakdown), 'Portfolio Comparison' (assess multiple activities at once across countries), and 'Ask AI' (free-form chat).",
    "- Media & Trend Hub (media.html): live news/reports/papers feed plus AI-generated trend insights and thematic/timeline charts.",
    "- Subscribe (subscribe.html): sign up for a weekly email digest of taxonomy news and updates.",
    "- About (about.html): platform mission, team, BNZ PARTNERS background, and key reference resources.",
    "If a user asks 'where can I find X' or describes a goal that matches one of these sections, tell them which page and tab to use.",
    "",
    "REFERENCE DATA (one line per jurisdiction):",
    lines.join("\n")
  ].join("\n");

  /* Korea is the one jurisdiction where the site holds activity-level
     criteria. Adding them only when the question is about Korea keeps the
     prompt (and the per-question API cost) small for everything else. */
  /* The chat on a country page sends that page's ISO code, so a question like
     "is offshore wind covered?" still gets Korea's activity data even though
     the question itself never says "Korea". */
  const koreaContext = countryIso === "KOR" || (question && mentionsKorea(question));

  const dynamic = [
    languageLine,
    countryIso ? `The user is reading the country page for ${countryIso}. Assume questions are about that jurisdiction unless they name another one.` : "",
    koreaContext ? krDetailBlock(question || "") : ""
  ].filter(Boolean).join("\n");

  /* The static half is byte-identical on every question, so it is marked as a
     cache breakpoint: Anthropic then charges the cheaper cache-read rate for
     it instead of re-reading ~30k tokens of reference data at full price on
     every single question. The Korea block changes per question and therefore
     sits after the breakpoint, uncached. Set ASK_DISABLE_PROMPT_CACHE=1 in
     Vercel to fall back to a plain string prompt. */
  const blocks = [{ type: "text", text: staticPrompt }];
  if (process.env.ASK_DISABLE_PROMPT_CACHE !== "1") {
    blocks[0].cache_control = { type: "ephemeral" };
  }
  if (dynamic) blocks.push({ type: "text", text: dynamic });
  return blocks;
}

/* Plain-string version of the same prompt, used as a fallback if the API
   rejects the cache_control field for any reason. */
function flattenSystem(blocks) {
  return blocks.map(b => b.text).join("\n");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: "The server is missing an ANTHROPIC_API_KEY environment variable. Set it in your Vercel project settings (see DEPLOY_INSTRUCTIONS.md) and redeploy."
    });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const question = String(body.question || "").trim();
  const history = Array.isArray(body.history) ? body.history : [];
  const langCode = LANGUAGE_NAMES[body.lang] ? body.lang : null;
  /* Optional page context sent by the country-page chat. */
  const countryIso = /^[A-Z]{3}$/.test(String(body.country || "").toUpperCase())
    ? String(body.country).toUpperCase() : null;

  if (!question) {
    res.status(400).json({ error: "Missing 'question' in request body." });
    return;
  }
  if (question.length > 4000) {
    res.status(400).json({ error: "Question is too long (max 4000 characters)." });
    return;
  }

  const messages = history
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-8)
    .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));
  messages.push({ role: "user", content: question });

  const systemBlocks = buildSystemPrompt(langCode, question, countryIso);

  async function callModel(system) {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
        max_tokens: 1024,
        system,
        messages
      })
    });
    return { upstream, data: await upstream.json() };
  }

  try {
    let { upstream, data } = await callModel(systemBlocks);

    /* If this account or API version doesn't accept the prompt-cache field,
       retry once with a plain string prompt rather than showing the user an
       error. Everything still works, just without the caching discount. */
    const rejectedCache = !upstream.ok && /cache_control|system\.0|invalid_request/i.test(
      (data && data.error && data.error.message) || ""
    );
    if (rejectedCache) {
      console.warn("Prompt caching rejected, retrying without it:", data.error.message);
      ({ upstream, data } = await callModel(flattenSystem(systemBlocks)));
    }

    if (!upstream.ok) {
      const msg = (data && data.error && data.error.message) || `Upstream API error (HTTP ${upstream.status})`;
      res.status(upstream.status).json({ error: msg });
      return;
    }

    const text = Array.isArray(data.content)
      ? data.content.map(block => block.text || "").join("\n").trim()
      : "";

    res.status(200).json({ answer: text || "(The model returned an empty response.)" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reach the AI provider: " + err.message });
  }
};
