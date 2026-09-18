/* Global Sustainable Taxonomy Website — Country Page */

function getStatusLabel(status) {
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const keys = {
    national: "home.chipNational",
    regional: "home.chipRegional",
    developing: "home.chipUnderDevelopment",
    none: "home.chipNoTaxonomy"
  };
  return t(keys[status] || keys.none);
}

/* Mirrors getBucket() on the map page: a country whose only coverage is a
   regional framework (EU, UMOA, ASEAN) is shown as such rather than as having
   a taxonomy of its own. Kept as its own copy because the country page does
   not load app.js. */
const REGIONAL_TAXONOMY_LABELS = ["EU Taxonomy", "ASEAN Taxonomy", "UMOA"];

/* Mirrors ALT_APPROACH_ISOS in app.js — jurisdictions with no taxonomy that
   deliberately run a different instrument in its place. They keep the grey
   "No Taxonomy" badge; this only adds a tag beside it. */
const ALT_APPROACH_ISOS = { JPN: true, GBR: true, CHE: true, USA: true };

function altApproachTag(iso, status) {
  if (!ALT_APPROACH_ISOS[iso] || status !== "none") return "";
  const t = (typeof gstT === "function") ? gstT : (k => k);
  return `<span class="badge badge-alt">${escapeHtml(t("home.altApproach"))}</span>`;
}

/* Mirrors unverifiedTag() in app.js — see the note there. The test is that this
   country has no official document attached, which is the same (empty) Official
   Documents section further down this page. */
function unverifiedTag(entry) {
  if (!entry || entry.status === "established") return "";
  if (entry.officialDocuments && entry.officialDocuments.length) return "";
  const t = (typeof gstT === "function") ? gstT : (k => k);
  return `<span class="badge badge-unverified" title="${escapeAttr(t("home.tagUnverifiedNote"))}">${escapeHtml(t("home.tagUnverified"))}</span>`;
}

function bucketStatus(entry) {
  const raw = entry ? entry.status : "none";
  if (raw === "developing") return "developing";
  if (raw !== "established") return "none";
  const name = (entry && entry.taxonomy) || "";
  return REGIONAL_TAXONOMY_LABELS.some(l => name.indexOf(l) !== -1) ? "regional" : "national";
}

const ICONS = {
  climate: '<path d="M12 3v6m0 6v6M4.2 4.2l4.2 4.2m7.2 7.2l4.2 4.2M3 12h6m6 0h6M4.2 19.8l4.2-4.2m7.2-7.2l4.2-4.2"/>',
  "climate-adapt": '<path d="M12 2l3 6-3 2-3-2 3-6z"/><path d="M5 22c1.5-4 4-6 7-6s5.5 2 7 6"/>',
  water: '<path d="M12 2s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13z"/>',
  circular: '<path d="M4 9a8 8 0 0 1 14-4M20 15a8 8 0 0 1-14 4"/><path d="M17 2v4h-4M7 22v-4h4"/>',
  pollution: '<path d="M4 15a4 4 0 0 1 4-4h.3A5 5 0 0 1 18 9a4 4 0 0 1-.5 8H8a4 4 0 0 1-4-2z"/>',
  biodiversity: '<path d="M12 2c-3 3-4 6-4 9a4 4 0 0 0 8 0c0-3-1-6-4-9z"/><path d="M8 20c1-2 2-3 4-3s3 1 4 3"/>',
  energy: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>',
  industry: '<path d="M3 21V10l6 4v-4l6 4V7l6-4v18H3z"/>',
  digital: '<rect x="4" y="4" width="16" height="12" rx="1"/><path d="M8 20h8M12 16v4"/>',
  "carbon-capture": '<path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 3v6M21 12h-6"/>'
};
function icon(name) {
  return `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
}

// When a country has its own national taxonomy *and* is also covered by a
// regional overlay framework (ASEAN, UMOA, LAC Common Framework, etc.), make
// that dual coverage visible right in the header — not just buried in the
// "Also Applies" section further down the page.
function overlayHeaderTags(entry) {
  if (!entry || !entry.taxonomy || !entry.overlays || !entry.overlays.length) return "";
  const names = entry.overlays
    .map(o => o && o.name)
    .filter(n => n && !entry.taxonomy.includes(n));
  if (!names.length) return "";
  return names.map(n => `<span class="header-overlay-tag">+ ${escapeHtml(n)}</span>`).join("");
}

function renderHeader(entry, status, label, name, iso) {
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const altTag = altApproachTag(iso, status) + unverifiedTag(entry);
  const taxonomyName = entry && entry.taxonomy ? entry.taxonomy : t("country.noTaxonomyEstablished");
  const overlayTags = overlayHeaderTags(entry);
  return `
    <section class="country-header-dark">
      <div class="country-header-inner">
        <div class="country-header-row">
          <div class="country-header-titles">
            <span class="badge badge-${status}">${label}</span>${altTag}
            <h1>${name}</h1>
            <p class="country-header-sub">${taxonomyName}${entry && entry.year ? " · " + t("country.publishedPrefix") + " " + entry.year : ""}${overlayTags}</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function overviewTable(entry, name, label) {
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const rows = [
    [t("country.tableCountry"), name],
    [t("country.tableTaxonomyName"), entry && entry.taxonomy ? entry.taxonomy : t("country.notEstablished")],
    [t("country.tableStatus"), label],
    [t("country.tableRegulator"), entry && entry.regulator ? entry.regulator : t("country.notPubliclySpecified")],
    [t("country.tableYearPublished"), entry && entry.year ? entry.year : t("country.notSpecified")],
    [t("country.tableRegion"), entry && entry.region ? entry.region : t("country.notSpecified")]
  ];
  let html = `<table class="overview-table"><tbody>`;
  rows.forEach(([k, v]) => { html += `<tr><th>${k}</th><td>${v}</td></tr>`; });
  html += `</tbody></table>`;
  return html;
}

/* Countries that ship an activity-level drill-down (kr-taxonomy.js /
   eu-taxonomy.js and their companion JSON files). For these, the
   "Environmental Objectives" card becomes interactive: clicking an objective
   opens that objective's economic activities and their full screening
   criteria. The value is the name of the global the renderer publishes, so a
   third jurisdiction is one line here plus its own renderer file.

   EU_TAXONOMY covers the EU-27 plus the three EEA EFTA states, which apply the
   Taxonomy Regulation through the EEA Agreement — the same criteria text, so
   the same dataset. */
const DRILLDOWN_COUNTRIES = (() => {
  const map = { KOR: "KR_TAXONOMY" };
  [
    /* EU-27 */
    "AUT", "BEL", "BGR", "HRV", "CYP", "CZE", "DNK", "EST", "FIN", "FRA",
    "DEU", "GRC", "HUN", "IRL", "ITA", "LVA", "LTU", "LUX", "MLT", "NLD",
    "POL", "PRT", "ROU", "SVK", "SVN", "ESP", "SWE",
    /* EEA EFTA */
    "NOR", "ISL", "LIE"
  ].forEach(iso => { map[iso] = "EU_TAXONOMY"; });
  return map;
})();

function drilldownRenderer(iso) {
  const key = DRILLDOWN_COUNTRIES[iso];
  return (key && window[key]) ? window[key] : null;
}

function hasDrilldown(iso) {
  return !!drilldownRenderer(iso);
}

function objectivesSection(entry, iso) {
  const t = (typeof gstT === "function") ? gstT : (k => k);

  /* Interactive drill-down replaces the static pill list where available.
     The container is filled asynchronously by the jurisdiction's renderer.
     The id keeps its original "kr" name on purpose: the build workflow's
     safety check greps country.html for it to prove the drill-down survived
     the last edit, so renaming it here would stop the site from deploying. */
  if (hasDrilldown(iso)) {
    /* For the 30 EU-Taxonomy countries the criteria below are not this
       country's own — they are the EU's, word for word, in all 30. Saying so
       here, with a way through to the framework page, is the difference
       between a reader thinking Germany wrote these and knowing it did not. */
    const euLink = DRILLDOWN_COUNTRIES[iso] === "EU_TAXONOMY"
      ? `<a class="eu-page-link" href="eu.html">${t("country.euFullPage")}</a>`
      : "";
    return `${euLink}<div id="krTaxonomyDrilldown" class="kr-drill"></div>`;
  }

  const objs = (entry && entry.objectives && entry.objectives.length) ? entry.objectives : null;
  if (!objs) {
    return `<p class="data-not-available">${t("country.notYetDocumented")}</p>`;
  }
  let html = `<ol class="objective-pills">`;
  objs.forEach((o, i) => {
    html += `<li><span class="pill-num">${i + 1}</span>${icon(o.icon)}<span>${o.label}</span></li>`;
  });
  html += `</ol>`;
  return html;
}

function criteriaTable(entry) {
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const real = entry && entry.activityList && entry.activityList.length;
  let html = "";

  if (real) {
    /* Four columns of criteria text cannot be squeezed into a phone screen, so
       the table scrolls inside its own box rather than pushing the whole page
       sideways. */
    html += `<div class="table-scroll"><table class="criteria-table"><thead><tr><th>${t("country.colActivity")}</th><th>${t("country.colScreeningCriteria")}</th><th>${t("country.colThreshold")}</th><th>${t("country.colDnsh")}</th></tr></thead><tbody>`;
    entry.activityList.forEach(a => {
      html += `<tr><td>${a.activity}</td><td>${a.criteria || t("country.seeOfficialDocumentation")}</td><td>${a.threshold || t("country.seeOfficialDocumentation")}</td><td>${a.dnsh || t("country.dnshAppliesDefault")}</td></tr>`;
    });
    html += `</tbody></table></div>`;
  } else {
    html += `<p class="data-not-available">${t("country.notYetDocumented")}</p>`;
  }

  if (entry && entry.source) {
    html += `<a class="btn-download" href="${entry.source}" target="_blank" rel="noopener">${t("country.viewAllCriteria")} ↗</a>`;
  }
  return html;
}

function escapeAttr(s) {
  return String(s || "")
    .replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Honest, site-wide date reflecting when the underlying dataset (data.js)
// was last substantively compiled/reviewed — not a per-country claim we
// can't verify, just a factual statement about this data file.
const DATA_LAST_REVIEWED = "2026-07-20";

// Turns inline "[1]", "[2]" markers written in fullDescription/features text into
// small superscript links pointing at the matching entry in that country's
// "citations" array (rendered via citationsListHtml). If the country has no
// citations array, markers are left as plain text (shouldn't normally happen).
function linkifyCitations(text) {
  return String(text).replace(/\[(\d+)\]/g, (m, n) => `<sup class="citation-mark"><a href="#cite-${n}">[${n}]</a></sup>`);
}

function citationsListHtml(entry) {
  if (!entry || !entry.citations || !entry.citations.length) return "";
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const items = entry.citations.map(c =>
    `<li id="cite-${c.id}">${c.id}. ${escapeHtml(c.label)}${c.url ? ` — <a href="${c.url}" target="_blank" rel="noopener">${t("country.sourceLinkLabel")} ↗</a>` : ""}</li>`
  ).join("");
  return `<div class="citations-block"><h3>${t("footer.references")}</h3><ol class="citations-list">${items}</ol></div>`;
}

function sourcesNote() {
  const t = (typeof gstT === "function") ? gstT : (k => k);
  return `<p class="sources-note">${t("sources.note")} <span class="sources-reviewed">${t("sources.lastReviewed")} ${DATA_LAST_REVIEWED}</span></p>`;
}

// Cross-cutting reference resources — each one only actually documents a specific
// taxonomy family, so it's only relevant on the country page(s) for that family,
// not every country page. The full list (with descriptions) is always available
// on the About page (about.html#key-resources) via the footer "References" link.
const EU_TAXONOMY_COUNTRY_CODES = [
  "AUT","BEL","BGR","HRV","CYP","CZE","DNK","EST","FIN","FRA","DEU","GRC",
  "HUN","IRL","ITA","LVA","LTU","LUX","MLT","NLD","POL","PRT","ROU","SVK","SVN","ESP","SWE"
];

function relevantGeneralResources(iso, entry) {
  const resources = [];
  if (EU_TAXONOMY_COUNTRY_CODES.includes(iso)) {
    resources.push({ name: "EU Taxonomy", url: "https://finance.ec.europa.eu/sustainable-finance/tools-and-standards/eu-taxonomy-sustainable-activities_en" });
  }
  if (iso === "KOR") {
    /* Same change as the About page: the old link was a 2022 KOTRA promotional
       PDF, which sat oddly under the official 2025 guidelines listed above it. */
    resources.push({ name: "K-Taxonomy", url: "https://www.gmi.go.kr/gc/gcGuideLine.do" });
  }
  return resources;
}

function generalResourcesHtml(iso, entry) {
  const resources = relevantGeneralResources(iso, entry);
  if (!resources.length) return "";
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const items = resources.map(r =>
    `<li><a href="${r.url}" target="_blank" rel="noopener">${escapeHtml(r.name)} ↗</a></li>`
  ).join("");
  return `<div class="country-general-resources"><h3>${t("country.generalResources")}</h3><ul>${items}</ul></div>`;
}

function officialDocumentsSection(entry) {
  const t = (typeof gstT === "function") ? gstT : (k => k);
  if (entry && entry.officialDocuments && entry.officialDocuments.length) {
    let html = `<ul class="docs-list">`;
    entry.officialDocuments.forEach(d => {
      html += `<li><a href="${d.url}" target="_blank" rel="noopener">${d.title}</a>${d.date ? `<span class="docs-date">${d.date}</span>` : ""} <button class="doc-translate-btn" type="button" data-doc-url="${escapeAttr(d.url)}" data-doc-title="${escapeAttr(d.title)}" data-i18n="translate.button">${t("translate.button")}</button></li>`;
    });
    html += `</ul>`;
    return html;
  }
  if (entry && entry.source) {
    return `
      <a class="source-card" href="${entry.source}" target="_blank" rel="noopener">
        <span class="dot established"></span>
        <span><strong>${t("country.officialSourceLabel")}</strong> ${entry.regulator ? entry.regulator + " — " : ""}${entry.taxonomy || entry.name}</span>
        <svg class="arrow-out" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 17 17 7M7 7h10v10"/></svg>
      </a>
      <button class="doc-translate-btn" type="button" style="margin-left:0; margin-top:6px;" data-doc-url="${escapeAttr(entry.source)}" data-doc-title="${escapeAttr(entry.taxonomy || entry.name)}" data-i18n="translate.button">${t("translate.button")}</button>
      <p class="sample-note">${t("country.singleSourceNote")}</p>
    `;
  }
  return `<p class="sample-note">${t("country.noSourceYet")}</p>`;
}

function mediaFeed(entry) {
  const t = (typeof gstT === "function") ? gstT : (k => k);
  let html = `<ul class="media-feed">`;
  if (entry && entry.source) {
    html += `<li><span class="media-tag">${t("country.mediaTagDocument")}</span><a href="${entry.source}" target="_blank" rel="noopener">${entry.regulator ? entry.regulator + " — " : ""}${t("country.officialTaxonomyDocumentation")}</a>${entry.year ? `<span class="media-date">${entry.year}</span>` : ""}</li>`;
  }
  if (entry && entry.overlays && entry.overlays.length) {
    entry.overlays.forEach(o => {
      if (o.source) {
        html += `<li><span class="media-tag">${t("country.mediaTagRegional")}</span><a href="${o.source}" target="_blank" rel="noopener">${o.name}</a></li>`;
      }
    });
  }
  html += `<li class="media-placeholder">${t("country.moreUpdatesComingSoon")}</li>`;
  html += `</ul>`;
  return html;
}

function aiChatBoxHtml() {
  const t = (typeof gstT === "function") ? gstT : (k => k);
  return `
    <div class="chat-log chat-log-compact" id="countryChatLog"></div>
    <div class="chat-examples" id="countryChatExamples"></div>
    <form class="chat-input-row" id="countryChatForm">
      <textarea id="countryChatInput" rows="2" placeholder="${escapeAttr(t("country.chatPlaceholder"))}"></textarea>
      <button class="btn-primary" type="submit" id="countryChatSendBtn">${t("chat.send")}</button>
    </form>
    <p class="sample-note">${t("country.chatDisclaimer")}</p>
  `;
}

/* Same as the advisor panel: Markdown from the assistant, literal user text. */
function countryChatBody(m) {
  if (m.role !== "user" && !m.pending && !m.error && typeof gstMarkdown === "function") {
    return gstMarkdown(m.content);
  }
  return escapeHtml(m.content).replace(/\n/g, "<br>");
}

let countryChatHistory = [];
let countryChatBusy = false;
let countryChatWelcome = (typeof gstT === "function") ? gstT("country.chatWelcomeDefault") : "Ask anything about this taxonomy.";

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderCountryChatLog() {
  const log = document.getElementById("countryChatLog");
  if (!log) return;
  const welcome = `<div class="chat-welcome">${countryChatWelcome}</div>`;
  const msgs = countryChatHistory.map(m => `
    <div class="chat-msg chat-msg-${m.role}">
      <div class="chat-bubble${m.pending ? " chat-bubble-pending" : ""}${m.error ? " chat-bubble-error" : ""}">${countryChatBody(m)}</div>
    </div>
  `).join("");
  log.innerHTML = countryChatHistory.length ? msgs : welcome;
  log.scrollTop = log.scrollHeight;
}

/* ISO code of the country page this chat belongs to. Sent with each question
   so the server knows the context even when the question itself doesn't name
   the country ("is offshore wind covered?" asked on the Korea page). */
let countryChatIso = "";

async function sendCountryChatMessage(question) {
  if (countryChatBusy) return;
  countryChatBusy = true;
  const sendBtn = document.getElementById("countryChatSendBtn");
  if (sendBtn) sendBtn.disabled = true;

  countryChatHistory.push({ role: "user", content: question });
  countryChatHistory.push({ role: "assistant", content: "Thinking…", pending: true });
  renderCountryChatLog();

  const historyForApi = countryChatHistory.slice(0, -2).map(m => ({ role: m.role, content: m.content }));

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        question,
        history: historyForApi,
        lang: (typeof gstCurrentLang === "string") ? gstCurrentLang : undefined,
        country: countryChatIso || undefined
      })
    });
    let data;
    try { data = await res.json(); } catch (e) { data = {}; }

    countryChatHistory.pop();
    if (!res.ok) {
      countryChatHistory.push({
        role: "assistant",
        error: true,
        content: (data && data.error) || "This site doesn't seem to be deployed with the AI backend yet — see DEPLOY_INSTRUCTIONS.md."
      });
    } else {
      countryChatHistory.push({ role: "assistant", content: data.answer || "(no response)" });
    }
  } catch (err) {
    countryChatHistory.pop();
    countryChatHistory.push({
      role: "assistant",
      error: true,
      content: "Couldn't reach the AI backend (" + err.message + "). If you're opening this file directly rather than visiting a deployed Vercel URL, this chat isn't available yet — see DEPLOY_INSTRUCTIONS.md."
    });
  }

  renderCountryChatLog();
  countryChatBusy = false;
  if (sendBtn) sendBtn.disabled = false;
}

function setupCountryChat(name, taxonomy, iso) {
  const form = document.getElementById("countryChatForm");
  if (!form) return;
  countryChatIso = iso || "";
  const t = (typeof gstT === "function") ? gstT : (k => k);

  countryChatWelcome = t("country.chatWelcomeWithName").replace("{name}", name);
  renderCountryChatLog();

  const examples = [
    t("country.chatExampleCompare").replace("{name}", name),
    t("country.chatExampleCriteria").replace("{taxonomy}", taxonomy || (name + "'s taxonomy")),
    t("country.chatExampleDocumentation"),
    t("country.chatExampleSimilar").replace("{name}", name)
  ];
  const examplesWrap = document.getElementById("countryChatExamples");
  examplesWrap.innerHTML = examples.map(q => `<button class="example-card" type="button">${q}</button>`).join("");
  examplesWrap.querySelectorAll(".example-card").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      document.getElementById("countryChatInput").value = examples[i];
      document.getElementById("countryChatInput").focus();
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const input = document.getElementById("countryChatInput");
    const q = input.value.trim();
    if (!q) return;
    input.value = "";
    sendCountryChatMessage(q);
  });
  document.getElementById("countryChatInput").addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
}

/* ---------- Compare With Another Taxonomy (data-driven, no AI needed) ---------- */

function yn(v) {
  const t = (typeof gstT === "function") ? gstT : (k => k);
  return v === true ? t("country.yes") : v === false ? t("country.no") : t("country.notSpecified");
}

function compareRow(label, a, b) {
  return `<tr><th>${label}</th><td>${a}</td><td>${b}</td></tr>`;
}

function compareValues(entry) {
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const f = (entry && entry.facts) || {};
  return {
    taxonomy: entry && entry.taxonomy ? entry.taxonomy : t("country.noTaxonomyEstablished"),
    status: getStatusLabel(bucketStatus(entry)),
    year: entry && entry.year ? entry.year : t("country.notSpecified"),
    regulator: entry && entry.regulator ? entry.regulator : t("country.notPubliclySpecified"),
    region: entry && entry.region ? entry.region : t("country.notSpecified"),
    mandatory: f.mandatory || t("country.notSpecified"),
    dnsh: yn(f.dnsh),
    safeguards: yn(f.minimumSafeguards),
    objectives: (entry && entry.objectives && entry.objectives.length) ? entry.objectives.map(o => o.label).join(", ") : t("country.notDocumented"),
    sectors: (entry && entry.sectors && entry.sectors.length) ? entry.sectors.join(", ") : t("country.notDocumented")
  };
}

function renderCompareTable(nameA, entryA, nameB, entryB) {
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const a = compareValues(entryA);
  const b = compareValues(entryB);
  let html = `<table class="compare-table"><thead><tr><th></th><th>${nameA}</th><th>${nameB}</th></tr></thead><tbody>`;
  html += compareRow(t("country.tableTaxonomyName"), a.taxonomy, b.taxonomy);
  html += compareRow(t("country.tableStatus"), a.status, b.status);
  html += compareRow(t("country.tableYearPublished"), a.year, b.year);
  html += compareRow(t("country.tableRegulator"), a.regulator, b.regulator);
  html += compareRow(t("country.tableRegion"), a.region, b.region);
  html += compareRow(t("country.rowMandatoryVoluntary"), a.mandatory, b.mandatory);
  html += compareRow(t("country.rowRequiresDnsh"), a.dnsh, b.dnsh);
  html += compareRow(t("country.rowRequiresSafeguards"), a.safeguards, b.safeguards);
  html += compareRow(t("country.headingEnvironmentalObjectives"), a.objectives, b.objectives);
  html += compareRow(t("country.rowSectorsCovered"), a.sectors, b.sectors);
  html += `</tbody></table>`;
  return html;
}

function pickDefaultCompareIso(currentIso) {
  if (currentIso !== "KOR" && window.TAXONOMY_DATA.KOR) return "KOR";
  if (window.TAXONOMY_DATA.DEU) return "DEU";
  const other = Object.keys(window.TAXONOMY_DATA).find(k => k !== currentIso);
  return other || currentIso;
}

function compareBlockHtml(iso, name) {
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const label = t("country.compareWithLabel").replace("{name}", name);
  return `
    <div class="compare-controls">
      <label for="compareSelect">${label}</label>
      <select id="compareSelect"></select>
    </div>
    <div id="compareResult"></div>
  `;
}

function setupCompare(iso, name) {
  const sel = document.getElementById("compareSelect");
  if (!sel) return;

  Object.keys(window.TAXONOMY_DATA)
    .map(k => ({ iso: k, name: window.TAXONOMY_DATA[k].name }))
    .filter(c => c.iso !== iso)
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.iso;
      opt.textContent = c.name;
      sel.appendChild(opt);
    });

  const defaultIso = pickDefaultCompareIso(iso);
  sel.value = defaultIso;

  function update() {
    const targetIso = sel.value;
    const targetEntry = window.TAXONOMY_DATA[targetIso];
    const targetName = targetEntry ? targetEntry.name : targetIso;
    document.getElementById("compareResult").innerHTML =
      renderCompareTable(name, window.TAXONOMY_DATA[iso], targetName, targetEntry);
  }

  sel.addEventListener("change", update);
  update();
}

/* ---------- Live content translation ----------
   The global nav language selector (global.js) only translates static UI
   chrome (nav labels, headings, buttons). The actual researched content for
   each country — description paragraphs, environmental objective labels,
   activity-table cells, overlay text — is still English in data.js, since
   hand-translating that for 107 countries × every language isn't something
   that can be done reliably at this scale. Instead, when a non-English
   language is selected, we translate that content live via the same AI
   backend that powers "Ask AI" and the document Translate button, cache the
   result per country+language for the rest of the session, and fall back to
   English (silently) if the request fails — the page never breaks, it just
   stays in English if translation isn't available. Proper nouns and
   anything that must stay verifiable against the original — country names,
   taxonomy titles, regulator names, official document titles, citation
   labels, and all URLs — are deliberately NOT sent through this pipeline. */

const gstCountryTranslationCache = {};

function extractTranslatable(entry) {
  const items = [];
  const manifest = [];
  if (entry.note) { manifest.push({ type: "note" }); items.push(entry.note); }
  (entry.fullDescription || []).forEach((p, i) => { manifest.push({ type: "fullDescription", i }); items.push(p); });
  (entry.objectives || []).forEach((o, i) => { manifest.push({ type: "objective", i }); items.push(o.label || ""); });
  (entry.activityList || []).forEach((a, i) => {
    ["activity", "criteria", "threshold", "dnsh"].forEach(f => {
      manifest.push({ type: "activity", i, f });
      items.push(a[f] || "");
    });
  });
  (entry.overlays || []).forEach((o, oi) => {
    manifest.push({ type: "overlayScope", oi });
    items.push(o.scope || "");
    (o.features || []).forEach((feat, fi) => {
      manifest.push({ type: "overlayFeature", oi, fi });
      items.push(feat);
    });
  });
  return { items, manifest };
}

function applyTranslated(entry, manifest, translated) {
  const clone = JSON.parse(JSON.stringify(entry));
  manifest.forEach((m, idx) => {
    const val = translated[idx];
    if (val === undefined || val === null) return;
    if (m.type === "note") clone.note = val;
    else if (m.type === "fullDescription") clone.fullDescription[m.i] = val;
    else if (m.type === "objective") clone.objectives[m.i].label = val;
    else if (m.type === "activity") clone.activityList[m.i][m.f] = val;
    else if (m.type === "overlayScope") clone.overlays[m.oi].scope = val;
    else if (m.type === "overlayFeature") clone.overlays[m.oi].features[m.fi] = val;
  });
  return clone;
}

async function maybeTranslateAndRender() {
  const params = new URLSearchParams(window.location.search);
  const iso = (params.get("iso") || "").toUpperCase();
  const entry = window.TAXONOMY_DATA ? window.TAXONOMY_DATA[iso] : null;
  const lang = (typeof gstCurrentLang !== "undefined" && gstCurrentLang) ? gstCurrentLang : "en";

  if (!entry || lang === "en") { renderCountry(entry); return; }

  const cacheKey = iso + "::" + lang;
  if (gstCountryTranslationCache[cacheKey]) { renderCountry(gstCountryTranslationCache[cacheKey]); return; }

  renderCountry(entry); // show English immediately, don't block on the network
  const el = document.getElementById("countryContent");
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const banner = document.createElement("div");
  banner.className = "content-translating-banner";
  banner.textContent = t("country.translatingContent");
  if (el.firstChild) el.insertBefore(banner, el.firstChild); else el.appendChild(banner);

  try {
    const { items, manifest } = extractTranslatable(entry);
    if (!items.length) return;
    const res = await fetch("/api/translate-content", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items, lang })
    });
    const data = await res.json();
    if (!res.ok || !Array.isArray(data.translated)) throw new Error((data && data.error) || "Translation failed");

    const translatedEntry = applyTranslated(entry, manifest, data.translated);
    gstCountryTranslationCache[cacheKey] = translatedEntry;

    // Only redraw if the user hasn't since navigated away or switched language again
    const stillSameIso = (new URLSearchParams(window.location.search).get("iso") || "").toUpperCase() === iso;
    const stillSameLang = (typeof gstCurrentLang !== "undefined" ? gstCurrentLang : "en") === lang;
    if (stillSameIso && stillSameLang) renderCountry(translatedEntry);
  } catch (err) {
    console.warn("Country content translation failed, showing English content:", err);
    // Already rendered English above — nothing more to do.
  }
}

/* The AI Advisor's "View full profile" links open this page in a NEW TAB, so
   the browser's Back button is disabled and there is no way back to the
   analysis. When those links tag themselves with from=advisor, show a second
   back link that returns to the advisor on the tab the visitor is already in,
   reopening the same mode and country. */
function setupBackToAdvisor(params, iso) {
  const link = document.getElementById("backToAdvisor");
  if (!link) return;
  if (params.get("from") !== "advisor") { link.hidden = true; return; }

  const allowedModes = ["compare", "country", "portfolio", "ask"];
  const raw = params.get("amode");
  const mode = allowedModes.indexOf(raw) !== -1 ? raw : "country";
  const q = params.get("q");
  link.href = `advisor.html?mode=${mode}` +
    (iso ? `&iso=${encodeURIComponent(iso)}` : "") +
    (q ? `&q=${encodeURIComponent(q)}` : "");
  link.hidden = false;
}

function renderCountry(entryOverride) {
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const params = new URLSearchParams(window.location.search);
  const iso = (params.get("iso") || "").toUpperCase();
  const headerEl = document.getElementById("countryHeader");
  const el = document.getElementById("countryContent");
  const entry = entryOverride !== undefined ? entryOverride : window.TAXONOMY_DATA[iso];

  if (!iso) {
    headerEl.innerHTML = "";
    el.innerHTML = `<h1 class="report-title">${t("country.noCountrySelected")}</h1><p class="lede">${t("country.goBackToMap")}</p>`;
    return;
  }

  const name = entry ? entry.name : iso;
  const status = bucketStatus(entry);
  const label = getStatusLabel(status);

  headerEl.innerHTML = renderHeader(entry, status, label, name, iso);

  let left = "";

  left += `<div class="card-block"><h2>${t("country.headingOverview")}</h2>${overviewTable(entry, name, label)}</div>`;

  if (entry && entry.fullDescription && entry.fullDescription.length) {
    left += `<div class="card-block"><h2>${t("country.headingAboutTaxonomy")}</h2>` +
      entry.fullDescription.map(p => `<p class="section-text">${linkifyCitations(p)}</p>`).join("") +
      citationsListHtml(entry) + `</div>`;
  } else if (entry && entry.note) {
    left += `<div class="card-block"><h2>${t("country.headingAboutTaxonomy")}</h2><p class="section-text">${entry.note}</p><p class="sample-note">${t("country.limitedInfoNote")}</p></div>`;
  } else if (!entry) {
    left += `<div class="card-block"><p class="section-text">${t("country.noDataCompiledYet")}</p></div>`;
  }

  left += `<div class="card-block"><h2>${t("country.headingOfficialDocuments")}</h2>${officialDocumentsSection(entry)}${sourcesNote()}${generalResourcesHtml(iso, entry)}</div>`;
  left += `<div class="card-block"><h2>${t("country.headingEnvironmentalObjectives")}</h2>${objectivesSection(entry, iso)}</div>`;
  left += `<div class="card-block"><h2>${t("country.headingTechnicalCriteria")}</h2>${criteriaTable(entry)}</div>`;

  if (entry && entry.overlays && entry.overlays.length) {
    left += `<div class="card-block"><h2>${t("country.headingAlsoApplies")}</h2>` + entry.overlays.map(o =>
      `<div class="overlay-item"><strong>${o.name}</strong><br/>${o.scope}${o.source ? ` — <a href="${o.source}" target="_blank" rel="noopener">${t("country.sourceLinkLabel")}</a>` : ""}</div>`
    ).join("") + `</div>`;
  }

  let right = "";
  right += `<div class="card-block"><h2>${t("country.headingRelatedMedia")}</h2>${mediaFeed(entry)}</div>`;
  right += `<div class="card-block"><h2>${t("country.headingAiChat")}</h2>${aiChatBoxHtml()}</div>`;

  el.innerHTML = `
    <div class="country-columns">
      <div class="country-col-left">${left}</div>
      <div class="country-col-right">${right}</div>
    </div>

    <div class="card-block compare-block">
      <h2>${t("country.headingCompare")}</h2>
      ${compareBlockHtml(iso, name)}
    </div>

    <div class="country-footer-actions">
      <a class="btn-secondary" href="advisor.html?mode=compare">${t("country.compareAllCountriesBtn")}</a>
    </div>
  `;

  setupBackToAdvisor(params, iso);
  setupCountryChat(name, entry && entry.taxonomy, iso);
  setupCompare(iso, name);

  /* Activity-level drill-down (South Korea, and the EU-27 + EEA states). Each
     renderer loads its own dataset lazily, so it costs nothing on the other
     country pages. */
  const drill = drilldownRenderer(iso);
  if (drill) {
    drill.render(document.getElementById("krTaxonomyDrilldown"));
  }
}

/* ---------- Translate document modal ---------- */

/* Very small Markdown-ish renderer for the translated text Claude returns
   (## headings, numbered/bulleted lists, blank-line paragraphs, **bold**).
   Not a full Markdown parser — just enough to make a translated legal
   document readable in the modal without pulling in a dependency. */
function renderTranslatedMarkdown(text) {
  const escapeHtml = s => String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = String(text || "").split("\n");
  let html = "";
  let inList = null; // "ul" | "ol" | null
  const closeList = () => { if (inList) { html += `</${inList}>`; inList = null; } };

  lines.forEach(raw => {
    const line = raw.trim();
    if (!line) { closeList(); return; }

    let m;
    if ((m = line.match(/^#{1,3}\s+(.*)$/))) {
      closeList();
      html += `<h3>${escapeHtml(m[1])}</h3>`;
      return;
    }
    if ((m = line.match(/^[-*]\s+(.*)$/))) {
      if (inList !== "ul") { closeList(); html += "<ul>"; inList = "ul"; }
      html += `<li>${escapeHtml(m[1])}</li>`;
      return;
    }
    if ((m = line.match(/^\d+[.)]\s+(.*)$/))) {
      if (inList !== "ol") { closeList(); html += "<ol>"; inList = "ol"; }
      html += `<li>${escapeHtml(m[1])}</li>`;
      return;
    }
    closeList();
    const withBold = escapeHtml(line).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html += `<p>${withBold}</p>`;
  });
  closeList();
  return html || `<p>${escapeHtml(text)}</p>`;
}

// Tracks which document is currently open in the modal, so the language
// picker can re-request a translation without needing the button's dataset.
let gstTranslateActiveUrl = null;
let gstTranslateActiveTitle = null;
// Bumped every time a new translation run starts (open, or language change).
// A running chunk loop checks this before applying each chunk, so an old,
// still-in-flight run can't overwrite a newer one's output if the reader
// switches language mid-translation.
let gstTranslateRequestId = 0;

// Populates the modal's own language <select> from the same GST_LANGUAGES
// list the sitewide language switcher uses (defined in global.js, loaded
// before this file in every built page), so a document can be translated
// into any language the site supports — independent of the site's current
// display language. Only needs to run once per page load.
function populateTranslateLangSelect() {
  const sel = document.getElementById("translateLangSelect");
  if (!sel || sel.dataset.populated) return;
  if (typeof GST_LANGUAGES === "undefined") return;
  sel.innerHTML = GST_LANGUAGES.map(l => `<option value="${l.code}">${l.label}</option>`).join("");
  sel.dataset.populated = "1";
}

// Rough heuristic for "does this URL point at a PDF" — used to decide how to
// embed the original document (see openTranslateModal below). Mirrors the
// pattern already used elsewhere in the project for the same purpose.
function looksLikePdf(url) {
  return /\.pdf(\?|$|\/)/i.test(url) ||
    /\/pdf(\?|\/|$)/i.test(url) ||
    /[?&](format|type)=pdf/i.test(url) ||
    // Many government file-serving endpoints (e.g. Korean ministry sites,
    // Russia's official legal-publication portal) stream a PDF from a
    // generic "download"/"file" action with no ".pdf" in the URL at all —
    // route these through the same PDF-viewer path too.
    /download\.?do\b/i.test(url) ||
    /download\.aspx/i.test(url) ||
    /\/download\//i.test(url) ||
    /readdownloadfile/i.test(url) ||
    /[?&]fileid=/i.test(url);
}

// Translates the WHOLE document, not just its first few pages: the backend
// splits long documents into chunks server-side and this walks chunkIndex
// 0, 1, 2, ... until totalChunks is reached, appending each chunk's
// translation to the reader as it arrives and showing a "translating part X
// of Y" note in between (each chunk is its own request, so nothing appears
// until the first one finishes, then it grows chunk by chunk).
// Fetches one chunk from the backend. Returns { ok, data, fetchErr } rather
// than throwing, so callers (sequential or parallel) can handle failures
// uniformly without try/catch scattered everywhere.
async function fetchTranslationChunk(url, lang, chunkIndex) {
  try {
    const res = await fetch("/api/translate-pdf", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url, lang, chunkIndex })
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data, fetchErr: null };
  } catch (err) {
    return { ok: false, data: null, fetchErr: err };
  }
}

// Long documents (some run 100+ pages) used to fetch one chunk at a time,
// waiting for each full translation to finish before starting the next —
// for a 128-page document that's dozens of sequential AI calls in a row,
// each taking up to ~40s, adding up to several minutes of total wait. Since
// each chunk's translation is independent of the others, chunks after the
// first (which we need alone first, to learn how many chunks there are in
// total) are now fetched several at a time in parallel batches instead,
// cutting the total wall-clock wait roughly in proportion to the batch size.
const TRANSLATE_PARALLEL_BATCH_SIZE = 4;

async function fetchTranslation(url, lang) {
  const body = document.getElementById("translateModalBody");
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const myRequestId = ++gstTranslateRequestId;

  body.innerHTML = `<div class="translate-modal-loading"><span class="translate-spinner"></span><span>${t("translate.loading")}</span></div>`;

  const showError = (accumulatedHtml, message, debugLine) => {
    body.innerHTML = accumulatedHtml + `<p class="translate-modal-error">${message}</p>${debugLine || ""}`;
  };

  const handleFailure = (accumulatedHtml, result) => {
    if (result.fetchErr) {
      // "Failed to fetch" means the request never reached a server at all —
      // typically because the site is being viewed as a local file (file://)
      // or a static host without the /api serverless functions, rather than
      // an actual Vercel deployment with ANTHROPIC_API_KEY set.
      const looksUndeployed = /failed to fetch|networkerror|load failed/i.test(result.fetchErr.message || "");
      showError(accumulatedHtml, looksUndeployed ? t("translate.errorNotDeployed") : `${t("translate.errorGeneric")} (${result.fetchErr.message})`);
      return;
    }
    const data = result.data;
    const debugLine = data && data.debugKind
      ? `<p class="translate-modal-truncated-note">Debug: detected as "${data.debugKind}", sample: ${escapeAttr((data.debugSample || "").slice(0, 150))}</p>`
      : "";
    showError(accumulatedHtml, (data && data.error) || t("translate.errorGeneric"), debugLine);
  };

  let accumulatedHtml = "";

  // Chunk 0 always runs alone first: it's the only request that tells us
  // totalChunks, and it also does the (possibly slow, first-time) document
  // extraction that later chunks benefit from via the backend's cache.
  const first = await fetchTranslationChunk(url, lang, 0);
  if (myRequestId !== gstTranslateRequestId) return;
  if (!first.ok || !first.data || first.data.error || first.fetchErr) {
    handleFailure(accumulatedHtml, first);
    return;
  }

  accumulatedHtml += renderTranslatedMarkdown(first.data.translatedText);
  const totalChunks = first.data.totalChunks || 1;
  let truncatedOverall = first.data.truncatedOverall;
  body.innerHTML = accumulatedHtml;

  let nextIndex = 1;
  while (nextIndex < totalChunks) {
    if (myRequestId !== gstTranslateRequestId) return; // superseded by a newer run

    const batchEnd = Math.min(nextIndex + TRANSLATE_PARALLEL_BATCH_SIZE, totalChunks);
    const progressLabel = t("translate.loadingPart")
      .replace("{n}", String(batchEnd))
      .replace("{total}", String(totalChunks));
    body.innerHTML = accumulatedHtml +
      `<div class="translate-modal-loading translate-modal-progress"><span class="translate-spinner"></span><span>${progressLabel}</span></div>`;

    const batchResults = await Promise.all(
      Array.from({ length: batchEnd - nextIndex }, (_, i) => fetchTranslationChunk(url, lang, nextIndex + i))
    );

    if (myRequestId !== gstTranslateRequestId) return;

    // Apply in order (Promise.all already preserves the input order
    // regardless of which one actually finished first).
    for (const result of batchResults) {
      if (!result.ok || !result.data || result.data.error || result.fetchErr) {
        handleFailure(accumulatedHtml, result);
        return;
      }
      accumulatedHtml += renderTranslatedMarkdown(result.data.translatedText);
      if (result.data.isLastChunk) {
        truncatedOverall = result.data.truncatedOverall;
      }
    }

    body.innerHTML = accumulatedHtml;
    nextIndex = batchEnd;
  }

  if (truncatedOverall) {
    accumulatedHtml += `<p class="translate-modal-truncated-note">${t("translate.truncatedNote")}</p>`;
    body.innerHTML = accumulatedHtml;
  }
}

// Sources confirmed to block automated fetches at the network/IP level (see
// KNOWN_DOCUMENT_TEXT_FILES in api/translate-pdf.js) can't be previewed via
// Google's viewer either — gview does its own server-side fetch of the URL,
// which is blocked the exact same way ours was, and just renders its own
// "preview not available" message inside the iframe. Rather than show that
// confusing, unstyled, wrong-language message, these known cases skip the
// iframe entirely and show a clear explanation with a link to open the real
// document directly (which works fine, since that's a normal browser request
// from the reader's own machine, not a server-to-server fetch).
// Note: this same list also covers non-PDF pages that send an
// X-Frame-Options/CSP frame-ancestors header blocking iframe embedding
// outright (confirmed: greenfinanceplatform.org) — the browser refuses the
// embed itself ("site refused to connect"), the same dead-end as a blocked
// automated fetch, just for a different technical reason. New cases should
// be added here as they're found.
const KNOWN_PREVIEW_BLOCKED_URLS = new Set([
  "https://ojk.go.id/id/Publikasi/Roadmap-dan-Pedoman/Sektor-Jasa-Keuangan/Keuangan-Berkelanjutan/Documents/FAQ%20Taksonomi%20untuk%20Keuangan%20Berkelanjutan%20Indonesia%20(TKBI)%20Versi%203.pdf",
  "https://www.ojk.go.id/id/Publikasi/Roadmap-dan-Pedoman/Sektor-Jasa-Keuangan/Keuangan-Berkelanjutan/Documents/FAQ%20Taksonomi%20untuk%20Keuangan%20Berkelanjutan%20Indonesia%20(TKBI)%20Versi%203.pdf",
  "https://www.greenfinanceplatform.org/policies-and-regulations/russian-green-taxonomy"
]);

function openTranslateModal(url, title) {
  const overlay = document.getElementById("translateModalOverlay");
  const docTitleEl = document.getElementById("translateDocTitle");
  const originalLink = document.getElementById("translateOriginalLink");
  const frame = document.getElementById("translateOriginalFrame");
  const unavailableNote = document.getElementById("translateOriginalUnavailable");
  const langSelect = document.getElementById("translateLangSelect");

  gstTranslateActiveUrl = url;
  gstTranslateActiveTitle = title;

  docTitleEl.textContent = title || "";
  originalLink.href = url;
  // Embeds the original PDF/page alongside the translation so the reader can
  // check layout, tables and figures against the plain-text translation.
  // Many official PDF hosts send an X-Frame-Options header that silently
  // blocks direct iframe embedding (no visible error — it just stays blank),
  // so PDFs are routed through Google's own viewer, which fetches and
  // renders the file itself and isn't subject to the source's framing
  // restriction. Non-PDF pages are embedded directly. The "View Original
  // PDF" link in the footer remains as a fallback either way.
  if (frame) {
    if (KNOWN_PREVIEW_BLOCKED_URLS.has(url)) {
      frame.style.display = "none";
      frame.src = "about:blank";
      if (unavailableNote) unavailableNote.style.display = "";
    } else {
      frame.style.display = "";
      if (unavailableNote) unavailableNote.style.display = "none";
      frame.src = looksLikePdf(url)
        ? "https://docs.google.com/gview?url=" + encodeURIComponent(url) + "&embedded=true"
        : url;
    }
  }
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";

  populateTranslateLangSelect();
  const lang = (typeof gstCurrentLang !== "undefined" && gstCurrentLang) ? gstCurrentLang : "en";
  if (langSelect) langSelect.value = lang;

  fetchTranslation(url, lang);
}

function closeTranslateModal() {
  document.getElementById("translateModalOverlay").classList.remove("open");
  document.body.style.overflow = "";
  const frame = document.getElementById("translateOriginalFrame");
  if (frame) frame.src = "about:blank";
  gstTranslateActiveUrl = null;
  gstTranslateActiveTitle = null;
  gstTranslateRequestId++; // stops any still-running chunk loop from continuing to fetch after close
}

// Google's own translator reliably renders and translates PDFs (including
// scanned/design-heavy ones our own text-extraction pipeline struggles with),
// without needing our serverless backend at all. Simpler and more robust.
const GOOGLE_TRANSLATE_LANG = { en: "en", sv: "sv", ko: "ko", es: "es", fr: "fr", de: "de", ja: "ja", zh: "zh-CN" };

function openInGoogleTranslate(url) {
  const lang = (typeof gstCurrentLang !== "undefined" && gstCurrentLang) ? gstCurrentLang : "en";
  const tl = GOOGLE_TRANSLATE_LANG[lang] || "en";
  const translateUrl = "https://translate.google.com/translate?sl=auto&tl=" + encodeURIComponent(tl) + "&u=" + encodeURIComponent(url);
  window.open(translateUrl, "_blank", "noopener");
}

function setupTranslateModal() {
  document.addEventListener("click", e => {
    const btn = e.target.closest(".doc-translate-btn");
    if (btn) {
      openTranslateModal(btn.dataset.docUrl, btn.dataset.docTitle);
      return;
    }
    if (e.target.id === "translateModalCloseBtn" || e.target.closest("#translateModalCloseBtn") ||
        e.target.id === "translateModalCloseBtn2" || e.target.closest("#translateModalCloseBtn2")) {
      closeTranslateModal();
      return;
    }
    if (e.target.id === "translateModalOverlay") {
      closeTranslateModal();
    }
  });
  document.addEventListener("change", e => {
    if (e.target.id === "translateLangSelect" && gstTranslateActiveUrl) {
      fetchTranslation(gstTranslateActiveUrl, e.target.value);
    }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeTranslateModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  maybeTranslateAndRender();
  setupTranslateModal();
});

document.addEventListener("gst-lang-changed", () => {
  maybeTranslateAndRender();
});
