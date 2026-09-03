"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production" && window.location.hostname !== "localhost") return;

    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // PWA enhancement is optional; the website remains fully usable if registration fails.
    });
  }, []);

  return null;
}
