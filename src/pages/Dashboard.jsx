import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, AlertTriangle, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import InsightCard from "../components/dashboard/InsightCard";
import ExportModal from "../components/dashboard/ExportModal";

export default function Dashboard() {
  const [bodyLogs, setBodyLogs] = useState([]);
  const [habitLogs, setHabitLogs] = useState([]);
  const [medLogs, setMedLogs] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [deepRegion, setDeepRegion] = useState("all");
  const [deepView, setDeepView] = useState("chart");
  const [logExpanded, setLogExpanded] = useState(false);

  const QUALITY_BADGE_COLORS = {
    "Cold": "bg-blue-100 text-blue-700",
    "Woody": "bg-indigo-100 text-indigo-700",
    "Loose/Concertina": "bg-amber-100 text-amber-700",
    "Velvety": "bg-purple-100 text-purple-700",
    "Healthy/Warm": "bg-green-100 text-green-700",
    "Spongy/Fluffy": "bg-sky-100 text-sky-700",
    "Heavy": "bg-slate-100 text-slate-700",
    "Painful": "bg-red-100 text-red-700",
    "Hard": "bg-orange-100 text-orange-700",
    "Congested/Thick": "bg-rose-100 text-rose-700",
  };

  const allRegions = [...new Set(bodyLogs.map((l) => l.region_id))].sort();
  const formatRegionLabel = (id) => id?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || id;

  const deepFilteredLogs = deepRegion === "all" ? bodyLogs : bodyLogs.filter((l) => l.region_id === deepRegion);

  const deepChartData = (() => {
    const byDate = {};
    deepFilteredLogs.forEach((log) => {
      const date = log.log_date?.split("T")[0];
      if (!date) return;
      if (!byDate[date]) byDate[date] = { date, total: 0, count: 0 };
      byDate[date].total += log.pain_score || 0;
      byDate[date].count += 1;
    });
    return Object.values(byDate)
      .map((d) => ({ date: d.date, pain: parseFloat((d.total / d.count).toFixed(1)) }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);
  })();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const [body, habits, meds, daily, profiles] = await Promise.all([
      base44.entities.BodyRegionLog.list("-log_date", 200),
      base44.entities.HabitLog.list("-log_date", 500),
      base44.entities.MedicationLog.list("-injection_date", 50),
      base44.entities.DailyCheckIn.list("-check_in_date", 100),
      base44.entities.UserProfile.filter({}),
    ]);
    setBodyLogs(body);
    setHabitLogs(habits);
    setMedLogs(meds);
    setCheckIns(daily);
    setProfile(profiles[0] || null);
    setLoading(false);
  };

  // Calculate insights
  const daysOfData = new Set(habitLogs.map((l) => l.log_date?.split("T")[0])).size;
  const hasEnoughData = daysOfData >= 7;

  // Weekly wins
  const weeklyWins = [];
  if (hasEnoughData) {
    const completedCount = habitLogs.filter((l) => l.status === "completed").length;
    const totalCount = habitLogs.length;
    if (totalCount > 0 && completedCount / totalCount > 0.7) {
      weeklyWins.push({
        title: "Habit Champion",
        description: `You completed ${Math.round((completedCount / totalCount) * 100)}% of your habits this week!`,
        icon: "🏆",
      });
    }

    const sunlightDays = checkIns.filter(
      (c) => c.check_in_type === "morning" && c.morning_sunlight
    ).length;
    if (sunlightDays >= 5) {
      weeklyWins.push({
        title: "Sun Seeker",
        description: `${sunlightDays} days of morning sunlight this week.`,
        icon: "☀️",
      });
    }

    const healthyRegions = bodyLogs.filter((l) =>
      l.skin_quality?.includes("Healthy/Warm") || l.skin_quality?.includes("Velvety")
    ).length;
    if (healthyRegions > 0) {
      weeklyWins.push({
        title: "Tissue Remodeling",
        description: `${healthyRegions} healthy/warm tissue readings detected.`,
        icon: "🌸",
      });
    }
  }

  // Experiment Results
  const experimentResults = [];
  const activeHabits = profile?.active_habits || [];

  // Helper: parse systemic notes from DailyCheckIn
  const getSystemic = (checkIn) => {
    try { return JSON.parse(checkIn.notes || "{}"); } catch { return {}; }
  };

  activeHabits.forEach((habitName) => {
    const completed = habitLogs.filter(
      (l) => l.habit_name === habitName && l.status === "completed"
    );
    const uniqueDays = [...new Set(completed.map((l) => l.log_date?.split("T")[0]))].sort();
    if (uniqueDays.length < 14) return;

    const first7Days = new Set(uniqueDays.slice(0, 7));
    const last7Days = new Set(uniqueDays.slice(-7));

    const painOnFirst = bodyLogs.filter((l) => first7Days.has(l.log_date?.split("T")[0]));
    const painOnLast = bodyLogs.filter((l) => last7Days.has(l.log_date?.split("T")[0]));

    if (painOnFirst.length === 0 || painOnLast.length === 0) return;

    const avgFirst = painOnFirst.reduce((s, l) => s + (l.pain_score || 0), 0) / painOnFirst.length;
    const avgLast = painOnLast.reduce((s, l) => s + (l.pain_score || 0), 0) / painOnLast.length;
    const diff = avgFirst - avgLast;
    const pct = Math.round(Math.abs(diff / avgFirst) * 100);

    if (diff > 0.5) {
      experimentResults.push({
        title: "Experiment Results",
        description: `Your ${habitName} experiment is showing a ${pct}% reduction in pain!`,
        icon: "🧪",
        type: "win",
      });
    } else {
      experimentResults.push({
        title: "Experiment Results",
        description: `No significant change detected with ${habitName}. Consider if this protocol fits your lifestyle or try a new experiment.`,
        icon: "🧪",
        type: "neutral",
      });
    }

    // MCAS insight for Low Histamine Diet
    if (habitName === "Low Histamine Diet") {
      const mcasFirst = checkIns
        .filter((c) => first7Days.has(c.check_in_date))
        .reduce((s, c) => s + (c.triggers?.length || 0), 0);
      const mcasLast = checkIns
        .filter((c) => last7Days.has(c.check_in_date))
        .reduce((s, c) => s + (c.triggers?.length || 0), 0);
      if (mcasFirst > mcasLast && mcasFirst > 0) {
        const mcasPct = Math.round(((mcasFirst - mcasLast) / mcasFirst) * 100);
        experimentResults.push({
          title: "MCAS Response",
          description: `Low Histamine Diet correlates with a ${mcasPct}% decrease in MCAS symptom events over your protocol period.`,
          icon: "🌿",
          type: "win",
        });
      }
    }

    // Exhaustion insight
    const exhaustFirst = checkIns
      .filter((c) => first7Days.has(c.check_in_date))
      .map((c) => getSystemic(c).exhaustion)
      .filter(Boolean);
    const exhaustLast = checkIns
      .filter((c) => last7Days.has(c.check_in_date))
      .map((c) => getSystemic(c).exhaustion)
      .filter(Boolean);
    if (exhaustFirst.length > 0 && exhaustLast.length > 0) {
      const avgExFirst = exhaustFirst.reduce((a, b) => a + b, 0) / exhaustFirst.length;
      const avgExLast = exhaustLast.reduce((a, b) => a + b, 0) / exhaustLast.length;
      if (avgExFirst - avgExLast > 1) {
        experimentResults.push({
          title: "Energy Improvement",
          description: `Exhaustion scores dropped from ${avgExFirst.toFixed(1)} → ${avgExLast.toFixed(1)} while practising ${habitName}.`,
          icon: "⚡",
          type: "win",
        });
      }
    }
  });

  // Trigger alerts
  const triggerAlerts = [];
  if (hasEnoughData) {
    const eveningChecks = checkIns.filter((c) => c.check_in_type === "evening" && c.triggers?.length > 0);
    const triggerCounts = {};
    eveningChecks.forEach((c) => {
      c.triggers?.forEach((t) => {
        triggerCounts[t] = (triggerCounts[t] || 0) + 1;
      });
    });

    const highPainLogs = bodyLogs.filter((l) => l.pain_score >= 7);
    Object.entries(triggerCounts)
      .filter(([_, count]) => count >= 2)
      .slice(0, 3)
      .forEach(([trigger, count]) => {
        if (highPainLogs.length > 0) {
          triggerAlerts.push({
            title: trigger,
            description: `Logged ${count}x this week. Correlated with ${highPainLogs.length} high pain readings.`,
            icon: "⚡",
          });
        }
      });
  }

  // Cycle-phase correlation insight
  const cycleInsight = (() => {
    const lutealMensesCheckins = checkIns.filter((c) => {
      const phase = (() => { try { return JSON.parse(c.notes || "{}").cyclePhase; } catch { return null; } })();
      return phase === "Luteal" || phase === "Menses";
    });
    if (lutealMensesCheckins.length < 2) return null;
    const painDates = new Set(lutealMensesCheckins.map((c) => c.check_in_date));
    const relevantPain = bodyLogs.filter((l) => painDates.has(l.log_date?.split("T")[0]));
    if (relevantPain.length === 0) return null;
    const avgPain = relevantPain.reduce((s, l) => s + (l.pain_score || 0), 0) / relevantPain.length;
    const overallAvg = bodyLogs.length > 0
      ? bodyLogs.reduce((s, l) => s + (l.pain_score || 0), 0) / bodyLogs.length
      : 0;
    if (avgPain - overallAvg > 1) {
      return {
        title: "Cycle-Linked Pain Pattern",
        description: `Your pain scores average ${avgPain.toFixed(1)} during Luteal/Menses phases vs ${overallAvg.toFixed(1)} overall. Consider extra support during these phases.`,
        icon: "🌙",
        type: "alert",
      };
    }
    return null;
  })();

  // Chart data
  const chartData = buildChartData(bodyLogs, medLogs);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-muted border-t-electric-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-5 pt-8 pb-4">
        <h1 className="font-heading text-2xl text-pakistani-green">Insights Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {hasEnoughData
            ? "Your personal Remodeling Code"
            : `${7 - daysOfData} more days of data needed for insights`}
        </p>
      </div>

      {!hasEnoughData && (
        <div className="px-5 mb-4">
          <div className="bg-muted rounded-2xl p-5 text-center">
            <div className="w-16 h-16 rounded-full bg-shampoo flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-pakistani-green" />
            </div>
            <h3 className="font-heading text-base text-pakistani-green">Building Your Baseline</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Keep logging daily. After 7 days, your personalised insights will appear here.
            </p>
            <div className="mt-3 bg-background rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-electric-blue rounded-full transition-all"
                style={{ width: `${(daysOfData / 7) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{daysOfData}/7 days</p>
          </div>
        </div>
      )}

      {/* Weekly Wins */}
      {weeklyWins.length > 0 && (
        <div className="px-5 mb-5">
          <h2 className="font-heading text-lg text-pakistani-green mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5" /> Weekly Wins
          </h2>
          <div className="space-y-3">
            {weeklyWins.map((win, i) => (
              <InsightCard key={i} type="win" {...win} delay={i * 0.1} />
            ))}
          </div>
        </div>
      )}

      {/* Experiment Results */}
      {experimentResults.length > 0 && (
        <div className="px-5 mb-5">
          <h2 className="font-heading text-lg text-pakistani-green mb-3 flex items-center gap-2">
            🧪 Experiment Results
          </h2>
          <div className="space-y-3">
            {experimentResults.map((result, i) => (
              <InsightCard key={i} type={result.type} {...result} delay={i * 0.1} />
            ))}
          </div>
        </div>
      )}

      {/* Trigger Alerts */}
      {triggerAlerts.length > 0 && (
        <div className="px-5 mb-5">
          <h2 className="font-heading text-lg text-pakistani-green mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-dynamic-red" /> Trigger Alerts
          </h2>
          <div className="space-y-3">
            {triggerAlerts.map((alert, i) => (
              <InsightCard key={i} type="alert" {...alert} delay={i * 0.1} />
            ))}
          </div>
        </div>
      )}

      {/* Cycle Insight */}
      {cycleInsight && (
        <div className="px-5 mb-5">
          <h2 className="font-heading text-lg text-pakistani-green mb-3 flex items-center gap-2">
            🌙 Cycle Awareness
          </h2>
          <InsightCard type="alert" {...cycleInsight} delay={0} />
        </div>
      )}

      {/* Progress Chart */}
      {chartData.length > 0 && (
        <div className="px-5 mb-5">
          <h2 className="font-heading text-lg text-pakistani-green mb-3">Progress Tracker</h2>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} domain={[0, 10]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgPain"
                  stroke="#0202FB"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Avg Pain"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="doseMg"
                  stroke="#000"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={{ r: 2 }}
                  name="GLP-1 mg"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-4 h-0.5 bg-electric-blue" />
                <span className="text-muted-foreground">Tissue Softness</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-0.5 bg-black border-dashed" />
                <span className="text-muted-foreground">GLP-1 Dose</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deep Dive Section */}
      <div className="px-5 mb-5">
        <h2 className="font-heading text-lg mb-3" style={{ color: '#003300' }}>Deep Dive</h2>

        {/* Controls */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <select
              value={deepRegion}
              onChange={(e) => setDeepRegion(e.target.value)}
              className="w-full appearance-none bg-card border border-border rounded-xl px-4 py-2.5 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-electric-blue"
              style={{ color: '#003300' }}
            >
              <option value="all">All Regions</option>
              {allRegions.map((r) => (
                <option key={r} value={r}>{formatRegionLabel(r)}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="flex bg-muted rounded-xl p-1 gap-1">
            <button
              onClick={() => setDeepView("chart")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${deepView === "chart" ? "bg-card shadow" : "text-muted-foreground"}`}
              style={deepView === "chart" ? { color: '#003300' } : {}}
            >Chart</button>
            <button
              onClick={() => setDeepView("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${deepView === "list" ? "bg-card shadow" : "text-muted-foreground"}`}
              style={deepView === "list" ? { color: '#003300' } : {}}
            >List</button>
          </div>
        </div>

        {/* Chart View */}
        {deepView === "chart" && (
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-xs text-muted-foreground mb-3">
              {deepRegion === "all" ? "Avg pain — all regions" : `${formatRegionLabel(deepRegion)} pain trend`} · last 30 days
            </p>
            {deepChartData.length < 2 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Not enough data points yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={deepChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => { try { return format(parseISO(d), "MMM d"); } catch { return d; } }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} width={24} />
                  <Tooltip formatter={(v) => [v, "Avg Pain"]} labelFormatter={(d) => { try { return format(parseISO(d), "MMM d, yyyy"); } catch { return d; } }} />
                  <Line type="monotone" dataKey="pain" stroke="#FB4002" strokeWidth={2} dot={{ r: 3, fill: "#FB4002" }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
            {deepRegion !== "all" && deepFilteredLogs.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">Recent skin quality tags</p>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(deepFilteredLogs.flatMap((l) => l.skin_quality || []))].map((q) => (
                    <span key={q} className={`px-2.5 py-1 rounded-full text-xs font-medium ${QUALITY_BADGE_COLORS[q] || "bg-muted text-muted-foreground"}`}>{q}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* List View — Full Symptom Log accordion */}
        {deepView === "list" && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => setLogExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold"
              style={{ color: '#003300' }}
            >
              Full Symptom Log ({deepFilteredLogs.length})
              {logExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {logExpanded && (
              <div className="divide-y divide-border">
                {deepFilteredLogs.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-muted-foreground text-center">No logs found.</p>
                ) : (
                  deepFilteredLogs.map((log) => (
                    <div key={log.id} className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="text-sm font-semibold">{formatRegionLabel(log.region_id)}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.log_date ? (() => { try { return format(parseISO(log.log_date), "EEE d MMM yyyy"); } catch { return log.log_date; } })() : "—"}
                          </p>
                        </div>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                          log.pain_score >= 7 ? "bg-red-100 text-dynamic-red" :
                          log.pain_score >= 4 ? "bg-amber-100 text-amber-700" :
                          "bg-tea-green text-pakistani-green"
                        }`}>{log.pain_score}</div>
                      </div>
                      {(log.skin_quality?.length > 0 || log.fat_quality?.length > 0) && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {(log.skin_quality || []).map((q) => (
                            <span key={q} className={`px-2 py-0.5 rounded-full text-xs ${QUALITY_BADGE_COLORS[q] || "bg-muted text-muted-foreground"}`}>{q}</span>
                          ))}
                          {(log.fat_quality || []).map((q) => (
                            <span key={q} className={`px-2 py-0.5 rounded-full text-xs ${QUALITY_BADGE_COLORS[q] || "bg-muted text-muted-foreground"}`}>{q}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Export Button */}
      <div className="px-5 pb-6">
        <Button
          onClick={() => setShowExport(true)}
          className="w-full h-14 bg-electric-blue hover:bg-blue-700 text-white rounded-xl font-heading text-base"
        >
          <FileText className="w-5 h-5 mr-2" />
          Export Medical Health Report (PDF)
        </Button>
      </div>

      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
    </div>
  );
}

function buildChartData(bodyLogs, medLogs) {
  const dateMap = {};

  bodyLogs.forEach((log) => {
    const date = log.log_date?.split("T")[0];
    if (!date) return;
    if (!dateMap[date]) dateMap[date] = { pains: [], doseMg: 0 };
    dateMap[date].pains.push(log.pain_score);
  });

  medLogs.forEach((log) => {
    const date = log.injection_date?.split("T")[0];
    if (!date) return;
    if (!dateMap[date]) dateMap[date] = { pains: [], doseMg: 0 };
    dateMap[date].doseMg += log.mg_dose;
  });

  return Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, data]) => ({
      date: new Date(date).toLocaleDateString("en-AU", { month: "short", day: "numeric" }),
      avgPain: data.pains.length
        ? Math.round((data.pains.reduce((a, b) => a + b, 0) / data.pains.length) * 10) / 10
        : null,
      doseMg: data.doseMg || null,
    }));
}