import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import BodySvgFront from "../components/body/BodySvgFront";
import BodySvgBack from "../components/body/BodySvgBack";
import RegionBottomSheet from "../components/body/RegionBottomSheet";
import { AnimatePresence, motion } from "framer-motion";

export default function BodyMap() {
  const [view, setView] = useState("front");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionData, setRegionData] = useState({});
  const [loading, setLoading] = useState(true);

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
        <h1 className="font-heading text-2xl text-pakistani-green">Pain Map</h1>
        <p className="text-sm text-muted-foreground mt-1">Tap a region to log tissue quality</p>
      </div>

      {/* View Toggle */}
      <div className="px-5 mb-4">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setView("front")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              view === "front"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Front View
          </button>
          <button
            onClick={() => setView("back")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              view === "back"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Back View
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
    </div>
  );
}