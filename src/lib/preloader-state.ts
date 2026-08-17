const SESSION_KEY = "nepalwood_preloader_shown";

/** Dispatched on `window` the moment the preloader starts its exit
 *  animation, so the Hero section's own entrance timeline can pick up
 *  right where it left off instead of running independently. */
export const PRELOADER_DONE_EVENT = "nepalwood:preloader-done";

/** Dispatched by HeroGlobeCanvas once its WebGL canvas/renderer exists. */
export const GLOBE_READY_EVENT = "nepalwood:globe-ready";

export function hasShownPreloader(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    // Storage unavailable (private browsing etc.) — don't block the page on it.
    return true;
  }
}

export function markPreloaderShown() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // ignore
  }
}
