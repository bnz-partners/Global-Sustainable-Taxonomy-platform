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
  "activity", "activities", "criteria", "green",
  /* Added 2026-09: the Korean branch drops its generic nouns (설비·공장·해당)
     but the English branch did not, so words that sit in dozens of activity
     names — "facility", "plant", "production" — drowned out the one word that
     actually identified the activity. Same answer, different language, was the
     reviewer-reported symptom. */
  "facility", "facilities", "plant", "plants", "equipment", "installation",
  "installations", "system", "systems", "operation", "operations", "project",
  "projects", "process", "processes", "sector", "sectors", "area", "areas",
  "covered", "cover", "include", "included", "includes", "eligible",
  "eligibility", "threshold", "thresholds", "requirement", "requirements",
  "standard", "standards", "rule", "rules", "new", "use", "used", "using",
  "would", "should", "could", "about", "any", "there", "from", "into",
  "qualify", "qualifies", "count", "counts", "classified", "classification",
  "sustainable", "finance", "financing"
]);

/* A question asked in one language must reach the other language's fields —
   the dataset carries both, but a Korean word never matches an English name.
   Small and hand-picked: only terms that identify an activity. */
const CROSS_LANG = {
  "태양광": "solar", "태양열": "solar", "풍력": "wind", "해상풍력": "offshore wind",
  "수소": "hydrogen", "암모니아": "ammonia", "원자력": "nuclear", "원전": "nuclear",
  "폐열": "waste heat", "폐기물": "waste", "재활용": "recycling", "바이오": "bio",
  "바이오매스": "biomass", "지열": "geothermal", "수력": "hydro", "조력": "tidal",
  "연료전지": "fuel cell", "전기차": "electric vehicle", "이차전지": "battery",
  "배터리": "battery", "철강": "steel", "시멘트": "cement", "반도체": "semiconductor",
  "석유화학": "petrochemical", "정유": "refining", "제지": "paper", "조선": "shipbuilding",
  "해운": "shipping", "항공": "aviation", "철도": "railway", "물류": "logistics",
  "건축": "building", "건물": "building", "냉난방": "heating cooling",
  "열병합": "cogeneration", "송배전": "transmission distribution", "에너지저장": "storage",
  "탄소포집": "carbon capture", "산림": "forest", "농업": "agriculture",
  "어업": "fishing", "양식": "aquaculture", "상수도": "water supply",
  "하수": "sewage", "대기오염": "air pollution", "생물다양성": "biodiversity"
};
const CROSS_LANG_REV = (() => {
  const out = {};
  Object.keys(CROSS_LANG).forEach(k => {
    const v = CROSS_LANG[k];
    if (!out[v]) out[v] = [];
    out[v].push(k);
  });
  return out;
})();

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
  /* Hyphens are treated as spaces: a user writes "waste-heat recovery" while
     the guideline says "Waste Heat". Keeping the hyphenated form as a single
     token would make it match nothing at all. */
  const words = low.replace(/[-‐-―]/g, " ").match(/[a-z0-9]{3,}/g) || [];
  const seq = words.filter(w => !STOP.has(w));   // question order, stop words dropped
  const terms = Array.from(new Set(seq));

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

  /* Cross-language reach: a Korean term contributes its English counterpart to
     the English term list and vice versa, so the same question scores the same
     way whichever language it was typed in. */
  const extraEn = [];
  koreanRaw.forEach(w => {
    Object.keys(CROSS_LANG).forEach(k => { if (w.includes(k)) extraEn.push(CROSS_LANG[k]); });
  });
  const extraKo = [];
  terms.forEach(t => {
    Object.keys(CROSS_LANG_REV).forEach(en => {
      if (en.split(" ").indexOf(t) !== -1) CROSS_LANG_REV[en].forEach(k => extraKo.push(k));
    });
  });
  const enTerms = Array.from(new Set(terms.concat(extraEn.join(" ").split(" ").filter(Boolean))));
  const koTerms = Array.from(new Set(korean.concat(extraKo)));

  /* The English analogue of the Korean fragment bonus: an adjacent pair of
     surviving words that appears in the activity's NAME as a phrase ("waste
     heat") is a far stronger signal than the two words scoring separately. */
  const phrases = [];
  for (let i = 0; i + 1 < seq.length; i++) phrases.push(seq[i] + " " + seq[i + 1]);
  extraEn.forEach(p => { if (p.indexOf(" ") !== -1) phrases.push(p); });

  const scored = acts.map(a => {
    const hayEn = (a.name_en + " " + a.field_en + " " + a.activity_en + " " +
      (a.recognition_en || []).join(" ")).toLowerCase();
    const hayKo = a.name_ko + " " + a.field_ko + " " + a.activity_ko + " " +
      (a.recognition_ko || []).join(" ");
    let score = 0;
    enTerms.forEach(term => {
      if (a.name_en.toLowerCase().includes(term)) score += 3;
      else if (hayEn.includes(term)) score += 1;
    });
    koTerms.forEach(term => {
      if (a.name_ko.includes(term)) score += 3;
      else if (hayKo.includes(term)) score += 1;
    });
    phrases.forEach(ph => {
      if (a.name_en.toLowerCase().includes(ph)) score += 4;
      else if (hayEn.includes(ph)) score += 1;
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

  /* Fallback for a question whose wording shares no whole word with the
     guideline — "afforestation" never equals "forest", so an English question
     that a Korean one would have answered came back with no criteria at all.
     Only runs when the normal pass found almost nothing, so it cannot dilute a
     good match: a long question word that CONTAINS an activity-name word is
     treated as a weak hit. */
  if (scored.length < 2) {
    const longTerms = enTerms.filter(t => t.length >= 7);
    if (longTerms.length) {
      const already = new Set(scored.map(x => x.a));
      const extra = [];
      acts.forEach(a => {
        if (already.has(a)) return;
        const nameWords = (a.name_en || "").toLowerCase().match(/[a-z]{5,}/g) || [];
        let s = 0;
        nameWords.forEach(w => {
          longTerms.forEach(t => { if (t !== w && t.indexOf(w) !== -1) s += 2; });
        });
        if (s > 0) extra.push({ a, score: s });
      });
      extra.sort((x, y) => y.score - x.score);
      scored.push.apply(scored, extra);
    }
  }

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

/* ---------------------------------------------------------------------------
   Activity-level detail — EU Taxonomy (EU-27 + the three EEA EFTA states)

   Same two-tier shape as the Korean block above, for the same reason: sending
   all 241 objective-activity records in full would add ~1.3M characters to the
   prompt. Tier 1 is a one-line index of every record (~18k characters), tier 2
   the full criteria for up to EU_MAX_DETAIL records that match the question,
   plus the common Appendix text those records point at (a DNSH entry that just
   says "complies with Appendix A" is useless without it).

   The copy read here is produced by build.py from the root
   eu-taxonomy-activities.json, so the two can never drift apart.
   --------------------------------------------------------------------------- */

let EU_ACTIVITIES = null;
function loadEuActivities() {
  if (EU_ACTIVITIES === null) {
    try {
      const raw = fs.readFileSync(path.join(__dirname, "eu-taxonomy-activities.json"), "utf8");
      EU_ACTIVITIES = JSON.parse(raw);
    } catch (e) {
      console.warn("EU Taxonomy activity data unavailable:", e.message);
      EU_ACTIVITIES = { activities: [], appendices: {}, appendix_set: {}, meta: {} };
    }
  }
  return EU_ACTIVITIES;
}

/* ---------------------------------------------------------------------------
   Ontology layer (taxonomy-ontology.json)

   Korea and the EU each have their own activity file because the site renders
   their criteria on screen. Everything else the assistant needs in order to
   answer ACROSS countries lives here:

     profiles   one compact record per framework — issuer, legal basis, which
                objectives it covers, and, most importantly, what SHAPE it has.
                Four shapes appear so far: threshold-based (EU, Korea), an
                eligible-project list (UMOA), a principles-based classification
                (Philippines), and a product list carrying customs codes
                (Kyrgyzstan). Two frameworks of different shape cannot be
                ranked by strictness, and saying so is usually the real answer
                to "which country is stricter?".
     crosswalk  which activity in one framework is the same activity in
                another. Only links a human checked (curated) or that scored
                high (confident) are shipped; anything weaker would quietly
                put the wrong two activities side by side.
     metrics    the same activity across frameworks with every number each one
                attaches to it — and, just as useful, which frameworks attach
                no number at all.
     frameworks full activity records for the frameworks that have no page of
                their own yet (UMOA, Kyrgyzstan, Philippines).

   The file is produced by the ontology build in scratchpad/onto and copied
   into api/ by build.py, the same way the Korea and EU files are.
   --------------------------------------------------------------------------- */

let ONTOLOGY = null;
function loadOntology() {
  if (ONTOLOGY === null) {
    try {
      const raw = fs.readFileSync(path.join(__dirname, "taxonomy-ontology.json"), "utf8");
      ONTOLOGY = JSON.parse(raw);
    } catch (e) {
      console.warn("Ontology data unavailable:", e.message);
      ONTOLOGY = { profiles: [], metrics: [], crosswalk: { links: [] },
                   jurisdiction_frameworks: {}, frameworks: {}, meta: {} };
    }
  }
  return ONTOLOGY;
}

const STRUCTURE_PLAIN = {
  "threshold-based":
    "numeric thresholds written into the rules, activity by activity",
  "activity-list":
    "a list of eligible projects; most entries carry no number",
  "principles-based":
    "no activity list and no thresholds — a classification rule plus guiding questions",
  "product-and-activity list with customs codes":
    "goods and equipment down to customs-code level, tied to tax relief"
};

/* The always-on part: five short paragraphs, identical on every question, so
   it sits inside the cached half of the prompt and costs almost nothing. */
function ontologyBrief() {
  const o = loadOntology();
  if (!o.profiles || !o.profiles.length) return "";
  const lines = o.profiles.map(p => {
    const bits = [
      `${p.name}${p.name_ko ? " / " + p.name_ko : ""} [${p.id}]`,
      `issuer: ${p.issuer}`,
      `shape: ${p.structure} — ${STRUCTURE_PLAIN[p.structure] || ""}`,
      `objectives: ${(p.objectives_local || []).join(", ") || "n/a"}`,
      `scale: ${p.scale.activities} activities, ${p.scale.thresholds} numeric thresholds`,
      `applies in ${p.jurisdiction_count} jurisdiction(s): ` +
        (p.jurisdictions.length > 10
          ? p.jurisdictions.slice(0, 10).join(", ") + ` +${p.jurisdictions.length - 10} more`
          : p.jurisdictions.join(", ")),
      `decimal separator: "${p.decimal_separator}"`,
      p.version ? `version: ${p.version}` : null
    ].filter(Boolean);
    return "- " + bits.join(" | ");
  });

  const rules = [
    "Compare SHAPE before comparing strictness. If one framework states thresholds and the other only lists eligible projects, there is no 'stricter' to report — say that plainly and compare what can be compared (which activities each one recognises, which objectives each one covers).",
    "Decimal separators differ between frameworks. The EU and the francophone documents use a comma as the decimal point (1,331 means 1.331); English-language documents use it as a thousands separator. Each framework's separator is given above — read it before quoting a number.",
    "Never cite an activity by its bare number. The same number means different activities in different annexes and different frameworks. Use the full id (CCM-4.5, kr:1-B-8, umoa:1.5).",
    "When a framework has no number for an activity, say so explicitly. 'Korea states no numeric threshold for this activity' is an answer; silently leaving Korea out of the comparison is not.",
    "Only equivalences marked curated or confident are stated as 'the same activity'. If the crosswalk is unsure, say the two look comparable but have not been verified."
  ];

  return [
    "",
    "TAXONOMY FRAMEWORKS THE ASSISTANT HOLDS IN DEPTH (beyond the one-line-per-country data above):",
    lines.join("\n"),
    "",
    "RULES FOR CROSS-FRAMEWORK ANSWERS:",
    rules.map((r, i) => `${i + 1}. ${r}`).join("\n")
  ].join("\n");
}

const EU_ISOS = new Set([
  "AUT", "BEL", "BGR", "HRV", "CYP", "CZE", "DNK", "EST", "FIN", "FRA",
  "DEU", "GRC", "HUN", "IRL", "ITA", "LVA", "LTU", "LUX", "MLT", "NLD",
  "POL", "PRT", "ROU", "SVK", "SVN", "ESP", "SWE", "NOR", "ISL", "LIE"
]);

/* As with Korea, naming the jurisdiction is not the only way a question is
   about it: "위임규정에서 원자력은 어떻게 다루나요?" uses the EU's own
   vocabulary without ever saying EU. */
const EU_TRIGGERS = [
  "eu taxonomy", "eu-taxonomy", "european union", "european commission",
  "eur-lex", "eurlex", "delegated act", "delegated regulation",
  "taxonomy regulation", "2020/852", "2021/2139", "2023/2486",
  "csrd", "sfdr", "nfrd", "do no significant harm", "dnsh",
  "minimum safeguards", "enabling activity", "transitional activity",
  "eu 택소노미", "eu택소노미", "유럽", "유럽연합", "이유택소노미",
  "위임규정", "위임법", "기술선별기준", "택소노미 규정", "최소안전장치"
];

const EU_MAX_DETAIL = 4;
/* One EU record can run to 15k characters (circular economy 1.2). Left whole,
   four of them would dominate the prompt, so each is capped and the cut is
   marked rather than hidden. */
const EU_DETAIL_CHARS = 6000;

const EU_OBJ_LABEL = {
  climate_mitigation: "Climate change mitigation",
  climate_adaptation: "Climate change adaptation",
  water: "Water and marine resources",
  circular_economy: "Circular economy",
  pollution: "Pollution prevention and control",
  biodiversity: "Biodiversity and ecosystems"
};

/* "EU" on its own has to be matched on a word boundary, not as a substring:
   "neutral", "reuse" and "Deutschland" all contain it. */
const EU_WORD = /(^|[^a-z])eu([^a-z]|$)/i;
/* A record id typed directly is about the EU whatever else the sentence says. */
const EU_ID = /\b(?:CCM|CCA|WTR|CE|PPC|BIO)-\d{1,2}\.\d{1,2}\b/i;

function mentionsEu(text) {
  const low = text.toLowerCase();
  if (EU_TRIGGERS.some(k => low.includes(k))) return true;
  if (EU_ID.test(text)) return true;
  return EU_WORD.test(text);
}

/* Korean → the exact English wording the EU annexes use. CROSS_LANG above is
   tuned to the K-Taxonomy's vocabulary and is too loose here — its "수력" →
   "hydro" matches "hydrogen" and buried hydropower under five hydrogen
   entries — so these take precedence and CROSS_LANG is only the fallback. */
const EU_KO_ALIAS = {
  "수력발전": "hydropower", "수력": "hydropower", "양수": "hydropower",
  "태양광": "solar photovoltaic", "태양열": "solar", "집광형": "concentrated solar",
  "풍력": "wind power", "해상풍력": "offshore wind", "육상풍력": "wind power",
  "지열": "geothermal", "해양에너지": "ocean energy", "조력": "ocean energy",
  "원자력": "nuclear", "원전": "nuclear", "소형모듈원자로": "nuclear",
  "수소": "hydrogen", "암모니아": "anhydrous ammonia", "연료전지": "hydrogen",
  "바이오매스": "bioenergy", "바이오가스": "biogas", "바이오연료": "biofuels",
  "천연가스": "fossil gaseous fuels", "가스발전": "fossil gaseous fuels",
  "석탄": "coal", "열병합": "cogeneration", "지역난방": "district heating",
  "히트펌프": "heat pump", "열펌프": "heat pump", "폐열": "waste heat",
  "송전": "transmission", "배전": "distribution", "에너지저장": "storage",
  "배터리": "batteries", "이차전지": "batteries", "축전지": "batteries",
  "전기차": "electric", "전기자동차": "electric",
  "철강": "iron and steel", "시멘트": "cement", "알루미늄": "aluminium",
  "유리": "glass", "종이": "paper", "펄프": "pulp", "비료": "fertiliser",
  "화학": "chemicals", "석유화학": "chemicals", "플라스틱": "plastic",
  "포장재": "plastic packaging", "포장": "packaging",
  "반도체": "electronic", "전기전자": "electrical and electronic",
  "데이터센터": "data processing hosting", "소프트웨어": "computer programming",
  "건물": "buildings", "건축": "construction", "신축": "new buildings",
  "리모델링": "renovation", "개보수": "renovation", "철거": "demolition",
  "콘크리트": "concrete", "도로": "road", "철도": "rail",
  "항공": "air transport", "공항": "airport", "해운": "sea", "선박": "vessels",
  "물류": "freight", "탄소포집": "carbon capture", "직접공기포집": "direct air capture",
  "탄소저장": "underground permanent geological storage",
  "폐기물": "waste", "재활용": "recycling", "소각": "incineration",
  "매립": "landfill", "하수": "waste water", "상수도": "water supply",
  "정화": "remediation", "오염": "pollution",
  "산림": "forest", "조림": "afforestation", "복원": "restoration",
  "농업": "agriculture", "생물다양성": "conservation",
  "숙박": "hotels", "호텔": "hotels", "관광": "hotels",
  "보험": "insurance", "의약품": "medicinal", "원료의약품": "active pharmaceutical",
  "중고": "second-hand", "수리": "repair", "재제조": "remanufacturing"
};

/* Grouped by objective rather than one self-describing line per record: the
   objective name and the id prefix are then written once per group instead of
   241 times, which halves the index without dropping anything from it. */
function euIndexLines(acts) {
  const order = [];
  const byObj = {};
  acts.forEach(a => {
    if (!byObj[a.objective]) { byObj[a.objective] = []; order.push(a.objective); }
    byObj[a.objective].push(a);
  });
  return order.map(obj => {
    const prefix = (byObj[obj][0].id.split("-")[0]);
    const head = `[${prefix}] ${EU_OBJ_LABEL[obj] || obj} — ${byObj[obj].length} records (ids are ${prefix}-<code>):`;
    const rows = byObj[obj].map(a => {
      const ty = a.activity_type === "own_performance" ? "" :
        (a.activity_type === "enabling" ? " [enabling]" : " [transitional]");
      return `  ${a.code} ${a.name}${ty}`;
    }).join("\n");
    return head + "\n" + rows;
  }).join("\n");
}

function clip(s, n) {
  const text = String(s || "");
  return text.length <= n ? text : text.slice(0, n) + " […text truncated here — the full criteria are on the country page]";
}

function euActivityDetail(a) {
  const dnsh = Object.keys(a.dnsh || {})
    .map(k => `    - ${EU_OBJ_LABEL[k] || k}: ${a.dnsh[k]}`).join("\n");
  return clip([
    `### ${a.id} — ${a.code} ${a.name}`,
    `  Objective: ${EU_OBJ_LABEL[a.objective] || a.objective} | Sector: ${a.sector}` +
      (a.activity_type === "own_performance" ? "" : ` | ${a.activity_type} activity`) +
      (a.nace && a.nace.length ? ` | NACE: ${a.nace.join(", ")}` : ""),
    `  Legal basis: ${a.annex}`,
    `  Description: ${a.description}`,
    `  Substantial contribution criteria: ${a.substantial_contribution}`,
    `  DNSH criteria:`,
    dnsh
  ].join("\n"), EU_DETAIL_CHARS);
}

/* Scores each record against the question. Deliberately simpler than the
   Korean picker: the EU text is English-only, so the only cross-language work
   needed is running the Korean question through the CROSS_LANG map that is
   already maintained above. An activity code typed directly ("4.5", "CCM-4.5")
   is treated as the strongest possible signal. */
function pickEuActivities(acts, question) {
  const low = question.toLowerCase().replace(/[-‐-―]/g, " ");

  const codes = new Set((question.toUpperCase().match(/\b(?:CCM|CCA|WTR|CE|PPC|BIO)-\d{1,2}\.\d{1,2}\b/g) || []));
  const bareCodes = new Set((question.match(/\b\d{1,2}\.\d{1,2}\b/g) || []));

  const words = (low.match(/[a-z0-9]{3,}/g) || []).filter(w => !STOP.has(w));
  const terms = new Set(words);
  const phrases = [];
  for (let i = 0; i + 1 < words.length; i++) phrases.push(words[i] + " " + words[i + 1]);

  /* Korean question → the English words the Regulation actually uses. The
     longest matching alias wins, so "수력발전" resolves to hydropower rather
     than also dragging in every "수력"/"수소" near-miss. */
  const aliasKeys = Object.keys(EU_KO_ALIAS).sort((a, b) => b.length - a.length);
  (low.match(/[가-힣]{2,}/g) || []).forEach(w => {
    let rest = w;
    let hit = false;
    aliasKeys.forEach(k => {
      if (rest.indexOf(k) === -1) return;
      hit = true;
      rest = rest.split(k).join(" ");
      const en = EU_KO_ALIAS[k];
      en.split(" ").forEach(part => terms.add(part));
      if (en.indexOf(" ") !== -1) phrases.push(en);
    });
    if (hit) return;
    /* Nothing in the EU list — fall back to the K-Taxonomy map so a term this
       file has not been taught still reaches something. */
    Object.keys(CROSS_LANG).forEach(k => {
      if (w.indexOf(k) === -1) return;
      const en = CROSS_LANG[k];
      en.split(" ").forEach(part => terms.add(part));
      if (en.indexOf(" ") !== -1) phrases.push(en);
    });
  });

  const scored = acts.map(a => {
    const name = a.name.toLowerCase();
    const hay = (a.name + " " + a.sector + " " + a.description + " " +
      a.substantial_contribution).toLowerCase();
    let score = 0;
    if (codes.has(a.id)) score += 40;
    if (bareCodes.has(a.code)) score += 12;
    terms.forEach(term => {
      if (name.includes(term)) score += 3;
      else if (hay.includes(term)) score += 1;
    });
    phrases.forEach(ph => {
      if (name.includes(ph)) score += 5;
      else if (hay.includes(ph)) score += 1;
    });
    return { a, score };
  }).filter(x => x.score > 0);

  scored.sort((x, y) => y.score - x.score);

  /* Same fallback as the Korean picker: "afforestation" never equals "forest",
     so a long question word that contains an activity-name word counts as a
     weak hit when the normal pass found next to nothing. */
  if (scored.length < 2) {
    const longTerms = Array.from(terms).filter(t => t.length >= 7);
    if (longTerms.length) {
      const already = new Set(scored.map(x => x.a));
      const extra = [];
      acts.forEach(a => {
        if (already.has(a)) return;
        const nameWords = a.name.toLowerCase().match(/[a-z]{5,}/g) || [];
        let s = 0;
        nameWords.forEach(w => {
          longTerms.forEach(t => { if (t !== w && t.indexOf(w) !== -1) s += 2; });
        });
        if (s > 0) extra.push({ a, score: s });
      });
      extra.sort((x, y) => y.score - x.score);
      scored.push.apply(scored, extra);
    }
  }

  return scored.slice(0, EU_MAX_DETAIL).map(x => x.a);
}

function euDetailBlock(question) {
  const data = loadEuActivities();
  const acts = data.activities || [];
  if (!acts.length) return "";

  const matches = pickEuActivities(acts, question);
  const counts = (data.meta && data.meta.counts) || {};

  let block = [
    "",
    "EU TAXONOMY — TECHNICAL SCREENING CRITERIA BY ECONOMIC ACTIVITY.",
    "Source: Commission Delegated Regulation (EU) 2021/2139 (Climate Delegated Act) Annexes I-II and Commission Delegated Regulation (EU) 2023/2486 (Environmental Delegated Act) Annexes I-IV, EUR-Lex consolidated texts as at 1 January 2026.",
    `Coverage: ${acts.length} objective-activity records — mitigation ${counts.climate_mitigation || 0}, adaptation ${counts.climate_adaptation || 0}, water ${counts.water || 0}, circular economy ${counts.circular_economy || 0}, pollution ${counts.pollution || 0}, biodiversity ${counts.biodiversity || 0}.`,
    "Record ids read as objective-code: CCM = mitigation, CCA = adaptation, WTR = water, CE = circular economy, PPC = pollution, BIO = biodiversity. The SAME activity number can mean different activities in different annexes, so always cite the id, not the bare number. An activity listed under two objectives has different criteria under each.",
    "These criteria apply identically in all 27 EU Member States and, through the EEA Agreement, in Norway, Iceland and Liechtenstein — there is no national variation in the criteria themselves.",
    euIndexLines(acts)
  ].join("\n");

  if (matches.length) {
    block += "\n\nFULL TECHNICAL SCREENING CRITERIA for the records most relevant to this question " +
      "(verbatim from the official English consolidated text — quote thresholds exactly, and say plainly " +
      "when the user's case is not covered):\n" +
      matches.map(euActivityDetail).join("\n\n");

    /* The Appendices carry the generic DNSH criteria that dozens of activities
       simply cross-refer to. Only the ones actually cited by the matched
       records are attached. */
    const book = data.appendices || {};
    const wanted = [];
    matches.forEach(a => {
      const set = (data.appendix_set || {})[a.objective];
      const text = Object.keys(a.dnsh || {}).map(k => a.dnsh[k]).join(" ") + " " + a.substantial_contribution;
      (text.match(/Appendix\s+[A-E]/g) || []).forEach(m => {
        const key = m.replace(/\s+/, " ");
        const entry = (book[set] || {})[key];
        if (entry && !wanted.some(w => w.key === key && w.set === set)) {
          wanted.push({ key, set, text: entry });
        }
      });
    });
    if (wanted.length) {
      block += "\n\nCOMMON APPENDIX CRITERIA referenced by the records above:\n" +
        wanted.slice(0, 3).map(w => `### ${w.key} (${w.set === "climate" ? "Climate DA" : "Environmental DA"})\n${clip(w.text, 4500)}`).join("\n\n");
    }
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

/* Which embedded framework, if any, a jurisdiction follows. EU and Korea are
   excluded because they have their own blocks above. */
function ontoFrameworksFor(iso) {
  const o = loadOntology();
  const ids = (o.jurisdiction_frameworks || {})[iso] || [];
  return ids.filter(id => o.frameworks && o.frameworks[id]);
}

const ONTO_TRIGGERS = {
  "umoa-taxonomy": ["umoa", "uemoa", "waemu", "amf-umoa", "서아프리카", "benin", "bénin",
                    "burkina", "ivory coast", "côte d'ivoire", "cote d'ivoire", "guinea-bissau",
                    "mali", "niger", "senegal", "sénégal", "togo", "세네갈", "말리", "토고",
                    "projets bleus", "taxonomie"],
  "kgz-green-taxonomy": ["kyrgyz", "kirghiz", "키르기스", "кыргыз", "зеленая таксономия",
                         "тн вэд", "customs code"],
  "phl-sftg": ["philippine", "philippines", "필리핀", "sftg", "bangko sentral", "bsp",
               "circular 1187", "circular no. 1187"],
  "asean-taxonomy": ["asean", "아세안", "atb", "asean taxonomy", "plus standard",
                     "foundation framework", "brunei", "브루나이", "myanmar", "미얀마"],
  "khm-sftcb": ["cambodia", "cambodian", "캄보디아", "national bank of cambodia", "nbc"],
  "sgp-asia-taxonomy": ["singapore", "싱가포르", "singapore-asia", "gfit", "mas taxonomy"],
  "tha-taxonomy": ["thailand", "thai ", "태국", "bank of thailand", "tsic"],
  "zaf-gft": ["south africa", "남아공", "남아프리카", "national treasury", "green finance taxonomy"],
  "aus-asft": ["australia", "australian", "호주", "asfi"],
  "gha-gft": ["ghana", "가나", "mofep"],
  "rwa-green-taxonomy": ["rwanda", "르완다", "minecofin"],
  "aze-green-taxonomy": ["azerbaijan", "아제르바이잔", "yaşıl taksonomiya"],
  "npl-gft": ["nepal", "네팔", "nepal rastra bank"],
  "fji-gft": ["fiji", "피지", "reserve bank of fiji"],
  "uga-ngt": ["uganda", "우간다", "mofped", "national green taxonomy"],
  "lka-gft": ["sri lanka", "스리랑카", "central bank of sri lanka"],
  "mex-taxonomia": ["mexico", "méxico", "멕시코", "shcp", "taxonomía sostenible de méxico"],
  "dom-taxonomia": ["dominican", "도미니카", "taxonomía verde"],
  "pan-taxonomia": ["panama", "panamá", "파나마", "supervalores"],
  "chl-taxonomia": ["chile", "칠레", "ministerio de hacienda"],
  "isr-taxonomy": ["israel", "이스라엘", "israeli taxonomy"],
  "mys-ccpt": ["malaysia", "말레이시아", "ccpt", "bank negara", "sri taxonomy"],
  "chn-gfspc": ["china", "chinese", "중국", "pboc", "人民银行", "绿色金融支持项目目录",
                "绿色债券支持项目目录", "green bond endorsed", "国民经济行业", "gb/t 4754"]
};

function mentionsOnto(question) {
  const q = String(question || "").toLowerCase();
  const hits = [];
  for (const [fid, words] of Object.entries(ONTO_TRIGGERS)) {
    if (words.some(w => q.includes(w))) hits.push(fid);
  }
  return hits;
}

/* Comparison questions are the ones the metric table exists for. A question
   that names two jurisdictions, or uses comparison vocabulary in any of the
   site's languages, gets the table. */
const COMPARE_WORDS = ["compare", "comparison", "versus", " vs ", "difference", "differ",
                       "stricter", "strict", "비교", "차이", "대비", "vergleich", "comparer",
                       "comparación", "比較", "对比", "jämför", "compare com"];
/* 단위가 들어간 질문은 "이 숫자를 쓰는 나라는?" 이라는 뜻이므로, '비교'라는
   말이 없어도 비교 질문으로 다룬다. */
const UNIT_WORDS = /gco2|g\s?co2|kwh|tco2|w\/m|mw\b|kwh\/m/i;
function looksComparative(question) {
  const q = " " + String(question || "").toLowerCase() + " ";
  if (COMPARE_WORDS.some(w => q.includes(w))) return true;
  return UNIT_WORDS.test(q) && /\d/.test(q);
}

/* A Korean question never contains the English word the records are written
   in. EU_KO_ALIAS above already maps Korean taxonomy vocabulary to the exact
   English wording, so the cheapest fix is to run the question through it and
   append what it yields before tokenising. Longest key first, so 수력발전 wins
   over 수력 and 전기자동차 over 전기. */
function ontoExpand(question) {
  const q = String(question || "");
  const low = q.toLowerCase();
  const extra = [];
  const keys = Object.keys(EU_KO_ALIAS).sort((a, b) => b.length - a.length);
  const used = [];
  for (const k of keys) {
    if (!q.includes(k)) continue;
    if (used.some(u => u.includes(k))) continue;   // 이미 더 긴 표현으로 잡힌 것
    used.push(k);
    extra.push(EU_KO_ALIAS[k]);
  }
  for (const k of Object.keys(CROSS_LANG)) {
    if (low.includes(k) && !extra.includes(CROSS_LANG[k])) extra.push(CROSS_LANG[k]);
  }
  return extra.length ? q + " " + extra.join(" ") : q;
}

const ONTO_MAX_DETAIL = 4;
const ONTO_DETAIL_CHARS = 4000;

function ontoScore(act, words) {
  const hay = [act.name, act.sector_local, act.category_local || "",
               (act.criteria || []).map(c => c.text).join(" ")].join(" ").toLowerCase();
  let n = 0;
  for (const w of words) if (hay.includes(w)) n++;
  return n;
}

function ontoIndexLines(fid, question, cap) {
  const o = loadOntology();
  const f = o.frameworks[fid];
  if (!f) return "";
  let list = f.activities;
  if (cap && list.length > cap) {
    /* 질문에 걸리는 활동을 먼저, 남는 자리는 앞에서부터 채운다. 잘랐다는 사실을
       마지막 줄에 적어 두어야 "목록에 없다"는 답이 잘못 나가지 않는다. */
    const words = ontoExpand(question || "").toLowerCase()
      .split(/[^a-z0-9가-힣а-яёà-ÿ\u4e00-\u9fa5]+/).filter(w => w.length > 1);
    const hit = list.filter(a => words.some(w =>
      (a.name + " " + (a.sector_local || "") + " " + (a.category_local || "")).toLowerCase().includes(w)));
    const rest = list.filter(a => hit.indexOf(a) < 0);
    list = hit.concat(rest).slice(0, cap);
  }
  const bySector = {};
  for (const a of list) (bySector[a.sector_local] = bySector[a.sector_local] || []).push(a);
  const body = Object.entries(bySector).map(([sec, l]) =>
    `  ${sec}\n` + l.map(a =>
      `    ${a.uid} — ${a.name}${a.objective ? ` [${a.objective}]` : ""}`
    ).join("\n")
  ).join("\n");
  return body + (cap && f.activities.length > cap
    ? `\n  (showing ${list.length} of ${f.activities.length}; the rest are not listed here — do `
      + "not tell the user an activity is absent from the framework on the strength of this list)"
    : "");
}

function ontoActivityDetail(a) {
  const parts = [`${a.uid} — ${a.name}`];
  if (a.sector_local) parts.push(`sector: ${a.sector_local}`);
  if (a.category_local) parts.push(`category: ${a.category_local}`);
  if (a.objective) parts.push(`objective: ${a.objective}${a.objective_local ? " (" + a.objective_local + ")" : ""}`);
  if (a.isic_group && a.isic_group.length) parts.push(`ISIC group: ${a.isic_group.join(", ")}`);
  if (a.nace && a.nace.length) parts.push(`${a.nace_edition || "NACE"}: ${a.nace.join(", ")}`);
  if (a.hs_codes_tnved && a.hs_codes_tnved.length) parts.push(`customs (ТН ВЭД): ${a.hs_codes_tnved.join(", ")}`);
  if (a.eu_cn_codes && a.eu_cn_codes.length) parts.push(`EU CN: ${a.eu_cn_codes.join(", ")}`);
  if (a.legal_basis) parts.push(`legal basis: ${a.legal_basis}`);
  for (const c of (a.criteria || [])) {
    parts.push(`[${c.type}${c.objective ? " / " + c.objective : ""}]\n${String(c.text).slice(0, ONTO_DETAIL_CHARS)}`);
  }
  for (const t of (a.thresholds || [])) {
    parts.push(`threshold: ${t.metric} ${t.comparator || "(comparator not stated)"} ${t.value} ${t.unit} — verbatim: "${t.verbatim}"`);
  }
  if (a.component_count) {
    parts.push(`components listed: ${a.component_count}` +
      (a.function_groups && a.function_groups.length ? ` across ${a.function_groups.join(", ")}` : "") +
      (a.component_examples && a.component_examples.length ? `\n  e.g. ${a.component_examples.join("; ")}` : ""));
  }
  return parts.join("\n");
}

function ontoMetricBlock(question) {
  const o = loadOntology();
  if (!o.metrics || !o.metrics.length) return "";
  const words = ontoExpand(question).toLowerCase().split(/[^a-z0-9가-힣а-яё]+/).filter(w => w.length > 2);
  /* Whole-word matching, not substring: "electric" (what 전기차 expands to)
     otherwise matches "electricity" and drags every generation activity in. */
  const scored = o.metrics.map(c => {
    const hay = " " + (c.anchor_name + " " + c.members.map(m => m.name + " " + (m.name_ko || "")).join(" "))
      .toLowerCase().replace(/[^a-z0-9가-힣а-яё]+/g, " ") + " ";
    return { c, n: words.filter(w => hay.includes(" " + w + " ")).length };
  }).filter(x => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 4);
  const use = scored.length ? scored.map(x => x.c)
                            : o.metrics.filter(c => c.comparable).slice(0, 4);
  if (!use.length) return "";
  const blocks = use.map(c => {
    const mem = c.members.map(m => `    ${m.framework}: ${m.code} ${m.name}${m.name_ko ? " (" + m.name_ko + ")" : ""}`).join("\n");
    const thr = Object.entries(c.thresholds_by_metric || {}).map(([metric, rows]) =>
      `    ${metric}:\n` + rows.map(r =>
        `      ${r.framework} ${r.comparator || "(no comparator stated)"} ${r.value} ${r.unit} [${r.criterion}] — verbatim: "${r.verbatim}"`
      ).join("\n")
    ).join("\n");
    const none = (c.frameworks_with_no_numeric_threshold || []);
    return [`  ${c.anchor} ${c.anchor_name}`, mem,
            thr || "    (no numeric thresholds on any side)",
            none.length ? `    states NO numeric threshold for this activity: ${none.join(", ")}` : ""
           ].filter(Boolean).join("\n");
  });
  return ["SAME-ACTIVITY COMPARISON TABLE (thresholds each framework attaches to the same activity):",
          blocks.join("\n\n"),
          `CAVEAT: ${o.metrics_caveat}`].join("\n");
}

/* "100 gCO2e/kWh 를 쓰는 나라가 또 어디 있나" 류의 질문에 답하는 블록.
   활동 목록이 없는 나라도 숫자로는 비교에 낄 수 있다. */
function ontoSharedValueBlock(question) {
  const o = loadOntology();
  const mi = o.metric_index;
  if (!mi || !mi.shared_values || !mi.shared_values.length) return "";
  const q = ontoExpand(question).toLowerCase();
  const nums = (question.match(/\d[\d.,]*/g) || []).map(n => n.replace(/[.,]$/, ""));
  let use = mi.shared_values.filter(c =>
    nums.some(n => c.value === n.replace(/,/g, "")) ||
    q.includes(c.metric.replace(/_/g, " ")) ||
    (c.metric.indexOf("electricity") >= 0 && /kwh|electric|전력|발전/.test(q)) ||
    (c.metric === "power_density" && /hydro|수력|density/.test(q)));
  if (!use.length) use = mi.shared_values.slice(0, 3);
  use = use.slice(0, 4);
  const blocks = use.map(c => {
    const rows = c.entries.slice(0, 12).map(e =>
      `      ${e.framework}${e.activity_name ? " — " + e.activity_name : ""}: "${(e.verbatim || "").slice(0, 200)}"`);
    return `  ${c.metric} = ${c.value} ${c.unit} — used by ${c.framework_count} frameworks, `
      + `covering ${c.jurisdictions.length} jurisdictions (${c.jurisdictions.join(", ")})\n`
      + rows.join("\n") + (c.entries.length > 12 ? `\n      …and ${c.entries.length - 12} more entries` : "");
  });
  return ["THRESHOLD VALUES SHARED ACROSS FRAMEWORKS:", blocks.join("\n\n"),
          "CAVEAT: " + (mi.caveats || []).join(" ")].join("\n");
}

function ontologyDetailBlock(question, countryIso) {
  const o = loadOntology();
  const wanted = new Set(mentionsOnto(question));
  for (const fid of ontoFrameworksFor(countryIso)) wanted.add(fid);

  const out = [];
  for (const fid of wanted) {
    const f = o.frameworks[fid];
    if (!f) continue;
    const m = f.framework;
    out.push([
      `${m.name}${m.name_ko ? " / " + m.name_ko : ""} — issuer ${m.issuer}, ${m.structure}, applies in ${(m.jurisdictions || []).join(", ")}.`,
      (m.notes || []).map(n => "  note: " + n).join("\n")
    ].filter(Boolean).join("\n"));

    if (m.classification) {
      out.push("  classification:\n" + m.classification.map(c => `    ${c.label}: ${c.rule}`).join("\n"));
    }
    if (m.assessment && m.assessment.essential_criteria) {
      out.push("  essential criteria:\n" + m.assessment.essential_criteria
        .map(c => `    ${c.id} (${c.name}): ${c.note}`).join("\n"));
      if (m.assessment.method) out.push("  method: " + m.assessment.method);
    }
    /* 이 프레임워크들은 활동 목록을 아직 못 만들었다. 대신 원문에서 그대로
       걷어 온 임계값 문장이 있으므로 그것을 내보낸다. 질문과 관계있는 것을
       먼저 고르되, 하나도 안 걸리면 기준으로 분류된 것부터 보여 준다. */
    if (!f.activities.length && (f.thresholds || []).length) {
      const words = ontoExpand(question).toLowerCase()
        .split(/[^a-z0-9가-힣а-яёà-ÿ]+/).filter(w => w.length > 2);
      const crit = f.thresholds.filter(t => t.kind === "criterion");
      const scored = crit.map(t => ({ t, n: words.filter(w => t.verbatim.toLowerCase().includes(w)).length }))
        .filter(x => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 8).map(x => x.t);
      const use = scored.length ? scored : crit.slice(0, 8);
      out.push(`  numeric thresholds quoted verbatim from the document (${crit.length} classified as criteria out of ${f.thresholds.length} numeric sentences found):\n` +
        use.map(t => `    [${t.metric}] ${t.value_verbatim} ${t.unit}` +
          (t.decimal_warning ? ` (${t.decimal_warning})` : "") +
          `\n      "${String(t.verbatim).slice(0, 280)}"`).join("\n"));
      out.push("  NOTE: this framework has no activity list in the dataset. Answer from the "
        + "threshold sentences above and from the framework description, and say plainly that "
        + "the per-activity table is not held here rather than inventing one.");
    }
    /* 중국처럼 조건이 자국 표준을 가리키는 프레임워크는, 숫자 대신 '어떤 표준의
       몇 급을 요구하는지' 가 답이다. 활동 레코드의 standards_referenced 를 모아
       자주 인용되는 표준을 먼저 보여 준다. */
    if (f.activities.length && f.activities.some(a => (a.standards_referenced || []).length)) {
      const cnt = {};
      for (const a of f.activities)
        for (const st of (a.standards_referenced || [])) {
          const k = (st.code ? st.code + " " : "") + st.standard;
          cnt[k] = (cnt[k] || 0) + 1;
        }
      const top = Object.entries(cnt).sort((x, y) => y[1] - x[1]).slice(0, 12);
      if (top.length) out.push("  criteria in this framework point at national standards rather "
        + "than stating numbers. Most cited:\n"
        + top.map(([k, n]) => `    ${n}x  ${k}`).join("\n"));
    }
    if (f.activities.length) {
      /* 활동이 많은 프레임워크(중국 310건)는 목록을 통째로 넣으면 질문 하나에
         1만 토큰이 넘는다. 질문과 관계있는 것부터 추려 싣고, 전체 건수는 밝힌다. */
      out.push(`  activities in ${fid} (${f.activities.length} in total):\n`
        + ontoIndexLines(fid, question, 90));
      const words = ontoExpand(question).toLowerCase().split(/[^a-z0-9가-힣а-яёà-ÿ]+/).filter(w => w.length > 2);
      const picked = f.activities
        .map(a => ({ a, n: ontoScore(a, words) }))
        .filter(x => x.n > 0)
        .sort((x, y) => y.n - x.n)
        .slice(0, ONTO_MAX_DETAIL)
        .map(x => x.a);
      if (picked.length) {
        out.push("  full records for the activities closest to the question:\n\n" +
          picked.map(ontoActivityDetail).join("\n\n"));
      }
    }
  }

  if (looksComparative(question) || wanted.size) {
    /* 질문에 숫자와 단위가 같이 들어 있으면 "이 값을 쓰는 나라는?" 을 묻는 것이다.
       그럴 때는 값 색인을 먼저 보여 준다 — 활동별 표를 앞에 두면 정작 물은
       숫자가 한참 뒤로 밀린다. */
    const valueFirst = UNIT_WORDS.test(question) && /\d/.test(question);
    const mb = ontoMetricBlock(question);
    const sv = ontoSharedValueBlock(question);
    if (valueFirst) { if (sv) out.push(sv); if (mb) out.push(mb); }
    else { if (mb) out.push(mb); if (sv) out.push(sv); }
  }
  if (!out.length) return "";
  return "ONTOLOGY DETAIL FOR THIS QUESTION:\n" + out.join("\n\n");
}

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
    "For the EU Taxonomy the reference data also goes down to individual economic activities, and it applies identically across the 27 EU Member States plus Norway, Iceland and Liechtenstein. Cite a record by its id and name (e.g. \"CCM-4.5 Electricity generation from hydropower\") — never by the bare number, because the same number means different activities in different annexes. Quote thresholds exactly as written. State which of the six objectives the criteria you are quoting belong to, since the same activity has different criteria under a different objective, and note when a DNSH entry simply cross-refers to an Appendix. If the activity the user describes is not on the list, say so in the first sentence and name the closest records by id.",
    "When asked to compare the K-Taxonomy with the EU Taxonomy, compare the actual criteria you have been given for both — the activity definitions and the numeric thresholds — rather than describing the two frameworks in general terms. Name the specific activity on each side you are comparing, and say plainly where one framework has an activity the other does not, or where the structures do not line up (Korea's four-step activity/recognition/exclusion/protection criteria against the EU's substantial contribution plus DNSH).",
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
    lines.join("\n"),
    ontologyBrief()
  ].join("\n");

  /* Korea is the one jurisdiction where the site holds activity-level
     criteria. Adding them only when the question is about Korea keeps the
     prompt (and the per-question API cost) small for everything else. */
  /* The chat on a country page sends that page's ISO code, so a question like
     "is offshore wind covered?" still gets Korea's activity data even though
     the question itself never says "Korea". */
  const koreaContext = countryIso === "KOR" || (question && mentionsKorea(question));
  /* The EU block works the same way. A question that mentions both — the most
     common one on this site is "how does the K-Taxonomy differ from the EU's?"
     — gets both blocks, which is the only way that comparison can be answered
     from the actual criteria rather than from general knowledge. */
  /* "EUU" is not a country code. It is what eu.html sends so that a question
     typed on the EU framework page arrives with the EU activity data attached,
     exactly as a country page's own ISO does. */
  const onEuPage = countryIso === "EUU";
  const euContext = onEuPage || EU_ISOS.has(countryIso) || (question && mentionsEu(question));

  const dynamic = [
    languageLine,
    onEuPage
      ? "The user is reading the site's EU Taxonomy framework page. Assume questions are about the EU Taxonomy unless they name another jurisdiction. Do not describe the EU as a country."
      : countryIso ? `The user is reading the country page for ${countryIso}. Assume questions are about that jurisdiction unless they name another one.` : "",
    koreaContext ? krDetailBlock(question || "") : "",
    euContext ? euDetailBlock(question || "") : "",
    /* UMOA, Kyrgyzstan and the Philippines have no page of their own yet, so
       the ontology block is the only way a question about them reaches real
       criteria rather than general knowledge. It also carries the
       same-activity comparison table whenever the question is comparative. */
    ontologyDetailBlock(question || "", countryIso)
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

/* Offline verification hook — lets the retrieval be checked without calling the
   model. Not referenced by the HTTP handler. */
module.exports.__test = {
  pickKrActivities, mentionsKorea, loadKrActivities,
  pickEuActivities, mentionsEu, loadEuActivities, euDetailBlock, euIndexLines,
  loadOntology, ontologyBrief, ontologyDetailBlock, mentionsOnto, looksComparative, ontoMetricBlock, ontoSharedValueBlock
};
