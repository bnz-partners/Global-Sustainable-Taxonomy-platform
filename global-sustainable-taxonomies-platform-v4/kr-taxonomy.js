/* kr-taxonomy.js — K-Taxonomy activity drill-down (South Korea only)
 *
 * Renders the 100 economic activities of the K-Taxonomy (한국형 녹색분류체계)
 * as a drill-down under the six environmental objectives on the country page:
 *
 *     objective card  →  sector (분야) group  →  activity  →  full criteria
 *                                                (활동기준 / 인정기준 /
 *                                                 배제기준 / 보호기준)
 *
 * Source of the data: Ministry of Climate, Energy and Environment,
 * "한국형 녹색분류체계 가이드라인" (31 Dec 2025) and its official English
 * edition "K-Taxonomy Guidelines". Every criteria string in
 * kr-taxonomy-activities.json is a verbatim extract from those two PDFs —
 * nothing is paraphrased or machine-translated, so this drill-down never
 * calls the translation API. Korean shows for lang "ko"; every other
 * language shows the official English text.
 *
 * The dataset (~420KB) is fetched lazily the first time a country page for
 * KOR is rendered, so it costs nothing on any other page.
 */

(function () {
  "use strict";

  var DATA_URL = "kr-taxonomy-activities.json";
  var cache = null;
  var loading = null;

  /* Objective keys used by the cards. "0" = Common (공통, applies across all
     six objectives), "T" = Transitional Area (전환부문). */
  var OBJECTIVES = [
    { key: "1", icon: "climate",      ko: "온실가스 감축",        en: "Greenhouse Gas Reduction" },
    { key: "2", icon: "climate-adapt", ko: "기후변화 적응",        en: "Climate Change Adaptation" },
    { key: "3", icon: "water",        ko: "물의 지속가능한 보전", en: "Sustainable Water Preservation" },
    { key: "4", icon: "circular",     ko: "순환경제로의 전환",    en: "Transition to Circular Economy" },
    { key: "5", icon: "pollution",    ko: "오염 방지 및 관리",    en: "Pollution Prevention and Control" },
    { key: "6", icon: "biodiversity", ko: "생물다양성 보전",      en: "Biodiversity Preservation" }
  ];

  var T = {
    ko: {
      intro: "6대 환경목표를 누르면 해당 목표의 경제활동과 세부 판단기준(활동·인정·배제·보호)이 펼쳐집니다.",
      searchPlaceholder: "활동명 또는 기준 내용 검색 (예: 수소, 데이터센터, 벤치마크)",
      common: "공통",
      commonNote: "6대 환경목표 중 하나 이상을 선택해 적용",
      transitional: "전환부문",
      transitionalNote: "탄소중립으로 가는 과도기적 활동 — 한시적·조건부 인정",
      green: "녹색부문",
      activities: "개 활동",
      activityCriteria: "① 활동기준",
      recognition: "② 인정기준",
      exclusion: "③ 배제기준",
      protection: "④ 보호기준",
      loading: "판단기준 데이터를 불러오는 중…",
      error: "판단기준 데이터를 불러오지 못했습니다.",
      noResult: "검색 결과가 없습니다.",
      resultCount: "건 검색됨",
      sourceNote: "출처: 기후에너지환경부 「한국형 녹색분류체계 가이드라인」(2025.12.31.) 및 공식 영문판 K-Taxonomy Guidelines. 본문은 원문 그대로 인용한 것으로, 실제 적합성판단 시에는 원문과 붙임(공통 배제기준 등)을 확인하십시오.",
      back: "← 목표 선택으로"
    },
    en: {
      intro: "Select one of the six environmental objectives to open its economic activities and their full determining criteria (activity, recognition, exclusion, protection).",
      searchPlaceholder: "Search activities or criteria (e.g. hydrogen, data centre, benchmark)",
      common: "Common",
      commonNote: "Applies across the six objectives — select at least one",
      transitional: "Transitional Area",
      transitionalNote: "Bridge activities toward carbon neutrality — recognised temporarily and conditionally",
      green: "Green Area",
      activities: " activities",
      activityCriteria: "① Activity Criteria",
      recognition: "② Recognition Criteria",
      exclusion: "③ Exclusion Criteria",
      protection: "④ Protection Criteria",
      loading: "Loading determining criteria…",
      error: "Could not load the determining criteria data.",
      noResult: "No matching activity.",
      resultCount: " matches",
      sourceNote: "Source: Ministry of Climate, Energy and Environment, “한국형 녹색분류체계 가이드라인” (31 Dec 2025) and its official English edition, K-Taxonomy Guidelines. Text is quoted verbatim; for an actual alignment assessment, consult the guideline and its attachments (common exclusion criteria).",
      back: "← Back to objectives"
    }
  };

  function lang() {
    return (typeof gstCurrentLang === "string" && gstCurrentLang === "ko") ? "ko" : "en";
  }
  function t(key) {
    var L = lang();
    return (T[L] && T[L][key] !== undefined) ? T[L][key] : T.en[key];
  }
  function isKo() { return lang() === "ko"; }

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

  /* group key for an activity: "1".."6", "0" (common), "T" (transitional) */
  function groupKey(a) {
    if (a.section_en === "Transitional Area") return "T";
    if (a.objective_no === 0) return "0";
    return String(a.objective_no);
  }

  function nameOf(a) { return isKo() ? a.name_ko : a.name_en; }
  function fieldOf(a) { return isKo() ? a.field_ko : a.field_en; }
  function codeOf(a) { return isKo() ? a.code_ko : a.code_en; }

  function searchBlob(a) {
    return [
      a.name_ko, a.name_en, a.field_ko, a.field_en, a.code_ko, a.code_en,
      a.activity_ko, a.activity_en,
      (a.recognition_ko || []).join(" "), (a.recognition_en || []).join(" "),
      (a.exclusion_ko || []).map(function (r) { return r.text; }).join(" "),
      (a.exclusion_en || []).map(function (r) { return r.text; }).join(" ")
    ].join(" ").toLowerCase();
  }

  /* ---------- rendering ---------- */

  function criteriaHtml(a) {
    var rec = isKo() ? a.recognition_ko : a.recognition_en;
    var exc = isKo() ? a.exclusion_ko : a.exclusion_en;
    var act = isKo() ? a.activity_ko : a.activity_en;
    var pro = isKo() ? a.protection_ko : a.protection_en;

    var html = "";
    html += '<div class="kr-crit"><h5>' + esc(t("activityCriteria")) + "</h5>" +
            '<p class="kr-crit-text">' + esc(act) + "</p></div>";

    html += '<div class="kr-crit"><h5>' + esc(t("recognition")) + "</h5><ul class=\"kr-crit-list\">" +
            (rec || []).map(function (line) {
              var note = /^[※*]/.test(line.trim());
              return '<li class="' + (note ? "kr-crit-note" : "") + '">' + esc(line) + "</li>";
            }).join("") + "</ul></div>";

    html += '<div class="kr-crit"><h5>' + esc(t("exclusion")) + "</h5>" +
            '<table class="kr-crit-table"><tbody>' +
            (exc || []).map(function (r) {
              return "<tr><th>" + esc(r.objective || "") + "</th><td>" + esc(r.text) + "</td></tr>";
            }).join("") + "</tbody></table></div>";

    html += '<div class="kr-crit"><h5>' + esc(t("protection")) + "</h5>" +
            '<p class="kr-crit-text">' + esc(pro) + "</p></div>";

    return html;
  }

  function activityRowHtml(a) {
    return '<div class="kr-act" data-act-id="' + esc(a.id) + '">' +
             '<button class="kr-act-head" type="button" aria-expanded="false">' +
               '<span class="kr-act-code">' + esc(codeOf(a)) + "</span>" +
               '<span class="kr-act-name">' + esc(nameOf(a)) + "</span>" +
               '<span class="kr-act-chevron" aria-hidden="true">▾</span>' +
             "</button>" +
             '<div class="kr-act-body" hidden>' + criteriaHtml(a) + "</div>" +
           "</div>";
  }

  function groupPanelHtml(items) {
    /* group by sector (분야), keeping guideline order */
    var order = [];
    var byField = {};
    items.forEach(function (a) {
      var f = fieldOf(a);
      if (!byField[f]) { byField[f] = []; order.push(f); }
      byField[f].push(a);
    });
    return order.map(function (f) {
      return '<div class="kr-field">' +
               '<h4 class="kr-field-title">' + esc(f) +
                 ' <span class="kr-field-count">' + byField[f].length + "</span></h4>" +
               byField[f].map(activityRowHtml).join("") +
             "</div>";
    }).join("");
  }

  function cardsHtml(data) {
    var counts = {};
    data.forEach(function (a) {
      var k = groupKey(a);
      counts[k] = (counts[k] || 0) + 1;
    });

    var green = OBJECTIVES.map(function (o) {
      return '<button class="kr-obj-card" type="button" data-obj="' + o.key + '" aria-expanded="false">' +
               '<span class="kr-obj-icon">' + svgIcon(o.icon) + "</span>" +
               '<span class="kr-obj-name">' + esc(isKo() ? o.ko : o.en) + "</span>" +
               '<span class="kr-obj-count">' + (counts[o.key] || 0) + esc(t("activities")) + "</span>" +
             "</button>";
    }).join("");

    var extra =
      '<button class="kr-obj-card kr-obj-card-alt" type="button" data-obj="0" aria-expanded="false">' +
        '<span class="kr-obj-name">' + esc(t("common")) + "</span>" +
        '<span class="kr-obj-count">' + (counts["0"] || 0) + esc(t("activities")) + "</span>" +
        '<span class="kr-obj-note">' + esc(t("commonNote")) + "</span>" +
      "</button>" +
      '<button class="kr-obj-card kr-obj-card-transition" type="button" data-obj="T" aria-expanded="false">' +
        '<span class="kr-obj-name">' + esc(t("transitional")) + "</span>" +
        '<span class="kr-obj-count">' + (counts["T"] || 0) + esc(t("activities")) + "</span>" +
        '<span class="kr-obj-note">' + esc(t("transitionalNote")) + "</span>" +
      "</button>";

    return '<p class="kr-drill-intro">' + esc(t("intro")) + "</p>" +
           '<div class="kr-drill-searchwrap">' +
             '<input type="search" class="kr-drill-search" placeholder="' + esc(t("searchPlaceholder")) + '" />' +
           "</div>" +
           '<div class="kr-obj-grid">' + green + "</div>" +
           '<div class="kr-obj-grid kr-obj-grid-alt">' + extra + "</div>" +
           '<div class="kr-drill-panel" hidden></div>' +
           '<p class="kr-drill-source">' + esc(t("sourceNote")) + "</p>";
  }

  /* ---------- behaviour ---------- */

  function wire(root, data) {
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
      var items = data.filter(function (a) { return groupKey(a) === key; });
      closeCards();
      card.classList.add("is-open");
      card.setAttribute("aria-expanded", "true");
      panel.innerHTML = groupPanelHtml(items);
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

    /* accordion for the activity rows (event delegation — rows are re-rendered) */
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
          var hits = data.filter(function (a) { return searchBlob(a).indexOf(q) !== -1; });
          panel.hidden = false;
          if (!hits.length) {
            panel.innerHTML = '<p class="kr-drill-empty">' + esc(t("noResult")) + "</p>";
            return;
          }
          panel.innerHTML = '<p class="kr-drill-count">' + hits.length + esc(t("resultCount")) + "</p>" +
                            groupPanelHtml(hits);
        }, 180);
      });
    }
  }

  /* ---------- public entry point ---------- */

  /* Site-wide search links here as country.html?iso=KOR&activity=<id>.
     Open that activity's objective card and expand the activity itself, so the
     visitor lands on the criteria rather than on a closed list. */
  function openFromUrl(root, data) {
    var id;
    try {
      id = new URLSearchParams(window.location.search).get("activity");
    } catch (e) { return; }
    if (!id) return;

    var target = data.filter(function (a) { return a.id === id; })[0];
    if (!target) return;

    var card = root.querySelector('.kr-obj-card[data-obj="' + groupKey(target) + '"]');
    if (!card) return;
    card.click();

    var row = root.querySelector('.kr-act[data-act-id="' + id + '"]');
    if (!row) return;
    var head = row.querySelector(".kr-act-head");
    if (head) head.click();
    row.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* Renders the drill-down into `container`. Safe to call repeatedly (e.g.
     after a language change) — it re-renders from the cached dataset. */
  function render(container) {
    if (!container) return;
    container.innerHTML = '<p class="kr-drill-loading">' + esc(t("loading")) + "</p>";
    load().then(function (data) {
      container.innerHTML = cardsHtml(data);
      wire(container, data);
      openFromUrl(container, data);
    }).catch(function (err) {
      console.warn("K-Taxonomy drill-down failed to load:", err);
      container.innerHTML = '<p class="kr-drill-empty">' + esc(t("error")) + "</p>";
    });
  }

  window.KR_TAXONOMY = { render: render, load: load, DATA_URL: DATA_URL };
})();
