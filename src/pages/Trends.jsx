import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import { format, parseISO, subDays } from "date-fns";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

const RANGE_OPTIONS = [
  { label: "2W", days: 14 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "All", days: 365 },
];

const QUALITY_COLORS = {
  "Cold": "#6366f1",
  "Woody": "#4f46e5",
  "Loose/Concertina": "#d97706",
  "Velvety": "#9333ea",
  "Healthy/Warm": "#16a34a",
  "Rough/Bumpy": "#b45309",
  "Spongy/Fluffy": "#0ea5e9",
  "Heavy": "#64748b",
  "Painful": "#dc2626",
  "Hard": "#ea580c",
  "Congested/Thick": "#be185d",
  "Nodules": "#7c3aed",
  "Fibrosis": "#1e3a5f",
};

const formatRegionLabel = (id) =>
  id?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || id;

export default function Trends() {
  const [bodyLogs, setBodyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rangeDays, setRangeDays] = useState(30);
  const [selectedRegion, setSelectedRegion] = useState("all");

  useEffect(() => {
    base44.entities.BodyRegionLog.list("-log_date", 500).then((logs) => {
      setBodyLogs(logs);
      setLoading(false);
    });
  }, []);

  const allRegions = [...new Set(bodyLogs.map((l) => l.region_id))].sort();
  const cutoff = subDays(new Date(), rangeDays);

  const filteredLogs = bodyLogs.filter((l) => {
    if (!l.log_date) return false;
    if (new Date(l.log_date) < cutoff) return false;
    if (selectedRegion !== "all" && l.region_id !== selectedRegion) return false;
    return true;
  });

  // --- Pain chart data: average pain per day ---
  const painChartData = (() => {
    const byDate = {};
    filteredLogs.forEach((l) => {
      const d = l.log_date.split("T")[0];
      if (!byDate[d]) byDate[d] = { total: 0, count: 0 };
      byDate[d].total += l.pain_score || 0;
      byDate[d].count += 1;
    });
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { total, count }]) => ({
        date,
        pain: parseFloat((total / count).toFixed(1)),
      }));
  })();

  // --- Tissue quality trend: count of each tag per week ---
  const qualityTrendData = (() => {
    // Bucket by ISO week (YYYY-Www)
    const byWeek = {};
    filteredLogs.forEach((l) => {
      const d = new Date(l.log_date);
      // Simple weekly bucket using Monday of that week
      const monday = new Date(d);
      monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      const week = monday.toISOString().split("T")[0];
      if (!byWeek[week]) byWeek[week] = {};
      [...(l.skin_quality || []), ...(l.fat_quality || [])].forEach((tag) => {
        byWeek[week][tag] = (byWeek[week][tag] || 0) + 1;
      });
    });
    return Object.entries(byWeek)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, tags]) => ({ week, ...tags }));
  })();

  const allTags = [...new Set(
    filteredLogs.flatMap((l) => [...(l.skin_quality || []), ...(l.fat_quality || [])])
  )];

  // --- Summary stats ---
  const half = Math.floor(painChartData.length / 2);
  const firstHalf = painChartData.slice(0, half);
  const secondHalf = painChartData.slice(half);
  const avg = (arr) => arr.length ? arr.reduce((s, d) => s + d.pain, 0) / arr.length : null;
  const firstAvg = avg(firstHalf);
  const secondAvg = avg(secondHalf);
  const diff = firstAvg && secondAvg ? (secondAvg - firstAvg).toFixed(1) : null;
  const overallAvg = avg(painChartData);

  const TrendIcon = diff === null ? Minus : parseFloat(diff) < 0 ? TrendingDown : parseFloat(diff) > 0 ? TrendingUp : Minus;
  const trendColor = diff === null ? "#aaa" : parseFloat(diff) < 0 ? "#003300" : "#FB4002";
  const trendLabel = diff === null ? "No trend yet"
    : parseFloat(diff) < 0 ? `↓ ${Math.abs(diff)} pts — improving`
    : parseFloat(diff) > 0 ? `↑ ${Math.abs(diff)} pts — worsening`
    : "Stable";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-muted rounded-full animate-spin" style={{ borderTopColor: "#FB4002" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-5 pt-10 pb-4">
        <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-0.5">
          Protocol Progress
        </p>
        <h1 className="text-4xl" style={{ fontFamily: "var(--font-display)", color: "#0a0a0a", lineHeight: 1.1 }}>
          Trends
        </h1>
        <div className="brand-rule" />
      </div>

      {/* Filters */}
      <div className="px-5 mb-4 flex gap-3 items-center">
        {/* Range selector */}
        <div className="flex bg-muted rounded-xl p-1 gap-1">
          {RANGE_OPTIONS.map(({ label, days }) => (
            <button
              key={days}
              onClick={() => setRangeDays(days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                rangeDays === days ? "bg-card shadow text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Region selector */}
        <div className="relative flex-1">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full appearance-none bg-card border border-border rounded-xl px-3 py-2 text-xs focus:outline-none"
            style={{ color: "#003300" }}
          >
            <option value="all">All Regions</option>
            {allRegions.map((r) => (
              <option key={r} value={r}>{formatRegionLabel(r)}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="px-5">
          <div className="bg-muted rounded-2xl p-8 text-center">
            <p className="text-2xl mb-2">📊</p>
            <p className="text-sm text-muted-foreground">No pain data logged yet for this period.<br />Use Record Pain to start building your trend.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="px-5 mb-4 grid grid-cols-3 gap-2"
          >
            <div className="bg-card rounded-xl p-3 border border-border">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Avg Pain</p>
              <p className="text-2xl font-bold leading-none" style={{ fontFamily: "var(--font-heading)", color: "#FB4002" }}>
                {overallAvg?.toFixed(1) ?? "—"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">out of 10</p>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Logs</p>
              <p className="text-2xl font-bold leading-none" style={{ fontFamily: "var(--font-heading)", color: "#0202FB" }}>
                {filteredLogs.length}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">readings</p>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border flex flex-col justify-between">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Trend</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendIcon className="w-4 h-4" style={{ color: trendColor }} />
                <p className="text-[10px] font-semibold leading-tight" style={{ color: trendColor }}>{trendLabel}</p>
              </div>
            </div>
          </motion.div>

          {/* Pain Score Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="px-5 mb-5"
          >
            <h2 className="text-base mb-2" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "#003300" }}>
              Pain Score Over Time
            </h2>
            <div className="bg-card rounded-2xl p-4 border border-border">
              {painChartData.length < 2 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Log pain in at least 2 sessions to see a chart.</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={painChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(d) => { try { return format(parseISO(d), "d MMM"); } catch { return d; } }}
                    />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} width={20} />
                    <Tooltip
                      formatter={(v) => [v, "Avg Pain"]}
                      labelFormatter={(d) => { try { return format(parseISO(d), "EEE d MMM yyyy"); } catch { return d; } }}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                    {overallAvg && (
                      <ReferenceLine y={overallAvg} stroke="#FB4002" strokeDasharray="4 4" strokeOpacity={0.5} />
                    )}
                    <Line
                      type="monotone"
                      dataKey="pain"
                      stroke="#FB4002"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#FB4002", strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
              {overallAvg && (
                <p className="text-[10px] text-muted-foreground text-center mt-1">
                  Dashed line = average ({overallAvg.toFixed(1)})
                </p>
              )}
            </div>
          </motion.div>

          {/* Tissue Quality Chart */}
          {allTags.length > 0 && qualityTrendData.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="px-5 mb-5"
            >
              <h2 className="text-base mb-2" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "#003300" }}>
                Tissue Quality Over Time
              </h2>
              <div className="bg-card rounded-2xl p-4 border border-border">
                <p className="text-[10px] text-muted-foreground mb-3">Tag frequency per week</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={qualityTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(d) => { try { return format(parseISO(d), "d MMM"); } catch { return d; } }}
                    />
                    <YAxis tick={{ fontSize: 10 }} width={20} allowDecimals={false} />
                    <Tooltip
                      labelFormatter={(d) => { try { return "Week of " + format(parseISO(d), "d MMM"); } catch { return d; } }}
                      contentStyle={{ fontSize: 11, borderRadius: 8 }}
                    />
                    {allTags.slice(0, 6).map((tag) => (
                      <Line
                        key={tag}
                        type="monotone"
                        dataKey={tag}
                        stroke={QUALITY_COLORS[tag] || "#888"}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {allTags.slice(0, 6).map((tag) => (
                    <div key={tag} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: QUALITY_COLORS[tag] || "#888" }} />
                      <span className="text-[10px] text-muted-foreground">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tissue quality tag summary */}
          {allTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="px-5 mb-8"
            >
              <h2 className="text-base mb-2" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "#003300" }}>
                Tissue Tag Summary
              </h2>
              <div className="bg-card rounded-2xl p-4 border border-border">
                <p className="text-[10px] text-muted-foreground mb-3">Most frequently logged in this period</p>
                <div className="space-y-2">
                  {allTags
                    .map((tag) => {
                      const count = filteredLogs.filter(
                        (l) => l.skin_quality?.includes(tag) || l.fat_quality?.includes(tag)
                      ).length;
                      return { tag, count };
                    })
                    .sort((a, b) => b.count - a.count)
                    .map(({ tag, count }) => {
                      const max = filteredLogs.length;
                      const pct = Math.round((count / max) * 100);
                      return (
                        <div key={tag}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="font-medium">{tag}</span>
                            <span className="text-muted-foreground">{count}×</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, backgroundColor: QUALITY_COLORS[tag] || "#888" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}