/* Global Sustainable Taxonomies — Home / Interactive Map */

/* Four buckets, not three (2026-09, SB본부 review).
   36 of the 76 countries counted as "Developed" do not have a taxonomy of
   their own — they are covered by a regional framework (EU 27, UMOA 7, ASEAN
   2). Showing them in the same green made the spread of taxonomies look wider
   than it is. `national` and `regional` are therefore separate buckets
   everywhere: map colour, legend, statistics and the status filter.

   The split is derived from the taxonomy's own name rather than a new data
   field, so data.js needs no edits. Checked against the dataset: these three
   labels cover exactly the 36 regional countries and no national one. */
const REGIONAL_TAXONOMY_LABELS = ["EU Taxonomy", "ASEAN Taxonomy", "UMOA"];

const BUCKET_LABEL = {
  national: "National taxonomy",
  regional: "Regional framework",
  developing: "Under Development",
  none: "No Taxonomy"
};

const BUCKET_I18N = {
  national: "home.chipNational",
  regional: "home.chipRegional",
  developing: "home.chipUnderDevelopment",
  none: "home.chipNoTaxonomy"
};

const BUCKET_COLOR = {
  national: "#15803D",   /* own taxonomy in force */
  /* Blue, not a lighter green: two shades of one hue read as "more / less of
     the same thing", and on a map at country scale they were being mistaken
     for each other. A different hue says "a different kind of coverage".
     Checked with the palette validator — national↔regional separation goes
     from ΔE 23.9 to 29.7 for normal vision, and it now passes on both the
     light and the dark map background. */
  regional: "#3B82F6",   /* covered by a regional framework only */
  /* Amber-500 rather than amber-600. Against the national green, the darker
     amber sat at ΔE 6.5 for red-green colour blindness — effectively the same
     colour for ~1 in 12 men. One step lighter takes it to 17.4 and the whole
     four-colour key passes. Amber text elsewhere keeps the darker --amber,
     which has the contrast a small label needs. */
  developing: "#F59E0B",
  none: "#B8C0CC"
};

/* Jurisdictions with no taxonomy that have deliberately chosen a different
   instrument to do the same steering job. They stay grey — no new bucket —
   but carry a tag so the map does not read them as simply doing nothing.
   Kept deliberately narrow: every entry below says so in its own data note.
   Countries that merely lack a taxonomy, or that have a green-bond issuance
   framework which does not classify activities, are NOT listed. */
const ALT_APPROACH_ISOS = {
  JPN: true,   /* Basic Guidelines on Climate Transition Finance (METI) */
  GBR: true,   /* taxonomy dropped Jul 2025 in favour of transition-plan rules */
  CHE: true,   /* EU-Taxonomy interoperability + industry self-regulation */
  USA: true    /* disclosure-based approach instead of a classification */
};

function hasAltApproach(iso) {
  return !!ALT_APPROACH_ISOS[iso] && getBucket(iso) === "none";
}

function altApproachTag(iso) {
  if (!hasAltApproach(iso)) return "";
  const entry = getEntry(iso);
  const label = (typeof gstT === "function" && gstT("home.altApproach")) || "Alternative approach";
  const tip = entry && entry.note ? ` title="${escapeAttrApp(entry.note)}"` : "";
  return `<span class="badge badge-sm badge-alt"${tip}>${escapeHtml(label)}</span>`;
}

function escapeAttrApp(v) {
  return String(v || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* "No taxonomy" and "we could not find one" look identical on the map, which
   overstates how much of the world has been checked. A country with no official
   document attached is flagged rather than given a fifth colour — the legend
   stays at four, as with the "alternative approach" tag.

   The test is deliberately mechanical and visible: the entry has no entry in
   officialDocuments, which is exactly the (empty) Official Documents section a
   reader sees on that country's page. No judgement call, reproducible by
   anyone, and it stops being true the moment a document is added. */
function lacksOfficialDocs(iso) {
  const entry = getEntry(iso);
  if (!entry || entry.status === "established") return false;
  return !(entry.officialDocuments && entry.officialDocuments.length);
}

function unverifiedTag(iso) {
  if (!lacksOfficialDocs(iso)) return "";
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const label = t("home.tagUnverified");
  const tip = escapeAttrApp(t("home.tagUnverifiedNote"));
  return `<span class="badge badge-sm badge-unverified" title="${tip}">${escapeHtml(label)}</span>`;
}

function bucketLabel(bucket) {
  const key = BUCKET_I18N[bucket];
  return (typeof gstT === "function" && key && gstT(key)) || BUCKET_LABEL[bucket] || bucket;
}

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

/* The bucket the map, legend, statistics and filter all work from. Splits
   `established` into `national` / `regional`; the other two pass through. */
function getBucket(iso) {
  const status = getStatus(iso);
  if (status !== "established") return status === "developing" ? "developing" : "none";
  const entry = getEntry(iso);
  const name = (entry && entry.taxonomy) || "";
  return REGIONAL_TAXONOMY_LABELS.some(l => name.indexOf(l) !== -1) ? "regional" : "national";
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
  const bucket = getBucket(iso);
  const region = entry ? entry.region : null;
  if (currentStatus !== "All" && bucket !== currentStatus) return false;
  if (currentRegion !== "All" && region !== currentRegion) return false;
  if (currentObjective !== "All" && !entryMatchesObjective(entry, currentObjective)) return false;
  if (currentSector !== "All" && !entryMatchesSector(entry, currentSector)) return false;
  return true;
}

function styleFeature(feature) {
  const bucket = getBucket(feature.id);
  const match = matchesFilters(feature.id);
  return {
    fillColor: BUCKET_COLOR[bucket],
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
  const bucket = getBucket(iso);

  let html = `<div class="taxo-popup">`;
  html += `<h3>${name}</h3>`;
  html += `<span class="badge badge-${bucket}">${escapeHtml(bucketLabel(bucket))}</span>`;
  html += altApproachTag(iso);
  html += unverifiedTag(iso);
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
  /* Renamed from "AI Compliance Check" (2026-09): the tool screens the
     activity criteria only, so "Compliance Check" overstated what it does. */
  const screenLabel = (typeof gstT === "function" && gstT("home.popupScreening")) || "Activity Criteria Screening";
  html += `<a class="btn-secondary-sm" href="advisor.html?mode=country&amp;iso=${iso}">${screenLabel}</a>`;
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
  const counts = { national: 0, regional: 0, developing: 0, none: 0 };
  // Count only countries we actually have a compiled research entry for.
  // The map background (GeoJSON) renders ~180 country shapes total, but most
  // of those have no entry in data.js at all — they're just gray/"No Taxonomy"
  // by default because nobody has researched them, not because we've confirmed
  // they have no taxonomy. Counting every map shape here would silently inflate
  // "Total Countries Tracked" with countries we've never actually looked at,
  // which misrepresents how much of the world this site actually covers.
  const isoList = Object.keys(window.TAXONOMY_DATA);
  isoList.forEach(iso => { counts[getBucket(iso)] += 1; });
  const total = counts.national + counts.regional + counts.developing + counts.none;

  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  set("statTotal", total);
  set("statNational", counts.national);
  set("statRegional", counts.regional);
  set("statDeveloping", counts.developing);
  set("statNone", counts.none);
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

  const regionKey = {
    "Europe": "home.chipEurope", "Asia-Pacific": "home.chipAsiaPacific",
    "Americas": "home.chipAmericas", "Africa": "home.chipAfrica",
    "Middle East": "home.chipMiddleEast"
  };

  const parts = [];
  if (currentRegion !== "All") parts.push(regionKey[currentRegion] ? t(regionKey[currentRegion]) : currentRegion);
  if (currentStatus !== "All") parts.push(bucketLabel(currentStatus));
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
        <div class="recent-sub"><span>${entry.taxonomy || ""}</span><span class="badge badge-sm badge-${getBucket(iso)}">${escapeHtml(bucketLabel(getBucket(iso)))}</span>${altApproachTag(iso)}</div>
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
    /* animate:false matters. With the default animated path this initial
       fitBounds silently did nothing — the map stayed on the setView() zoom
       above and the world kept rendering at 512px. Verified on the live site:
       the identical call with animate:false applies the fitted zoom. It is
       also the right behaviour for a first paint — there is nothing to
       animate from. */
    map.fitBounds(L.latLngBounds([[-58, -180], [84, 180]]), { padding: [6, 6], animate: false });
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
