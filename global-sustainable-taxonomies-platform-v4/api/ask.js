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

/* Naming the country is not the only way a question is about Korea. Asking
   "전환부문에 원자력이 포함되나요?" uses K-Taxonomy's own vocabulary without
   ever saying "한국" — before this list was widened, such questions reached the
   model with no Korean activity data at all, and it correctly but unhelpfully
   answered that it had nothing on file. */
const KR_TRIGGERS = [
  "korea", "korean", "k-taxonomy", "ktaxonomy", "kor", "seoul", "mcee",
  "k-green", "kepco", "k-ets", "green area", "transitional area",
  "한국", "한국형", "녹색분류체계", "케이택소노미", "k-택소노미",
  "기후에너지환경부", "환경부", "환경산업기술원",
  /* K-Taxonomy's own terms of art */
  "녹색부문", "전환부문", "활동기준", "인정기준", "배제기준", "보호기준",
  "적합성판단", "녹색채권", "녹색여신", "온실가스 감축 핵심기술", "혁신품목"
];

/* Second net: a question written in Korean that talks about taxonomies at all
   is, on this site, almost always about the K-Taxonomy. Requiring one of these
   words keeps a Korean-language question about the EU from pulling in Korea's
   data unnecessarily. */
const KR_KO_CONTEXT = ["택소노미", "분류체계", "녹색", "기준", "부문", "활동", "경제활동"];
const HANGUL = /[가-힣]/;

/* Very small stop-word list so that "the", "for", "of" don't match every
   activity. Korean is matched on raw substrings instead of tokens. */
const STOP = new Set([
  "the", "and", "for", "are", "is", "of", "in", "on", "to", "a", "an", "or",
  "does", "do", "what", "which", "how", "can", "under", "with", "my", "our",
  "this", "that", "it", "be", "i", "we", "taxonomy", "korea", "korean",
  "activity", "activities", "criteria", "green"
]);

/* Korean questions are dense with words that appear in almost every activity
   name ("설비", "구축", "해당") — left in, they drown out the one term that
   actually identifies the activity. Asking about "반도체 공장의 폐열회수 설비"
   was surfacing steel and cement manufacturing while missing
   1-B-(16) 폐열·냉열·감압 기반 에너지 생산 entirely. */
const KO_STOP = new Set([
  "설비", "시설", "장비", "공장", "사업", "사업장", "활동", "경제활동", "기준",
  "해당", "여부", "경우", "대상", "관련", "포함", "구축", "운영", "개조", "이용",
  "사용", "적용", "필요", "가능", "무엇", "알려줘", "알려", "어떻게", "어떤",
  "녹색", "녹색부문", "전환부문", "분류체계", "택소노미", "인정기준", "배제기준",
  "보호기준", "활동기준", "적합성판단", "한국", "한국형"
]);

const MAX_DETAIL = 6;

/* Names of the other jurisdictions most often asked about in Korean — if one of
   these appears, the question is about that country, not Korea. */
const OTHER_JURISDICTIONS_KO = [
  "eu", "유럽", "이유", "중국", "일본", "싱가포르", "태국", "인도네시아", "말레이시아",
  "베트남", "필리핀", "호주", "뉴질랜드", "영국", "미국", "캐나다", "인도", "브라질",
  "남아공", "아세안", "asean"
];

function mentionsKorea(text) {
  const low = text.toLowerCase();
  if (KR_TRIGGERS.some(k => low.includes(k))) return true;

  if (HANGUL.test(text) &&
      KR_KO_CONTEXT.some(k => low.includes(k)) &&
      !OTHER_JURISDICTIONS_KO.some(k => low.includes(k))) {
    return true;
  }
  return false;
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
  const koreanRaw = low.match(/[가-힣]{2,}/g) || [];
  const korean = koreanRaw.filter(w => !KO_STOP.has(w));
  const koParts = new Set();
  koreanRaw.forEach(w => {
    for (let n = 4; n >= 2; n--) {
      for (let i = 0; i + n <= w.length; i++) {
        const part = w.slice(i, i + n);
        if (!KO_STOP.has(part)) koParts.add(part);
      }
    }
  });
  koreanRaw.forEach(w => koParts.delete(w));

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
    /* A fragment that lands in the activity's own NAME is a strong signal —
       "폐열" out of "폐열회수" pointing at 폐열·냉열 기반 에너지 생산 — so it
       outranks a whole word that merely appears somewhere in the criteria. */
    koParts.forEach(part => {
      if (a.name_ko.includes(part)) score += 2 + (part.length >= 3 ? 1 : 0);
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

/* Shown instead of the old "(The model returned an empty response.)" — an
   error string told the user nothing and left them stuck. A model that returns
   nothing has almost always failed to understand the question, so invite a
   narrower one instead. */
const CLARIFY_PROMPT = {
  en: "I couldn't tell what you're asking. Could you narrow it down? For example: a specific country's taxonomy status, the criteria for a particular economic activity, or a comparison between two countries.",
  ko: "질문을 정확히 파악하지 못했습니다. 조금만 좁혀서 다시 여쭤봐 주시겠어요? 예를 들어 — 특정 국가의 택소노미 현황, 특정 경제활동의 판단기준, 또는 두 나라 기준 비교처럼 알려주시면 답변드릴 수 있습니다.",
  ja: "ご質問の意図を把握できませんでした。もう少し具体的にお願いできますか。例えば、特定の国のタクソノミーの状況、特定の経済活動の判定基準、2か国の比較などです。",
  zh: "我无法确定您的问题。能否再具体一些？例如：某个国家的分类标准现状、某项经济活动的判定标准，或两国标准的比较。",
  es: "No he podido entender su pregunta. ¿Podría concretarla? Por ejemplo: la situación de la taxonomía de un país, los criterios de una actividad económica concreta, o una comparación entre dos países.",
  fr: "Je n'ai pas saisi votre question. Pourriez-vous la préciser ? Par exemple : la situation de la taxonomie d'un pays, les critères d'une activité économique précise, ou une comparaison entre deux pays.",
  de: "Ich konnte Ihre Frage nicht einordnen. Könnten Sie sie eingrenzen? Zum Beispiel: der Taxonomie-Status eines Landes, die Kriterien einer bestimmten Wirtschaftstätigkeit oder ein Vergleich zweier Länder.",
  sv: "Jag kunde inte tolka din fråga. Kan du precisera den? Till exempel: ett lands taxonomistatus, kriterierna för en viss ekonomisk aktivitet, eller en jämförelse mellan två länder."
};

/* Appended when the model hit the token ceiling, so a clipped answer is never
   presented as a finished one. */
const TRUNCATED_NOTE = {
  en: "\n\n— (Answer cut off here because it ran long. Ask about one activity or one country at a time for the full detail.)",
  ko: "\n\n— (답변이 길어져 여기서 잘렸습니다. 활동 하나 또는 국가 하나씩 나눠서 물어보시면 끝까지 답변드립니다.)",
  ja: "\n\n—（回答が長くなったため、ここで切れています。活動または国を一つずつお尋ねください。）",
  zh: "\n\n—（回答过长已在此截断。请逐一询问单个活动或单个国家。）",
  es: "\n\n— (La respuesta se ha cortado por extensión. Pregunte por una actividad o un país cada vez.)",
  fr: "\n\n— (Réponse tronquée car trop longue. Posez la question une activité ou un pays à la fois.)",
  de: "\n\n— (Antwort wurde wegen Länge abgeschnitten. Fragen Sie nach einer Aktivität oder einem Land auf einmal.)",
  sv: "\n\n— (Svaret klipptes av på grund av längd. Fråga om en aktivitet eller ett land i taget.)"
};

function localised(table, langCode) {
  return table[langCode] || table.en;
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

    "HOW TO STRUCTURE EVERY ANSWER — answer first, reasoning after:",
    "1. Open with the answer itself in one to three sentences. Never open with restating the question, with caveats, or with what you are about to do. If the honest answer is 'it depends' or 'this is not on the list', say that in the first sentence.",
    "2. Then give the reasoning and the specifics — the activity code and name, the actual threshold, the relevant criteria.",
    "3. If the user has to check something themselves, name exactly where and what to look for in one or two short lines — the page and tab, or the document and section. Do not spell out a multi-step procedure or repeat what the site already shows them.",
    "4. Close with a single short line only if there is a real limitation or caveat worth flagging (data not verified, criteria may have been revised, this is not a compliance determination). If there is nothing worth flagging, end after the substance.",
    "Keep the whole answer short enough to read without scrolling — this renders in a chat panel. Prefer a few tight paragraphs or a short list over long prose, and never pad.",
    "",
    "If asked to compare two or more countries, lead with the single most important difference, then give a compact comparison: status, year, scope/sectors, DNSH, minimum safeguards, mandatory vs voluntary.",
    "If the data needed to answer isn't in the reference data below, say so plainly in the first sentence instead of guessing or inventing specifics — then point to the closest thing the site does have.",
    "If the question is ambiguous, too broad, or you cannot tell what is being asked, do not guess and do not produce an empty reply. Ask one short clarifying question, and offer two or three concrete options the user can pick from so they do not have to phrase it again from scratch.",
    "For South Korea the reference data goes down to individual economic activities. When you use it, cite the activity by its code and name (e.g. \"1-B-(3) Production of Hydrogen\"), quote thresholds exactly as written rather than rounding or paraphrasing them, and remind the user that the four steps — activity, recognition, exclusion and protection criteria — must all be satisfied. If an activity the user describes is not on the list under that exact name, say so in the first sentence, then name the closest activities that plausibly cover it (by code) so the user has somewhere to go — do not stretch one to fit, and do not walk them through a lookup procedure.",
    "This is an informational tool, not legal, financial, or regulatory advice — if the user asks for a compliance determination for a specific transaction, remind them to confirm against official sources.",
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
        /* 1024 cut real answers off mid-sentence. The system prompt now asks
           for a short, answer-first reply, so this ceiling is a safety net
           rather than the normal stopping point — and api/ask.js has 30s in
           vercel.json, which a reply of this length stays well inside. */
        max_tokens: 2000,
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

    let text = Array.isArray(data.content)
      ? data.content.map(block => block.text || "").join("\n").trim()
      : "";

    /* A reply that stopped at the ceiling ends mid-sentence. Say so rather than
       letting it look like the answer simply ended there. */
    if (text && data.stop_reason === "max_tokens") {
      text += localised(TRUNCATED_NOTE, langCode);
    }

    res.status(200).json({ answer: text || localised(CLARIFY_PROMPT, langCode) });
  } catch (err) {
    res.status(500).json({ error: "Failed to reach the AI provider: " + err.message });
  }
};
