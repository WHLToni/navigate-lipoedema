import { motion, AnimatePresence } from "framer-motion";
import { X, Share, PlusSquare, Download } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export default function InstallBanner() {
  const { showBanner, isIOS, canInstallNatively, triggerInstall, dismissBanner } =
    useInstallPrompt();

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-[72px] left-0 right-0 z-40 px-3 pb-1"
      >
        <div
          className="max-w-lg mx-auto rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
            border: "1px solid #2a2a2a",
          }}
        >
          {/* Top accent line */}
          <div className="h-[3px] w-full" style={{ background: "#FB4002" }} />

          <div className="p-4">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#FB4002" }}
                >
                  <span className="text-white text-lg">💜</span>
                </div>
                <div>
                  <p
                    className="text-white text-sm font-semibold leading-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Add Navigate to your home screen
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}
                  >
                    One tap access — no app store needed
                  </p>
                </div>
              </div>
              <button
                onClick={dismissBanner}
                className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0 mt-0.5"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* iOS instructions */}
            {isIOS && !canInstallNatively && (
              <div
                className="rounded-xl p-3 space-y-2"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <p
                  className="text-xs font-medium"
                  style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)" }}
                >
                  Here's how:
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(251,64,2,0.2)" }}
                  >
                    <Share className="w-3.5 h-3.5" style={{ color: "#FB4002" }} />
                  </div>
                  <p className="text-xs text-white/60" style={{ fontFamily: "var(--font-body)" }}>
                    Tap the <span className="text-white font-semibold">Share</span> button at the
                    bottom of Safari
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(251,64,2,0.2)" }}
                  >
                    <PlusSquare className="w-3.5 h-3.5" style={{ color: "#FB4002" }} />
                  </div>
                  <p className="text-xs text-white/60" style={{ fontFamily: "var(--font-body)" }}>
                    Scroll down and tap{" "}
                    <span className="text-white font-semibold">Add to Home Screen</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(251,64,2,0.2)" }}
                  >
                    <span className="text-xs" style={{ color: "#FB4002" }}>✓</span>
                  </div>
                  <p className="text-xs text-white/60" style={{ fontFamily: "var(--font-body)" }}>
                    Tap <span className="text-white font-semibold">Add</span> — done!
                  </p>
                </div>
              </div>
            )}

            {/* Android / Chrome native install button */}
            {canInstallNatively && (
              <button
                onClick={triggerInstall}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-75"
                style={{ background: "#FB4002", fontFamily: "var(--font-body)" }}
              >
                <Download className="w-4 h-4" />
                Install App
              </button>
            )}

            {/* Fallback for non-iOS, non-Chrome browsers without the event */}
            {!isIOS && !canInstallNatively && (
              <div
                className="rounded-xl p-3"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <p className="text-xs text-white/60" style={{ fontFamily: "var(--font-body)" }}>
                  In your browser menu, look for{" "}
                  <span className="text-white font-semibold">
                    "Install app"
                  </span>{" "}
                  or{" "}
                  <span className="text-white font-semibold">
                    "Add to Home Screen"
                  </span>{" "}
                  to install Navigate.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}