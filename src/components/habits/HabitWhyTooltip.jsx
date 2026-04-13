import { useState } from "react";
import { Info, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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

export default function HabitWhyTooltip({ habitName }) {
  const [open, setOpen] = useState(false);
  const why = HABIT_WHY[habitName];
  if (!why) return null;

  return (
    <div className="relative inline-flex">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="p-1 rounded-full hover:bg-muted transition-colors"
        aria-label="Why this habit?"
      >
        <Info className="w-4 h-4" style={{ color: '#003300' }} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-7 z-50 bg-card border border-border rounded-xl shadow-lg p-3 w-64 text-xs text-foreground leading-relaxed"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-semibold text-pakistani-green">Why this helps</span>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              </div>
              {why}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}