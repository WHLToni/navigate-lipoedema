export const BACK_REGIONS = [
  { id: "back-left-upper-arm",  label: "Left Upper Arm (Back)",  d: "M 70,74 C 64,84 58,112 56,148 L 67,148 C 68,112 73,84 78,76 Z" },
  { id: "back-right-upper-arm", label: "Right Upper Arm (Back)", d: "M 122,76 C 127,84 132,112 133,148 L 144,148 C 142,112 136,84 130,74 Z" },
  { id: "upper-back",           label: "Upper Back",             d: "M 78,76 C 82,68 90,62 100,60 C 110,62 118,68 122,76 L 126,115 L 74,115 Z" },
  { id: "lower-back",           label: "Lower Back",             d: "M 74,115 L 126,115 L 120,162 L 80,162 Z" },
  { id: "left-buttock",         label: "Left Buttock",           d: "M 80,162 L 100,162 L 100,202 L 72,202 C 70,190 72,174 80,162 Z" },
  { id: "right-buttock",        label: "Right Buttock",          d: "M 100,162 L 120,162 C 128,174 130,190 128,202 L 100,202 Z" },
  { id: "back-left-thigh",      label: "Left Thigh (Back)",      d: "M 72,202 L 88,202 L 88,265 L 72,265 Z" },
  { id: "back-right-thigh",     label: "Right Thigh (Back)",     d: "M 112,202 L 128,202 L 128,265 L 112,265 Z" },
  { id: "back-left-knee",       label: "Left Knee (Back)",       d: "M 72,265 L 88,265 L 88,285 L 72,285 Z" },
  { id: "back-right-knee",      label: "Right Knee (Back)",      d: "M 112,265 L 128,265 L 128,285 L 112,285 Z" },
  { id: "back-left-calf",       label: "Left Calf",              d: "M 72,285 L 88,285 L 88,334 L 72,334 Z" },
  { id: "back-right-calf",      label: "Right Calf",             d: "M 112,285 L 128,285 L 128,334 L 112,334 Z" },
];

export default function BodySvgBack({ regionData = {}, onRegionTap, selectedRegion }) {
  const getRegionFill = (regionId) => {
    const data = regionData[regionId];
    if (!data) return "transparent";
    const hasWoody = data.skin_quality?.includes("Cold") || data.skin_quality?.includes("Woody");
    const hasPain = data.pain_score >= 5;
    const hasHealthy = data.skin_quality?.includes("Healthy/Warm");
    if (hasPain) return "#FB400240";
    if (hasWoody) return "#0202FB30";
    if (hasHealthy) return "#FFE5E680";
    return "#0202FB15";
  };

  const ls = { fill: "none", stroke: "#003300", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" };

  return (
    <svg viewBox="0 0 200 350" className="w-full max-w-[280px] mx-auto">
      {/* Head */}
      <ellipse cx="100" cy="26" rx="13" ry="17" {...ls} />

      {/* Neck */}
      <path d="M 94,43 L 93,60 M 106,43 L 107,60" {...ls} />

      {/* Left shoulder sweep */}
      <path d="M 93,60 C 86,64 79,68 70,74" {...ls} />
      {/* Right shoulder sweep */}
      <path d="M 107,60 C 114,64 121,68 130,74" {...ls} />

      {/* Left arm */}
      <path d="M 70,74 C 62,84 56,112 54,150 C 52,172 51,190 51,205 L 63,205 C 63,190 65,172 67,150 C 70,112 74,84 78,76 Z" {...ls} />

      {/* Right arm */}
      <path d="M 122,76 C 126,84 130,112 133,150 C 135,172 137,190 137,205 L 149,205 C 149,190 148,172 146,150 C 144,112 138,84 130,74 Z" {...ls} />

      {/* Torso + Legs (back — slightly fuller hip curve) */}
      <path d="
        M 78,76
        C 82,68 90,62 100,60
        C 110,62 118,68 122,76
        C 124,84 126,96 126,112
        C 126,128 122,140 118,152
        C 116,162 122,176 128,186
        C 130,192 130,198 128,202
        L 128,334 L 112,334 L 112,202
        C 110,207 106,212 100,214
        C 94,212 90,207 88,202
        L 88,334 L 72,334 L 72,202
        C 70,198 70,192 72,186
        C 78,176 84,162 82,152
        C 78,140 74,128 74,112
        C 74,96 76,84 78,76 Z
      " {...ls} />

      {/* Waist seam hint */}
      <path d="M 74,115 L 126,115" stroke="#003300" strokeWidth="1" strokeOpacity="0.3" fill="none" strokeLinecap="round" />

      {/* Knee crease lines */}
      <path d="M 72,265 L 88,265 M 112,265 L 128,265" stroke="#003300" strokeWidth="1" strokeOpacity="0.4" fill="none" strokeLinecap="round" />
      <path d="M 72,285 L 88,285 M 112,285 L 128,285" stroke="#003300" strokeWidth="1" strokeOpacity="0.4" fill="none" strokeLinecap="round" />

      {/* Tappable regions */}
      {BACK_REGIONS.map((region) => (
        <path
          key={region.id}
          d={region.d}
          fill={getRegionFill(region.id)}
          stroke={selectedRegion === region.id ? "#0202FB" : "transparent"}
          strokeWidth={selectedRegion === region.id ? 2 : 0}
          className="cursor-pointer transition-all duration-200"
          onClick={() => onRegionTap?.(region)}
          style={{ pointerEvents: "all" }}
        />
      ))}
    </svg>
  );
}