import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Minus, Moon, MapPin, Sun } from "lucide-react";
import { motion } from "framer-motion";

function StatCard({ label, value, sub, color = "#0a0a0a", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-xl p-3 border border-border"
    >
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold leading-none" style={{ color, fontFamily: "var(--font-heading)" }}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>}
    </motion.div>
  );
}

export default function DailyBriefing({ habitLogs, bodyLogs, checkIns, activeHabits, todayCheckIn, profile }) {
  const today = new Date().toISOString().split("T")[0];

  // --- 7-day habit streak ---
  const streakDays = (() => {
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      const hasCompletion = habitLogs.some(
        (l) => l.status === "completed" && l.log_date?.split("T")[0] === ds
      );
      if (hasCompletion) count++;
      else if (i > 0) break; // only count consecutive from today backwards
    }
    return count;
  })();

  // --- Today's habit progress ---
  const todayCompleted = habitLogs.filter(
    (l) => l.status === "completed" && l.log_date?.split("T")[0] === today
  ).length;
  const totalHabits = activeHabits.length;

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
  const painTrendColor = painDiff === null ? "#aaa" : parseFloat(painDiff) < 0 ? "#003300" : parseFloat(painDiff) > 0 ? "#FB4002" : "#aaa";

  // --- Top trigger ---
  const last7Date = new Date(); last7Date.setDate(last7Date.getDate() - 7);
  const recentCheckIns = checkIns.filter((c) => new Date(c.check_in_date) >= last7Date);
  const triggerCounts = {};
  recentCheckIns.forEach((c) => {
    (c.triggers || []).forEach((t) => { triggerCounts[t] = (triggerCounts[t] || 0) + 1; });
  });
  const topTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-3">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard
          label="Habit Streak"
          value={`${streakDays}/7`}
          sub="days this week"
          color="#003300"
          delay={0}
        />
        <StatCard
          label="Today's Habits"
          value={totalHabits > 0 ? `${todayCompleted}/${totalHabits}` : "—"}
          sub={totalHabits > 0 ? `${Math.round((todayCompleted / totalHabits) * 100)}% done` : "No habits set"}
          color="#FB4002"
          delay={0.05}
        />
        <div
          className="bg-card rounded-xl p-3 border border-border flex flex-col justify-between"
        >
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Avg Pain</p>
          <div className="flex items-end gap-1 mt-1">
            <p className="text-2xl font-bold leading-none" style={{ fontFamily: "var(--font-heading)", color: recentPain ? "#FB4002" : "#aaa" }}>
              {recentPain ?? "—"}
            </p>
            {painDiff !== null && (
              <div className="flex items-center mb-0.5">
                <PainTrend className="w-3.5 h-3.5" style={{ color: painTrendColor }} />
                <span className="text-[10px] ml-0.5" style={{ color: painTrendColor }}>
                  {Math.abs(painDiff)}
                </span>
              </div>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">vs prior week</p>
        </div>
      </div>

      {/* Top Trigger */}
      {topTrigger && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-misty-rose rounded-xl p-3 border border-border flex items-center gap-3"
        >
          <span className="text-xl">⚡</span>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Top Trigger This Week</p>
            <p className="text-sm font-semibold text-dynamic-red">{topTrigger[0]}</p>
            <p className="text-[10px] text-muted-foreground">Logged {topTrigger[1]}x in last 7 days</p>
          </div>
        </motion.div>
      )}

      {/* Profile + Nav layout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-2"
      >
        {/* Profile — 2 cols */}
        <div className="col-span-2 bg-card rounded-xl p-3 border border-border">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Your Profile</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <ProfileItem label="Stage" value={profile.stage || "Not set"} />
            <ProfileItem label="Life Stage" value={profile.life_stage || "Not set"} />
            <ProfileItem label="Type" value={profile.type?.join(", ") || "Not set"} />
            <ProfileItem label="Habits" value={`${profile.active_habits?.length || 0} active`} />
          </div>
        </div>

        {/* Nav stack — 1 col */}
        <div className="col-span-1 flex flex-col gap-2">
          <NavTile icon={<Sun className="w-3.5 h-3.5" />} label="Check-In" bg="bg-tea-green" href="/habits" />
          <NavTile icon={<Moon className="w-3.5 h-3.5" />} label="Evening" bg="bg-shampoo" href="/habits" />
          <NavTile icon={<MapPin className="w-3.5 h-3.5" />} label="Pain Map" bg="bg-misty-rose" href="/body-map" />
        </div>
      </motion.div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-xs font-semibold text-foreground truncate">{value}</p>
    </div>
  );
}

function NavTile({ icon, label, bg, href }) {
  return (
    <Link
      to={href}
      className={`${bg} rounded-lg p-2 flex items-center gap-1.5 flex-1 transition-transform hover:scale-105`}
    >
      <span className="text-pakistani-green">{icon}</span>
      <span className="text-[11px] font-medium text-pakistani-green leading-tight">{label}</span>
    </Link>
  );
}