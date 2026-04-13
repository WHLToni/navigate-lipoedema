import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Check, X, Dumbbell, Salad, Sun, FlaskConical, Plus, ChevronDown } from "lucide-react";
import HabitWhyTooltip from "../components/habits/HabitWhyTooltip";
import { motion, AnimatePresence } from "framer-motion";
import HabitLibrarySheet from "../components/habits/HabitLibrarySheet";
import TriggerLogger from "../components/habits/TriggerLogger";

const CATEGORY_ICONS = {
  "Physical Therapies": Dumbbell,
  Metabolic: Salad,
  "Circadian / Environmental": Sun,
  Supplements: FlaskConical,
};

export default function Habits() {
  const [profile, setProfile] = useState(null);
  const [todayLogs, setTodayLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showTriggers, setShowTriggers] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const hour = new Date().getHours();
  const isEvening = hour >= 17;

  const [allLogs, setAllLogs] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const profiles = await base44.entities.UserProfile.filter({});
    if (profiles.length > 0) {
      setProfile(profiles[0]);
    }
    const logs = await base44.entities.HabitLog.filter({});
    setAllLogs(logs);
    const todayOnly = logs.filter((l) => l.log_date?.startsWith(today));
    setTodayLogs(todayOnly);
    setLoading(false);
  };

  const logHabit = async (habitName, category, status) => {
    const entry = { habit_name: habitName, category, status, log_date: new Date().toISOString() };
    await base44.entities.HabitLog.create(entry);
    setTodayLogs((prev) => [...prev, entry]);
    setAllLogs((prev) => [...prev, entry]);
  };

  const getDayOfExperiment = (habitName) => {
    const completed = allLogs.filter(
      (l) => l.habit_name === habitName && l.status === "completed"
    );
    const uniqueDays = new Set(completed.map((l) => l.log_date?.split("T")[0]));
    return Math.min(uniqueDays.size + 1, 30);
  };

  const handleHabitsUpdate = async (newHabits) => {
    if (profile) {
      await base44.entities.UserProfile.update(profile.id, { active_habits: newHabits });
      setProfile((prev) => ({ ...prev, active_habits: newHabits }));
    }
    setShowLibrary(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-muted border-t-electric-blue rounded-full animate-spin" />
      </div>
    );
  }

  const activeHabits = profile?.active_habits || [];
  const loggedHabits = todayLogs.map((l) => l.habit_name);

  // Calculate day-of-30 for each habit based on all-time logs
  const getHabitDay = async () => {}; // placeholder — we use allLogs for streak

  const getStreakDay = (habitName) => {
    // Count distinct days this habit was completed (not skipped)
    // Use todayLogs as a proxy; for full streak we'd need all logs
    // For now, show a deterministic value based on log count
    return 1; // Will be enriched when allLogs loaded
  };

  return (
    <div className={`min-h-screen ${isEvening ? "bg-shampoo" : "bg-background"}`}>
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl text-pakistani-green">Daily Habits</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isEvening ? "Evening Reflection" : "Today's Protocol"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLibrary(true)}
            className="border-pakistani-green text-pakistani-green"
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Active Habits */}
      <div className="px-5 space-y-3">
        {activeHabits.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 border border-border text-center">
            <p className="text-muted-foreground text-sm mb-3">
              No active habits yet. Build your protocol!
            </p>
            <Button
              onClick={() => setShowLibrary(true)}
              className="bg-electric-blue hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> Browse Habit Library
            </Button>
          </div>
        ) : (
          <>

          {activeHabits.map((habit, i) => {
            const isLogged = loggedHabits.includes(habit);
            const logEntry = todayLogs.find((l) => l.habit_name === habit);
            return (
              <motion.div
                key={habit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-card rounded-xl p-4 border shadow-sm transition-all ${
                  isLogged
                    ? logEntry?.status === "completed"
                      ? "border-pakistani-green bg-tea-green/30"
                      : "border-border opacity-60"
                    : "border-border"
                }`}
              >
                {/* Habit header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isLogged && logEntry?.status === "completed" && (
                      <div className="w-6 h-6 rounded-full bg-pakistani-green flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className={`text-sm font-medium truncate ${isLogged && logEntry?.status === "skipped" ? "line-through text-muted-foreground" : ""}`}>
                      {habit}
                    </span>
                    <HabitWhyTooltip habitName={habit} />
                  </div>

                  {!isLogged && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => logHabit(habit, "Mechanical", "completed")}
                        className="px-3 py-1.5 rounded-full text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#0202FB' }}
                      >
                        Done ✓
                      </button>
                      <button
                        onClick={() => logHabit(habit, "Mechanical", "skipped")}
                        className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border hover:opacity-80 transition-opacity"
                      >
                        Skip
                      </button>
                    </div>
                  )}
                </div>

                {/* Progress bar — Day X of 30 */}
                {(() => {
                  const day = getDayOfExperiment(habit);
                  const pct = Math.round((day / 30) * 100);
                  return (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">30-day experiment</span>
                        <span className="font-medium" style={{ color: '#0202FB' }}>Day {day} of 30</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ backgroundColor: '#CCFFCC' }}>
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: '#0202FB' }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            );
          })}
          </>
        )}
      </div>

      {/* Evening Trigger Logger */}
      {isEvening && activeHabits.length > 0 && (
        <div className="px-5 mt-6">
          <Button
            variant="outline"
            onClick={() => setShowTriggers(true)}
            className="mx-auto h-12 border-2 border-pakistani-green text-pakistani-green rounded-full px-8 flex"
          >
            Log Today's Triggers <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="px-5 mt-6 mb-4">
        <div className="flex gap-3">
          <div className="flex-1 bg-tea-green/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-heading text-pakistani-green">
              {todayLogs.filter((l) => l.status === "completed").length}
            </p>
            <p className="text-xs text-pakistani-green/70">Completed</p>
          </div>
          <div className="flex-1 bg-muted rounded-xl p-3 text-center">
            <p className="text-2xl font-heading text-muted-foreground">
              {todayLogs.filter((l) => l.status === "skipped").length}
            </p>
            <p className="text-xs text-muted-foreground">Skipped</p>
          </div>
          <div className="flex-1 bg-shampoo/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-heading text-pakistani-green">
              {activeHabits.length - loggedHabits.length}
            </p>
            <p className="text-xs text-pakistani-green/70">Remaining</p>
          </div>
        </div>
      </div>

      {/* Library Sheet */}
      <AnimatePresence>
        {showLibrary && (
          <HabitLibrarySheet
            activeHabits={activeHabits}
            onSave={handleHabitsUpdate}
            onClose={() => setShowLibrary(false)}
          />
        )}
      </AnimatePresence>

      {/* Trigger Logger */}
      <AnimatePresence>
        {showTriggers && (
          <TriggerLogger onClose={() => setShowTriggers(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}