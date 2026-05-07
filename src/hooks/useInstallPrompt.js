import { useState, useEffect } from "react";

const VISIT_COUNT_KEY = "nl_visit_count";
const BANNER_DISMISSED_KEY = "nl_install_banner_dismissed";
const VISITS_BEFORE_PROMPT = 2; // Show after 2nd visit

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect if already installed (running as standalone PWA)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS (Safari doesn't support beforeinstallprompt)
    const ios =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !window.MSStream;
    setIsIOS(ios);

    // Track visit count
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
    if (dismissed) return; // User already dismissed — respect that

    const count = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || "0", 10) + 1;
    localStorage.setItem(VISIT_COUNT_KEY, String(count));

    // Listen for the browser's install event (Android/Chrome)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (count >= VISITS_BEFORE_PROMPT) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // For iOS, show our manual instructions banner after enough visits
    if (ios && count >= VISITS_BEFORE_PROMPT) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const triggerInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const dismissBanner = () => {
    localStorage.setItem(BANNER_DISMISSED_KEY, "true");
    setShowBanner(false);
  };

  return {
    showBanner,
    isIOS,
    isInstalled,
    canInstallNatively: !!deferredPrompt,
    triggerInstall,
    dismissBanner,
  };
}