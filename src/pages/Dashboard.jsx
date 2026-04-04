import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, AlertTriangle, Trophy } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import InsightCard from "../components/dashboard/InsightCard";
import ExportModal from "../components/dashboard/ExportModal";

export default function Dashboard() {
  const [bodyLogs, setBodyLogs] = useState([]);
  const [habitLogs, setHabitLogs] = useState([]);
  const [medLogs, setMedLogs] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const [body, habits, meds, daily] = await Promise.all([
      base44.entities.BodyRegionLog.list("-log_date", 200),
      base44.entities.HabitLog.list("-log_date", 200),
      base44.entities.MedicationLog.list("-injection_date", 50),
      base44.entities.DailyCheckIn.list("-check_in_date", 100),
    ]);
    setBodyLogs(body);
    setHabitLogs(habits);
    setMedLogs(meds);
    setCheckIns(daily);
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