/* Global Sustainable Taxonomies — Home / Interactive Map */

const STATUS_LABEL = {
  established: "Developed",
  developing: "Under Development",
  none: "No Taxonomy"
};

const STATUS_COLOR = {
  established: "#15803D",
  developing: "#D97706",
  none: "#B8C0CC"
};

const GEOJSON_URL = "https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json";
const GEOJSON_FALLBACK_URL = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

let map, geoLayer;
let currentRegion = "All";
let currentStatus = "All";
let currentObjective = "All";
let currentSector = "All";
const layerByIso = {};

function getEntry(iso) {
  return window.TAXONOMY_DATA[iso] || null;
}

function getStatus(iso) {
  const entry = getEntry(iso);
  const raw = entry ? entry.status : "none";
  return (raw === "established" || raw === "developing") ? raw : "none";
}

// Environmental objective labels are free text and vary a lot between
// countries' own data (e.g. "Climate Change Mitigation" vs "Climate Change
// Mitigation (1.5°C-aligned)"), but every objective entry already carries a
// canonical `icon` tag assigned when the data was compiled. Filtering on that
// icon groups equivalent objectives together reliably instead of trying to
// match free text. The "industry" filter bucket also matches the rarer
// "digital" icon (only one label uses it: "Green Services & Trade") so it
// isn't left as an unreachable filter option of its own.
function entryMatchesObjective(entry, key) {
  if (!entry || !Array.isArray(entry.objectives) || !entry.objectives.length) return false;
  return entry.objectives.some(o => {
    if (!o || !o.icon) return false;
    if (key === "industry") return o.icon === "industry" || o.icon === "digital";
    return o.icon === key;
  });
}

// Sectors are stored as a plain list of clean strings per country (unlike the
// free-text objective labels), so an exact match against that list is enough.
function entryMatchesSector(entry, sector) {
  if (!entry || !Array.isArray(entry.sectors) || !entry.sectors.length) return false;
  return entry.sectors.includes(sector);
}

function matchesFilters(iso) {
  const entry = getEntry(iso);
  const status = getStatus(iso);
  const region = entry ? entry.region : null;
  if (currentStatus !== "All" && status !== currentStatus) return false;
  if (currentRegion !== "All" && region !== currentRegion) return false;
  if (currentObjective !== "All" && !entryMatchesObjective(entry, currentObjective)) return false;
  if (currentSector !== "All" && !entryMatchesSector(entry, currentSector)) return false;
  return true;
}

function styleFeature(feature) {
  const status = getStatus(feature.id);
  const match = matchesFilters(feature.id);
  return {
    fillColor: STATUS_COLOR[status],
    weight: 0.7,
    color: "#ffffff",
    fillOpacity: match ? 0.9 : 0.12,
    opacity: match ? 1 : 0.35
  };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Same rule as the country page header: if a country has its own named
// taxonomy *and* is also covered by a regional overlay (ASEAN, UMOA, LAC
// Common Framework, etc.), surface that dual coverage right in the popup.
function overlayPopupTags(entry) {
  if (!entry || !entry.taxonomy || !entry.overlays || !entry.overlays.length) return "";
  const names = entry.overlays
    .map(o => o && o.name)
    .filter(n => n && !entry.taxonomy.includes(n));
  if (!names.length) return "";
  return names.map(n => `<span class="popup-overlay-tag">+ ${escapeHtml(n)}</span>`).join("");
}

function buildPopupHtml(feature) {
  const iso = feature.id;
  const entry = getEntry(iso);
  const name = entry ? entry.name : feature.properties.name;
  const status = getStatus(iso);
  const label = STATUS_LABEL[status];

  let html = `<div class="taxo-popup">`;
  html += `<h3>${name}</h3>`;
  html += `<span class="badge badge-${status}">${label}</span>`;
  if (entry && entry.taxonomy) {
    html += `<div class="taxo-name">${entry.taxonomy}${entry.year ? " (" + entry.year + ")" : ""}</div>`;
    html += overlayPopupTags(entry);
  }
  if (entry && entry.regulator) {
    html += `<div class="taxo-meta">${entry.regulator}</div>`;
  }
  if (!entry) {
    html += `<div class="taxo-meta">No taxonomy data compiled for this country yet.</div>`;
  }
  html += `<div class="taxo-actions">`;
  html += `<a class="btn-primary" href="country.html?iso=${iso}">View Full Taxonomy</a>`;
  html += `<a class="btn-secondary-sm" href="advisor.html?mode=country&amp;iso=${iso}">AI Compliance Check</a>`;
  html += `</div></div>`;
  return html;
}

function onEachFeature(feature, layer) {
  const iso = feature.id;
  layerByIso[iso] = layer;
  layer.bindPopup(buildPopupHtml(feature));

  layer.on({
    mouseover: e => {
      const l = e.target;
      l.setStyle({ weight: 2, color: "#0F172A" });
      l.bringToFront();
    },
    mouseout: e => {
      geoLayer.resetStyle(e.target);
    }
  });
}

function renderStats() {
  const counts = { established: 0, developing: 0, none: 0 };
  // Count only countries we actually have a compiled research entry for.
  // The map background (GeoJSON) renders ~180 country shapes total, but most
  // of those have no entry in data.js at all — they're just gray/"No Taxonomy"
  // by default because nobody has researched them, not because we've confirmed
  // they have no taxonomy. Counting every map shape here would silently inflate
  // "Total Countries Tracked" with countries we've never actually looked at,
  // which misrepresents how much of the world this site actually covers.
  const isoList = Object.keys(window.TAXONOMY_DATA);
  isoList.forEach(iso => {
    const bucket = getStatus(iso);
    counts[bucket] += 1;
  });
  const total = counts.established + counts.developing + counts.none;

  const totalEl = document.getElementById("statTotal");
  const estEl = document.getElementById("statEstablished");
  const devEl = document.getElementById("statDeveloping");
  const noneEl = document.getElementById("statNone");
  if (totalEl) totalEl.textContent = total;
  if (estEl) estEl.textContent = counts.established;
  if (devEl) devEl.textContent = counts.developing;
  if (noneEl) noneEl.textContent = counts.none;
}

function renderRecentUpdates() {
  const list = document.getElementById("recentList");
  if (!list) return;

  const dated = Object.entries(window.TAXONOMY_DATA)
    .map(([iso, e]) => ({
      iso,
      name: e.name,
      year: parseInt(e.year, 10),
      taxonomy: e.taxonomy || "National sustainable finance taxonomy"
    }))
    .filter(e => !isNaN(e.year));

  dated.sort((a, b) => b.year - a.year || a.name.localeCompare(b.name));

  const top = dated.slice(0, 3);
  list.innerHTML = top.map(e => `
    <li>
      <a href="country.html?iso=${e.iso}">
        <div class="recent-top"><strong>${e.name}</strong></div>
        <div class="recent-sub"><span>${e.taxonomy}</span><span class="recent-date">${e.year}</span></div>
      </a>
    </li>
  `).join("");
}

function refreshMapStyles() {
  if (!geoLayer) return;
  geoLayer.eachLayer(l => l.setStyle(styleFeature(l.feature)));
}

// Advanced Search & Filtering (7.3): re-renders both the map highlighting
// (via refreshMapStyles, using the existing matchesFilters opacity trick)
// and the synced "Matching Countries" list every time any filter chip
// (region, status, environmental objective, or sector) changes, so the two
// views always stay in sync with each other.
function onFiltersChanged() {
  refreshMapStyles();
  renderFilteredList();
}

/* Spells out which filters produced the "Matching Countries" number. Without
   this the figure sits directly under the Global Stats block and reads like
   another global statistic — which is exactly what reviewers found confusing.
   The labels come from the select options, so they follow the site language. */
function renderActiveFilters() {
  const el = document.getElementById("activeFilters");
  if (!el) return;
  const t = (typeof gstT === "function") ? gstT : (k => k);

  const selectedLabel = (selectId, value) => {
    const sel = document.getElementById(selectId);
    if (!sel) return value;
    const opt = Array.prototype.find.call(sel.options, o => o.value === value);
    return opt ? opt.textContent : value;
  };

  const statusKey = {
    established: "home.chipDeveloped",
    developing: "home.chipUnderDevelopment",
    none: "home.chipNoTaxonomy"
  };
  const regionKey = {
    "Europe": "home.chipEurope", "Asia-Pacific": "home.chipAsiaPacific",
    "Americas": "home.chipAmericas", "Africa": "home.chipAfrica",
    "Middle East": "home.chipMiddleEast"
  };

  const parts = [];
  if (currentRegion !== "All") parts.push(regionKey[currentRegion] ? t(regionKey[currentRegion]) : currentRegion);
  if (currentStatus !== "All") parts.push(statusKey[currentStatus] ? t(statusKey[currentStatus]) : (STATUS_LABEL[currentStatus] || currentStatus));
  if (currentObjective !== "All") parts.push(selectedLabel("homeObjectiveSelect", currentObjective));
  if (currentSector !== "All") parts.push(selectedLabel("homeSectorSelect", currentSector));

  if (!parts.length) { el.textContent = ""; return; }
  el.textContent = t("home.activeFiltersLabel") + ": " + parts.join(" + ");
}

function renderFilteredList() {
  const listEl = document.getElementById("filteredList");
  const countEl = document.getElementById("filteredCount");
  const sectionEl = document.getElementById("filteredSection");
  if (!listEl || !countEl) return;

  // Only show this panel once a filter is actually narrowing things down —
  // with everything left on "All" it would just repeat the full country
  // list, which isn't useful and clutters the default view.
  const anyFilterActive = currentRegion !== "All" || currentStatus !== "All" ||
    currentObjective !== "All" || currentSector !== "All";
  if (sectionEl) sectionEl.classList.toggle("show", anyFilterActive);
  if (!anyFilterActive) return;

  const matches = Object.keys(window.TAXONOMY_DATA)
    .filter(matchesFilters)
    .map(iso => ({ iso, entry: window.TAXONOMY_DATA[iso] }))
    .sort((a, b) => a.entry.name.localeCompare(b.entry.name));

  countEl.textContent = matches.length;
  renderActiveFilters();

  if (!matches.length) {
    listEl.innerHTML = `<li class="search-empty">${(typeof gstT === "function" && gstT("home.noMatchingCountries")) || "No countries match these filters yet."}</li>`;
    return;
  }

  listEl.innerHTML = matches.map(({ iso, entry }) => {
    const status = getStatus(iso);
    return `
    <li>
      <a href="country.html?iso=${iso}" data-iso="${iso}">
        <div class="recent-top"><strong>${entry.name}</strong></div>
        <div class="recent-sub"><span>${entry.taxonomy || ""}</span><span class="badge badge-sm badge-${status}">${STATUS_LABEL[status]}</span></div>
      </a>
    </li>`;
  }).join("");

  // Clicking a list entry pans/highlights the matching shape on the map
  // instead of navigating away, when that country's shape is actually on
  // the map (some entries — e.g. small city-states — may not have a GeoJSON
  // shape at all, in which case the link falls through to the country page).
  listEl.querySelectorAll("a[data-iso]").forEach(a => {
    const iso = a.dataset.iso;
    const layer = layerByIso[iso];
    if (!layer) return;
    a.addEventListener("click", e => {
      e.preventDefault();
      highlightLayer(layer);
    });
  });
}

function setupChips() {
  document.querySelectorAll("#regionChips .chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#regionChips .chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentRegion = btn.dataset.region;
      onFiltersChanged();
    });
  });
  document.querySelectorAll("#statusChips .chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#statusChips .chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentStatus = btn.dataset.status;
      onFiltersChanged();
    });
  });
  const objectiveSelect = document.getElementById("homeObjectiveSelect");
  if (objectiveSelect) {
    objectiveSelect.addEventListener("change", () => {
      currentObjective = objectiveSelect.value;
      onFiltersChanged();
    });
  }
  const sectorSelect = document.getElementById("homeSectorSelect");
  if (sectorSelect) {
    sectorSelect.addEventListener("change", () => {
      currentSector = sectorSelect.value;
      onFiltersChanged();
    });
  }
}

// The Advanced Search & Filtering panel (environmental objective + sector)
// is collapsed by default so the map page stays uncluttered — most visitors
// just use the region/status chips above. It only expands when explicitly
// requested.
function setupAdvancedFilterToggle() {
  const toggle = document.getElementById("advancedFilterToggle");
  const panel = document.getElementById("advancedFilterPanel");
  if (!toggle || !panel) return;
  toggle.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
  });
}

function highlightLayer(layer) {
  Object.values(layerByIso).forEach(l => geoLayer.resetStyle(l));
  layer.setStyle({ weight: 3, color: "#22C55E" });
  layer.bringToFront();
  map.fitBounds(layer.getBounds(), { maxZoom: 5, padding: [30, 30] });
  layer.openPopup();
}

function setupSearch() {
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");

  function matchesQuery(entry, name, q, iso) {
    if (name.toLowerCase().includes(q)) return true;
    if (entry && entry.taxonomy && entry.taxonomy.toLowerCase().includes(q)) return true;
    if (entry && entry.regulator && entry.regulator.toLowerCase().includes(q)) return true;
    /* The dataset is English-only, so "태국" / "미국" would otherwise miss.
       gstCountryNameMatches (global.js) checks the country's name in every
       interface language, plus common short forms. */
    if (iso && typeof gstCountryNameMatches === "function" && gstCountryNameMatches(iso, q)) return true;
    return false;
  }

  function search() {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = "";
    if (!q) { results.classList.remove("show"); return; }

    const matches = [];
    Object.keys(layerByIso).forEach(iso => {
      const entry = getEntry(iso);
      const layer = layerByIso[iso];
      const name = entry ? entry.name : layer.feature.properties.name;
      if (matchesQuery(entry, name, q, iso)) matches.push({ name, iso, layer, entry });
    });
    /* Search the whole dataset, not only what the map can draw. The world
       GeoJSON has no polygon for 29 of the 196 jurisdictions — Singapore,
       Hong Kong, Bahrain, Mauritius, Maldives, the microstates and the small
       island states — so they were unfindable here in every language. They
       have no shape to highlight, so their result opens the country page. */
    Object.keys(window.TAXONOMY_DATA || {}).forEach(iso => {
      if (layerByIso[iso]) return;
      const entry = getEntry(iso);
      if (!entry) return;
      const name = entry.name || iso;
      if (matchesQuery(entry, name, q, iso)) matches.push({ name, iso, layer: null, entry });
    });

    if (!matches.length) {
      const msg = (typeof gstT === "function" && gstT("search.noMatches")) || "No matches";
      results.innerHTML = `<div class="search-empty">${msg}</div>`;
    } else {
      matches.slice(0, 8).forEach(m => {
        const div = document.createElement("div");
        div.className = "search-result-item";
        const sub = m.entry && m.entry.taxonomy ? m.entry.taxonomy
          : ((typeof gstT === "function" && gstT("search.noTaxonomyData")) || "No taxonomy data");
        /* Shows "Thailand (태국)" when the interface language has its own name. */
        const label = typeof gstCountryDisplayName === "function"
          ? gstCountryDisplayName(m.iso, m.name) : m.name;
        div.innerHTML = `<span class="sr-name">${label}</span><span class="sr-sub">${sub}</span>`;
        div.addEventListener("click", () => {
          if (!m.layer) { window.location.href = `country.html?iso=${m.iso}`; return; }
          highlightLayer(m.layer);
          results.classList.remove("show");
          input.value = label;
        });
        results.appendChild(div);
      });
    }
    results.classList.add("show");
  }

  input.addEventListener("input", search);
  document.addEventListener("click", e => {
    if (!e.target.closest(".hero-dark-inner")) results.classList.remove("show");
  });
}

async function init() {
  map = L.map("map", {
    worldCopyJump: false,
    /* Leaflet only uses whole zoom levels by default, so fitBounds() rounded
       the world DOWN to zoom 1 — a fixed 512px-wide drawing — no matter how
       big the box was. Enlarging the box therefore only added empty
       background. zoomSnap: 0 allows fractional zoom, so the world actually
       scales to fill the box and small countries become clickable without
       zooming in first. minZoom 0 lets the whole world still fit on a phone,
       where the fitted zoom falls below 1. */
    zoomSnap: 0,
    zoomDelta: 0.5,
    minZoom: 0,
    maxZoom: 6,
    zoomControl: true,
    attributionControl: false
  }).setView([20, 10], 2);

  let world = null;
  for (const url of [GEOJSON_URL, GEOJSON_FALLBACK_URL]) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      world = await res.json();
      break;
    } catch (err) {
      console.warn("GeoJSON load failed from", url, err);
    }
  }

  if (world) {
    geoLayer = L.geoJSON(world, { style: styleFeature, onEachFeature }).addTo(map);
    /* Fit to the inhabited latitudes rather than geoLayer.getBounds(): that
       raw extent runs to -85.6° because the source file includes Antarctica,
       and fitting it wasted about a third of the height on empty polar ocean,
       shrinking every country. The southernmost country in the dataset is
       around -55°, so -58° keeps them all. */
    map.fitBounds(L.latLngBounds([[-58, -180], [84, 180]]), { padding: [6, 6] });
  } else {
    document.getElementById("map").innerHTML =
      '<p style="padding:20px;color:#B8433F;">Could not load world map data (check your internet connection) — please reload the page.</p>';
  }

  renderStats();
  renderRecentUpdates();
  setupChips();
  setupAdvancedFilterToggle();
  setupSearch();
  renderFilteredList();
}

document.addEventListener("DOMContentLoaded", init);

/* gstApplyI18n only refreshes elements carrying data-i18n. The filter result
   list and the active-filter summary are written by JS, so they have to be
   re-rendered when the language changes or they stay in the previous one. */
document.addEventListener("gst-lang-changed", () => {
  renderFilteredList();
});
