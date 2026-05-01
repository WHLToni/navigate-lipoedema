import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Check, Plus, ChevronDown } from "lucide-react";
import HabitWhyTooltip from "../components/habits/HabitWhyTooltip";
import { motion, AnimatePresence } from "framer-motion";
import HabitLibrarySheet from "../components/habits/HabitLibrarySheet";
import TriggerLogger from "../components/habits/TriggerLogger";

const TIME_SLOT_CONFIG = {
  morning: { label: "Morning", emoji: "☀️", bg: "bg-tea-green/40" },
  evening: { label: "Evening", emoji: "🌙", bg: "bg-shampoo/50" },
  anytime: { label: "Anytime", emoji: "🕐", bg: "bg-muted/50" },
};

const SLOT_ORDER = ["morning", "anytime", "evening"];

// Normalize old string-based habits to objects
const normalizeHabit = (h) =>
  typeof h === "string" ? { name: h, cadence: "daily", time_slot: "anytime" } : h;

export default function Habits() {
  const [profile, setProfile] = useState(null);
  const [todayLogs, setTodayLogs] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showTriggers, setShowTriggers] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const dayOfWeek = new Date().getDay(); // 0=Sun
  const hour = new Date().getHours();
  const isEvening = hour >= 17;

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const profiles = await base44.entities.UserProfile.filter({});
    if (profiles.length > 0) setProfile(profiles[0]);
    const logs = await base44.entities.HabitLog.filter({});
    setAllLogs(logs);
    setTodayLogs(logs.filter((l) => l.log_date?.startsWith(today)));
    setLoading(false);
  };

  const logHabit = async (habitName, status) => {
    const entry = { habit_name: habitName, category: "Protocol", status, log_date: new Date().toISOString() };
    await base44.entities.HabitLog.create(entry);
    setTodayLogs((prev) => [...prev, entry]);
    setAllLogs((prev) => [...prev, entry]);
  };

  const getDayOfExperiment = (habitName) => {
    const completed = allLogs.filter((l) => l.habit_name === habitName && l.status === "completed");
    const uniqueDays = new Set(completed.map((l) => l.log_date?.split("T")[0]));
    return Math.min(uniqueDays.size + 1, 30);
  };

  // For weekly habits: show as "due this week" if not completed this week
  const isCompletedThisWeek = (habitName) => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    const weekStart = startOfWeek.toISOString().split("T")[0];
    return allLogs.some(
      (l) => l.habit_name === habitName && l.status === "completed" && l.log_date?.split("T")[0] >= weekStart
    );
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

  const activeHabits = (profile?.active_habits || []).map(normalizeHabit);
  const loggedToday = todayLogs.map((l) => l.habit_name);

  // Group habits by time slot
  const grouped = SLOT_ORDER.reduce((acc, slot) => {
    acc[slot] = activeHabits.filter((h) => h.time_slot === slot);
    return acc;
  }, {});

  const completedCount = todayLogs.filter((l) => l.status === "completed").length;
  const skippedCount = todayLogs.filter((l) => l.status === "skipped").length;
  const remainingCount = activeHabits.filter((h) => {
    if (h.cadence === "weekly") return !isCompletedThisWeek(h.name);
    return !loggedToday.includes(h.name);
  }).length;

  return (
    <div className={`min-h-screen ${isEvening ? "bg-shampoo/20" : "bg-background"}`}>
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
            <Plus className="w-4 h-4 mr-1" /> Edit
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      {activeHabits.length > 0 && (
        <div className="px-5 mb-5">
          <div className="flex gap-3">
            <div className="flex-1 bg-tea-green/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-heading text-pakistani-green">{completedCount}</p>
              <p className="text-xs text-pakistani-green/70">Done</p>
            </div>
            <div className="flex-1 bg-muted rounded-xl p-3 text-center">
              <p className="text-2xl font-heading text-muted-foreground">{skippedCount}</p>
              <p className="text-xs text-muted-foreground">Skipped</p>
            </div>
            <div className="flex-1 bg-shampoo/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-heading text-pakistani-green">{remainingCount}</p>
              <p className="text-xs text-pakistani-green/70">Remaining</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {activeHabits.length === 0 && (
        <div className="px-5">
          <div className="bg-card rounded-2xl p-8 border border-border text-center">
            <p className="text-muted-foreground text-sm mb-3">No active habits yet. Build your protocol!</p>
            <Button onClick={() => setShowLibrary(true)} className="bg-electric-blue hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Browse Habit Library
            </Button>
          </div>
        </div>
      )}

      {/* Grouped Habit Sections */}
      {SLOT_ORDER.map((slot) => {
        const habits = grouped[slot];
        if (habits.length === 0) return null;
        const cfg = TIME_SLOT_CONFIG[slot];
        return (
          <div key={slot} className="px-5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{cfg.emoji}</span>
              <h2 className="font-heading text-base text-pakistani-green">{cfg.label}</h2>
            </div>
            <div className="space-y-3">
              {habits.map((habit, i) => {
                const isWeekly = habit.cadence === "weekly";
                const isDoneToday = loggedToday.includes(habit.name);
                const isDoneThisWeek = isWeekly && isCompletedThisWeek(habit.name);
                const logEntry = todayLogs.find((l) => l.habit_name === habit.name);
                const isCompleted = isWeekly ? isDoneThisWeek : (isDoneToday && logEntry?.status === "completed");
                const isSkipped = isDoneToday && logEntry?.status === "skipped";
                const day = getDayOfExperiment(habit.name);
                const pct = Math.round((day / 30) * 100);

                return (
                  <motion.div
                    key={habit.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`rounded-xl p-4 border shadow-sm transition-all ${cfg.bg} ${
                      isCompleted
                        ? "border-pakistani-green"
                        : isSkipped
                        ? "border-border opacity-60"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {isCompleted && (
                          <div className="w-6 h-6 rounded-full bg-pakistani-green flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className={`text-sm font-medium ${isSkipped ? "line-through text-muted-foreground" : ""}`}>
                            {habit.name}
                          </span>
                          <span className="ml-2 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                            {isWeekly ? "weekly" : "daily"}
                          </span>
                          {isWeekly && isDoneThisWeek && (
                            <span className="ml-1 text-[10px] text-pakistani-green font-medium">✓ done this week</span>
                          )}
                        </div>
                        <HabitWhyTooltip habitName={habit.name} />
                      </div>

                      {!isDoneToday && !(isWeekly && isDoneThisWeek) && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => logHabit(habit.name, "completed")}
                            className="px-3 py-1.5 rounded-full text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: '#0202FB' }}
                          >
                            Done ✓
                          </button>
                          <button
                            onClick={() => logHabit(habit.name, "skipped")}
                            className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border hover:opacity-80 transition-opacity"
                          >
                            Skip
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">30-day experiment</span>
                        <span className="font-medium" style={{ color: '#0202FB' }}>Day {day} of 30</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/60">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: '#0202FB' }} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Evening Trigger Logger */}
      {isEvening && activeHabits.length > 0 && (
        <div className="px-5 mt-2 mb-4">
          <Button
            variant="outline"
            onClick={() => setShowTriggers(true)}
            className="mx-auto h-12 border-2 border-pakistani-green text-pakistani-green rounded-full px-8 flex"
          >
            Log Today's Triggers <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Library */}
      {showLibrary && (
        <HabitLibrarySheet
          activeHabits={activeHabits}
          onSave={handleHabitsUpdate}
          onClose={() => setShowLibrary(false)}
        />
      )}

      <AnimatePresence>
        {showTriggers && <TriggerLogger onClose={() => setShowTriggers(false)} />}
      </AnimatePresence>
    </div>
  );
}