export const BACK_REGIONS = [
  { id: "back-left-upper-arm",  label: "Left Upper Arm (Back)",  d: "M 60,70 C 55,86 50,140 48,202 L 60,206 C 62,144 66,92 74,78 Z" },
  { id: "back-right-upper-arm", label: "Right Upper Arm (Back)", d: "M 126,78 C 134,92 138,144 140,206 L 152,202 C 150,140 145,86 140,70 Z" },
  { id: "upper-back",           label: "Upper Back",             d: "M 76,74 C 86,68 93,64 100,62 C 107,64 114,68 124,74 L 120,134 L 80,134 Z" },
  { id: "lower-back",           label: "Lower Back",             d: "M 80,134 L 120,134 L 118,165 L 82,165 Z" },
  { id: "left-buttock",         label: "Left Buttock",           d: "M 82,165 L 100,165 L 100,205 L 66,205 C 66,188 72,172 82,165 Z" },
  { id: "right-buttock",        label: "Right Buttock",          d: "M 100,165 L 118,165 C 128,172 134,188 134,205 L 100,205 Z" },
  { id: "back-left-thigh",      label: "Left Thigh (Back)",      d: "M 66,205 L 88,205 L 86,262 L 66,262 Z" },
  { id: "back-right-thigh",     label: "Right Thigh (Back)",     d: "M 112,205 L 134,205 L 134,262 L 114,262 Z" },
  { id: "back-left-knee",       label: "Left Knee (Back)",       d: "M 66,262 L 86,262 L 86,280 L 66,280 Z" },
  { id: "back-right-knee",      label: "Right Knee (Back)",      d: "M 114,262 L 134,262 L 134,280 L 114,280 Z" },
  { id: "back-left-calf",       label: "Left Calf",              d: "M 66,280 L 86,280 L 85,336 L 67,336 Z" },
  { id: "back-right-calf",      label: "Right Calf",             d: "M 114,280 L 134,280 L 133,336 L 115,336 Z" },
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

  const stroke = "#003300";
  const sw = "1.5";
  const common = { fill: "none", stroke, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };

  return (
    <svg viewBox="0 0 200 350" className="w-full max-w-[280px] mx-auto">

      {/* Head */}
      <ellipse cx="100" cy="28" rx="14" ry="18" {...common} />

      {/* Neck */}
      <path d="M 94,46 L 93,62 M 106,46 L 107,62" {...common} />

      {/* Full body silhouette — single continuous path (back view, fuller hip) */}
      <path
        d="
          M 107,62
          C 116,64 132,64 140,70
          C 146,86 152,140 154,202
          L 142,206
          C 140,144 136,92 128,78
          C 124,72 120,68 120,68
          C 122,80 122,108 120,132
          C 120,148 130,168 136,185
          C 138,195 136,262 134,280
          C 134,300 133,320 133,336
          L 115,336
          C 115,320 114,300 114,280
          C 114,270 114,210 112,205
          C 108,212 104,216 100,216
          C 96,216 92,212 88,205
          C 86,210 86,270 86,280
          C 86,300 85,320 85,336
          L 67,336
          C 67,320 66,300 66,280
          C 64,262 62,195 64,185
          C 70,168 80,148 80,132
          C 78,108 78,80 80,68
          C 80,68 76,72 72,78
          C 64,92 60,144 58,206
          L 46,202
          C 48,140 54,86 60,70
          C 68,64 84,64 93,62
          Z
        "
        {...common}
      />

      {/* Armpit separators */}
      <path d="M 128,78 C 124,78 122,80 120,86" {...common} strokeOpacity="0.5" />
      <path d="M 72,78 C 76,78 78,80 80,86" {...common} strokeOpacity="0.5" />

      {/* Waist horizontal hint */}
      <path d="M 80,134 L 120,134" stroke={stroke} strokeWidth="1.2" strokeOpacity="0.3" fill="none" strokeLinecap="round" />

      {/* Knee lines */}
      <path d="M 66,262 L 86,262 M 114,262 L 134,262" stroke={stroke} strokeWidth="1.2" strokeOpacity="0.45" fill="none" strokeLinecap="round" />
      <path d="M 66,280 L 86,280 M 114,280 L 134,280" stroke={stroke} strokeWidth="1.2" strokeOpacity="0.45" fill="none" strokeLinecap="round" />

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