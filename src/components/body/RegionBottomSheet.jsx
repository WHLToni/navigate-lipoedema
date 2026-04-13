import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const SKIN_OPTIONS = ["Cold", "Woody", "Loose/Concertina", "Velvety", "Healthy/Warm"];
const FAT_OPTIONS = ["Spongy/Fluffy", "Heavy", "Painful", "Hard", "Congested/Thick"];

export default function RegionBottomSheet({ region, existingData, onSave, onClear, onClose }) {
  const [skinQuality, setSkinQuality] = useState(existingData?.skin_quality || []);
  const [fatQuality, setFatQuality] = useState(existingData?.fat_quality || []);
  const [painScore, setPainScore] = useState(existingData?.pain_score || 5);
  const [bruising, setBruising] = useState(existingData?.bruising || false);

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
      bruising,
      log_date: new Date().toISOString(),
    });
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed inset-y-0 right-0 w-full max-w-[400px] h-screen z-50 bg-card border-l border-border shadow-2xl overflow-y-auto"
    >

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

        {/* Localized Symptoms */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2 text-pakistani-green">Localized Symptoms</h4>
          <button
            onClick={() => setBruising(!bruising)}
            className={`px-3 py-2 rounded-full text-xs font-medium border-2 transition-all ${
              bruising
                ? "border-electric-blue bg-blue-50 text-electric-blue"
                : "border-border text-muted-foreground hover:border-muted-foreground"
            }`}
          >
            Bruising
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {existingData && (
            <Button
              variant="outline"
              onClick={() => onClear(region.id)}
              className="flex-1 h-12 border-dynamic-red text-dynamic-red hover:bg-red-50 rounded-full"
            >
              Remove Log
            </Button>
          )}
          <Button
            onClick={handleSave}
            className={`h-12 bg-electric-blue hover:bg-blue-700 text-white font-medium text-base rounded-full px-10 ${existingData ? 'flex-1' : 'mx-auto flex'}`}
          >
            Save Region Data
          </Button>
        </div>
      </div>
    </motion.div>
  );
}