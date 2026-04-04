export const FRONT_REGIONS = [
  { id: "left-upper-arm",   label: "Left Upper Arm",   d: "M 72,74 C 63,92 56,120 55,148 L 66,148 C 67,120 72,94 78,78 Z" },
  { id: "right-upper-arm",  label: "Right Upper Arm",  d: "M 122,78 C 128,94 133,120 134,148 L 145,148 C 144,120 137,92 128,74 Z" },
  { id: "left-forearm",     label: "Left Forearm",     d: "M 55,148 C 51,168 47,183 46,198 L 58,198 C 59,183 63,168 66,148 Z" },
  { id: "right-forearm",    label: "Right Forearm",    d: "M 134,148 C 137,168 141,183 142,198 L 154,198 C 153,183 149,168 145,148 Z" },
  { id: "chest",            label: "Chest",            d: "M 78,78 C 86,75 93,73 100,73 C 107,73 114,75 122,78 L 120,118 L 80,118 Z" },
  { id: "abdomen",          label: "Abdomen",          d: "M 80,118 L 120,118 L 120,156 L 80,156 Z" },
  { id: "left-hip",         label: "Left Hip",         d: "M 80,156 L 100,156 L 98,190 L 64,190 C 63,176 68,164 80,156 Z" },
  { id: "right-hip",        label: "Right Hip",        d: "M 100,156 L 120,156 C 132,164 137,176 136,190 L 102,190 Z" },
  { id: "left-upper-thigh", label: "Left Upper Thigh", d: "M 64,190 L 89,190 L 87,257 L 64,257 Z" },
  { id: "right-upper-thigh",label: "Right Upper Thigh",d: "M 111,190 L 136,190 L 136,257 L 113,257 Z" },
  { id: "left-inner-thigh", label: "Left Inner Thigh", d: "M 82,198 L 93,198 L 91,257 L 83,257 Z" },
  { id: "right-inner-thigh",label: "Right Inner Thigh",d: "M 107,198 L 118,198 L 117,257 L 109,257 Z" },
  { id: "left-knee",        label: "Left Knee",        d: "M 64,257 L 88,257 L 88,277 L 64,277 Z" },
  { id: "right-knee",       label: "Right Knee",       d: "M 112,257 L 136,257 L 136,277 L 112,277 Z" },
  { id: "left-lower-leg",   label: "Left Lower Leg",   d: "M 64,277 L 87,277 L 85,336 L 65,336 Z" },
  { id: "right-lower-leg",  label: "Right Lower Leg",  d: "M 113,277 L 136,277 L 135,336 L 115,336 Z" },
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

  const s = { fill: "none", stroke: "#003300", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" };

  return (
    <svg viewBox="0 0 200 350" className="w-full max-w-[280px] mx-auto">
      {/* Head */}
      <ellipse cx="100" cy="30" rx="15" ry="19" {...s} />

      {/* Neck */}
      <path d="M 95,49 L 94,64 M 105,49 L 106,64" {...s} />

      {/* Shoulder line */}
      <path d="M 94,64 C 88,65 80,68 72,74 M 106,64 C 112,65 120,68 128,74" {...s} />

      {/* Left arm outer */}
      <path d="M 72,74 C 62,92 55,120 55,148 C 52,168 48,183 46,198" {...s} />
      {/* Left arm inner */}
      <path d="M 78,78 C 70,94 67,120 66,148 C 65,168 60,183 58,198" {...s} />
      {/* Left wrist */}
      <path d="M 46,198 L 58,198" {...s} />

      {/* Right arm outer */}
      <path d="M 128,74 C 138,92 145,120 145,148 C 148,168 152,183 154,198" {...s} />
      {/* Right arm inner */}
      <path d="M 122,78 C 130,94 133,120 134,148 C 135,168 140,183 142,198" {...s} />
      {/* Right wrist */}
      <path d="M 142,198 L 154,198" {...s} />

      {/* Left torso outer */}
      <path d="M 72,74 C 74,90 76,108 76,118 C 75,136 76,146 80,156 C 76,166 63,175 62,190" {...s} />
      {/* Right torso outer */}
      <path d="M 128,74 C 126,90 124,108 124,118 C 125,136 124,146 120,156 C 124,166 137,175 138,190" {...s} />

      {/* Chest top */}
      <path d="M 78,78 C 86,75 93,73 100,73 C 107,73 114,75 122,78" {...s} />

      {/* Left leg outer */}
      <path d="M 62,190 C 62,216 63,238 64,257 C 64,268 64,276 64,277 C 64,300 64,318 65,336" {...s} />
      {/* Left leg inner */}
      <path d="M 89,190 C 88,216 87,238 87,257 C 87,268 87,276 87,277 C 87,300 86,318 85,336" {...s} />
      {/* Left foot */}
      <path d="M 65,336 L 85,336" {...s} />

      {/* Crotch arch */}
      <path d="M 89,190 C 93,198 107,198 111,190" {...s} />

      {/* Right leg inner */}
      <path d="M 111,190 C 112,216 113,238 113,257 C 113,268 113,276 113,277 C 113,300 114,318 115,336" {...s} />
      {/* Right leg outer */}
      <path d="M 138,190 C 138,216 137,238 136,257 C 136,268 136,276 136,277 C 136,300 136,318 135,336" {...s} />
      {/* Right foot */}
      <path d="M 115,336 L 135,336" {...s} />

      {/* Knee lines */}
      <path d="M 64,257 L 88,257 M 112,257 L 136,257" {...s} strokeOpacity="0.35" />
      <path d="M 64,277 L 88,277 M 112,277 L 136,277" {...s} strokeOpacity="0.35" />

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