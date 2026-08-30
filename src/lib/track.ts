const VISITOR_ID_KEY = "gemstore-visitor-id";

export function getVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_ID_KEY, id);
    return id;
  } catch {
    return "unknown";
  }
}

export function trackEvent(type: "page_view" | "checkout_clicked" | "checkout_completed", path?: string) {
  try {
    const visitorId = getVisitorId();
    const payload = JSON.stringify({ visitorId, type, path: path ?? window.location.pathname });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // tracking must never break the storefront
  }
}
