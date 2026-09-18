/* eu.js — the EU Taxonomy framework page (eu.html)
 *
 * The EU Taxonomy is not a country, so it deliberately has no entry in
 * TAXONOMY_DATA: the map, the filter list, the country dropdown and the
 * comparison tool all iterate over that object, and a pseudo-country would
 * quietly distort every country count on the site. This page is its own thing
 * instead, and reads the country list out of TAXONOMY_DATA rather than adding
 * to it.
 *
 * What this file does is small: draw the two country-chip rows, hand the
 * drill-down container to EU_TAXONOMY, and tell the site-wide chat widget that
 * questions asked here are about the EU.
 */

(function () {
  "use strict";

  /* The 27 EU Member States and the three EEA EFTA states, in the same order
     country.js uses. Kept here rather than derived from TAXONOMY_DATA by
     matching on the taxonomy name, so a wording change in the dataset can
     never silently drop a country off this page. */
  var EU27 = ["AUT", "BEL", "BGR", "HRV", "CYP", "CZE", "DNK", "EST", "FIN", "FRA",
              "DEU", "GRC", "HUN", "IRL", "ITA", "LVA", "LTU", "LUX", "MLT", "NLD",
              "POL", "PRT", "ROU", "SVK", "SVN", "ESP", "SWE"];
  var EEA = ["NOR", "ISL", "LIE"];

  /* The drill-down calls a global icon() for the objective cards. On a country
     page that comes from country.js, which this page does not load, so the six
     objective icons are repeated here. */
  var ICONS = {
    climate: '<path d="M12 3v6m0 6v6M4.2 4.2l4.2 4.2m7.2 7.2l4.2 4.2M3 12h6m6 0h6M4.2 19.8l4.2-4.2m7.2-7.2l4.2-4.2"/>',
    "climate-adapt": '<path d="M12 2l3 6-3 2-3-2 3-6z"/><path d="M5 22c1.5-4 4-6 7-6s5.5 2 7 6"/>',
    water: '<path d="M12 2s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13z"/>',
    circular: '<path d="M4 9a8 8 0 0 1 14-4M20 15a8 8 0 0 1-14 4"/><path d="M17 2v4h-4M7 22v-4h4"/>',
    pollution: '<path d="M4 15a4 4 0 0 1 4-4h.3A5 5 0 0 1 18 9a4 4 0 0 1-.5 8H8a4 4 0 0 1-4-2z"/>',
    biodiversity: '<path d="M12 2c-3 3-4 6-4 9a4 4 0 0 0 8 0c0-3-1-6-4-9z"/><path d="M8 20c1-2 2-3 4-3s3 1 4 3"/>'
  };
  if (typeof window.icon !== "function") {
    window.icon = function (name) {
      return '<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" ' +
             'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
             (ICONS[name] || "") + "</svg>";
    };
  }

  /* The site-wide chat widget posts this alongside the question, so "is
     offshore wind covered?" typed on this page reaches the model with the EU
     activity data attached — the same courtesy a country page gets. EUU is not
     an ISO country code and is not in TAXONOMY_DATA; /api/ask knows it means
     this page. */
  window.GST_PAGE_COUNTRY = "EUU";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function displayName(iso) {
    if (typeof gstCountryDisplayName === "function") {
      var e = (window.TAXONOMY_DATA || {})[iso];
      return gstCountryDisplayName(iso, (e && e.name) || iso);
    }
    var entry = (window.TAXONOMY_DATA || {})[iso];
    return (entry && entry.name) || iso;
  }

  function chips(isos) {
    return isos.map(function (iso) {
      return '<a class="eu-country-chip" href="country.html?iso=' + esc(iso) + '">' +
               esc(displayName(iso)) +
             "</a>";
    }).join("");
  }

  function renderCountries() {
    var a = document.getElementById("euCountriesEu");
    var b = document.getElementById("euCountriesEea");
    if (a) a.innerHTML = chips(EU27);
    if (b) b.innerHTML = chips(EEA);
  }

  function renderDrilldown() {
    if (typeof window.EU_TAXONOMY === "undefined") return;
    window.EU_TAXONOMY.render(document.getElementById("krTaxonomyDrilldown"));
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderCountries();
    renderDrilldown();
  });

  /* Country names and the drill-down's own labels both follow the language
     selector, so both are redrawn on a language change. */
  document.addEventListener("gst-lang-changed", function () {
    renderCountries();
    renderDrilldown();
  });
})();
