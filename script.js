const config = window.ADVENT_SUPABASE_CONFIG || {};
const SUPABASE_URL = String(config.url || "").replace(/\/+$/, "");
const SUPABASE_KEY = config.publishableKey || "";
const SESSION_KEY = "advent_calendar_session_v1";
const ADVENT_YEAR = 2026;

const loginPanel = document.getElementById("login-panel");
const loginForm = document.getElementById("login-form");
const loginInput = document.getElementById("access-code");
const loginSubmit = document.getElementById("login-submit");
const loginStatus = document.getElementById("login-status");
const calendarApp = document.getElementById("calendar-app");
const tilesElement = document.getElementById("tiles");
const contentArea = document.getElementById("content-area");
const contentDay = document.getElementById("content-day");
const contentTitle = document.getElementById("content-title");
const contentMessage = document.getElementById("content-message");
const contentBody = document.getElementById("content-body");
const ratingHearts = document.getElementById("rating-hearts");
const ratingStatus = document.getElementById("rating-status");
const logoutButton = document.getElementById("logout-button");
const statsArea = document.getElementById("stats-area");
const loadStatsButton = document.getElementById("load-stats");
const statsContent = document.getElementById("stats-content");
const statsStatus = document.getElementById("stats-status");
const statsIntro = document.getElementById("stats-intro");

let sessionToken = null;
let selectedDay = null;
let ratings = {};
let currentYear = ADVENT_YEAR;

function getViennaDate() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Vienna",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day)
  };
}

function getUnlockedDay() {
  const date = getViennaDate();
  if (date.year < ADVENT_YEAR) return 0;
  if (date.year > ADVENT_YEAR) return 24;
  // Temporärer Testmodus im November: Türchen bis zum Kalendertag öffnen.
  if (date.month === 11) return Math.min(24, date.day);
  if (date.month < 12) return 0;
  return Math.min(24, date.day);
}

function statsAreAvailable() {
  const date = getViennaDate();
  return date.year > ADVENT_YEAR ||
    (date.year === ADVENT_YEAR && date.month === 12 && date.day >= 25);
}

function setStatus(element, message, type = "") {
  element.textContent = message;
  element.className = `${element.className.replace(/\b(error|success)\b/g, "").trim()} ${type}`.trim();
}

function storedSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!saved || !saved.token || !saved.expiresAt) return null;
    if (Date.parse(saved.expiresAt) <= Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return saved.token;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

async function api(endpoint, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Supabase-Konfiguration fehlt. Bitte supabase-config.js prüfen.");
  }

  const headers = {
    "Content-Type": "application/json",
    "apikey": SUPABASE_KEY,
    ...(options.headers || {})
  };

  if (options.auth !== false && sessionToken) {
    headers.Authorization = `Bearer ${sessionToken}`;
  }

  const response = await fetch(`${SUPABASE_URL}/functions/v1/advent-api/${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let data = {};
  try { data = await response.json(); } catch { /* response may be empty */ }

  if (response.status === 401 && options.auth !== false) {
    clearSession();
    showLogin();
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || `Anfrage fehlgeschlagen (${response.status}).`);
  }

  return data;
}

function showLogin() {
  loginPanel.hidden = false;
  calendarApp.hidden = true;
  loginInput.focus();
}

function showApp() {
  loginPanel.hidden = true;
  calendarApp.hidden = false;
  renderCalendar();
  updateStatsAvailability();
}

function clearSession() {
  sessionToken = null;
  ratings = {};
  selectedDay = null;
  localStorage.removeItem(SESSION_KEY);
}

async function login(code) {
  return api("login", {
    method: "POST",
    auth: false,
    body: { code }
  });
}

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  const code = loginInput.value.trim();
  if (!code) return;

  loginSubmit.disabled = true;
  setStatus(loginStatus, "Anmeldung wird geprüft …");

  try {
    const result = await login(code);
    sessionToken = result.token;
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      token: result.token,
      expiresAt: result.expires_at
    }));
    loginInput.value = "";
    setStatus(loginStatus, "");
    showApp();
    await loadRatings();
  } catch (error) {
    setStatus(loginStatus, error.message, "error");
  } finally {
    loginSubmit.disabled = false;
  }
});

async function loadRatings() {
  const result = await api(`ratings?year=${currentYear}`);
  ratings = {};
  for (const entry of (result.ratings || [])) {
    ratings[Number(entry.day)] = Number(entry.rating);
  }
  renderCalendar();
  if (selectedDay !== null) renderRating();
}

function renderCalendar() {
  const unlockedDay = getUnlockedDay();
  tilesElement.replaceChildren();

  for (let day = 1; day <= 24; day++) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `day-tile ${day % 2 ? "scheme-a" : "scheme-b"}`;
    button.disabled = day > unlockedDay;
    button.setAttribute(
      "aria-label",
      button.disabled ? `Türchen ${day}, noch verschlossen` : `Türchen ${day} öffnen`
    );

    const number = document.createElement("span");
    number.className = "day-number";
    number.textContent = String(day).padStart(2, "0");

    const heart = document.createElement("span");
    heart.className = "day-heart";
    heart.setAttribute("aria-hidden", "true");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M12 21s-9-5.7-9-12a5 5 0 0 1 9-3.1A5 5 0 0 1 21 9c0 6.3-9 12-9 12z");
    path.setAttribute("fill", "currentColor");
    svg.appendChild(path);
    heart.appendChild(svg);

    button.append(number, heart);
    if (!button.disabled) button.addEventListener("click", () => showDay(day));
    tilesElement.appendChild(button);
  }

  const intro = document.getElementById("intro-text");
  if (unlockedDay === 0) {
    intro.textContent = "Am 1. Dezember öffnet sich das erste Türchen.";
  } else if (unlockedDay === 24) {
    intro.textContent = "Alle 24 Türchen sind geöffnet.";
  } else {
    intro.textContent = `Türchen 1 bis ${unlockedDay} sind geöffnet. Das nächste folgt morgen.`;
  }
}

function appendPlaceholder(message) {
  const placeholder = document.createElement("p");
  placeholder.className = "content-placeholder";
  placeholder.textContent = message;
  contentBody.appendChild(placeholder);
}

function showDay(day) {
  const unlockedDay = getUnlockedDay();
  if (day < 1 || day > unlockedDay) return;

  const item = adventVideos.find(entry => Number(entry.day) === Number(day)) || {};
  selectedDay = day;
  contentArea.hidden = false;
  contentDay.textContent = `Türchen ${day}`;
  contentTitle.textContent = item.title || `Türchen ${day}`;
  contentMessage.textContent = item.message || "";
  contentBody.replaceChildren();

  const type = String(item.type || (item.videoId ? "video" : "video")).toLowerCase();

  if (type === "link") {
    let destination;
    try {
      destination = new URL(String(item.url || ""));
    } catch {
      destination = null;
    }

    if (destination && ["http:", "https:"].includes(destination.protocol)) {
      const linkButton = document.createElement("a");
      linkButton.className = "advent-link-button";
      linkButton.href = destination.href;
      linkButton.target = "_blank";
      linkButton.rel = "noopener noreferrer";
      linkButton.textContent = item.buttonText || "Hier öffnen";
      linkButton.setAttribute("aria-label", `${linkButton.textContent} – öffnet in einem neuen Tab`);
      contentBody.appendChild(linkButton);
    } else {
      appendPlaceholder("Für dieses Türchen wurde noch kein gültiger Link hinterlegt.");
    }
  } else if (type === "fact") {
    if (typeof item.fact === "string" && item.fact.trim()) {
      const card = document.createElement("article");
      card.className = "fact-card";
      const label = document.createElement("p");
      label.className = "fact-label";
      label.textContent = "Fun Fact";
      const fact = document.createElement("p");
      fact.className = "fact-text";
      fact.textContent = item.fact;
      card.append(label, fact);
      contentBody.appendChild(card);
    } else {
      appendPlaceholder("Für dieses Türchen wurde noch kein Fun Fact hinterlegt.");
    }
  } else if (
    type === "video" &&
    typeof item.videoId === "string" &&
    /^[a-zA-Z0-9_-]{11}$/.test(item.videoId) &&
    item.videoId !== "DEINE_VIDEO_ID"
  ) {
    const frame = document.createElement("div");
    frame.className = "video-frame";
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.videoId)}`;
    iframe.title = item.title || `Video zu Türchen ${day}`;
    iframe.loading = "lazy";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    frame.appendChild(iframe);
    contentBody.replaceChildren(frame);
  } else {
    appendPlaceholder("Für dieses Türchen wurde noch kein Inhalt hinterlegt.");
  }

  renderRating();
  contentArea.scrollIntoView({ behavior: "smooth", block: "start" });
}

function createHeartSvg() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M12 21s-9-5.7-9-12a5 5 0 0 1 9-3.1A5 5 0 0 1 21 9c0 6.3-9 12-9 12z");
  path.setAttribute("fill", "currentColor");
  svg.appendChild(path);
  return svg;
}

function renderRating() {
  if (selectedDay === null) return;
  const existing = Object.prototype.hasOwnProperty.call(ratings, selectedDay)
    ? ratings[selectedDay]
    : null;

  ratingHearts.replaceChildren();

  const zero = document.createElement("button");
  zero.type = "button";
  zero.className = `rating-zero${existing === 0 ? " is-selected" : ""}`;
  zero.textContent = "0";
  zero.title = "0 von 10";
  zero.setAttribute("aria-label", "0 von 10 Herzen");
  zero.disabled = existing === null && false;
  zero.addEventListener("click", () => saveRating(0));
  ratingHearts.appendChild(zero);

  for (let value = 1; value <= 10; value++) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `rating-heart${existing !== null && value <= existing ? " is-selected" : ""}`;
    button.title = `${value} von 10`;
    button.setAttribute("aria-label", `${value} von 10 Herzen`);
    button.appendChild(createHeartSvg());
    button.addEventListener("click", () => saveRating(value));
    ratingHearts.appendChild(button);
  }

  setStatus(
    ratingStatus,
    existing === null ? "Noch nicht bewertet." : `Deine aktuelle Bewertung: ${existing} von 10.`,
    existing === null ? "" : "success"
  );
}

async function saveRating(value) {
  if (selectedDay === null) return;
  const day = selectedDay;
  const buttons = ratingHearts.querySelectorAll("button");
  buttons.forEach(button => { button.disabled = true; });
  setStatus(ratingStatus, "Bewertung wird gespeichert …");

  try {
    await api("rate", {
      method: "POST",
      body: { year: currentYear, day, rating: value }
    });
    ratings[day] = value;
    renderRating();
  } catch (error) {
    setStatus(ratingStatus, error.message, "error");
    renderRating();
  }
}

function updateStatsAvailability() {
  statsArea.hidden = !statsAreAvailable();
  if (!statsArea.hidden) {
    statsIntro.textContent = "Alle Bewertungen des Adventskalenders im Überblick.";
  }
}

loadStatsButton.addEventListener("click", async () => {
  loadStatsButton.disabled = true;
  setStatus(statsStatus, "Statistik wird geladen …");
  try {
    const result = await api(`stats?year=${currentYear}`);
    renderStats(result);
    statsContent.hidden = false;
    setStatus(statsStatus, "");
  } catch (error) {
    setStatus(statsStatus, error.message, "error");
  } finally {
    loadStatsButton.disabled = false;
  }
});

function renderStats(data) {
  statsContent.replaceChildren();

  const summary = document.createElement("div");
  summary.className = "stats-summary";

  const averageCard = document.createElement("div");
  averageCard.className = "stat-card";
  const averageValue = document.createElement("span");
  averageValue.className = "stat-value";
  averageValue.textContent = data.average === null ? "–" : `${data.average}/10`;
  const averageLabel = document.createElement("span");
  averageLabel.className = "stat-label";
  averageLabel.textContent = "Durchschnitt";
  averageCard.append(averageValue, averageLabel);

  const daysCard = document.createElement("div");
  daysCard.className = "stat-card";
  const daysValue = document.createElement("span");
  daysValue.className = "stat-value";
  daysValue.textContent = `${data.rated_days}/24`;
  const daysLabel = document.createElement("span");
  daysLabel.className = "stat-label";
  daysLabel.textContent = "Bewertete Türchen";
  daysCard.append(daysValue, daysLabel);
  summary.append(averageCard, daysCard);
  statsContent.appendChild(summary);

  const topHeading = document.createElement("h3");
  topHeading.textContent = "Top 10 Türchen";
  statsContent.appendChild(topHeading);

  const topList = document.createElement("ol");
  topList.className = "top-list";
  if (!data.top10 || data.top10.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Noch keine Bewertungen vorhanden.";
    topList.appendChild(empty);
  } else {
    data.top10.forEach(item => {
      const row = document.createElement("li");
      const day = document.createElement("span");
      day.textContent = `Türchen ${item.day}`;
      const score = document.createElement("strong");
      score.textContent = `${item.rating}/10`;
      row.append(day, score);
      topList.appendChild(row);
    });
  }
  statsContent.appendChild(topList);

  const timelineHeading = document.createElement("h3");
  timelineHeading.textContent = "Bewertungsverlauf";
  statsContent.appendChild(timelineHeading);

  const timeline = document.createElement("div");
  timeline.className = "timeline";
  (data.timeline || []).forEach(item => {
    const cell = document.createElement("div");
    cell.className = "timeline-item";
    const track = document.createElement("div");
    track.className = "timeline-track";
    const bar = document.createElement("div");
    bar.className = "timeline-bar";
    bar.style.height = item.rating === null ? "2px" : `${Math.max(2, item.rating * 10)}%`;
    bar.style.opacity = item.rating === null ? ".18" : "1";
    track.appendChild(bar);
    const day = document.createElement("span");
    day.className = "timeline-day";
    day.textContent = String(item.day).padStart(2, "0");
    const score = document.createElement("span");
    score.className = "timeline-rating";
    score.textContent = item.rating === null ? "–" : String(item.rating);
    cell.append(track, day, score);
    timeline.appendChild(cell);
  });
  statsContent.appendChild(timeline);
}

logoutButton.addEventListener("click", async () => {
  try {
    if (sessionToken) {
      await api("logout", { method: "POST" });
    }
  } catch {
    // The local session is cleared even if the network is unavailable.
  }
  clearSession();
  statsContent.replaceChildren();
  statsContent.hidden = true;
  contentArea.hidden = true;
  showLogin();
  setStatus(loginStatus, "Du wurdest abgemeldet.", "success");
});

async function initialize() {
  if (storedSession()) {
    sessionToken = storedSession();
    try {
      showApp();
      await loadRatings();
    } catch {
      clearSession();
      showLogin();
    }
  } else {
    showLogin();
  }
}

initialize();
