import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { base44 } from "@/api/base44Client";
import { ArrowRight, ArrowLeft, Sun, Shield, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    display_name: "",
    age: "",
    stage: "",
    type: [],
    comorbidities: [],
    life_stage: "",
    goals: [],
    notifications_consent: false,
    privacy_consent: false,
    research_opt_in: false,
  });

  const totalSteps = 6;

  const updateField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field, item) => {
    setData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  const handleFinish = async () => {
    if (!data.privacy_consent) return;
    await base44.entities.UserProfile.create({
      ...data,
      age: data.age ? Number(data.age) : null,
      onboarding_complete: true,
      active_habits: [],
    });
    onComplete();
  };

  const canNext = () => {
    if (step === 0) return data.display_name.trim().length > 0;
    if (step === 5) return data.privacy_consent;
    return true;
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-tea-green flex items-center justify-center mx-auto">
              <Sun className="w-8 h-8 text-pakistani-green" />
            </div>
            <h2 className="font-heading text-2xl text-center text-pakistani-green">
              Welcome to Navigate Lipoedema
            </h2>
            <p className="text-center text-muted-foreground text-sm">
              Let's set up your profile so we can personalise your experience.
            </p>
            <div className="space-y-3">
              <label className="text-sm font-medium">Your Name</label>
              <Input
                placeholder="Enter your first name"
                value={data.display_name}
                onChange={(e) => updateField("display_name", e.target.value)}
                className="h-12 text-base"
              />
              <label className="text-sm font-medium">Age (optional)</label>
              <Input
                type="number"
                placeholder="Your age"
                value={data.age}
                onChange={(e) => updateField("age", e.target.value)}
                className="h-12 text-base"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="font-heading text-2xl text-center text-pakistani-green">
              Your Lipoedema Profile
            </h2>
            <p className="text-center text-muted-foreground text-sm">
              This helps us tailor insights to your condition.
            </p>
            <div className="space-y-4">
              <label className="text-sm font-medium">Stage</label>
              <div className="grid grid-cols-2 gap-2">
                {STAGES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateField("stage", s)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      data.stage === s
                        ? "border-electric-blue bg-blue-50 text-electric-blue"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <label className="text-sm font-medium">Type <span className="text-muted-foreground font-normal">(select all that apply)</span></label>
              <div className="flex flex-col gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleArrayItem("type", t.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      data.type.includes(t.id)
                        ? "border-electric-blue bg-blue-50 text-electric-blue"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <span className="text-sm font-semibold block">{t.id}</span>
                    <span className="text-xs opacity-70 mt-0.5 block">{t.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="font-heading text-2xl text-center text-pakistani-green">
              Comorbidities
            </h2>
            <p className="text-center text-muted-foreground text-sm">
              Select any that apply to you (optional).
            </p>
            <div className="space-y-3">
              {COMORBIDITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleArrayItem("comorbidities", c)}
                  className={`w-full p-4 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                    data.comorbidities.includes(c)
                      ? "border-electric-blue bg-blue-50 text-electric-blue"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="font-heading text-2xl text-center text-pakistani-green">
              Life Stage
            </h2>
            <p className="text-center text-muted-foreground text-sm">
              Hormonal life stages affect Lipoedema significantly.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {LIFE_STAGES.map((ls) => (
                <button
                  key={ls}
                  onClick={() => updateField("life_stage", ls)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    data.life_stage === ls
                      ? "border-electric-blue bg-blue-50 text-electric-blue"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {ls}
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-shampoo flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-pakistani-green" />
            </div>
            <h2 className="font-heading text-2xl text-center text-pakistani-green">
              Your Goals
            </h2>
            <p className="text-center text-muted-foreground text-sm">
              What do you want to achieve? Select all that apply.
            </p>
            <div className="space-y-3">
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => toggleArrayItem("goals", g)}
                  className={`w-full p-4 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                    data.goals.includes(g)
                      ? "border-electric-blue bg-blue-50 text-electric-blue"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-misty-rose flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-pakistani-green" />
            </div>
            <h2 className="font-heading text-2xl text-center text-pakistani-green">
              Consent & Privacy
            </h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3 p-4 rounded-lg border border-border">
                <Checkbox
                  checked={data.notifications_consent}
                  onCheckedChange={(c) => updateField("notifications_consent", c)}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Receive habit reminders and half-life alerts.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-4 rounded-lg border border-border">
                <Checkbox
                  checked={data.research_opt_in}
                  onCheckedChange={(c) => updateField("research_opt_in", c)}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium">Research Contribution (Optional)</p>
                  <p className="text-xs text-muted-foreground">
                    Share anonymised data to help Lipoedema research in Australia.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-4 rounded-lg border-2 border-pakistani-green">
                <Checkbox
                  checked={data.privacy_consent}
                  onCheckedChange={(c) => updateField("privacy_consent", c)}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium">Privacy Policy *</p>
                  <p className="text-xs text-muted-foreground">
                    I agree to the privacy policy and terms of use. Required to continue.
                  </p>
                </div>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="px-6 pt-6">
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? "bg-electric-blue" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Step {step + 1} of {totalSteps}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 flex gap-3 border-t border-border bg-card">
        {step > 0 && (
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 h-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        )}
        {step < totalSteps - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className={`${step > 0 ? "flex-1" : "min-w-[160px] mx-auto"} h-12 bg-electric-blue hover:bg-blue-700 text-white`}
          >
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            disabled={!data.privacy_consent}
            className="flex-1 h-12 bg-electric-blue hover:bg-blue-700 text-white"
          >
            Get Started <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}