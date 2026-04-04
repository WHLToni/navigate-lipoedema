import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const SKIN_OPTIONS = ["Cold", "Woody", "Loose/Concertina", "Velvety", "Healthy/Warm"];
const FAT_OPTIONS = ["Spongy/Fluffy", "Heavy", "Painful", "Hard", "Congested/Thick"];

export default function RegionBottomSheet({ region, existingData, onSave, onClose }) {
  const [skinQuality, setSkinQuality] = useState(existingData?.skin_quality || []);
  const [fatQuality, setFatQuality] = useState(existingData?.fat_quality || []);
  const [painScore, setPainScore] = useState(existingData?.pain_score || 5);

  const toggleItem = (arr, setArr, item) => {
    if (arr.includes(item)) {
      setArr(arr.filter((i) => i !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const handleSave = () => {
    onSave({
      region_id: region.id,
      skin_quality: skinQuality,
      fat_quality: fatQuality,
      pain_score: painScore,
      log_date: new Date().toISOString(),
    });
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-3xl border-t border-border shadow-2xl max-h-[85vh] overflow-y-auto"
    >
      {/* Handle */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 bg-muted rounded-full" />
      </div>

      <div className="px-5 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg text-pakistani-green">{region.label}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pain Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Pain Level</span>
            <span
              className="text-2xl font-heading"
              style={{ color: painScore >= 5 ? "#FB4002" : "#003300" }}
            >
              {painScore}
            </span>
          </div>
          <Slider
            value={[painScore]}
            onValueChange={([v]) => setPainScore(v)}
            min={1}
            max={10}
            step={1}
            className="[&_[role=slider]]:bg-dynamic-red [&_[role=slider]]:border-dynamic-red [&_.range]:bg-dynamic-red"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Mild</span>
            <span>Severe</span>
          </div>
        </div>

        {/* Skin Quality */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold mb-2 text-pakistani-green">Skin Quality</h4>
          <div className="flex flex-wrap gap-2">
            {SKIN_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => toggleItem(skinQuality, setSkinQuality, opt)}
                className={`px-3 py-2 rounded-full text-xs font-medium border-2 transition-all ${
                  skinQuality.includes(opt)
                    ? "border-electric-blue bg-blue-50 text-electric-blue"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Fat Quality */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2 text-pakistani-green">Fat Quality</h4>
          <div className="flex flex-wrap gap-2">
            {FAT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => toggleItem(fatQuality, setFatQuality, opt)}
                className={`px-3 py-2 rounded-full text-xs font-medium border-2 transition-all ${
                  fatQuality.includes(opt)
                    ? "border-electric-blue bg-blue-50 text-electric-blue"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <Button
          onClick={handleSave}
          className="mx-auto h-12 bg-electric-blue hover:bg-blue-700 text-white font-medium text-base rounded-full px-10 flex"
        >
          Save Region Data
        </Button>
      </div>
    </motion.div>
  );
}