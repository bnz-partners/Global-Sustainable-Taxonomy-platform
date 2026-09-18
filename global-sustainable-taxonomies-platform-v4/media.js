/* Global Sustainable Taxonomies — Media & Trend Hub (Screen 4)

   Every section below is wired to a real, live source rather than sample
   content:

   - News / Reports -> /api/news (Google News RSS; Reports is the same live
     feed narrowed with report-related keywords, since Google News has no
     separate curated reports database).
     (Papers was removed 2026-07-26 — Google News rarely surfaces genuine
     academic papers, so the feed was consistently empty/erroring for readers.)
   - AI Trend Insights -> /api/trends, which analyses the live News
     headlines with the same Anthropic model already used for the AI
     Advisor's "Ask AI" tab (reusing ANTHROPIC_API_KEY rather than
     requiring a second AI provider/key, per the spec's intent of
     "AI-generated" trend analysis of freshly ingested content).
   - The taxonomy-development timeline chart is real — built from the
     "year" field in data.js.

   Podcasts and Videos were intentionally removed (2026-07-21) — they added
   noise without clear value for this audience.
   The "Thematic Policy Trends" bar chart was removed (2026-07-26) — it was
   a rough AI-estimated percentage breakdown of a small, live news sample,
   which read as more precise/authoritative than the underlying data
   actually supported. The AI Trend Insight cards above (same /api/trends
   call) stay, since those are qualitative write-ups rather than implied
   statistics. */

const TYPES = ["News", "Reports"];

const itemsByType = { News: [], Reports: [] };
const typeState = {
  News: { status: "loading" },
  Reports: { status: "loading" }
};

let currentType = "All";

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function formatDate(raw) {
  if (!raw) return "Recent";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return "Recent";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function typeTagHtml(type) {
  return `<span class="type-tag">${escapeHtml(type)}</span>`;
}

/* ---------- Fetching each content type ---------- */

async function loadNewsLike(type, queryParam) {
  try {
    const url = queryParam ? `/api/news?type=${encodeURIComponent(queryParam)}` : "/api/news";
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok || !Array.isArray(data.items)) throw new Error((data && data.error) || `HTTP ${res.status}`);
    itemsByType[type] = data.items.map(item => ({
      type,
      title: item.title,
      source: item.source,
      rawDate: item.publishedAt,
      date: formatDate(item.publishedAt),
      link: item.link
    }));
    typeState[type] = itemsByType[type].length
      ? { status: "ready" }
      : { status: "empty", message: `No live ${type.toLowerCase()} results found right now.` };
  } catch (err) {
    console.error(`Failed to load ${type}:`, err);
    itemsByType[type] = [];
    typeState[type] = { status: "error", message: `Couldn't load live ${type.toLowerCase()} right now — please try again later.` };
  }
  renderFeatured();
  renderGrid();
}

/* ---------- AI Trend Insights + thematic chart (real, via /api/trends) ---------- */

async function loadTrends() {
  const trendGrid = document.getElementById("trendGrid");
  trendGrid.innerHTML = `<p class="section-text">Loading live AI trend analysis…</p>`;

  try {
    const res = await fetch("/api/trends");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

    if ((!data.trends || !data.trends.length) && data.note) {
      trendGrid.innerHTML = `<p class="section-text" style="grid-column:1/-1;color:var(--text-muted);">${escapeHtml(data.note)}</p>`;
      return;
    }

    renderTrendCards(data.trends || []);
  } catch (err) {
    console.error("Failed to load AI trend analysis:", err);
    const msg = "Couldn't load live AI trend analysis right now — please try again later.";
    trendGrid.innerHTML = `<p class="section-text" style="grid-column:1/-1;color:var(--text-muted);">${msg}</p>`;
  }
}

function renderTrendCards(trends) {
  const wrap = document.getElementById("trendGrid");
  if (!trends.length) {
    wrap.innerHTML = `<p class="section-text" style="grid-column:1/-1;color:var(--text-muted);">No trend analysis available right now.</p>`;
    return;
  }
  wrap.innerHTML = trends.map((t, i) => `
    <div class="trend-card" data-idx="${i}">
      <h3>${escapeHtml(t.title)}</h3>
      <p>${escapeHtml(t.teaser)}</p>
      <span class="trend-toggle">Expand analysis ▾</span>
      <div class="trend-detail">${escapeHtml(t.detail)}</div>
    </div>
  `).join("");

  wrap.querySelectorAll(".trend-card").forEach(card => {
    card.addEventListener("click", () => {
      const expanded = card.classList.toggle("expanded");
      card.querySelector(".trend-toggle").textContent = expanded ? "Collapse analysis ▴" : "Expand analysis ▾";
    });
  });
}

/* ---------- Featured + grid (merged across all ready content types) ---------- */

function allReadyItems() {
  const all = [];
  TYPES.forEach(t => {
    if (typeState[t].status === "ready") all.push(...itemsByType[t]);
  });
  all.sort((a, b) => {
    const da = new Date(a.rawDate).getTime() || 0;
    const db = new Date(b.rawDate).getTime() || 0;
    return db - da;
  });
  return all;
}

function anyStillLoading() {
  return TYPES.some(t => typeState[t].status === "loading");
}

function renderFeatured() {
  const card = document.getElementById("featuredCard");
  const all = allReadyItems();

  if (!all.length) {
    if (anyStillLoading()) {
      card.innerHTML = `<div><p class="section-text">Loading live media…</p></div>`;
    } else {
      card.innerHTML = `<div><p class="section-text">No live media content available right now — please try again later.</p></div>`;
    }
    card.style.cursor = "default";
    card.onclick = null;
    return;
  }

  const f = all[0];
  card.innerHTML = `
    <div>
      ${typeTagHtml(f.type)}
      <h2>${escapeHtml(f.title)}</h2>
      <p class="section-text">Live content via Google News. Click to preview.</p>
      <div class="media-meta">${escapeHtml(f.source)} · ${escapeHtml(f.date)}</div>
    </div>
    <div class="featured-visual">Featured visual placeholder</div>
  `;
  card.style.cursor = "pointer";
  card.onclick = () => openMediaModal(f);
}

function matchesFilter(item, query) {
  if (query) {
    const q = query.toLowerCase();
    if (!item.title.toLowerCase().includes(q) && !item.source.toLowerCase().includes(q) && !item.type.toLowerCase().includes(q)) {
      return false;
    }
  }
  return true;
}

let currentGridItems = [];

function renderGrid() {
  const query = document.getElementById("mediaSearchInput").value.trim();
  const grid = document.getElementById("mediaGrid");

  if (currentType !== "All") {
    const state = typeState[currentType];
    if (state.status === "loading") {
      grid.innerHTML = `<p class="section-text" style="grid-column:1/-1;color:var(--text-muted);">Loading live ${currentType.toLowerCase()}…</p>`;
      currentGridItems = [];
      return;
    }
    if (state.status === "empty" || state.status === "error") {
      grid.innerHTML = `<p class="section-text" style="grid-column:1/-1;color:var(--text-muted);">${escapeHtml(state.message)}</p>`;
      currentGridItems = [];
      return;
    }
  }

  const source = currentType === "All" ? allReadyItems() : itemsByType[currentType];
  const rest = (currentType === "All" ? source.slice(1) : source).filter(item => matchesFilter(item, query));
  currentGridItems = rest;

  if (!rest.length) {
    grid.innerHTML = `<p class="section-text" style="grid-column:1/-1;color:var(--text-muted);">No live content matches this search.</p>`;
    return;
  }

  grid.innerHTML = rest.map((item, i) => `
    <a class="media-card" href="#" data-idx="${i}">
      ${typeTagHtml(item.type)}
      <h3>${escapeHtml(item.title)}</h3>
      <div class="media-meta">${escapeHtml(item.source)} · ${escapeHtml(item.date)}</div>
    </a>
  `).join("");

  grid.querySelectorAll(".media-card").forEach(card => {
    card.addEventListener("click", e => {
      e.preventDefault();
      const idx = parseInt(card.dataset.idx, 10);
      openMediaModal(currentGridItems[idx]);
    });
  });
}

function setupFilterChips() {
  document.querySelectorAll("#typeChips .chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#typeChips .chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentType = btn.dataset.type;
      renderGrid();
    });
  });
  document.getElementById("mediaSearchInput").addEventListener("input", renderGrid);
}

/* ---------- Real data chart: taxonomy development timeline ---------- */
/* Only countries with a taxonomy actually in force are plotted. Four entries
   (Pakistan, India, Ecuador, Guatemala) carry a 2025 year on a draft or
   roadmap; counting those in a chart titled "Taxonomy Development Timeline"
   overstated 2025 by four, so they are left out. */
function timelineCountsEntry(e) {
  return e.status === "established" && !isNaN(parseInt(e.year, 10));
}

function renderTimelineChart() {
  const counts = {};
  Object.values(window.TAXONOMY_DATA || {}).forEach(e => {
    if (!timelineCountsEntry(e)) return;
    counts[parseInt(e.year, 10)] = (counts[parseInt(e.year, 10)] || 0) + 1;
  });
  const years = Object.keys(counts).map(Number).sort((a, b) => a - b);
  if (!years.length) {
    document.getElementById("timelineChart").innerHTML = "<p class=\"section-text\">No dated entries available.</p>";
    return;
  }
  const w = 480, h = 190, pad = 26;
  const maxCount = Math.max(...years.map(y => counts[y]));
  const barW = (w - pad * 2) / years.length;

  let svg = `<svg class="hub-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">`;
  years.forEach((y, i) => {
    const val = counts[y];
    const barH = (val / maxCount) * (h - pad * 2 - 16);
    const x = pad + i * barW;
    const yPos = h - pad - barH;
    svg += `<rect x="${(x + barW * 0.15).toFixed(1)}" y="${yPos.toFixed(1)}" width="${(barW * 0.7).toFixed(1)}" height="${barH.toFixed(1)}" fill="var(--green)" rx="2"/>`;
  });
  svg += `</svg>`;
  document.getElementById("timelineChart").innerHTML = svg;

  const labelStep = Math.ceil(years.length / 8);
  const labels = years.filter((_, i) => i % labelStep === 0);
  document.getElementById("timelineLabels").innerHTML = labels.map(y => `<span>${y}</span>`).join("");

  renderTimelineBasis();
}

/* The chart counts COUNTRIES, not taxonomies, so the 27 EU member states that
   share the single EU Taxonomy each add to 2020 — which is why that year towers
   over the rest. Countries with no taxonomy in force, or with no confirmed
   adoption year, drop out. None of that was stated anywhere, so the figures are
   computed here and spelled out under the chart rather than being left for the
   reader to infer. */
function renderTimelineBasis() {
  const el = document.getElementById("timelineBasis");
  if (!el) return;
  const entries = Object.values(window.TAXONOMY_DATA || {});
  const hasYear = e => !isNaN(parseInt(e.year, 10));
  const counts = {
    eu: entries.filter(e => timelineCountsEntry(e) && /^EU Taxonomy$/i.test((e.taxonomy || "").trim())).length,
    excluded: entries.filter(e => !timelineCountsEntry(e)).length,
    draft: entries.filter(e => hasYear(e) && e.status !== "established").length
  };
  const t = (typeof gstT === "function") ? gstT : (k => k);
  el.textContent = t("media.timelineBasis")
    .replace("{eu}", counts.eu)
    .replace("{excluded}", counts.excluded)
    .replace("{draft}", counts.draft);
}

/* ---------- Media card detail modal (real items, embeds + link out) ---------- */

function modalBodyForItem(item) {
  return `
    <p class="modal-body-text">This is a live ${item.type.toLowerCase()} result via Google News. Click below to read the full article on the original publisher's site.</p>
    <a class="btn-primary" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">Read full article ↗</a>
    <div class="modal-disclaimer">Headline and link via Google News — Global Sustainable Taxonomies does not host or verify third-party articles; always check the original source.</div>
  `;
}

function openMediaModal(item) {
  const modal = document.getElementById("mediaModal");
  const overlay = document.getElementById("mediaModalOverlay");

  modal.innerHTML = `
    <button class="modal-close" id="mediaModalClose" aria-label="Close" type="button">✕</button>
    ${typeTagHtml(item.type)}
    <h3>${escapeHtml(item.title)}</h3>
    <div class="media-meta">${escapeHtml(item.source)} · ${escapeHtml(item.date)}</div>
    ${modalBodyForItem(item)}
  `;

  overlay.classList.add("open");
  document.getElementById("mediaModalClose").addEventListener("click", closeMediaModal);
}

function closeMediaModal() {
  document.getElementById("mediaModalOverlay").classList.remove("open");
}

function setupMediaModal() {
  const overlay = document.getElementById("mediaModalOverlay");
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeMediaModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeMediaModal();
  });
}

function init() {
  setupFilterChips();
  renderTimelineChart();
  setupMediaModal();
  renderFeatured();
  renderGrid();

  loadNewsLike("News");
  loadNewsLike("Reports", "Reports");
  loadTrends();
}

document.addEventListener("DOMContentLoaded", init);

/* The basis line carries computed counts, so gstApplyI18n's plain data-i18n
   swap can't rebuild it — re-render it whenever the language changes. */
document.addEventListener("gst-lang-changed", renderTimelineBasis);
