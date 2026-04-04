import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, FileText, Share2, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function ExportModal({ onClose }) {
  const [dateRange, setDateRange] = useState(30);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [profile, setProfile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [medLogs, setMedLogs] = useState([]);
  const [bodyLogs, setBodyLogs] = useState([]);
  const [habitLogs, setHabitLogs] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [profiles, meds, body, habits] = await Promise.all([
      base44.entities.UserProfile.filter({}),
      base44.entities.MedicationLog.list("-injection_date", 100),
      base44.entities.BodyRegionLog.list("-log_date", 200),
      base44.entities.HabitLog.list("-log_date", 500),
    ]);
    setProfile(profiles[0]);
    setMedLogs(meds);
    setBodyLogs(body);
    setHabitLogs(habits);
  };

  const cutoffDate = new Date(Date.now() - dateRange * 86400000);

  const filteredMeds = medLogs.filter((m) => new Date(m.injection_date) >= cutoffDate);
  const filteredBody = bodyLogs.filter((b) => new Date(b.log_date) >= cutoffDate);
  const filteredHabits = habitLogs.filter((h) => new Date(h.log_date) >= cutoffDate);

  const completedHabits = filteredHabits.filter((h) => h.status === "completed").length;
  const totalHabits = filteredHabits.length;
  const complianceRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  const handleExport = async () => {
    setGenerating(true);

    const reportContent = `
NAVIGATE LIPOEDEMA — MEDICAL HEALTH REPORT
Lipoedema Alliance Australia
Generated: ${new Date().toLocaleDateString("en-AU")}
Period: Last ${dateRange} days
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PATIENT DEMOGRAPHICS
Name: ${profile?.display_name || "N/A"}
Age: ${profile?.age || "N/A"}
Stage: ${profile?.stage || "N/A"}
Type: ${profile?.type || "N/A"}
Comorbidities: ${profile?.comorbidities?.join(", ") || "None"}
Life Stage: ${profile?.life_stage || "N/A"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GLP-1 MEDICATION HISTORY
${
  filteredMeds.length > 0
    ? filteredMeds
        .map(
          (m) =>
            `${new Date(m.injection_date).toLocaleDateString("en-AU")} | ${m.clicks} clicks | ${m.mg_dose}mg | Site: ${m.injection_site}`
        )
        .join("\n")
    : "No medication records in this period."
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HABIT COMPLIANCE
Total habits logged: ${totalHabits}
Completed: ${completedHabits}
Compliance rate: ${complianceRate}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BODY MAP SUMMARY
Regions logged: ${filteredBody.length}
Average pain score: ${
      filteredBody.length > 0
        ? (filteredBody.reduce((s, b) => s + b.pain_score, 0) / filteredBody.length).toFixed(1)
        : "N/A"
    }
High pain events (≥7): ${filteredBody.filter((b) => b.pain_score >= 7).length}

${doctorNotes ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nDOCTOR'S NOTES\n${doctorNotes}` : ""}
    `.trim();

    // Create a downloadable text file
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    if (navigator.share) {
      const file = new File([blob], `lipoedema-report-${dateRange}d.txt`, { type: "text/plain" });
      navigator.share({ title: "Navigate Lipoedema — Medical Report", files: [file] }).catch(() => {});
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.download = `lipoedema-report-${dateRange}d.txt`;
      a.click();
    }

    URL.revokeObjectURL(url);
    setGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        className="absolute inset-0 bg-black"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative w-full max-w-lg bg-misty-rose rounded-t-3xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-pakistani-green" />
            <h2 className="font-heading text-xl text-pakistani-green">Medical Report</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date Range */}
        <div className="mb-5">
          <label className="text-sm font-medium text-pakistani-green">Date Range</label>
          <div className="flex gap-2 mt-2">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setDateRange(days)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                  dateRange === days
                    ? "border-electric-blue bg-white text-electric-blue"
                    : "border-white/50 bg-white/30 text-pakistani-green"
                }`}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>

        {/* Preview Summary */}
        <div className="bg-white rounded-xl p-4 mb-4 space-y-2">
          <h4 className="text-xs font-semibold text-pakistani-green uppercase tracking-wider">
            Report Preview
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Patient:</span>{" "}
              <span className="font-medium">{profile?.display_name || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Stage:</span>{" "}
              <span className="font-medium">{profile?.stage || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Injections:</span>{" "}
              <span className="font-medium">{filteredMeds.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Compliance:</span>{" "}
              <span className="font-medium">{complianceRate}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Body Logs:</span>{" "}
              <span className="font-medium">{filteredBody.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">High Pain:</span>{" "}
              <span className="font-medium text-dynamic-red">
                {filteredBody.filter((b) => b.pain_score >= 7).length}
              </span>
            </div>
          </div>
        </div>

        {/* Doctor's Notes */}
        <div className="mb-5">
          <label className="text-sm font-medium text-pakistani-green">
            Doctor's Notes (optional)
          </label>
          <Textarea
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            placeholder="Add any notes for your healthcare provider..."
            className="mt-2 bg-white border-white/50 min-h-[80px]"
          />
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={generating}
          className="w-full h-14 bg-electric-blue hover:bg-blue-700 text-white rounded-xl font-medium text-base"
        >
          {generating ? (
            "Generating..."
          ) : (
            <>
              <Share2 className="w-5 h-5 mr-2" />
              Share / Save Report
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}