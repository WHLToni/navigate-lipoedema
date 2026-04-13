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

const CATEGORY_COLORS = {
  "Physical Therapies": "#CCFFCC",
  Metabolic: "#FFE5E6",
  "Circadian / Environmental": "#CCFFCC",
  Supplements: "#FFE5E6",
};

const HABIT_WHY = {
  "Dry Brushing": "Stimulates lymphatic flow and exfoliates dead skin, improving circulation in lipedema-affected tissue.",
  "Vibration — Massage Gun": "High-frequency vibration helps break up fibrotic tissue and encourages lymphatic drainage.",
  "60Hz/128Hz Vibration — Tuning Fork": "Targeted sonic vibration may reduce tissue density and support microcirculation.",
  "Vibration Plate": "Whole-body vibration activates muscle pumps that assist lymph flow and reduce fluid accumulation.",
  "Compression Garments": "External compression reduces fluid build-up and prevents tissue expansion in lipedema limbs.",
  "Compression Boots": "Pneumatic compression actively pumps lymph fluid out of the limbs.",
  "MLD Therapy": "Manual Lymphatic Drainage is the gold standard for redirecting lymph and softening tissue.",
  "Weight Lifting": "Muscle contractions act as a pump for the lymphatic system, reducing swelling.",
  "Swimming": "Hydrostatic pressure from water provides natural full-body compression while low-impact exercise supports lymph flow.",
  "Ocean Swimming": "Salt water + hydrostatic pressure provides anti-inflammatory and lymphatic benefits.",
  "Ultrasound Cavitation": "Targeted ultrasound can break down lipedema nodules and fibrotic tissue.",
  "Shockwave Therapy": "Acoustic waves stimulate collagen remodeling and improve tissue quality in affected areas.",
  "Keto Diet": "A low-carb ketogenic diet reduces insulin and inflammation, which are key drivers of lipedema progression.",
  "Low Histamine Diet": "Many lipedema patients have MCAS; reducing histamine load can decrease inflammation and flares.",
  "Anti-Inflammatory Diet": "Reducing systemic inflammation slows lipedema tissue deterioration.",
  "Fasting (24hr)": "Extended fasting triggers autophagy, clearing damaged cells and reducing inflammatory load.",
  "GLP-1 Protocol": "GLP-1 agonists reduce appetite and metabolic inflammation, supporting weight management in lipedema.",
  "Morning Sun (15+ min)": "Morning light regulates cortisol rhythms and improves circadian alignment, which affects inflammation.",
  "Cold Therapy — Ocean/Pool": "Cold exposure reduces acute inflammation and activates the sympathetic system to tighten tissue.",
  "Cold Therapy — Ice Bath": "Intense cold constricts blood vessels and reduces inflammatory cytokines in affected tissue.",
  "Vitamin C": "Essential for collagen synthesis and lymphatic vessel integrity.",
  "Pine Bark Extract": "Pycnogenol has strong evidence for reducing lipedema tissue swelling and pain.",
  "Quercetin": "A natural bioflavonoid with anti-inflammatory and mast-cell stabilising properties.",
  "Magnesium": "Supports muscle relaxation, lymph flow, and reduces systemic inflammation.",
  "Bioflavonoids": "Strengthen capillary walls and reduce fluid leakage into lipedema tissue.",
  "Butcher's Broom": "Venotonic herb that reduces capillary permeability and supports lymphatic tone.",
  "L-Arginine": "Nitric oxide precursor that improves microcirculation in affected tissue.",
  "Psyllium Husk": "Soluble fibre that feeds beneficial gut bacteria, reducing systemic inflammatory load.",
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
            <p className="px-3 pb-2.5 text-xs text-muted-foreground leading-relaxed border-t border-gray-100 pt-2">
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
              <div className="flex flex-col gap-2">
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