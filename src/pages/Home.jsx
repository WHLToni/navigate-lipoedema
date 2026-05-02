import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Sun, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import OnboardingWizard from "../components/onboarding/OnboardingWizard";
import BodySvgFront from "../components/body/BodySvgFront";
import { FRONT_REGIONS } from "../components/body/BodySvgFront";
import { motion } from "framer-motion";
import DailyBriefing from "../components/home/DailyBriefing";

const QUICK_SCAN_REGIONS = ["left-upper-thigh", "right-upper-thigh", "left-inner-thigh", "right-inner-thigh", "abdomen"];

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [morningDone, setMorningDone] = useState(false);
  const [sunlight, setSunlight] = useState(null);
  const [painScans, setPainScans] = useState({});
  const [todayCheckIn, setTodayCheckIn] = useState(null);
  const [habitLogs, setHabitLogs] = useState([]);
  const [bodyLogs, setBodyLogs] = useState([]);
  const [checkIns, setCheckIns] = useState([]);

  const hour = new Date().getHours();
  const isMorning = hour < 14;
  const isEvening = hour >= 17;

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const profiles = await base44.entities.UserProfile.filter({});
    if (profiles.length > 0) {
      setProfile(profiles[0]);
      const today = new Date().toISOString().split("T")[0];
      const [todayCheckIns, recentHabitLogs, recentBodyLogs, recentCheckIns] = await Promise.all([
        base44.entities.DailyCheckIn.filter({ check_in_date: today }),
        base44.entities.HabitLog.list("-log_date", 200),
        base44.entities.BodyRegionLog.list("-log_date", 200),
        base44.entities.DailyCheckIn.list("-check_in_date", 50),
      ]);
      const morningCI = todayCheckIns.find((c) => c.check_in_type === "morning");
      if (morningCI) { setTodayCheckIn(morningCI); setMorningDone(true); }
      setHabitLogs(recentHabitLogs);
      setBodyLogs(recentBodyLogs);
      setCheckIns(recentCheckIns);
    }
    setLoading(false);
  };

  const handlePainScan = (regionId, value) => setPainScans((prev) => ({ ...prev, [regionId]: value }));

  const submitMorning = async () => {
    const today = new Date().toISOString().split("T")[0];
    const scanRegions = Object.entries(painScans).map(([region_id, pain_score]) => ({ region_id, pain_score }));
    await base44.entities.DailyCheckIn.create({
      check_in_type: "morning",
      check_in_date: today,
      morning_sunlight: sunlight,
      tissue_scan_regions: scanRegions,
    });
    setMorningDone(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-muted rounded-full animate-spin" style={{ borderTopColor: "#FB4002" }} />
      </div>
    );
  }

  if (!profile) return <OnboardingWizard onComplete={loadData} />;

  const bgClass = isMorning ? "bg-tea-green" : isEvening ? "bg-shampoo" : "bg-background";
  const activeHabits = profile.active_habits || [];

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="px-5 pt-10 pb-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
            {isMorning ? "Good Morning" : isEvening ? "Good Evening" : "Good Afternoon"}
          </p>
          <h1 className="text-4xl mt-0.5" style={{ fontFamily: "var(--font-display)", color: "#0a0a0a", lineHeight: 1.1 }}>
            {profile.display_name}
          </h1>
          <div className="brand-rule" />
          <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
            {new Date().toLocaleDateString("en-AU", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </motion.div>

        {!morningDone ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">

            {/* Sunlight */}
            <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-tea-green flex items-center justify-center flex-shrink-0">
                  <Sun className="w-4 h-4 text-pakistani-green" />
                </div>
                <div>
                  <h3 className="text-sm text-pakistani-green" style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}>Morning Sunlight</h3>
                  <p className="text-xs text-muted-foreground">Did you get 15+ minutes outside?</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSunlight(true)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    sunlight === true
                      ? "bg-tea-green text-pakistani-green border-2 border-pakistani-green"
                      : "bg-muted text-muted-foreground border-2 border-transparent"
                  }`}
                >☀️ Yes</button>
                <button
                  onClick={() => setSunlight(false)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    sunlight === false
                      ? "bg-misty-rose text-pakistani-green border-2 border-pakistani-green"
                      : "bg-muted text-muted-foreground border-2 border-transparent"
                  }`}
                >🌙 No</button>
              </div>
            </div>

            {/* Pain Scan — replaces temperature scan */}
            <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm text-pakistani-green" style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}>Morning Pain Scan</h3>
                  <p className="text-xs text-muted-foreground">Rate pain in each region (0 = none, 10 = severe)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-20 opacity-50">
                  <BodySvgFront regionData={{}} selectedRegion={null} onRegionTap={() => {}} />
                </div>
                <div className="flex-1 space-y-4">
                  {QUICK_SCAN_REGIONS.map((rid) => {
                    const region = FRONT_REGIONS.find((r) => r.id === rid);
                    if (!region) return null;
                    const val = painScans[rid] ?? 0;
                    const painLabel = val === 0 ? "None" : val <= 3 ? "Mild" : val <= 6 ? "Moderate" : "Severe";
                    const painColor = val === 0 ? "#aaa" : val <= 3 ? "#003300" : val <= 6 ? "#d97706" : "#FB4002";
                    return (
                      <div key={rid}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{region.label}</span>
                          <span className="text-xs font-semibold" style={{ color: painColor }}>
                            {val} — {painLabel}
                          </span>
                        </div>
                        <Slider
                          value={[val]}
                          onValueChange={([v]) => handlePainScan(rid, v)}
                          min={0} max={10} step={1}
                          className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                          <span>0</span><span>5</span><span>10</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button
                onClick={submitMorning}
                disabled={sunlight === null}
                className="mx-auto mt-4 h-10 text-sm text-white font-medium flex"
                style={{ backgroundColor: "#FB4002" }}
              >
                Complete Check-In <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <DailyBriefing
              habitLogs={habitLogs}
              bodyLogs={bodyLogs}
              checkIns={checkIns}
              activeHabits={activeHabits}
              todayCheckIn={todayCheckIn}
              profile={profile}
              sunlightLogged={todayCheckIn?.morning_sunlight}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
