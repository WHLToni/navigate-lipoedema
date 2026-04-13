import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Sun, Moon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import OnboardingWizard from "../components/onboarding/OnboardingWizard";
import BodySvgFront from "../components/body/BodySvgFront";
import { FRONT_REGIONS } from "../components/body/BodySvgFront";
import { motion } from "framer-motion";

const QUICK_SCAN_REGIONS = ["left-upper-thigh", "right-upper-thigh", "left-inner-thigh", "right-inner-thigh", "abdomen"];

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [morningDone, setMorningDone] = useState(false);
  const [sunlight, setSunlight] = useState(null);
  const [quickScans, setQuickScans] = useState({});
  const [todayCheckIn, setTodayCheckIn] = useState(null);

  const hour = new Date().getHours();
  const isMorning = hour < 14;
  const isEvening = hour >= 17;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const profiles = await base44.entities.UserProfile.filter({});
    if (profiles.length > 0) {
      setProfile(profiles[0]);
      const today = new Date().toISOString().split("T")[0];
      const checkIns = await base44.entities.DailyCheckIn.filter({ check_in_date: today });
      const morningCI = checkIns.find((c) => c.check_in_type === "morning");
      if (morningCI) {
        setTodayCheckIn(morningCI);
        setMorningDone(true);
      }
    }
    setLoading(false);
  };

  const handleSunlight = async (value) => {
    setSunlight(value);
  };

  const handleQuickScan = (regionId, value) => {
    setQuickScans((prev) => ({ ...prev, [regionId]: value }));
  };

  const submitMorning = async () => {
    const today = new Date().toISOString().split("T")[0];
    const scanRegions = Object.entries(quickScans).map(([region_id, temperature]) => ({
      region_id,
      temperature,
    }));

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
        <div className="w-8 h-8 border-4 border-muted border-t-electric-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <OnboardingWizard onComplete={loadData} />;
  }

  return (
    <div className={`min-h-screen ${isMorning ? "bg-tea-green" : isEvening ? "bg-shampoo" : "bg-background"}`}>
      <div className="px-5 pt-8 pb-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <p className="text-sm text-muted-foreground font-body">
            {isMorning ? "Good Morning" : isEvening ? "Good Evening" : "Good Afternoon"}
          </p>
          <h1 className="font-heading text-3xl text-pakistani-green mt-1">
            {profile.display_name}
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-body">
            {new Date().toLocaleDateString("en-AU", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.div>

        {/* Morning Check-In */}
        {!morningDone ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-5"
          >
            {/* Sunlight Question */}
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-tea-green flex items-center justify-center">
                  <Sun className="w-5 h-5 text-pakistani-green" />
                </div>
                <div>
                  <h3 className="font-heading text-base text-pakistani-green">Morning Sunlight</h3>
                  <p className="text-xs text-muted-foreground">Did you get 15+ minutes?</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSunlight(true)}
                  className={`flex-1 py-4 rounded-2xl text-lg font-heading transition-all ${
                    sunlight === true
                      ? "bg-tea-green text-pakistani-green border-2 border-pakistani-green scale-105"
                      : "bg-muted text-muted-foreground border-2 border-transparent"
                  }`}
                >
                  ☀️ Yes
                </button>
                <button
                  onClick={() => handleSunlight(false)}
                  className={`flex-1 py-4 rounded-2xl text-lg font-heading transition-all ${
                    sunlight === false
                      ? "bg-misty-rose text-pakistani-green border-2 border-pakistani-green scale-105"
                      : "bg-muted text-muted-foreground border-2 border-transparent"
                  }`}
                >
                  🌙 No
                </button>
              </div>
            </div>

            {/* Quick Tissue Scan */}
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <h3 className="font-heading text-base text-pakistani-green mb-1">
                Quick Tissue Scan
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Slide each region: Cold ← → Warm
              </p>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-32 opacity-60">
                  <BodySvgFront
                    regionData={{}}
                    selectedRegion={null}
                    onRegionTap={() => {}}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  {QUICK_SCAN_REGIONS.map((rid) => {
                    const region = FRONT_REGIONS.find((r) => r.id === rid);
                    if (!region) return null;
                    const val = quickScans[rid] || 5;
                    return (
                      <div key={rid}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium truncate">{region.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {val <= 3 ? "Cold" : val >= 7 ? "Warm" : "Neutral"}
                          </span>
                        </div>
                        <Slider
                          value={[val]}
                          onValueChange={([v]) => handleQuickScan(rid, v)}
                          min={1}
                          max={10}
                          step={1}
                          className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={submitMorning}
                disabled={sunlight === null}
                className="mx-auto mt-5 h-12 bg-electric-blue hover:bg-blue-700 text-white font-medium flex"
              >
                Complete Morning Check-In <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* Completed Card */}
            <div className="bg-tea-green rounded-2xl p-6 border-2 border-pakistani-green">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <Sun className="w-6 h-6 text-pakistani-green" />
                </div>
                <div>
                  <h3 className="font-heading text-lg text-pakistani-green">
                    Morning Check-In Done ✓
                  </h3>
                  <p className="text-xs text-pakistani-green/70">
                    {todayCheckIn?.morning_sunlight ? "☀️ Sunlight logged" : "🌙 No sunlight today"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <QuickActionCard
                icon={<Moon className="w-5 h-5" />}
                label="Evening Reflection"
                bgColor="bg-shampoo"
                href="/habits"
              />
              <QuickActionCard
                icon="🗺️"
                label="Pain Map"
                bgColor="bg-blue-50"
                href="/body-map"
              />
            </div>

            {/* Profile Summary */}
            <div className="bg-card rounded-2xl p-5 border border-border">
              <h3 className="font-heading text-base text-pakistani-green mb-3">Your Profile</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <ProfileItem label="Stage" value={profile.stage || "Not set"} />
                <ProfileItem label="Type" value={profile.type || "Not set"} />
                <ProfileItem label="Life Stage" value={profile.life_stage || "Not set"} />
                <ProfileItem
                  label="Active Habits"
                  value={`${profile.active_habits?.length || 0} habits`}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function QuickActionCard({ icon, label, bgColor, href }) {
  return (
    <a
      href={href}
      className={`${bgColor} rounded-2xl p-4 flex flex-col items-center gap-2 transition-transform hover:scale-105`}
    >
      <span className="text-2xl">{typeof icon === "string" ? icon : icon}</span>
      <span className="text-xs font-medium text-pakistani-green">{label}</span>
    </a>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-sm">{value}</p>
    </div>
  );
}