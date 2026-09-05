"use client";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: AnalyticsParams) => void;
  }
}
