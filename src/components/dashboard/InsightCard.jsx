import { motion } from "framer-motion";

export default function InsightCard({ type, title, description, icon, delay = 0 }) {
  const isWin = type === "win";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-xl p-4 border-2 ${
        isWin
          ? "bg-tea-green border-pakistani-green"
          : "bg-white border-dynamic-red"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h4 className="font-heading text-sm text-pakistani-green">{title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}