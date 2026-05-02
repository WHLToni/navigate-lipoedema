import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const TRIGGERS = [
  "High Histamine Meal",
  "Poor Sleep",
  "Period Start",
  "Sedentary Day",
  "High Stress",
  "Alcohol",
  "Sugar/Processed Food",
  "Hormonal Fluctuation",
  "Weather Change",
  "Long Travel",
];

export default function TriggerLogger({ onClose }) {
  const [selected, setSelected] = useState([]);
  const [otherText, setOtherText] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleTrigger = (t) => {
    if (selected.includes(t)) {
      setSelected(selected.filter((s) => s !== t));
    } else {
      setSelected([...selected, t]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const today = new Date().toISOString().split("T")[0];
    await base44.entities.DailyCheckIn.create({
      check_in_type: "evening",
      check_in_date: today,
      triggers: selected,
      trigger_other: otherText || undefined,
    });
    setSaving(false);
    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-y-0 right-0 w-full max-w-[400px] h-screen z-50 bg-card border-l border-border shadow-2xl overflow-y-auto"
      >
        <div className="px-5 pt-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg text-pakistani-green">Log Today's Triggers</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Select any that occurred today.</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {TRIGGERS.map((t) => (
              <button
                key={t}
                onClick={() => toggleTrigger(t)}
                className={`px-3 py-2 rounded-full text-xs font-medium border-2 transition-all ${
                  selected.includes(t)
                    ? "border-dynamic-red bg-red-50 text-dynamic-red"
                    : "border-border text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <Input
            placeholder="Other trigger (max 100 chars)"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value.slice(0, 100))}
            className="mb-4"
          />
          <Button
            onClick={handleSave}
            disabled={saving || (selected.length === 0 && !otherText)}
            className="w-full h-12 bg-electric-blue hover:bg-blue-700 text-white rounded-xl font-medium"
          >
            {saving ? "Saving..." : "Save Triggers"}
          </Button>
        </div>
      </motion.div>
    </>
  );
}