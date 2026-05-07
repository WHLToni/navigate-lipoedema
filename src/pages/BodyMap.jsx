import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import BodySvgFront from "../components/body/BodySvgFront";
import BodySvgBack from "../components/body/BodySvgBack";
import RegionBottomSheet from "../components/body/RegionBottomSheet";
import MeasurementsTab from "../components/body/MeasurementsTab";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Map, Activity, Ruler, CheckCircle2, Circle } from "lucide-react";

export default function BodyMap() {
  const [openSection, setOpenSection] = useState("body");
  const [view, setView] = useState("front");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionData, setRegionData] = useState({});
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { loadRegionData(); }, []);

  const today = new Date().toISOString().split("T")[0];

  const loadRegionData = async () => {
    const logs = await base44.entities.BodyRegionLog.filter({});
    const latest = {};
    logs.forEach((log) => {
      if (!log.log_date?.startsWith(today)) return;
      const existing = latest[log.region_id];
      if (!existing || new Date(log.log_date) > new Date(existing.log_date))
        latest[log.region_id] = log;
    });
    setRegionData(latest);
    setLoading(false);
  };

  const handleRegionTap = (region) => setSelectedRegion(region);

  const handleSave = async (data) => {
    await base44.entities.BodyRegionLog.create({ ...data, view });
    setRegionData((prev) => ({ ...prev, [data.region_id]: data }));
    setSelectedRegion(null);
  };

  const handleClear = async (regionId) => {
    const logs = await base44.entities.BodyRegionLog.filter({});
    const toDelete = logs.filter(
      (l) => l.region_id === regionId && l.log_date?.startsWith(today)
    );
    await Promise.all(toDelete.map((l) => base44.entities.BodyRegionLog.delete(l.id)));
    setRegionData((prev) => {
      const next = { ...prev };
      delete next[regionId];
      return next;
    });
    setSelectedRegion(null);
  };

  const toggleSection = (key) =>
    setOpenSection((prev) => (prev === key ? null : key));

  const regionCount = Object.keys(regionData).length;
  const activeSelStyle = { backgroundColor: "#FB4002", color: "#fff", borderColor: "#FB4002" };
  const inactiveSelStyle = { borderColor: "#e0e0e0", color: "#555" };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-muted rounded-full animate-spin" style={{ borderTopColor: "#FB4002" }} />
      </div>
    );
  }

  const SectionCard = ({ sectionKey, icon: Icon, title, statusLabel, isDone }) => {
    const isOpen = openSection === sectionKey;
    return (
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left"
        style={{
          background: isOpen ? "#0a0a0a" : "white",
          borderColor: isOpen ? "#0a0a0a" : "#e5e7eb",
          boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.15)" : "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: isOpen ? "#FB4002" : "#f3f4f6" }}
        >
          <Icon className="w-5 h-5" style={{ color: isOpen ? "#fff" : "#6b7280" }} />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold leading-tight"
            style={{ fontFamily: "var(--font-heading)", color: isOpen ? "#fff" : "#0a0a0a" }}
          >
            {title}
          </p>
          <p className="text-xs mt-0.5" style={{ color: isOpen ? "rgba(255,255,255,0.55)" : "#9ca3af" }}>
            {statusLabel}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isDone ? (
            <CheckCircle2 className="w-5 h-5" style={{ color: isOpen ? "#4ade80" : "#16a34a" }} />
          ) : (
            <Circle className="w-5 h-5" style={{ color: isOpen ? "rgba(255,255,255,0.3)" : "#d1d5db" }} />
          )}
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{
              color: isOpen ? "rgba(255,255,255,0.5)" : "#9ca3af",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-5 pt-10 pb-4">
        <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-0.5">
          Log Today
        </p>
        <h1 className="text-4xl" style={{ fontFamily: "var(--font-display)", color: "#0a0a0a", lineHeight: 1.1 }}>
          Symptom Map
        </h1>
        <div className="brand-rule" />
        <p className="text-sm text-muted-foreground">
          Complete all three sections for a full picture of today's symptoms.
        </p>
      </div>

      {/* Section Cards */}
      <div className="px-5 pb-10 space-y-3">

        {/* 1. BODY MAP */}
        <div>
          <SectionCard
            sectionKey="body"
            icon={Map}
            title="Body Map"
            statusLabel={regionCount > 0 ? `${regionCount} region${regionCount !== 1 ? "s" : ""} logged` : "Tap regions to log tissue quality"}
            isDone={regionCount > 0}
          />
          <AnimatePresence initial={false}>
            {openSection === "body" && (
              <motion.div
                key="body-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {["front", "back"].map((v) => (
                      <button
                        key={v}
                        onClick={() => setView(v)}
                        className="py-2.5 rounded-xl text-sm font-medium transition-all border-2"
                        style={view === v ? activeSelStyle : { borderColor: "#e0e0e0", color: "#888", backgroundColor: "transparent" }}
                      >
                        {v.charAt(0).toUpperCase() + v.slice(1)} View
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <motion.div
                      key={view}
                      initial={{ opacity: 0, rotateY: 90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      {view === "front" ? (
                        <BodySvgFront regionData={regionData} onRegionTap={handleRegionTap} selectedRegion={selectedRegion?.id} />
                      ) : (
                        <BodySvgBack regionData={regionData} onRegionTap={handleRegionTap} selectedRegion={selectedRegion?.id} />
                      )}
                    </motion.div>
                  </div>

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
                      <div className="w-3 h-3 rounded-full" style={{ background: "#CCFFCC" }} />
                      <span>Healthy</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    {regionCount} region{regionCount !== 1 ? "s" : ""} logged today
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. SYSTEMIC SYMPTOMS */}
        <div>
          <SectionCard
            sectionKey="systemic"
            icon={Activity}
            title="Systemic Symptoms"
            statusLabel={systemicSaved ? "Logged for today" : "MCAS, exhaustion, cycle phase"}
            isDone={systemicSaved}
          />
          <AnimatePresence initial={false}>
            {openSection === "systemic" && (
              <motion.div
                key="systemic-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-4">
                  <div className="bg-card rounded-2xl p-5 border border-border">
                    <h3 className="text-base text-pakistani-green mb-3" style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}>
                      MCAS Symptoms
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {MCAS_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => toggleMcas(opt)}
                          className="px-3 py-2 rounded-full text-xs font-medium border-2 transition-all"
                          style={mcasSymptoms.includes(opt) ? activeSelStyle : inactiveSelStyle}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-5 border border-border space-y-5">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Exhaustion</span>
                        <span className="text-sm font-medium" style={{ color: "#FB4002" }}>{exhaustion}</span>
                      </div>
                      <Slider value={[exhaustion]} onValueChange={([v]) => setExhaustion(v)} min={1} max={10} step={1} />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>Low</span><span>High</span></div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Migraine Intensity</span>
                        <span className="text-sm font-medium" style={{ color: "#FB4002" }}>{migraineIntensity}</span>
                      </div>
                      <Slider value={[migraineIntensity]} onValueChange={([v]) => setMigraineIntensity(v)} min={1} max={10} step={1} />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>Mild</span><span>Severe</span></div>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-5 border border-border">
                    <h3 className="text-base text-pakistani-green mb-3" style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}>
                      Menstrual Cycle Phase
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {CYCLE_PHASES.map((phase) => (
                        <button
                          key={phase}
                          onClick={() => setCyclePhase(phase)}
                          className="px-3 py-2 rounded-full text-xs font-medium border-2 transition-all"
                          style={cyclePhase === phase ? activeSelStyle : inactiveSelStyle}
                        >
                          {phase}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={saveSystemic}
                    disabled={systemicSaved}
                    className="w-full h-12 text-white font-medium"
                    style={{ backgroundColor: systemicSaved ? "#888" : "#FB4002" }}
                  >
                    {systemicSaved ? "Saved ✓" : "Save Systemic Log"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. MEASUREMENTS */}
        <div>
          <SectionCard
            sectionKey="measurements"
            icon={Ruler}
            title="Measurements"
            statusLabel="Circumference & volume tracking"
            isDone={false}
          />
          <AnimatePresence initial={false}>
            {openSection === "measurements" && (
              <motion.div
                key="measurements-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-3">
                  <MeasurementsTab />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Region bottom sheet */}
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
    </div>
  );
}