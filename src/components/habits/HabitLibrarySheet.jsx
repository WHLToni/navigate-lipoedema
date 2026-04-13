import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, Salad, Sun, FlaskConical, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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

function HabitInfoPopover({ habitName }) {
  const [open, setOpen] = useState(false);
  const why = HABIT_WHY[habitName];
  if (!why) return null;

  return (
    <div className="relative inline-flex">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="p-1 rounded-full hover:bg-black/10 transition-colors"
      >
        <Info className="w-3.5 h-3.5" style={{ color: '#003300' }} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-7 z-[60] bg-white border border-border rounded-xl shadow-xl p-3 w-64 text-xs leading-relaxed"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-semibold" style={{ color: '#003300' }}>Why this helps</span>
                <button onClick={() => setOpen(false)}><X className="w-3 h-3 text-muted-foreground" /></button>
              </div>
              <p className="text-foreground">{why}</p>
            </motion.div>
          </>
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
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-10 pb-4 flex-shrink-0">
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

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-2 pb-6">
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
              <div className="flex flex-wrap gap-2">
                {habits.map((habit) => (
                  <div key={habit} className="flex items-center gap-1">
                    <button
                      onClick={() => toggleHabit(habit)}
                      className={`px-3 py-2 rounded-full text-xs font-medium border-2 transition-all ${
                        selected.includes(habit)
                          ? "bg-[#0202FB] border-[#0202FB] text-white"
                          : "bg-white border-white text-foreground hover:border-gray-300"
                      }`}
                    >
                      {habit}
                    </button>
                    <HabitInfoPopover habitName={habit} />
                  </div>
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
          className="w-full h-14 rounded-full font-heading text-base text-white"
          style={{ backgroundColor: '#0202FB' }}
        >
          Start My 30-Day Protocol ({selected.length} habits)
        </Button>
      </div>
    </div>
  );
}