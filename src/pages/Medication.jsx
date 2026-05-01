import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, AlertTriangle, Syringe, Calendar, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MedicationHistory from "../components/medication/MedicationHistory";
import InjectionSiteSelector from "../components/medication/InjectionSiteSelector";

export default function Medication() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clicks: "",
    injection_site: "",
    sterility_confirmed: false,
    injection_date: new Date().toISOString().slice(0, 16),
    notes: "",
  });

  useEffect(() => { loadLogs(); }, []);

  const loadLogs = async () => {
    const allLogs = await base44.entities.MedicationLog.list("-injection_date", 50);
    setLogs(allLogs);
    setLoading(false);
  };

  const lastDose = logs[0];
  const daysSinceLastDose = lastDose
    ? Math.floor((Date.now() - new Date(lastDose.injection_date).getTime()) / 86400000)
    : null;
  const nextDoseDate = lastDose
    ? new Date(new Date(lastDose.injection_date).getTime() + 7 * 86400000)
    : null;
  const isHalfLifeWindow = daysSinceLastDose !== null && (daysSinceLastDose === 6 || daysSinceLastDose === 7);
  const mgDose = formData.clicks ? Number(formData.clicks) * 0.25 : 0;
  const canLog = formData.clicks && formData.injection_site && formData.sterility_confirmed;

  const handleLog = async () => {
    await base44.entities.MedicationLog.create({
      injection_date: new Date(formData.injection_date).toISOString(),
      clicks: Number(formData.clicks),
      mg_dose: mgDose,
      injection_site: formData.injection_site,
      sterility_confirmed: true,
      notes: formData.notes || undefined,
    });
    setFormData({ clicks: "", injection_site: "", sterility_confirmed: false, injection_date: new Date().toISOString().slice(0, 16), notes: "" });
    setShowForm(false);
    loadLogs();
  };

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
        <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-0.5">Injection Tracker</p>
        <h1 className="text-4xl" style={{ fontFamily: "var(--font-display)", color: "#0a0a0a", lineHeight: 1.1 }}>
          GLP-1 Medication
        </h1>
        <div className="brand-rule" />
        <p className="text-sm text-muted-foreground">Track your injection protocol</p>
      </div>

      {/* Half-Life Warning */}
      {isHalfLifeWindow && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mx-5 mb-4 p-4 rounded-xl border-2"
          style={{ backgroundColor: "#FB400210", borderColor: "#FB4002" }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#FB4002" }} />
            <div>
              <p className="text-lg font-medium" style={{ color: "#FB4002", fontFamily: "var(--font-display)" }}>
                Half-Life Window
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#FB4002CC" }}>
                Day {daysSinceLastDose} post-injection. Watch for inflammation signals today.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Active Protocol Card */}
      <div className="px-5 mb-4">
        <div className="bg-shampoo rounded-2xl p-5 border-2 border-pakistani-green">
          <h3 className="text-lg text-pakistani-green mb-3" style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}>Active Protocol</h3>
          {lastDose ? (
            <div className="grid grid-cols-2 gap-3">
              <ProtocolItem icon={<Syringe className="w-4 h-4" />} label="Last Dose" value={`${lastDose.clicks} clicks (${lastDose.mg_dose}mg)`} />
              <ProtocolItem icon={<Calendar className="w-4 h-4" />} label="Days Since" value={`${daysSinceLastDose} days`} />
              <ProtocolItem icon={<Clock className="w-4 h-4" />} label="Next Dose" value={nextDoseDate?.toLocaleDateString("en-AU", { month: "short", day: "numeric" })} />
              <ProtocolItem icon="💉" label="Site" value={lastDose.injection_site} />
            </div>
          ) : (
            <p className="text-sm text-pakistani-green/70">No injections logged yet.</p>
          )}
        </div>
      </div>

      {/* Log New Injection Button */}
      {!showForm && (
        <div className="px-5 mb-4">
          <Button
            onClick={() => setShowForm(true)}
            className="mx-auto h-12 text-white font-medium px-8 flex rounded-none"
            style={{ backgroundColor: "#FB4002" }}
          >
            <Plus className="w-4 h-4 mr-2" /> Log New Injection
          </Button>
        </div>
      )}

      {/* Log Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="px-5 mb-4 overflow-hidden"
          >
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm space-y-4">
              <h3 className="text-base text-pakistani-green" style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}>Log New Injection</h3>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Date & Time</label>
                <Input type="datetime-local" value={formData.injection_date} onChange={(e) => setFormData((p) => ({ ...p, injection_date: e.target.value }))} className="mt-1" />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Clicks</label>
                <div className="flex items-center gap-3 mt-1">
                  <Input type="number" placeholder="Enter clicks" value={formData.clicks} onChange={(e) => setFormData((p) => ({ ...p, clicks: e.target.value }))} className="flex-1" />
                  <div className="bg-misty-rose px-3 py-2 rounded-lg">
                    <span className="text-sm font-semibold" style={{ color: "#FB4002" }}>= {mgDose.toFixed(2)}mg</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">1 click = 0.25mg (15mg pen)</p>
              </div>

              <InjectionSiteSelector value={formData.injection_site} onChange={(site) => setFormData((p) => ({ ...p, injection_site: site }))} />

              <div>
                <label className="text-xs font-medium text-muted-foreground">Notes (optional)</label>
                <Input placeholder="Any observations..." value={formData.notes} onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))} className="mt-1" />
              </div>

              <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-pakistani-green bg-tea-green/30">
                <Checkbox checked={formData.sterility_confirmed} onCheckedChange={(c) => setFormData((p) => ({ ...p, sterility_confirmed: c }))} className="mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-pakistani-green">Sterility Checklist ✓</p>
                  <p className="text-xs text-pakistani-green/70">I confirm clean hands, swabbed site, and new needle.</p>
                </div>
              </label>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 h-12">Cancel</Button>
                <Button
                  onClick={handleLog}
                  disabled={!canLog}
                  className="flex-1 h-12 text-white disabled:opacity-40 rounded-none"
                  style={{ backgroundColor: "#FB4002" }}
                >
                  Log Injection
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5">
        <MedicationHistory logs={logs} onReload={loadLogs} />
      </div>
    </div>
  );
}

function ProtocolItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-pakistani-green">{typeof icon === "string" ? icon : icon}</span>
      <div>
        <p className="text-xs text-pakistani-green/60">{label}</p>
        <p className="text-sm font-semibold text-pakistani-green">{value}</p>
      </div>
    </div>
  );
}
