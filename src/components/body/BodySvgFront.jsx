export const FRONT_REGIONS = [
  { id: "left-upper-arm", label: "Left Upper Arm", d: "M 55,95 Q 40,110 38,140 L 48,140 Q 50,115 60,100 Z" },
  { id: "right-upper-arm", label: "Right Upper Arm", d: "M 145,95 Q 160,110 162,140 L 152,140 Q 150,115 140,100 Z" },
  { id: "left-forearm", label: "Left Forearm", d: "M 38,140 Q 32,170 30,195 L 42,195 Q 43,170 48,140 Z" },
  { id: "right-forearm", label: "Right Forearm", d: "M 162,140 Q 168,170 170,195 L 158,195 Q 157,170 152,140 Z" },
  { id: "chest", label: "Chest", d: "M 70,90 L 130,90 L 135,120 L 65,120 Z" },
  { id: "abdomen", label: "Abdomen", d: "M 65,120 L 135,120 L 132,165 L 68,165 Z" },
  { id: "left-hip", label: "Left Hip", d: "M 60,165 L 100,165 L 95,190 L 58,190 Z" },
  { id: "right-hip", label: "Right Hip", d: "M 100,165 L 140,165 L 142,190 L 105,190 Z" },
  { id: "left-upper-thigh", label: "Left Upper Thigh", d: "M 58,190 L 95,190 L 90,240 L 62,240 Z" },
  { id: "right-upper-thigh", label: "Right Upper Thigh", d: "M 105,190 L 142,190 L 138,240 L 110,240 Z" },
  { id: "left-inner-thigh", label: "Left Inner Thigh", d: "M 80,200 L 100,200 L 97,250 L 82,250 Z" },
  { id: "right-inner-thigh", label: "Right Inner Thigh", d: "M 100,200 L 120,200 L 118,250 L 103,250 Z" },
  { id: "left-knee", label: "Left Knee", d: "M 64,240 L 90,240 L 88,265 L 66,265 Z" },
  { id: "right-knee", label: "Right Knee", d: "M 110,240 L 136,240 L 134,265 L 112,265 Z" },
  { id: "left-lower-leg", label: "Left Lower Leg", d: "M 66,265 L 88,265 L 85,320 L 70,320 Z" },
  { id: "right-lower-leg", label: "Right Lower Leg", d: "M 112,265 L 134,265 L 130,320 L 115,320 Z" },
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

  return (
    <svg viewBox="0 0 200 350" className="w-full max-w-[280px] mx-auto">
      {/* Body outline */}
      <ellipse cx="100" cy="40" rx="25" ry="30" fill="none" stroke="#003300" strokeWidth="1.5" />
      <path d="M 75,65 Q 60,80 55,95 L 70,90 L 130,90 L 145,95 Q 140,80 125,65 Z" fill="none" stroke="#003300" strokeWidth="1.5" />
      <path d="M 70,90 L 65,120 L 68,165 L 60,190 L 62,240 L 66,265 L 70,320 L 85,320 L 88,265 L 90,240 L 95,190 L 100,175 L 105,190 L 110,240 L 112,265 L 115,320 L 130,320 L 134,265 L 138,240 L 140,190 L 132,165 L 135,120 L 130,90" fill="none" stroke="#003300" strokeWidth="1.5" />
      <path d="M 55,95 Q 40,110 38,140 Q 32,170 30,195 L 42,195 Q 43,170 48,140 Q 50,115 60,100" fill="none" stroke="#003300" strokeWidth="1.5" />
      <path d="M 145,95 Q 160,110 162,140 Q 168,170 170,195 L 158,195 Q 157,170 152,140 Q 150,115 140,100" fill="none" stroke="#003300" strokeWidth="1.5" />

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