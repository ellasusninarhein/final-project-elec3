// If your Nekos API base differs, change this:
const API_BASE = "https://nekos.best/api/v2";

// Add/remove categories here:
const CATEGORIES = ["neko", "waifu", "kitsune", "hug", "pat"];

const els = {
  category: document.getElementById("category"),
  btnFetch: document.getElementById("btnFetch"),
  btnCopy: document.getElementById("btnCopy"),
  btnOpen: document.getElementById("btnOpen"),
  status: document.getElementById("status"),
  img: document.getElementById("resultImg"),
  placeholder: document.getElementById("placeholder"),
  imgUrl: document.getElementById("imgUrl"),
  badge: document.getElementById("badge"),
  autoToggle: document.getElementById("autoToggle"),
  autoEvery: document.getElementById("autoEvery"),
  darkmodeBtn: document.getElementById("darkmodeBtn"),
};

let lastUrl = "";
let autoTimer = null;
let darkmode = localStorage.getItem("nekos-darkmode") === "true";

function applyDarkmode() {
  if (darkmode) {
    document.body.classList.add("darkmode");
    els.darkmodeBtn.textContent = "☀️";
  } else {
    document.body.classList.remove("darkmode");
    els.darkmodeBtn.textContent = "🌙";
  }
}

function toggleDarkmode() {
  darkmode = !darkmode;
  localStorage.setItem("nekos-darkmode", darkmode);
  applyDarkmode();
}

function setStatus(msg) {
  els.status.textContent = msg || "";
}

function setActionsEnabled(enabled) {
  els.btnCopy.disabled = !enabled;
  els.btnOpen.setAttribute("aria-disabled", enabled ? "false" : "true");
  if (!enabled) els.btnOpen.href = "#";
}

function showImage(url, category) {
  lastUrl = url;

  els.img.src = url;
  els.img.style.display = "block";
  els.placeholder.style.display = "none";

  els.imgUrl.textContent = url;

  els.btnOpen.href = url;
  setActionsEnabled(true);

  els.badge.hidden = false;
  els.badge.textContent = category;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomCategory(except) {
  if (!except) return pickRandom(CATEGORIES);
  const filtered = CATEGORIES.filter((c) => c !== except);
  return filtered.length ? pickRandom(filtered) : pickRandom(CATEGORIES);
}

async function fetchNeko(category) {
  const endpoint = `${API_BASE}/${encodeURIComponent(category)}`;

  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);

  const data = await res.json();

  // Supports common response shapes:
  // nekos.best => { results: [ { url } ] }
  const url =
    data?.results?.[0]?.url ||
    data?.url ||
    data?.image ||
    data?.neko;

  if (!url) throw new Error("Could not find image URL in API response.");
  return url;
}

async function fetchRandom() {
  // avoid repeating currently displayed category if possible
  const current = els.category.value;
  const category = pickRandomCategory(current);

  // update dropdown to show what was picked
  els.category.value = category;

  setStatus(`Fetching (${category})...`);
  setActionsEnabled(false);

  try {
    const url = await fetchNeko(category);
    showImage(url, category);
    setStatus(`Done. (${category})`);
  } catch (err) {
    console.error(err);
    setStatus(`Error: ${err.message}`);
    els.img.style.display = "none";
    els.placeholder.style.display = "grid";
    els.imgUrl.textContent = "—";
    els.badge.hidden = true;
  }
}

async function onCopy() {
  if (!lastUrl) return;

  try {
    await navigator.clipboard.writeText(lastUrl);
    setStatus("Copied!");
    setTimeout(() => setStatus(""), 1200);
  } catch {
    const t = document.createElement("textarea");
    t.value = lastUrl;
    document.body.appendChild(t);
    t.select();
    document.execCommand("copy");
    t.remove();
    setStatus("Copied!");
    setTimeout(() => setStatus(""), 1200);
  }
}

function stopAuto() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = null;
}

function startAuto() {
  stopAuto();
  const seconds = Number(els.autoEvery.value || 5);
  autoTimer = setInterval(fetchRandom, seconds * 1000);
}

els.btnFetch.addEventListener("click", fetchRandom);
els.btnCopy.addEventListener("click", onCopy);

els.autoToggle.addEventListener("change", () => {
  if (els.autoToggle.checked) {
    startAuto();
    fetchRandom(); // fetch immediately when enabling
  } else {
    stopAuto();
    setStatus("Auto Random stopped.");
  }
});

els.autoEvery.addEventListener("change", () => {
  if (els.autoToggle.checked) startAuto();
});

if (els.darkmodeBtn) {
  els.darkmodeBtn.addEventListener("click", toggleDarkmode);
}

applyDarkmode();
