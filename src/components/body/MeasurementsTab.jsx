import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const MEASUREMENT_GROUPS = [
  {
    label: "Upper Thigh (widest)",
    fields: [
      { key: "upper_thigh_left", label: "Left" },
      { key: "upper_thigh_right", label: "Right" },
    ],
  },
  {
    label: "Above Knee (4cm above)",
    fields: [
      { key: "above_knee_left", label: "Left" },
      { key: "above_knee_right", label: "Right" },
    ],
  },
  {
    label: "Below Knee (4cm below)",
    fields: [
      { key: "below_knee_left", label: "Left" },
      { key: "below_knee_right", label: "Right" },
    ],
  },
  {
    label: "Ankle",
    fields: [
      { key: "ankle_left", label: "Left" },
      { key: "ankle_right", label: "Right" },
    ],
  },
  {
    label: "Upper Arm (widest)",
    fields: [
      { key: "upper_arm_left", label: "Left" },
      { key: "upper_arm_right", label: "Right" },
    ],
  },
  {
    label: "Hips",
    fields: [{ key: "hips", label: "Circumference" }],
  },
  {
    label: "Stomach (2cm below navel)",
    fields: [{ key: "stomach", label: "Circumference" }],
  },
];

export default function MeasurementsTab() {
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [existingId, setExistingId] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const logs = await base44.entities.MeasurementLog.list("-log_date", 30);
    setHistory(logs);
    const todayLog = logs.find((l) => l.log_date === today);
    if (todayLog) {
      setExistingId(todayLog.id);
      setForm(todayLog);
    }
  };

  const update = (key, value) => {
    setSaved(false);
    setForm((f) => ({ ...f, [key]: value === "" ? undefined : parseFloat(value) }));
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, log_date: today };
    if (existingId) {
      await base44.entities.MeasurementLog.update(existingId, data);
    } else {
      const created = await base44.entities.MeasurementLog.create(data);
      setExistingId(created.id);
    }
    setSaving(false);
    setSaved(true);
    loadData();
  };

  // Get last entry for comparison hint
  const prevLog = history.find((l) => l.log_date !== today);

  return (
    <div className="px-5 pb-10 space-y-4">
      <p className="text-xs text-muted-foreground">
        Enter circumference measurements in <strong>centimetres</strong>. You only need to fill in what you're tracking.
      </p>

      <div className="space-y-3">
        {MEASUREMENT_GROUPS.map((group) => (
          <div key={group.label} className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm font-semibold text-pakistani-green mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              {group.label}
            </p>
            <div className={`grid gap-3 ${group.fields.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {group.fields.map(({ key, label }) => {
                const prev = prevLog?.[key];
                const current = form[key];
                const diff = current !== undefined && prev !== undefined ? (current - prev).toFixed(1) : null;
                return (
                  <div key={key}>
                    <label className="text-xs text-muted-foreground block mb-1">{label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min="0"
                        placeholder="—"
                        value={form[key] ?? ""}
                        onChange={(e) => update(key, e.target.value)}
                        className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-dynamic-red"
                      />
                      <span className="text-xs text-muted-foreground w-6 flex-shrink-0">cm</span>
                    </div>
                    {diff !== null && (
                      <p className={`text-[10px] mt-0.5 ${parseFloat(diff) < 0 ? "text-pakistani-green" : parseFloat(diff) > 0 ? "text-dynamic-red" : "text-muted-foreground"}`}>
                        {parseFloat(diff) > 0 ? "+" : ""}{diff} vs last entry
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full h-12 text-white font-medium rounded-none"
        style={{ backgroundColor: saved ? "#888" : "#FB4002" }}
      >
        {saved ? "Saved ✓" : saving ? "Saving…" : "Save Measurements"}
      </Button>

      {/* History */}
      {history.length > 1 && (
        <div className="pt-2">
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground"
          >
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Past Entries ({history.filter((l) => l.log_date !== today).length})
          </button>

          {showHistory && (
            <div className="mt-3 space-y-3">
              {history
                .filter((l) => l.log_date !== today)
                .map((log) => (
                  <div key={log.id} className="bg-muted/50 rounded-xl p-4 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      {new Date(log.log_date + "T00:00:00").toLocaleDateString("en-AU", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {MEASUREMENT_GROUPS.flatMap((g) =>
                        g.fields.map(({ key, label }) =>
                          log[key] !== undefined ? (
                            <div key={key} className="flex justify-between">
                              <span className="text-[11px] text-muted-foreground">{g.label.split(" (")[0]} {label !== "Circumference" ? label : ""}</span>
                              <span className="text-[11px] font-medium">{log[key]} cm</span>
                            </div>
                          ) : null
                        )
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}