import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, RefreshCw, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const STAGES = ["Stage 1", "Stage 2", "Stage 3", "Stage 4"];
const TYPES = [
  { id: "Type I", description: "Hip & buttocks only" },
  { id: "Type II", description: "Hip down to knee, including inner knee fold" },
  { id: "Type III", description: "Hip all the way to the ankle" },
  { id: "Type IV", description: "Arms — upper and/or lower" },
  { id: "Type V", description: "Lower legs and calves only" },
];
const COMORBIDITIES = ["POTS", "MCAS", "hEDS/Hypermobility", "Hypothyroidism"];
const LIFE_STAGES = ["Puberty", "Pregnancy", "Post-Partum", "Perimenopause", "Menopause", "Other"];
const GOALS = [
  "Track tissue remodeling",
  "Monitor GLP-1 progress",
  "Identify personal triggers",
  "Build healthy habits",
  "Generate medical reports",
  "Contribute to research",
];

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.entities.UserProfile.filter({}).then((profiles) => {
      if (profiles[0]) {
        setProfile(profiles[0]);
        setForm({
          display_name: profiles[0].display_name || "",
          age: profiles[0].age || "",
          stage: profiles[0].stage || "",
          type: profiles[0].type || [],
          comorbidities: profiles[0].comorbidities || [],
          life_stage: profiles[0].life_stage || "",
          goals: profiles[0].goals || [],
          research_opt_in: profiles[0].research_opt_in || false,
        });
      }
    });
  }, []);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const toggleArray = (field, item) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(item)
        ? f[field].filter((i) => i !== item)
        : [...f[field], item],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.UserProfile.update(profile.id, {
      ...form,
      age: form.age ? Number(form.age) : null,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = async () => {
    await base44.entities.UserProfile.delete(profile.id);
    window.location.href = "/";
  };

  const handleDelete = async () => {
    await base44.entities.UserProfile.delete(profile.id);
    base44.auth.logout("/");
  };

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-muted border-t-electric-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-5 py-4 flex items-center gap-3">
        <Link to="/" className="p-2 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-heading text-xl text-pakistani-green">Edit Profile</h1>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-8">

        {/* Basic Info */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg text-pakistani-green">Basic Info</h2>
          <div className="space-y-3">
            <label className="text-sm font-medium block">First Name</label>
            <Input
              value={form.display_name}
              onChange={(e) => update("display_name", e.target.value)}
              className="h-12 text-base"
            />
            <label className="text-sm font-medium block">Age (optional)</label>
            <Input
              type="number"
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
              className="h-12 text-base"
            />
          </div>
        </section>

        {/* Stage */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg text-pakistani-green">Lipoedema Stage</h2>
          <div className="grid grid-cols-2 gap-2">
            {STAGES.map((s) => (
              <button
                key={s}
                onClick={() => update("stage", s)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  form.stage === s
                    ? "border-electric-blue bg-blue-50 text-electric-blue"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Type */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg text-pakistani-green">
            Lipoedema Type{" "}
            <span className="text-muted-foreground font-body font-normal text-sm">(select all that apply)</span>
          </h2>
          <div className="flex flex-col gap-2">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleArray("type", t.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  form.type.includes(t.id)
                    ? "border-electric-blue bg-blue-50 text-electric-blue"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <span className="text-sm font-semibold block">{t.id}</span>
                <span className="text-xs opacity-70 mt-0.5 block">{t.description}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Comorbidities */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg text-pakistani-green">Comorbidities</h2>
          <div className="space-y-2">
            {COMORBIDITIES.map((c) => (
              <button
                key={c}
                onClick={() => toggleArray("comorbidities", c)}
                className={`w-full p-4 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                  form.comorbidities.includes(c)
                    ? "border-electric-blue bg-blue-50 text-electric-blue"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Life Stage */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg text-pakistani-green">Life Stage</h2>
          <div className="grid grid-cols-2 gap-2">
            {LIFE_STAGES.map((ls) => (
              <button
                key={ls}
                onClick={() => update("life_stage", ls)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  form.life_stage === ls
                    ? "border-electric-blue bg-blue-50 text-electric-blue"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                {ls}
              </button>
            ))}
          </div>
        </section>

        {/* Goals */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg text-pakistani-green">Goals</h2>
          <div className="space-y-2">
            {GOALS.map((g) => (
              <button
                key={g}
                onClick={() => toggleArray("goals", g)}
                className={`w-full p-4 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                  form.goals.includes(g)
                    ? "border-electric-blue bg-blue-50 text-electric-blue"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </section>

        {/* Research opt-in */}
        <section>
          <label className="flex items-start gap-3 p-4 rounded-lg border border-border">
            <Checkbox
              checked={form.research_opt_in}
              onCheckedChange={(c) => update("research_opt_in", c)}
              className="mt-0.5"
            />
            <div>
              <p className="text-sm font-medium">Research Contribution</p>
              <p className="text-xs text-muted-foreground">
                Share anonymised data to help Lipoedema research in Australia.
              </p>
            </div>
          </label>
        </section>

        {/* Save */}
        <Button
          onClick={handleSave}
          disabled={saving || !form.display_name.trim()}
          className="mx-auto flex h-12 bg-electric-blue hover:bg-blue-700 text-white px-10"
        >
          <Save className="w-4 h-4 mr-2" />
          {saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}
        </Button>

        {/* Reset onboarding */}
        <div className="pt-4 border-t border-border">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 text-sm font-medium border-2 border-dynamic-red text-dynamic-red px-4 py-2 rounded-full mx-auto"
            >
              <RefreshCw className="w-4 h-4" /> Reset & Redo Onboarding
            </button>
          ) : (
            <div className="bg-misty-rose rounded-xl p-4 text-center space-y-3">
              <p className="text-sm font-medium text-pakistani-green">
                This will delete your profile and restart onboarding. Are you sure?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-full border border-border text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-full bg-dynamic-red text-white text-sm font-medium"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete account */}
        <div className="pt-2 pb-8 text-center">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-dynamic-red text-sm underline underline-offset-2"
            >
              Delete My Account
            </button>
          ) : (
            <div className="bg-misty-rose rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-pakistani-green">
                This will permanently delete all your data. This cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-full border border-border text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-full bg-dynamic-red text-white text-sm font-medium flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete Everything
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}