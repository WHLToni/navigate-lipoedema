import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronDown, ChevronUp, Pencil, Check, X, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import InjectionSiteSelector from "./InjectionSiteSelector";

export default function MedicationHistory({ logs, onReload }) {
  const [sortField, setSortField] = useState("injection_date");
  const [sortDir, setSortDir] = useState(-1);
  const [expanded, setExpanded] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const sorted = [...logs].sort((a, b) => {
    if (sortField === "injection_date") {
      return sortDir * (new Date(b.injection_date) - new Date(a.injection_date));
    }
    return sortDir * ((a[sortField] || 0) - (b[sortField] || 0));
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => d * -1);
    } else {
      setSortField(field);
      setSortDir(-1);
    }
  };

  const startEdit = (log) => {
    setEditingId(log.id);
    setEditData({
      injection_date: new Date(log.injection_date).toISOString().slice(0, 16),
      clicks: log.clicks,
      injection_site: log.injection_site,
      notes: log.notes || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (log) => {
    const clicks = Number(editData.clicks);
    await base44.entities.MedicationLog.update(log.id, {
      injection_date: new Date(editData.injection_date).toISOString(),
      clicks,
      mg_dose: clicks * 0.25,
      injection_site: editData.injection_site,
      notes: editData.notes || undefined,
    });
    setEditingId(null);
    onReload?.();
  };

  const deleteLog = async (id) => {
    if (!confirm("Delete this injection entry?")) return;
    await base44.entities.MedicationLog.delete(id);
    onReload?.();
  };

  if (logs.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden mb-4">
      <button
        className="w-full px-4 py-3 flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-heading text-base text-pakistani-green">Injection History</h3>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {expanded && (
        <div className="divide-y divide-border">
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 px-4 py-2 bg-muted/50 text-xs text-muted-foreground">
            <button className="text-left hover:text-foreground" onClick={() => toggleSort("injection_date")}>
              Date {sortField === "injection_date" && (sortDir > 0 ? "↑" : "↓")}
            </button>
            <button className="text-left hover:text-foreground" onClick={() => toggleSort("clicks")}>
              Clicks {sortField === "clicks" && (sortDir > 0 ? "↑" : "↓")}
            </button>
            <span>mg</span>
            <span>Site</span>
            <span />
          </div>

          {sorted.map((log) =>
            editingId === log.id ? (
              /* Edit row */
              <div key={log.id} className="px-4 py-3 space-y-3 bg-tea-green/10">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Date & Time</label>
                    <Input
                      type="datetime-local"
                      value={editData.injection_date}
                      onChange={(e) => setEditData((p) => ({ ...p, injection_date: e.target.value }))}
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Clicks</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="number"
                        value={editData.clicks}
                        onChange={(e) => setEditData((p) => ({ ...p, clicks: e.target.value }))}
                        className="text-xs"
                      />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        = {(Number(editData.clicks) * 0.25).toFixed(2)}mg
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Notes</label>
                  <Input
                    placeholder="Notes..."
                    value={editData.notes}
                    onChange={(e) => setEditData((p) => ({ ...p, notes: e.target.value }))}
                    className="mt-1 text-xs"
                  />
                </div>
                <InjectionSiteSelector
                  value={editData.injection_site}
                  onChange={(site) => setEditData((p) => ({ ...p, injection_site: site }))}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-muted"
                  >
                    <X className="w-3 h-3" /> Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(log)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-pakistani-green text-white hover:opacity-90"
                  >
                    <Check className="w-3 h-3" /> Save
                  </button>
                </div>
              </div>
            ) : (
              /* Display row */
              <div key={log.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center px-4 py-2.5 text-xs">
                <span>
                  {new Date(log.injection_date).toLocaleDateString("en-AU", { month: "short", day: "numeric" })}
                </span>
                <span className="font-medium">{log.clicks}</span>
                <span>{log.mg_dose}mg</span>
                <span>{log.injection_site}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(log)}
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteLog(log.id)}
                    className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-dynamic-red"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}