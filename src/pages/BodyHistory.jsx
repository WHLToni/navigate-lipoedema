import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, parseISO } from "date-fns";
import { ChevronDown } from "lucide-react";

const SKIN_QUALITY_COLORS = {
  "Cold": "#0202FB",
  "Woody": "#6366f1",
  "Loose/Concertina": "#f59e0b",
  "Velvety": "#a78bfa",
  "Healthy/Warm": "#16a34a",
};

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

export default function BodyHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [view, setView] = useState("chart"); // "chart" | "list"

  useEffect(() => {
    base44.entities.BodyRegionLog.list("-log_date", 200).then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  const allRegions = [...new Set(logs.map((l) => l.region_id))].sort();

  const filteredLogs = selectedRegion === "all"
    ? logs
    : logs.filter((l) => l.region_id === selectedRegion);

  // Build chart data: group by date, average pain per day
  const chartData = (() => {
    const byDate = {};
    filteredLogs.forEach((log) => {
      const date = log.log_date ? log.log_date.split("T")[0] : null;
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

  const formatRegionLabel = (id) =>
    id?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || id;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-muted border-t-electric-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-8 pb-4">
        <h1 className="font-heading text-2xl text-pakistani-green">Body Region History</h1>
        <p className="text-sm text-muted-foreground mt-1">Pain scores & skin quality over time</p>
      </div>

      {/* Controls */}
      <div className="px-5 flex gap-3 mb-5">
        {/* Region selector */}
        <div className="relative flex-1">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full appearance-none bg-card border border-border rounded-xl px-4 py-2.5 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-electric-blue"
          >
            <option value="all">All Regions</option>
            {allRegions.map((r) => (
              <option key={r} value={r}>{formatRegionLabel(r)}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* View toggle */}
        <div className="flex bg-muted rounded-xl p-1 gap-1">
          <button
            onClick={() => setView("chart")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === "chart" ? "bg-card shadow text-pakistani-green" : "text-muted-foreground"}`}
          >
            Chart
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === "list" ? "bg-card shadow text-pakistani-green" : "text-muted-foreground"}`}
          >
            List
          </button>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="px-5">
          <div className="bg-card rounded-2xl border border-border p-10 text-center">
            <p className="text-muted-foreground text-sm">No body region logs yet. Tap a region on the Body Map to start tracking.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Chart View */}
          {view === "chart" && (
            <div className="px-5 mb-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-3">
                  Avg pain score — last 30 days {selectedRegion !== "all" && `· ${formatRegionLabel(selectedRegion)}`}
                </p>
                {chartData.length < 2 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">Not enough data points to draw a chart yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(d) => format(parseISO(d), "MMM d")}
                      />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} width={24} />
                      <Tooltip
                        formatter={(v) => [v, "Avg Pain"]}
                        labelFormatter={(d) => format(parseISO(d), "MMM d, yyyy")}
                      />
                      <Line
                        type="monotone"
                        dataKey="pain"
                        stroke="#FB4002"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#FB4002" }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Skin quality breakdown */}
              {selectedRegion !== "all" && filteredLogs.length > 0 && (
                <div className="mt-4 bg-card border border-border rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground mb-3">Recent skin quality tags</p>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(filteredLogs.flatMap((l) => l.skin_quality || []))].map((q) => (
                      <span key={q} className={`px-2.5 py-1 rounded-full text-xs font-medium ${QUALITY_BADGE_COLORS[q] || "bg-muted text-muted-foreground"}`}>
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* List View */}
          {view === "list" && (
            <div className="px-5 space-y-3">
              {filteredLogs.map((log) => (
                <div key={log.id} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{formatRegionLabel(log.region_id)}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.log_date ? format(parseISO(log.log_date), "EEE d MMM yyyy, h:mm a") : "—"}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      log.pain_score >= 7 ? "bg-red-100 text-dynamic-red" :
                      log.pain_score >= 4 ? "bg-amber-100 text-amber-700" :
                      "bg-tea-green text-pakistani-green"
                    }`}>
                      {log.pain_score}
                    </div>
                  </div>
                  {(log.skin_quality?.length > 0 || log.fat_quality?.length > 0) && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(log.skin_quality || []).map((q) => (
                        <span key={q} className={`px-2 py-0.5 rounded-full text-xs ${QUALITY_BADGE_COLORS[q] || "bg-muted text-muted-foreground"}`}>{q}</span>
                      ))}
                      {(log.fat_quality || []).map((q) => (
                        <span key={q} className={`px-2 py-0.5 rounded-full text-xs ${QUALITY_BADGE_COLORS[q] || "bg-muted text-muted-foreground"}`}>{q}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}