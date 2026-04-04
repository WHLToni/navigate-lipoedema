export const BACK_REGIONS = [
  { id: "back-left-upper-arm", label: "Left Upper Arm (Back)", d: "M 55,95 Q 40,110 38,140 L 48,140 Q 50,115 60,100 Z" },
  { id: "back-right-upper-arm", label: "Right Upper Arm (Back)", d: "M 145,95 Q 160,110 162,140 L 152,140 Q 150,115 140,100 Z" },
  { id: "upper-back", label: "Upper Back", d: "M 70,90 L 130,90 L 133,125 L 67,125 Z" },
  { id: "lower-back", label: "Lower Back", d: "M 67,125 L 133,125 L 132,165 L 68,165 Z" },
  { id: "left-buttock", label: "Left Buttock", d: "M 60,165 L 100,165 L 97,200 L 58,200 Z" },
  { id: "right-buttock", label: "Right Buttock", d: "M 100,165 L 140,165 L 142,200 L 103,200 Z" },
  { id: "back-left-thigh", label: "Left Thigh (Back)", d: "M 58,200 L 95,200 L 90,250 L 62,250 Z" },
  { id: "back-right-thigh", label: "Right Thigh (Back)", d: "M 105,200 L 142,200 L 138,250 L 110,250 Z" },
  { id: "back-left-knee", label: "Left Knee (Back)", d: "M 64,250 L 90,250 L 88,275 L 66,275 Z" },
  { id: "back-right-knee", label: "Right Knee (Back)", d: "M 110,250 L 136,250 L 134,275 L 112,275 Z" },
  { id: "back-left-calf", label: "Left Calf", d: "M 66,275 L 88,275 L 85,320 L 70,320 Z" },
  { id: "back-right-calf", label: "Right Calf", d: "M 112,275 L 134,275 L 130,320 L 115,320 Z" },
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

  return (
    <svg viewBox="0 0 200 350" className="w-full max-w-[280px] mx-auto">
      {/* Body outline */}
      <ellipse cx="100" cy="40" rx="25" ry="30" fill="none" stroke="#003300" strokeWidth="1.5" />
      <path d="M 75,65 Q 60,80 55,95 L 70,90 L 130,90 L 145,95 Q 140,80 125,65 Z" fill="none" stroke="#003300" strokeWidth="1.5" />
      <path d="M 70,90 L 67,125 L 68,165 L 60,200 L 62,250 L 66,275 L 70,320 L 85,320 L 88,275 L 90,250 L 95,200 L 100,180 L 105,200 L 110,250 L 112,275 L 115,320 L 130,320 L 134,275 L 138,250 L 140,200 L 132,165 L 133,125 L 130,90" fill="none" stroke="#003300" strokeWidth="1.5" />
      <path d="M 55,95 Q 40,110 38,140 Q 32,170 30,195 L 42,195 Q 43,170 48,140 Q 50,115 60,100" fill="none" stroke="#003300" strokeWidth="1.5" />
      <path d="M 145,95 Q 160,110 162,140 Q 168,170 170,195 L 158,195 Q 157,170 152,140 Q 150,115 140,100" fill="none" stroke="#003300" strokeWidth="1.5" />

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