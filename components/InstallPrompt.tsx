"use client";

import { useEffect, useState } from "react";
import { FFMonogram } from "@/components/BrandIcon";

const DISMISS_KEY = "ff_install_prompt_dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari's non-standard flag for "added to home screen"
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      // sessionStorage unavailable (private mode etc) - just show the prompt
      setDismissed(false);
    }

    if (isStandalone()) return;

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handler);

    if (isIos()) setShowIosHint(true);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  }

  if (dismissed || isStandalone() || (!deferredPrompt && !showIosHint)) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm bg-navy-deep text-white rounded-2xl shadow-xl p-4 flex items-start gap-3 z-50">
      <FFMonogram className="w-9 h-9" />
      <div className="flex-1 text-[13px] leading-relaxed">
        <div className="font-bold text-[14px] mb-0.5">Add Formal Fleet to your phone</div>
        {deferredPrompt ? (
          <p className="text-slate-300 mb-2">
            Install the app for one-tap access to listings, your dashboard, and event invites.
          </p>
        ) : (
          <p className="text-slate-300 mb-2">
            Tap the Share icon, then &ldquo;Add to Home Screen&rdquo; for one-tap access anytime.
          </p>
        )}
        <div className="flex gap-3">
          {deferredPrompt && (
            <button
              onClick={install}
              className="bg-gold-light text-navy-deep font-bold text-[12.5px] px-3.5 py-1.5 rounded-lg"
            >
              Install app
            </button>
          )}
          <button onClick={dismiss} className="text-slate-300 text-[12.5px] underline">
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
