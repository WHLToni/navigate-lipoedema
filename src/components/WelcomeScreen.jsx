import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function WelcomeScreen({ onGetStarted }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-6 py-12 relative overflow-hidden"
      style={{ backgroundColor: "#FFE5E6" }}
    >
      {/* Background flame pattern — decorative, low opacity */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 400 600"
          className="absolute -right-20 -top-10 w-80 opacity-10"
          fill="#FB4002"
        >
          <path d="M200,20 C200,20 320,100 300,200 C280,300 350,320 330,420 C310,500 220,540 200,580 C180,540 90,500 70,420 C50,320 120,300 100,200 C80,100 200,20 200,20Z" />
          <circle cx="200" cy="80" r="55" />
        </svg>
        <svg
          viewBox="0 0 400 600"
          className="absolute -left-24 bottom-20 w-72 opacity-10"
          fill="#FB4002"
        >
          <path d="M200,20 C200,20 320,100 300,200 C280,300 350,320 330,420 C310,500 220,540 200,580 C180,540 90,500 70,420 C50,320 120,300 100,200 C80,100 200,20 200,20Z" />
          <circle cx="200" cy="80" r="55" />
        </svg>
      </div>

      {/* Top spacer */}
      <div />

      {/* Centre content */}
      <motion.div
        className="flex flex-col items-center text-center z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Brand mark — flame SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <svg
            viewBox="0 0 120 160"
            className="w-24 h-32"
            fill="#FB4002"
          >
            <circle cx="60" cy="38" r="30" />
            <path d="M60,55 C60,55 95,85 88,115 C81,140 68,152 60,158 C52,152 39,140 32,115 C25,85 60,55 60,55Z" />
          </svg>
        </motion.div>

        {/* App name */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-5xl leading-tight mb-1"
          style={{ fontFamily: "var(--font-display)", color: "#0a0a0a" }}
        >
          Navigate
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="text-5xl leading-tight mb-6"
          style={{ fontFamily: "var(--font-display)", color: "#FB4002" }}
        >
          Lipoedema
        </motion.h1>

        {/* Divider rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="w-10 h-0.5 mb-6"
          style={{ backgroundColor: "#FB4002" }}
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="text-base text-center max-w-xs leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "#333" }}
        >
          Your protocol. Your data.{" "}
          <span style={{ color: "#FB4002", fontWeight: 600 }}>Your control.</span>
        </motion.p>

        {/* Supporting line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="text-xs text-center max-w-xs mt-3 leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "#888" }}
        >
          Built for women with lipoedema who are ready to take action.
        </motion.p>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        className="w-full max-w-xs z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <Button
          onClick={onGetStarted}
          className="w-full h-14 text-white text-base font-semibold rounded-none shadow-lg"
          style={{ backgroundColor: "#FB4002", fontFamily: "var(--font-body)" }}
        >
          Get Started
        </Button>
        <p
          className="text-center text-xs mt-3"
          style={{ color: "#aaa", fontFamily: "var(--font-body)" }}
        >
          Free to use · Built by the lipoedema community
        </p>
      </motion.div>
    </div>
  );
}