const tilesElement = document.getElementById("tiles");
const videoArea = document.getElementById("video-area");
const videoDay = document.getElementById("video-day");
const videoTitle = document.getElementById("video-title");
const videoMessage = document.getElementById("video-message");
const videoFrame = document.getElementById("video-frame");

function getUnlockedDay() {
  const now = new Date();
  return Math.min(24, now.getDate());
}

function showDay(day) {
  const item = adventVideos.find(video => video.day === day) || {};
  videoArea.hidden = false;
  videoDay.textContent = `Türchen ${day}`;
  videoTitle.textContent = item.title || `Türchen ${day}`;
  videoMessage.textContent = item.message || "";
  videoFrame.replaceChildren();

  if (item.videoId && /^[a-zA-Z0-9_-]{6,}$/.test(item.videoId)) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.videoId)}`;
    iframe.title = item.title || `Video zu Türchen ${day}`;
    iframe.loading = "lazy";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    referrerPolicy = "strict-origin-when-cross-origin";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    videoFrame.appendChild(iframe);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "video-placeholder";
    placeholder.textContent = "Für dieses Türchen wurde noch kein Video hinterlegt.";
    videoFrame.appendChild(placeholder);
  }

  videoArea.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderCalendar() {
  const unlockedDay = getUnlockedDay();
  tilesElement.replaceChildren();

  for (let day = 1; day <= 24; day++) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `day-tile ${day % 2 ? "scheme-a" : "scheme-b"}`;
    button.disabled = day > unlockedDay;
    button.setAttribute("aria-label", button.disabled ? `Türchen ${day}, noch verschlossen` : `Türchen ${day} öffnen`);

    const number = document.createElement("span");
    number.className = "day-number";
    number.textContent = String(day).padStart(2, "0");

    const heart = document.createElement("span");
  heart.className = "day-heart";
heart.setAttribute("aria-hidden", "true");

heart.innerHTML = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21s-9-5.7-9-12a5 5 0 0 1 9-3.1A5 5 0 0 1 21 9c0 6.3-9 12-9 12z"
      fill="currentColor"/>
  </svg>
`;

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

renderCalendar();
