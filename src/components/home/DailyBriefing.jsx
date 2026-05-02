import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Minus, Moon, MapPin, ListChecks } from "lucide-react";
import { motion } from "framer-motion";

export default function DailyBriefing({ habitLogs, bodyLogs, checkIns, activeHabits, todayCheckIn, profile, sunlightLogged }) {
  const today = new Date().toISOString().split("T")[0];

  // --- Habit streak ---
  const streakDays = (() => {
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      const hasCompletion = habitLogs.some((l) => l.status === "completed" && l.log_date?.split("T")[0] === ds);
      if (hasCompletion) count++;
      else if (i > 0) break;
    }
    return count;
  })();

  // --- Today's habits ---
  const todayCompleted = habitLogs.filter((l) => l.status === "completed" && l.log_date?.split("T")[0] === today).length;
  const totalHabits = activeHabits.length;
  const habitPct = totalHabits > 0 ? Math.round((todayCompleted / totalHabits) * 100) : 0;

  // --- Pain trend ---
  const avgPain = (logs) => {
    if (!logs.length) return null;
    return (logs.reduce((s, l) => s + (l.pain_score || 0), 0) / logs.length).toFixed(1);
  };
  const last7 = new Date(); last7.setDate(last7.getDate() - 7);
  const prev7 = new Date(); prev7.setDate(prev7.getDate() - 14);
  const recentLogs = bodyLogs.filter((l) => new Date(l.log_date) >= last7);
  const olderLogs = bodyLogs.filter((l) => new Date(l.log_date) >= prev7 && new Date(l.log_date) < last7);
  const recentPain = avgPain(recentLogs);
  const olderPain = avgPain(olderLogs);
  const painDiff = recentPain && olderPain ? (parseFloat(recentPain) - parseFloat(olderPain)).toFixed(1) : null;
  const PainTrend = painDiff === null ? Minus : parseFloat(painDiff) < 0 ? TrendingDown : parseFloat(painDiff) > 0 ? TrendingUp : Minus;
  const painTrendColor = painDiff === null ? "#aaa" : parseFloat(painDiff) < 0 ? "#003300" : "#FB4002";

  // --- Top trigger ---
  const last7Date = new Date(); last7Date.setDate(last7Date.getDate() - 7);
  const recentCheckIns = checkIns.filter((c) => new Date(c.check_in_date) >= last7Date);
  const triggerCounts = {};
  recentCheckIns.forEach((c) => { (c.triggers || []).forEach((t) => { triggerCounts[t] = (triggerCounts[t] || 0) + 1; }); });
  const topTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-4">

      {/* ── 1. ACTION BUTTONS — most prominent, top of page ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Quick Actions</p>
        <div className="grid grid-cols-3 gap-2">
          {/* Morning done — static confirmation tile */}
          <div className="bg-tea-green rounded-xl p-3 flex flex-col justify-between min-h-[80px]">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-xs font-semibold text-pakistani-green leading-tight">Morning</p>
              <p className="text-[10px] text-pakistani-green/70">{sunlightLogged ? "☀️ Sunlight" : "🌙 No sun"}</p>
            </div>
          </div>

          <Link to="/habits" className="bg-shampoo rounded-xl p-3 flex flex-col justify-between min-h-[80px] transition-transform active:scale-95">
            <Moon className="w-4 h-4 text-pakistani-green" />
            <div>
              <p className="text-xs font-semibold text-pakistani-green leading-tight">Evening</p>
              <p className="text-[10px] text-pakistani-green/70">Log habits</p>
            </div>
          </Link>

          <Link to="/body-map" className="bg-misty-rose rounded-xl p-3 flex flex-col justify-between min-h-[80px] transition-transform active:scale-95">
            <MapPin className="w-4 h-4 text-dynamic-red" />
            <div>
              <p className="text-xs font-semibold text-pakistani-green leading-tight">Pain Map</p>
              <p className="text-[10px] text-muted-foreground">Record pain</p>
            </div>
          </Link>
        </div>

        {/* Habit progress bar — sits under action tiles, connects to Habits page */}
        {totalHabits > 0 && (
          <Link to="/habits" className="mt-2 bg-card rounded-xl px-3 py-2.5 border border-border flex items-center gap-3 transition-opacity hover:opacity-80">
            <ListChecks className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium">Today's Habits</span>
                <span className="text-xs font-semibold" style={{ color: "#FB4002" }}>{todayCompleted}/{totalHabits}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-none">
                <div className="h-1.5 rounded-none transition-all" style={{ width: `${habitPct}%`, backgroundColor: "#FB4002" }} />
              </div>
            </div>
          </Link>
        )}
      </motion.div>

      {/* ── 2. INSIGHTS — second priority ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">This Week</p>
        <div className="grid grid-cols-3 gap-2">

          {/* Streak */}
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Streak</p>
            <p className="text-xl font-bold mt-1 leading-none" style={{ color: "#003300", fontFamily: "var(--font-heading)" }}>
              {streakDays}<span className="text-xs font-normal text-muted-foreground ml-0.5">/7</span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">days active</p>
          </div>

          {/* Avg Pain */}
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Avg Pain</p>
            <div className="flex items-end gap-1 mt-1">
              <p className="text-xl font-bold leading-none" style={{ fontFamily: "var(--font-heading)", color: recentPain ? "#FB4002" : "#aaa" }}>
                {recentPain ?? "—"}
              </p>
              {painDiff !== null && (
                <PainTrend className="w-3 h-3 mb-0.5" style={{ color: painTrendColor }} />
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">vs prior week</p>
          </div>

          {/* Top trigger or sunlight */}
          {topTrigger ? (
            <div className="bg-misty-rose rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Top Trigger</p>
              <p className="text-xs font-semibold text-dynamic-red mt-1 leading-tight">{topTrigger[0]}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{topTrigger[1]}x logged</p>
            </div>
          ) : (
            <div className="bg-tea-green rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Sunlight</p>
              <p className="text-xl mt-1">{sunlightLogged ? "☀️" : "🌙"}</p>
              <p className="text-[10px] text-pakistani-green/70 mt-1">{sunlightLogged ? "Logged today" : "Not today"}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── 3. PROFILE — smallest, least prominent ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Your Profile</p>
        <div className="bg-card/60 rounded-xl px-3 py-2.5 border border-border/50">
          <div className="flex gap-4 flex-wrap">
            <ProfileItem label="Stage" value={profile.stage || "Not set"} />
            <ProfileItem label="Type" value={profile.type?.join(", ") || "Not set"} />
            <ProfileItem label="Life Stage" value={profile.life_stage || "Not set"} />
            <ProfileItem label="Active Habits" value={`${profile.active_habits?.length || 0}`} />
          </div>
        </div>
      </motion.div>

    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-xs font-semibold text-foreground">{value}</p>
    </div>
  );
}
