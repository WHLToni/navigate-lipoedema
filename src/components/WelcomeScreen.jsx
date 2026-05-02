import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function WelcomeScreen({ onGetStarted }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-6 py-12 relative overflow-hidden"
      style={{
        backgroundImage: "url('https://media.base44.com/images/public/69d0bde2222a87f8aebb38ac/946a36da5_NL_Background_Pink.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

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
          <img
            src="https://media.base44.com/images/public/69d0bde2222a87f8aebb38ac/3f25b2a35_NavigateLipoedemaIllustrationsInstagramPost1.png"
            alt="Navigate Lipoedema logo"
            className="w-24 h-32 object-contain"
          />
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
          style={{ fontFamily: "var(--font-display)", color: "#0a0a0a" }}
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
          Built by a woman living with lipoedema
        </p>
      </motion.div>
    </div>
  );
}