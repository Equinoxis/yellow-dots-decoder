import { acceptedCategory, validConsent } from "vanilla-cookieconsent";

const STORAGE_KEY = "yellow-dots-theme";

const MODES = /** @type {const} */ (["system", "light", "dark"]);

function preferencesStorageAllowed() {
  return validConsent() && acceptedCategory("preferences");
}

/** @returns {"system" | "light" | "dark"} */
function readStoredMode() {
  if (!preferencesStorageAllowed()) return "system";
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  return "system";
}

/** @param {"system" | "light" | "dark"} mode */
function setHtmlClass(mode) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  if (mode === "light") root.classList.add("light");
  if (mode === "dark") root.classList.add("dark");
}

/** @param {"system" | "light" | "dark"} mode */
function syncBar(mode) {
  const bar = document.getElementById("theme-bar");
  if (!bar) return;
  bar.setAttribute("data-theme-mode", mode);

  const ids = {
    system: "theme-btn-system",
    light: "theme-btn-light",
    dark: "theme-btn-dark",
  };

  for (const m of MODES) {
    const btn = document.getElementById(ids[m]);
    if (!btn) continue;
    const active = m === mode;
    btn.classList.toggle("theme-bar__btn--active", active);
    btn.setAttribute("aria-checked", active ? "true" : "false");
    btn.tabIndex = active ? 0 : -1;
  }
}

let mqListenerAttached = false;

function attachSystemListener() {
  if (mqListenerAttached) return;
  mqListenerAttached = true;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", () => {
    if (readStoredMode() === "system") setHtmlClass("system");
  });
}

/** @param {"system" | "light" | "dark"} mode */
function persist(mode) {
  if (!preferencesStorageAllowed()) return;
  localStorage.setItem(STORAGE_KEY, mode);
}

/** Sync theme UI and storage when cookie consent changes (vanilla-cookieconsent). */
export function onCookiePreferencesUpdated() {
  if (!preferencesStorageAllowed()) {
    localStorage.removeItem(STORAGE_KEY);
    setHtmlClass("system");
    syncBar("system");
    return;
  }
  const mode = readStoredMode();
  setHtmlClass(mode);
  syncBar(mode);
}

export function initTheme() {
  const mode = readStoredMode();
  setHtmlClass(mode);
  syncBar(mode);
  attachSystemListener();

  const ids = {
    system: "theme-btn-system",
    light: "theme-btn-light",
    dark: "theme-btn-dark",
  };

  for (const m of MODES) {
    document.getElementById(ids[m])?.addEventListener("click", () => {
      persist(m);
      setHtmlClass(m);
      syncBar(m);
    });
  }
}
