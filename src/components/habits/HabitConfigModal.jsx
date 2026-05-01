import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const TIME_SLOT_OPTIONS = [
  { value: "morning", label: "☀️ Morning", desc: "Best done early in the day" },
  { value: "evening", label: "🌙 Evening", desc: "Wind-down or end of day" },
  { value: "anytime", label: "🕐 Anytime", desc: "No specific time needed" },
];

const CADENCE_OPTIONS = [
  { value: "daily", label: "Daily", desc: "Every day" },
  { value: "weekly", label: "Weekly", desc: "A few times per week" },
];

export default function HabitConfigModal({ habitName, existing, onConfirm, onCancel }) {
  const [timeSlot, setTimeSlot] = useState(existing?.time_slot || "anytime");
  const [cadence, setCadence] = useState(existing?.cadence || "daily");

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40" onClick={onCancel}>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="bg-card w-full max-w-md rounded-t-3xl p-6 pb-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg text-pakistani-green leading-tight">{habitName}</h3>
          <button onClick={onCancel} className="p-1.5 rounded-full hover:bg-muted">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Time Slot */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">When do you do this?</p>
        <div className="flex gap-2 mb-5">
          {TIME_SLOT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeSlot(opt.value)}
              className={`flex-1 rounded-xl border-2 p-2.5 text-center transition-all ${
                timeSlot === opt.value
                  ? "border-electric-blue bg-blue-50"
                  : "border-border bg-background"
              }`}
            >
              <div className="text-base mb-0.5">{opt.label.split(" ")[0]}</div>
              <div className={`text-xs font-medium ${timeSlot === opt.value ? "text-electric-blue" : "text-foreground"}`}>
                {opt.label.split(" ")[1]}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>

        {/* Cadence */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">How often?</p>
        <div className="flex gap-2 mb-6">
          {CADENCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCadence(opt.value)}
              className={`flex-1 rounded-xl border-2 p-3 text-center transition-all ${
                cadence === opt.value
                  ? "border-electric-blue bg-blue-50"
                  : "border-border bg-background"
              }`}
            >
              <div className={`text-sm font-semibold ${cadence === opt.value ? "text-electric-blue" : "text-foreground"}`}>
                {opt.label}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>

        <Button
          onClick={() => onConfirm({ name: habitName, cadence, time_slot: timeSlot })}
          className="w-full h-12 bg-electric-blue hover:bg-blue-700 text-white font-medium"
        >
          Add to Protocol
        </Button>
      </motion.div>
    </div>
  );
}