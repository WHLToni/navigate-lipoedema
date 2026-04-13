import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, Salad, Sun, FlaskConical, Info, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HABIT_LIBRARY = {
  "Physical Therapies": [
    "Dry Brushing",
    "Vibration — Massage Gun",
    "60Hz/128Hz Vibration — Tuning Fork",
    "Vibration Plate",
    "Compression (Garments/Boots)",
    "MLD Therapy",
    "Swimming/Ocean",
  ],
  Metabolic: [
    "Keto/Anti-Inflammatory Diet",
    "Low Histamine Diet",
    "GLP-1 Protocol",
  ],
  "Circadian / Environmental": [
    "Morning Sun (15+ min)",
    "Cold Therapy — Ocean/Pool",
    "Cold Therapy — Ice Bath",
  ],
  Supplements: [
    "Vitamin C",
    "Pine Bark Extract / Bioflavonoids",
    "Quercetin",
    "Butcher's Broom",
    "L-Arginine",
    "Magnesium",
  ],
};

const CATEGORY_ICONS = {
  "Physical Therapies": Dumbbell,
  Metabolic: Salad,
  "Circadian / Environmental": Sun,
  Supplements: FlaskConical,
};

const CATEGORY_COLORS = {
  "Physical Therapies": "#CCFFCC",
  Metabolic: "#FFE5E6",
  "Circadian / Environmental": "#CCFFCC",
  Supplements: "#FFE5E6",
};

const HABIT_WHY = {
  "Dry Brushing": "Stimulates initial lymphatics near the skin surface to encourage movement of stagnant interstitial fluid.",
  "Vibration — Massage Gun": "Uses mechanical oscillation to help thin thickened lymph fluid (thixotropy) for easier transport.",
  "60Hz/128Hz Vibration — Tuning Fork": "Targeted frequency to assist with localized lymphatic clearance and tissue softening.",
  "Vibration Plate": "High-frequency whole-body vibration is thought to assist lymphatic pumping and reduce fluid retention.",
  "Compression (Garments/Boots)": "Provides counter-pressure to reduce capillary leakiness and assist the muscle pump in moving fluid upward.",
  "MLD Therapy": "Manually reroutes lymphatic fluid around congested areas to functional nodes, reducing tissue pressure.",
  "Swimming/Ocean": "Utilizes natural hydrostatic pressure to provide gentle, full-body compression supporting lymphatic return.",
  "Keto/Anti-Inflammatory Diet": "Lowers systemic inflammation and stabilizes insulin to reduce sodium-water retention in fat cells.",
  "Low Histamine Diet": "Reduces mast cell activation often associated with Lipedema, lowering tissue swelling and itchiness.",
  "GLP-1 Protocol": "May assist by reducing systemic inflammation and improving disrupted metabolic signaling in Lipedema tissue.",
  "Morning Sun (15+ min)": "Morning light regulates cortisol rhythms and improves circadian alignment, which affects inflammation.",
  "Cold Therapy — Ocean/Pool": "Cold exposure reduces acute inflammation and activates the sympathetic system to tighten tissue.",
  "Cold Therapy — Ice Bath": "Intense cold constricts blood vessels and reduces inflammatory cytokines in affected tissue.",
  "Vitamin C": "Essential for collagen synthesis to strengthen the basement membrane of blood vessels, reducing capillary leakiness.",
  "Pine Bark Extract / Bioflavonoids": "Improves microcirculation and strengthens the walls of small veins and lymphatics.",
  "Quercetin": "Acts as a mast cell stabilizer to reduce the release of histamines that cause tissue swelling and pain.",
  "Butcher's Broom": "Increases venous tone and helps reduce the permeability of the vascular system.",
  "L-Arginine": "Supports nitric oxide production to help reduce leakiness of vessels and improve lymphatic pumping.",
  "Magnesium": "Assists in reducing muscle tension and supporting cellular pumps that regulate fluid balance.",
};

function HabitChip({ habit, selected, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const why = HABIT_WHY[habit];

  return (
    <div
      className={`rounded-xl border-2 transition-all text-xs font-medium overflow-hidden ${
        selected
          ? "border-[#0202FB] bg-white"
          : "border-white bg-white"
      }`}
    >
      <div className="flex items-center gap-1 px-3 py-2">
        <button
          onClick={() => onToggle(habit)}
          className={`flex-1 text-left font-medium ${selected ? "text-[#0202FB]" : "text-foreground"}`}
        >
          {habit}
        </button>
        {why && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            className="p-0.5 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            {expanded
              ? <ChevronUp className="w-3.5 h-3.5" style={{ color: '#003300' }} />
              : <Info className="w-3.5 h-3.5" style={{ color: '#003300' }} />
            }
          </button>
        )}
      </div>
      <AnimatePresence>
        {expanded && why && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-3 pb-2.5 text-xs leading-relaxed border-t border-gray-100 pt-2" style={{ color: '#003300' }}>
              {why}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HabitLibrarySheet({ activeHabits, onSave, onClose }) {
  const [selected, setSelected] = useState([...activeHabits]);

  const toggleHabit = (habit) => {
    setSelected((prev) =>
      prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit]
    );
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Sticky header */}
      <div className="sticky top-0 bg-background z-20 border-b border-border">
        <div className="flex items-center gap-3 px-5 pt-10 pb-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#003300' }} />
          </button>
          <div>
            <h1 className="font-heading text-2xl" style={{ color: '#003300' }}>Wellness Menu</h1>
            <p className="text-xs text-muted-foreground">Select habits to add to your 30-day protocol</p>
          </div>
        </div>
      </div>

      {/* Habit categories */}
      <div className="px-5 py-4">
        {Object.entries(HABIT_LIBRARY).map(([category, habits]) => {
          const Icon = CATEGORY_ICONS[category] || Sun;
          const bgColor = CATEGORY_COLORS[category];
          return (
            <div
              key={category}
              className="mb-5 rounded-2xl p-4"
              style={{ backgroundColor: bgColor }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4" style={{ color: '#003300' }} />
                <h4 className="text-sm font-semibold" style={{ color: '#003300' }}>{category}</h4>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {habits.map((habit) => (
                  <HabitChip
                    key={habit}
                    habit={habit}
                    selected={selected.includes(habit)}
                    onToggle={toggleHabit}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* CTA Button — end of list */}
        <Button
          onClick={() => onSave(selected)}
          className="w-fit px-10 mx-auto block mt-10 mb-20 h-14 rounded-full font-heading text-base text-white"
          style={{ backgroundColor: '#0202FB' }}
        >
          Start My 30-Day Protocol ({selected.length} habits)
        </Button>
      </div>
    </div>
  );
}