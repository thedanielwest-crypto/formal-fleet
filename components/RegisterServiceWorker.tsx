"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // If a new service worker takes over while this tab is open (i.e. we just
    // shipped an update), the page is still running the old JS in memory —
    // reload once so it picks up the new code instead of silently submitting
    // against stale logic. The `refreshing` guard stops a reload loop.
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // Catch updates that ship while this tab/PWA has been left open —
        // browsers only check for a new SW on navigation by default.
        const checkForUpdate = () => registration.update().catch(() => {});
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") checkForUpdate();
        });
        window.addEventListener("focus", checkForUpdate);
      })
      .catch(() => {
        // Installability is a progressive enhancement — fail silently if unsupported.
      });
  }, []);

  return null;
}
