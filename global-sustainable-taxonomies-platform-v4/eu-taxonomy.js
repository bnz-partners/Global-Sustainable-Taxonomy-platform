/* eu-taxonomy.js — EU Taxonomy activity drill-down (EU-27 + EEA-3)
 *
 * Renders the 241 objective-activity combinations of the EU Taxonomy technical
 * screening criteria as a drill-down under the six environmental objectives on
 * the country page, mirroring kr-taxonomy.js:
 *
 *     objective card → sector group → activity → full criteria
 *                      (description / substantial contribution / DNSH ×5)
 *
 * Source of the data: the official English consolidated texts on EUR-Lex of
 *   - Commission Delegated Regulation (EU) 2021/2139 (Climate Delegated Act),
 *     Annex I (mitigation) and Annex II (adaptation), and
 *   - Commission Delegated Regulation (EU) 2023/2486 (Environmental Delegated
 *     Act), Annexes I–IV (water, circular economy, pollution, biodiversity),
 * both as consolidated on 1 January 2026. Every criteria string in
 * eu-taxonomy-activities.json is a verbatim extract — nothing is paraphrased
 * or machine-translated, so this drill-down never calls the translation API.
 * The EU publishes these criteria in English (and 23 other official EU
 * languages) but not in Korean, so the criteria text stays English in every UI
 * language; only the labels around it follow the language selector.
 *
 * One activity can appear under more than one objective — the Regulation
 * itself lists it once per objective, with different criteria each time — so
 * the record key is objective + code (e.g. CCM-4.5 and CCA-4.5).
 *
 * The dataset (~1.3MB, ~170KB over the wire once compressed) is fetched lazily
 * the first time a country page for an EU-Taxonomy country is rendered, so it
 * costs nothing on any other page.
 */

(function () {
  "use strict";

  var DATA_URL = "eu-taxonomy-activities.json";
  var cache = null;
  var loading = null;

  var OBJECTIVES = [
    { key: "climate_mitigation", icon: "climate",       ko: "기후변화 완화",            en: "Climate change mitigation" },
    { key: "climate_adaptation", icon: "climate-adapt", ko: "기후변화 적응",            en: "Climate change adaptation" },
    { key: "water",              icon: "water",         ko: "수자원·해양자원의 지속가능한 이용과 보호", en: "Sustainable use and protection of water and marine resources" },
    { key: "circular_economy",   icon: "circular",      ko: "순환경제로의 전환",        en: "Transition to a circular economy" },
    { key: "pollution",          icon: "pollution",     ko: "오염 방지 및 관리",        en: "Pollution prevention and control" },
    { key: "biodiversity",       icon: "biodiversity",  ko: "생물다양성·생태계 보호와 복원", en: "Protection and restoration of biodiversity and ecosystems" }
  ];

  var OBJ_SHORT = {
    climate_mitigation: { ko: "완화", en: "Mitigation" },
    climate_adaptation: { ko: "적응", en: "Adaptation" },
    water:              { ko: "물",   en: "Water" },
    circular_economy:   { ko: "순환경제", en: "Circular economy" },
    pollution:          { ko: "오염",  en: "Pollution" },
    biodiversity:       { ko: "생물다양성", en: "Biodiversity" }
  };

  var TYPE = {
    enabling:        { ko: "조력활동",  en: "Enabling" },
    transitional:    { ko: "전환활동",  en: "Transitional" },
    own_performance: { ko: "일반활동",  en: "Own performance" }
  };

  var T = {
    ko: {
      intro: "6대 환경목표를 누르면 해당 목표의 경제활동과 기술선별기준(활동 설명 · 실질적 기여 기준 · DNSH 기준)이 펼쳐집니다. 동일한 활동이 여러 목표에 중복해 나타날 수 있습니다 — 규정 자체가 목표별로 각각 기준을 두기 때문입니다.",
      searchPlaceholder: "활동명 또는 기준 내용 검색 (예: 수소, 원자력, hydrogen, cement)",
      activities: "개 활동",
      description: "① 활동 설명 (Description of the activity)",
      contribution: "② 실질적 기여 기준 (Substantial contribution)",
      dnsh: "③ 중대한 피해 방지 기준 (DNSH)",
      nace: "NACE 코드",
      annex: "근거 조문",
      appendix: "부록 본문 보기",
      appendixHide: "부록 접기",
      loading: "EU 기술선별기준 데이터를 불러오는 중…",
      error: "EU 기술선별기준 데이터를 불러오지 못했습니다.",
      noResult: "검색 결과가 없습니다.",
      resultCount: "건 검색됨",
      langNote: "기준 본문은 EU 공식 영문 통합본을 그대로 인용한 것입니다. EU는 이 기준을 한국어로 공표하지 않으므로 본문은 번역하지 않았습니다.",
      sourceNote: "출처: Commission Delegated Regulation (EU) 2021/2139 (기후 위임규정) 부속서 I·II, Commission Delegated Regulation (EU) 2023/2486 (환경 위임규정) 부속서 I~IV — EUR-Lex 통합본(2026.1.1. 기준). 본문은 원문 그대로 인용한 것으로, 실제 적합성 판단 시에는 원문과 부록(Appendix A~E), 최소안전장치(Minimum Safeguards) 규정을 함께 확인하십시오.",
      typeNote: "활동 유형(조력·전환)은 규정 본문의 “enabling activity”·“transitional activity” 문구를 그대로 읽은 것입니다."
    },
    en: {
      intro: "Select one of the six environmental objectives to open its economic activities and their technical screening criteria (description, substantial contribution, DNSH). The same activity can appear under more than one objective — the Regulation sets separate criteria for each.",
      searchPlaceholder: "Search activities or criteria (e.g. hydrogen, nuclear, cement)",
      activities: " activities",
      description: "① Description of the activity",
      contribution: "② Substantial contribution criteria",
      dnsh: "③ Do no significant harm (DNSH) criteria",
      nace: "NACE codes",
      annex: "Legal basis",
      appendix: "Show appendix text",
      appendixHide: "Hide appendix",
      loading: "Loading EU technical screening criteria…",
      error: "Could not load the EU technical screening criteria.",
      noResult: "No matching activity.",
      resultCount: " matches",
      langNote: "Criteria are quoted verbatim from the official English consolidated text.",
      sourceNote: "Source: Commission Delegated Regulation (EU) 2021/2139 (Climate Delegated Act), Annexes I–II, and Commission Delegated Regulation (EU) 2023/2486 (Environmental Delegated Act), Annexes I–IV — EUR-Lex consolidated texts as at 1 January 2026. Text is quoted verbatim; for an actual alignment assessment, consult the Regulations together with their Appendices A–E and the minimum safeguards.",
      typeNote: "Enabling / transitional flags are read directly from the “enabling activity” and “transitional activity” wording in the Regulation."
    }
  };

  /* Korean search aid only — these are search aliases so a Korean user can type
     "수소" and reach "Hydrogen". They are NOT a translation of the criteria and
     are never displayed. */
  var KO_ALIAS = {
    "수소": "hydrogen", "암모니아": "ammonia", "원자력": "nuclear", "원전": "nuclear",
    "태양광": "solar", "태양열": "solar", "풍력": "wind", "해상풍력": "offshore wind",
    "지열": "geothermal", "수력": "hydropower", "조력": "ocean", "해양": "ocean",
    "바이오매스": "biomass", "바이오가스": "biogas", "바이오연료": "biofuel",
    "연료전지": "fuel cell", "열병합": "cogeneration", "지역난방": "district heating",
    "송전": "transmission", "배전": "distribution", "에너지저장": "storage",
    "배터리": "batteries", "이차전지": "batteries", "전기차": "electric",
    "철강": "iron and steel", "시멘트": "cement", "알루미늄": "aluminium",
    "화학": "chemicals", "석유화학": "chemicals", "플라스틱": "plastic",
    "유리": "glass", "종이": "paper", "펄프": "pulp", "비료": "fertiliser",
    "반도체": "electronic", "데이터센터": "data", "소프트웨어": "computer programming",
    "건물": "buildings", "건축": "construction", "신축": "new buildings",
    "리모델링": "renovation", "철거": "demolition", "도로": "road",
    "철도": "rail", "항공": "air", "공항": "airport", "해운": "sea", "선박": "vessels",
    "물류": "freight", "탄소포집": "carbon capture", "탄소저장": "carbon storage",
    "폐기물": "waste", "재활용": "recycling", "매립": "landfill", "소각": "incineration",
    "하수": "waste water", "상수도": "water supply", "산림": "forest", "조림": "afforestation",
    "농업": "agriculture", "복원": "restoration", "생물다양성": "biodiversity",
    "관광": "hotels", "숙박": "accommodation", "보험": "insurance", "의약품": "medicinal",
    "오염": "pollution", "정화": "remediation", "수리": "repair", "중고": "second-hand"
  };

  function lang() {
    return (typeof gstCurrentLang === "string" && gstCurrentLang === "ko") ? "ko" : "en";
  }
  function t(key) {
    var L = lang();
    return (T[L] && T[L][key] !== undefined) ? T[L][key] : T.en[key];
  }
  function isKo() { return lang() === "ko"; }
  function loc(obj) { return isKo() ? obj.ko : obj.en; }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function svgIcon(name) {
    if (typeof icon === "function") return icon(name);
    return "";
  }

  /* ---------- data ---------- */

  function load() {
    if (cache) return Promise.resolve(cache);
    if (loading) return loading;
    loading = fetch(DATA_URL)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (json) { cache = json; return cache; });
    return loading;
  }

  function searchBlob(a) {
    return [
      a.code, a.name, a.sector, (a.nace || []).join(" "),
      a.description, a.substantial_contribution,
      Object.keys(a.dnsh || {}).map(function (k) { return a.dnsh[k]; }).join(" ")
    ].join(" ").toLowerCase();
  }

  /* A Korean query is rewritten into the English terms the Regulation uses;
     anything with no alias is kept as typed, so a mixed query still works. */
  function expandQuery(q) {
    var out = [q];
    Object.keys(KO_ALIAS).forEach(function (k) {
      if (q.indexOf(k) !== -1) out.push(KO_ALIAS[k]);
    });
    return out.filter(function (s) { return s && s.trim(); });
  }

  /* ---------- rendering ---------- */

  /* The Regulation's own numbering ("1. … 2. … 3. …") is the only structure a
     criteria cell has; EUR-Lex's HTML flattens it into one run of text, which
     reads as a wall. Splitting it back at the top-level numbers is purely
     presentational — no word is added, removed or reordered. Sub-numbers
     ("2.1.") and lettered points ("(a)") are deliberately left inline, and a
     cell with fewer than two markers is left exactly as it is. */
  function numbered(text) {
    var s = String(text || "");
    if ((s.match(/\s\d{1,2}\.\s+[A-Z(]/g) || []).length < 2) return [s];
    return s.split(/\s+(?=\d{1,2}\.\s+[A-Z(])/).filter(function (x) { return x.trim(); });
  }

  function paras(text) {
    var out = [];
    String(text || "").split("\n").forEach(function (line) {
      if (!line.trim()) return;
      numbered(line).forEach(function (part) { out.push(part); });
    });
    return out.map(function (l) { return '<p class="kr-crit-text">' + esc(l) + "</p>"; }).join("");
  }

  function cellHtml(text) {
    var parts = numbered(text);
    if (parts.length < 2) return esc(text);
    return parts.map(function (p) { return "<span>" + esc(p) + "</span>"; }).join("");
  }

  /* DNSH entries routinely say "complies with the criteria set out in Appendix
     A to this Annex" — without the appendix that sentence is a dead end, so the
     text is offered inline right where it is referenced. */
  function appendixRefs(a, data) {
    var set = (data.appendix_set || {})[a.objective];
    var book = (data.appendices || {})[set] || {};
    var joined = Object.keys(a.dnsh || {}).map(function (k) { return a.dnsh[k]; }).join(" ") +
                 " " + (a.substantial_contribution || "");
    var found = [];
    (joined.match(/Appendix\s+[A-E]/g) || []).forEach(function (m) {
      var key = m.replace(/\s+/, " ");
      if (found.indexOf(key) === -1 && book[key]) found.push(key);
    });
    if (!found.length) return "";
    return found.map(function (key) {
      return '<details class="eu-appx"><summary>' + esc(key) + " — " + esc(t("appendix")) + "</summary>" +
             paras(book[key]) + "</details>";
    }).join("");
  }

  function dnshHtml(a) {
    var keys = OBJECTIVES.map(function (o) { return o.key; })
      .filter(function (k) { return a.dnsh && a.dnsh[k]; });
    if (!keys.length) return "";
    return '<table class="kr-crit-table"><tbody>' + keys.map(function (k) {
      var o = OBJECTIVES.filter(function (x) { return x.key === k; })[0];
      return "<tr><th>" + esc(o ? loc(o) : k) + '</th><td class="eu-dnsh-cell">' +
             cellHtml(a.dnsh[k]) + "</td></tr>";
    }).join("") + "</tbody></table>";
  }

  function criteriaHtml(a, data) {
    var html = "";
    html += '<div class="kr-crit"><h5>' + esc(t("description")) + "</h5>" + paras(a.description) + "</div>";
    html += '<div class="kr-crit"><h5>' + esc(t("contribution")) + "</h5>" +
            paras(a.substantial_contribution) + "</div>";
    html += '<div class="kr-crit"><h5>' + esc(t("dnsh")) + "</h5>" + dnshHtml(a) + "</div>";
    html += appendixRefs(a, data);
    html += '<div class="kr-crit eu-meta">';
    if (a.nace && a.nace.length) {
      html += "<p><strong>" + esc(t("nace")) + ":</strong> " + esc(a.nace.join(", ")) + "</p>";
    }
    html += "<p><strong>" + esc(t("annex")) + ":</strong> " + esc(a.annex) + " — " + esc(a.code) + "</p>";
    html += "</div>";
    return html;
  }

  function activityRowHtml(a, data, showObjective) {
    var ty = TYPE[a.activity_type];
    var chip = (a.activity_type === "own_performance") ? "" :
      '<span class="eu-type eu-type-' + esc(a.activity_type) + '">' + esc(loc(ty)) + "</span>";
    var objChip = showObjective && OBJ_SHORT[a.objective]
      ? '<span class="eu-obj-chip">' + esc(loc(OBJ_SHORT[a.objective])) + "</span>" : "";
    return '<div class="kr-act" data-act-id="' + esc(a.id) + '">' +
             '<button class="kr-act-head" type="button" aria-expanded="false">' +
               '<span class="kr-act-code">' + esc(a.code) + "</span>" +
               '<span class="kr-act-name">' + esc(a.name) + objChip + chip + "</span>" +
               '<span class="kr-act-chevron" aria-hidden="true">▾</span>' +
             "</button>" +
             '<div class="kr-act-body" hidden>' + criteriaHtml(a, data) + "</div>" +
           "</div>";
  }

  function groupPanelHtml(items, data, showObjective) {
    var order = [], bySector = {};
    items.forEach(function (a) {
      var s = a.sector;
      if (!bySector[s]) { bySector[s] = []; order.push(s); }
      bySector[s].push(a);
    });
    return order.map(function (s) {
      return '<div class="kr-field">' +
               '<h4 class="kr-field-title">' + esc(s) +
                 ' <span class="kr-field-count">' + bySector[s].length + "</span></h4>" +
               bySector[s].map(function (a) { return activityRowHtml(a, data, showObjective); }).join("") +
             "</div>";
    }).join("");
  }

  function cardsHtml(data) {
    var counts = data.meta && data.meta.counts ? data.meta.counts : {};
    var cards = OBJECTIVES.map(function (o) {
      return '<button class="kr-obj-card" type="button" data-obj="' + o.key + '" aria-expanded="false">' +
               '<span class="kr-obj-icon">' + svgIcon(o.icon) + "</span>" +
               '<span class="kr-obj-name">' + esc(loc(o)) + "</span>" +
               '<span class="kr-obj-count">' + (counts[o.key] || 0) + esc(t("activities")) + "</span>" +
             "</button>";
    }).join("");

    return '<p class="kr-drill-intro">' + esc(t("intro")) + "</p>" +
           /* The rest of the country page is machine-translated into the
              selected language; these criteria deliberately are not, so the
              exception is stated wherever that language is not English. */
           ((typeof gstCurrentLang === "string" && gstCurrentLang !== "en")
             ? '<p class="eu-lang-note">' + esc(t("langNote")) + "</p>" : "") +
           '<div class="kr-drill-searchwrap">' +
             '<input type="search" class="kr-drill-search" placeholder="' + esc(t("searchPlaceholder")) + '" />' +
           "</div>" +
           '<div class="kr-obj-grid">' + cards + "</div>" +
           '<div class="kr-drill-panel" hidden></div>' +
           '<p class="kr-drill-source">' + esc(t("sourceNote")) + " " + esc(t("typeNote")) + "</p>";
  }

  /* ---------- behaviour ---------- */

  function wire(root, data) {
    var acts = data.activities || [];
    var panel = root.querySelector(".kr-drill-panel");
    var search = root.querySelector(".kr-drill-search");
    var cards = Array.prototype.slice.call(root.querySelectorAll(".kr-obj-card"));

    function closeCards() {
      cards.forEach(function (c) {
        c.classList.remove("is-open");
        c.setAttribute("aria-expanded", "false");
      });
    }

    function openObjective(key, card) {
      var items = acts.filter(function (a) { return a.objective === key; });
      closeCards();
      card.classList.add("is-open");
      card.setAttribute("aria-expanded", "true");
      panel.innerHTML = groupPanelHtml(items, data, false);
      panel.hidden = false;
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        if (card.classList.contains("is-open")) {
          closeCards();
          panel.hidden = true;
          panel.innerHTML = "";
          return;
        }
        if (search) search.value = "";
        openObjective(card.dataset.obj, card);
      });
    });

    panel.addEventListener("click", function (ev) {
      var head = ev.target.closest ? ev.target.closest(".kr-act-head") : null;
      if (!head || !panel.contains(head)) return;
      var body = head.nextElementSibling;
      var open = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", open ? "false" : "true");
      head.parentNode.classList.toggle("is-open", !open);
      if (body) body.hidden = open;
    });

    if (search) {
      var timer = null;
      search.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          var q = search.value.trim().toLowerCase();
          if (!q) {
            closeCards();
            panel.hidden = true;
            panel.innerHTML = "";
            return;
          }
          closeCards();
          var needles = expandQuery(q);
          var hits = acts.filter(function (a) {
            var blob = searchBlob(a);
            return needles.some(function (n) { return blob.indexOf(n) !== -1; });
          });
          panel.hidden = false;
          if (!hits.length) {
            panel.innerHTML = '<p class="kr-drill-empty">' + esc(t("noResult")) + "</p>";
            return;
          }
          panel.innerHTML = '<p class="kr-drill-count">' + hits.length + esc(t("resultCount")) + "</p>" +
                            groupPanelHtml(hits, data, true);
        }, 180);
      });
    }
  }

  /* Site-wide search and the AI answers link here as
     country.html?iso=DEU&activity=CCM-4.5 — open that activity's objective card
     and expand the activity itself. */
  function openFromUrl(root, data) {
    var id;
    try {
      id = new URLSearchParams(window.location.search).get("activity");
    } catch (e) { return; }
    if (!id) return;

    var target = (data.activities || []).filter(function (a) { return a.id === id; })[0];
    if (!target) return;

    var card = root.querySelector('.kr-obj-card[data-obj="' + target.objective + '"]');
    if (!card) return;
    card.click();

    var row = root.querySelector('.kr-act[data-act-id="' + id + '"]');
    if (!row) return;
    var head = row.querySelector(".kr-act-head");
    if (head) head.click();
    row.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function render(container) {
    if (!container) return;
    container.innerHTML = '<p class="kr-drill-loading">' + esc(t("loading")) + "</p>";
    load().then(function (data) {
      container.innerHTML = cardsHtml(data);
      wire(container, data);
      openFromUrl(container, data);
    }).catch(function (err) {
      console.warn("EU Taxonomy drill-down failed to load:", err);
      container.innerHTML = '<p class="kr-drill-empty">' + esc(t("error")) + "</p>";
    });
  }

  window.EU_TAXONOMY = { render: render, load: load, DATA_URL: DATA_URL };
})();
