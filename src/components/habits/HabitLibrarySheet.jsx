import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Dumbbell, Salad, Sun, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";

const HABIT_LIBRARY = {
  "Physical Therapies": [
    "Dry Brushing",
    "Vibration — Massage Gun",
    "60Hz/128Hz Vibration — Tuning Fork",
    "Vibration Plate",
    "Compression Garments",
    "Compression Boots",
    "MLD Therapy",
    "Weight Lifting",
    "Swimming",
    "Ocean Swimming",
    "Ultrasound Cavitation",
    "Shockwave Therapy",
  ],
  Metabolic: [
    "Keto Diet",
    "Low Histamine Diet",
    "Anti-Inflammatory Diet",
    "Fasting (24hr)",
    "GLP-1 Protocol",
  ],
  "Circadian / Environmental": [
    "Morning Sun (15+ min)",
    "Cold Therapy — Ocean/Pool",
    "Cold Therapy — Ice Bath",
  ],
  Supplements: [
    "Vitamin C",
    "Pine Bark Extract",
    "Quercetin",
    "Magnesium",
    "Bioflavonoids",
    "Butcher's Broom",
    "L-Arginine",
    "Psyllium Husk",
  ],
};

const CATEGORY_ICONS = {
  "Physical Therapies": Dumbbell,
  Metabolic: Salad,
  "Circadian / Environmental": Sun,
  Supplements: FlaskConical,
};

export default function HabitLibrarySheet({ activeHabits, onSave, onClose }) {
  const [selected, setSelected] = useState([...activeHabits]);

  const toggleHabit = (habit) => {
    if (selected.includes(habit)) {
      setSelected(selected.filter((h) => h !== habit));
    } else {
      setSelected([...selected, habit]);
    }
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
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-3xl border-t border-border shadow-2xl h-[85vh]"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-muted rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0">
          <h3 className="font-heading text-xl" style={{ color: '#003300' }}>Habit Library</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable habit categories */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {Object.entries(HABIT_LIBRARY).map(([category, habits]) => {
            const Icon = CATEGORY_ICONS[category] || Sun;
            return (
              <div key={category} className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: '#003300' }} />
                  <h4 className="text-sm font-semibold" style={{ color: '#003300' }}>{category}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {habits.map((habit) => (
                    <button
                      key={habit}
                      onClick={() => toggleHabit(habit)}
                      className={`px-3 py-2 rounded-full text-xs font-medium border-2 transition-all ${
                        selected.includes(habit)
                          ? "border-electric-blue bg-blue-50 text-electric-blue"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {habit}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky footer */}
        <div className="p-5 border-t border-border bg-card pb-10 flex-shrink-0">
          <Button
            onClick={() => onSave(selected)}
            className="w-full h-12 rounded-full font-medium text-white"
            style={{ backgroundColor: '#0202FB' }}
          >
            Save Protocol ({selected.length} habits)
          </Button>
        </div>
      </motion.div>
    </>
  );
}