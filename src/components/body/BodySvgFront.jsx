export const FRONT_REGIONS = [
  { id: "left-upper-arm",    label: "Left Upper Arm",    d: "M 70,74 C 64,84 58,112 56,148 L 67,148 C 68,112 73,84 78,76 Z" },
  { id: "right-upper-arm",   label: "Right Upper Arm",   d: "M 122,76 C 127,84 132,112 133,148 L 144,148 C 142,112 136,84 130,74 Z" },
  { id: "left-forearm",      label: "Left Forearm",      d: "M 56,148 C 53,170 52,188 51,205 L 63,205 C 63,188 65,170 67,148 Z" },
  { id: "right-forearm",     label: "Right Forearm",     d: "M 133,148 C 135,170 136,188 137,205 L 149,205 C 148,188 147,170 144,148 Z" },
  { id: "chest",             label: "Chest",             d: "M 78,76 C 82,68 90,62 100,60 C 110,62 118,68 122,76 L 126,115 L 74,115 Z" },
  { id: "abdomen",           label: "Abdomen",           d: "M 74,115 L 126,115 L 120,162 L 80,162 Z" },
  { id: "left-hip",          label: "Left Hip",          d: "M 80,162 L 100,162 L 100,202 L 72,202 C 70,190 72,174 80,162 Z" },
  { id: "right-hip",         label: "Right Hip",         d: "M 100,162 L 120,162 C 128,174 130,190 128,202 L 100,202 Z" },
  { id: "left-upper-thigh",  label: "Left Upper Thigh",  d: "M 72,202 L 88,202 L 88,265 L 72,265 Z" },
  { id: "right-upper-thigh", label: "Right Upper Thigh", d: "M 112,202 L 128,202 L 128,265 L 112,265 Z" },
  { id: "left-inner-thigh",  label: "Left Inner Thigh",  d: "M 82,210 L 88,210 L 88,265 L 82,265 Z" },
  { id: "right-inner-thigh", label: "Right Inner Thigh", d: "M 112,210 L 118,210 L 118,265 L 112,265 Z" },
  { id: "left-knee",         label: "Left Knee",         d: "M 72,265 L 88,265 L 88,285 L 72,285 Z" },
  { id: "right-knee",        label: "Right Knee",        d: "M 112,265 L 128,265 L 128,285 L 112,285 Z" },
  { id: "left-lower-leg",    label: "Left Lower Leg",    d: "M 72,285 L 88,285 L 88,334 L 72,334 Z" },
  { id: "right-lower-leg",   label: "Right Lower Leg",   d: "M 112,285 L 128,285 L 128,334 L 112,334 Z" },
];

export default function BodySvgFront({ regionData = {}, onRegionTap, selectedRegion }) {
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

      {/* Torso + Legs */}
      <path d="
        M 78,76
        C 82,68 90,62 100,60
        C 110,62 118,68 122,76
        C 124,84 126,96 126,112
        C 126,128 122,140 118,152
        C 116,162 120,174 124,182
        C 126,190 128,196 128,202
        L 128,334 L 112,334 L 112,202
        C 110,207 106,212 100,214
        C 94,212 90,207 88,202
        L 88,334 L 72,334 L 72,202
        C 72,196 72,190 74,182
        C 78,174 82,162 80,152
        C 76,140 72,128 72,112
        C 72,96 74,84 78,76 Z
      " {...ls} />

      {/* Knee crease lines */}
      <path d="M 72,265 L 88,265 M 112,265 L 128,265" stroke="#003300" strokeWidth="1" strokeOpacity="0.4" fill="none" strokeLinecap="round" />
      <path d="M 72,285 L 88,285 M 112,285 L 128,285" stroke="#003300" strokeWidth="1" strokeOpacity="0.4" fill="none" strokeLinecap="round" />

      {/* Tappable regions */}
      {FRONT_REGIONS.map((region) => (
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