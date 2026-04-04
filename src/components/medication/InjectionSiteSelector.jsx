const SITES = [
  { id: "L-Thigh", label: "L Thigh" },
  { id: "R-Thigh", label: "R Thigh" },
  { id: "Stomach", label: "Stomach" },
  { id: "L-Arm", label: "L Arm" },
  { id: "R-Arm", label: "R Arm" },
];

export default function InjectionSiteSelector({ value, onChange }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">Injection Site</label>
      <div className="grid grid-cols-5 gap-2 mt-2">
        {SITES.map((site) => (
          <button
            key={site.id}
            onClick={() => onChange(site.id)}
            className={`py-3 rounded-xl text-xs font-medium text-center transition-all border-2 ${
              value === site.id
                ? "border-electric-blue bg-blue-50 text-electric-blue"
                : "border-border text-muted-foreground hover:border-muted-foreground"
            }`}
          >
            {site.label}
          </button>
        ))}
      </div>
    </div>
  );
}