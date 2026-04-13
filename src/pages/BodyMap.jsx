import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import BodySvgFront from "../components/body/BodySvgFront";
import BodySvgBack from "../components/body/BodySvgBack";
import RegionBottomSheet from "../components/body/RegionBottomSheet";
import { AnimatePresence, motion } from "framer-motion";

export default function BodyMap() {
  const [mainTab, setMainTab] = useState("body");
  const [view, setView] = useState("front");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionData, setRegionData] = useState({});
  const [loading, setLoading] = useState(true);

  // Systemic tracker state
  const [mcasSymptoms, setMcasSymptoms] = useState([]);
  const [exhaustion, setExhaustion] = useState(5);
  const [migraineIntensity, setMigraineIntensity] = useState(1);
  const [cyclePhase, setCyclePhase] = useState("N/A");
  const [systemicSaved, setSystemicSaved] = useState(false);

  const MCAS_OPTIONS = ["Rash/Hives", "Itchy Skin", "Flushing", "Headache"];
  const CYCLE_PHASES = ["Menses", "Follicular", "Ovulation", "Luteal", "N/A"];

  const toggleMcas = (item) =>
    setMcasSymptoms((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );

  const saveSystemic = async () => {
    const today = new Date().toISOString().split("T")[0];
    await base44.entities.DailyCheckIn.create({
      check_in_type: "symptom_deep_dive",
      check_in_date: today,
      triggers: mcasSymptoms,
      notes: JSON.stringify({ exhaustion, migraineIntensity, cyclePhase }),
    });
    setSystemicSaved(true);
  };

  useEffect(() => {
    loadRegionData();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const loadRegionData = async () => {
    const logs = await base44.entities.BodyRegionLog.filter({});
    const latest = {};
    logs.forEach((log) => {
      if (!log.log_date?.startsWith(today)) return; // only show today's logs
      const existing = latest[log.region_id];
      if (!existing || new Date(log.log_date) > new Date(existing.log_date)) {
        latest[log.region_id] = log;
      }
    });
    setRegionData(latest);
    setLoading(false);
  };

  const handleRegionTap = (region) => {
    setSelectedRegion(region);
  };

  const handleSave = async (data) => {
    await base44.entities.BodyRegionLog.create({
      ...data,
      view,
    });
    setRegionData((prev) => ({
      ...prev,
      [data.region_id]: data,
    }));
    setSelectedRegion(null);
  };

  const handleClear = async (regionId) => {
    const logs = await base44.entities.BodyRegionLog.filter({});
    const toDelete = logs.filter((l) => l.region_id === regionId && l.log_date?.startsWith(today));
    await Promise.all(toDelete.map((l) => base44.entities.BodyRegionLog.delete(l.id)));
    setRegionData((prev) => {
      const next = { ...prev };
      delete next[regionId];
      return next;
    });
    setSelectedRegion(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-muted border-t-electric-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <h1 className="font-heading text-2xl text-pakistani-green">Symptom Map</h1>
        <p className="text-sm text-muted-foreground mt-1">Tap a region to log tissue quality</p>
      </div>

      {/* Main Tab Toggle */}
      <div className="px-5 mb-4">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setMainTab("body")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mainTab === "body" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Body View
          </button>
          <button
            onClick={() => setMainTab("systemic")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mainTab === "systemic" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Systemic View
          </button>
        </div>
      </div>

      {/* Systemic View */}
      {mainTab === "systemic" && (
        <div className="px-5 pb-10 space-y-6">
          {/* MCAS Symptoms */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h3 className="font-heading text-base text-pakistani-green mb-3">MCAS Symptoms</h3>
            <div className="flex flex-wrap gap-2">
              {MCAS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleMcas(opt)}
                  className={`px-3 py-2 rounded-full text-xs font-medium border-2 transition-all ${
                    mcasSymptoms.includes(opt)
                      ? "border-electric-blue bg-blue-50 text-electric-blue"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-card rounded-2xl p-5 border border-border space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Exhaustion</span>
                <span className="text-sm font-heading text-dynamic-red">{exhaustion}</span>
              </div>
              <Slider value={[exhaustion]} onValueChange={([v]) => setExhaustion(v)} min={1} max={10} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>Low</span><span>High</span></div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Migraine Intensity</span>
                <span className="text-sm font-heading text-dynamic-red">{migraineIntensity}</span>
              </div>
              <Slider value={[migraineIntensity]} onValueChange={([v]) => setMigraineIntensity(v)} min={1} max={10} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>Mild</span><span>Severe</span></div>
            </div>
          </div>

          {/* Menstrual Cycle Phase */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h3 className="font-heading text-base text-pakistani-green mb-3">Menstrual Cycle Phase</h3>
            <div className="flex flex-wrap gap-2">
              {CYCLE_PHASES.map((phase) => (
                <button
                  key={phase}
                  onClick={() => setCyclePhase(phase)}
                  className={`px-3 py-2 rounded-full text-xs font-medium border-2 transition-all ${
                    cyclePhase === phase
                      ? "border-electric-blue bg-blue-50 text-electric-blue"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  {phase}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={saveSystemic}
            disabled={systemicSaved}
            className="w-full h-12 bg-electric-blue hover:bg-blue-700 text-white font-medium rounded-full"
          >
            {systemicSaved ? "Saved ✓" : "Save Systemic Log"}
          </Button>
        </div>
      )}

      {/* View Toggle — only shown in Body tab */}
      {mainTab === "body" && <>
      <div className="px-5 mb-4">
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => setView("front")}
            className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
              view === "front"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground bg-muted"
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setView("back")}
            className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
              view === "back"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground bg-muted"
            }`}
          >
            Back
          </button>
        </div>
      </div>

      {/* Body SVG */}
      <div className="px-5 flex justify-center">
        <motion.div
          key={view}
          initial={{ opacity: 0, rotateY: 90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {view === "front" ? (
            <BodySvgFront
              regionData={regionData}
              onRegionTap={handleRegionTap}
              selectedRegion={selectedRegion?.id}
            />
          ) : (
            <BodySvgBack
              regionData={regionData}
              onRegionTap={handleRegionTap}
              selectedRegion={selectedRegion?.id}
            />
          )}
        </motion.div>
      </div>

      {/* Legend */}
      <div className="px-5 mt-4">
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: "#0202FB30" }} />
            <span>Cold/Woody</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: "#FB400240" }} />
            <span>Pain 5+</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: "#FFE5E680" }} />
            <span>Healthy</span>
          </div>
        </div>
      </div>

      {/* Region Count */}
      <div className="px-5 mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          {Object.keys(regionData).length} regions logged
        </p>
      </div>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {selectedRegion && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setSelectedRegion(null)}
            />
            <RegionBottomSheet
              region={selectedRegion}
              existingData={regionData[selectedRegion.id]}
              onSave={handleSave}
              onClear={handleClear}
              onClose={() => setSelectedRegion(null)}
            />
          </>
        )}
      </AnimatePresence>
      </>}
    </div>
  );
}