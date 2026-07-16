// Thin wrapper around GoatCounter custom events.
//
// GoatCounter's script (loaded in index.html) tracks pageviews automatically.
// Individual interactions (searches, outbound clicks, tool launches) are NOT
// counted unless we fire an explicit event. This helper does that safely:
// if the script hasn't loaded (blocked, offline, ad-blocker), it no-ops rather
// than throwing — analytics must never break the UI.

declare global {
  interface Window {
    goatcounter?: {
      count: (opts: { path: string; title?: string; event?: boolean }) => void;
    };
  }
}

/**
 * Record a custom event in GoatCounter. `name` becomes the event path shown in
 * the dashboard (e.g. "catalog-search", "jvd-github", "byoai-launch").
 */
export function track(name: string): void {
  try {
    window.goatcounter?.count({ path: name, title: name, event: true });
  } catch {
    /* never let analytics break the page */
  }
}
