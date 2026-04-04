export const BACK_REGIONS = [
  { id: "back-left-upper-arm",    label: "Left Upper Arm (Back)" },
  { id: "back-right-upper-arm",   label: "Right Upper Arm (Back)" },
  { id: "back-left-forearm",      label: "Left Forearm (Back)" },
  { id: "back-right-forearm",     label: "Right Forearm (Back)" },
  { id: "upper-back",             label: "Upper Back" },
  { id: "lower-back",             label: "Lower Back" },
  { id: "back-left-hip",          label: "Left Hip (Back)" },
  { id: "back-right-hip",         label: "Right Hip (Back)" },
  { id: "back-left-upper-thigh",  label: "Left Upper Thigh (Back)" },
  { id: "back-right-upper-thigh", label: "Right Upper Thigh (Back)" },
  { id: "back-left-knee",         label: "Left Knee (Back)" },
  { id: "back-right-knee",        label: "Right Knee (Back)" },
  { id: "back-left-lower-leg",    label: "Left Lower Leg (Back)" },
  { id: "back-right-lower-leg",   label: "Right Lower Leg (Back)" },
];

export default function BodySvgBack({ regionData = {}, onRegionTap, selectedRegion }) {
  const getRegionFill = (regionId) => {
    const data = regionData[regionId];
    if (!data) return "transparent";
    const hasWoody   = data.skin_quality?.includes("Cold") || data.skin_quality?.includes("Woody");
    const hasPain    = data.pain_score >= 5;
    const hasHealthy = data.skin_quality?.includes("Healthy/Warm");
    if (hasPain)    return "#FB400240";
    if (hasWoody)   return "#0202FB30";
    if (hasHealthy) return "#FFE5E680";
    return "#0202FB15";
  };

  const regionStyle = (id) => ({
    fill: selectedRegion === id ? "#0202FB25" : getRegionFill(id),
    stroke: selectedRegion === id ? "#0202FB" : "transparent",
    strokeWidth: selectedRegion === id ? 0.8 : 0,
    cursor: "pointer",
    transition: "fill 0.15s",
  });

  const handleTap = (id) => onRegionTap?.(BACK_REGIONS.find(r => r.id === id));

  return (
    <svg
      viewBox="0 0 103 270"
      className="w-full max-w-[220px] mx-auto"
      style={{ fillRule: "evenodd", clipRule: "evenodd", strokeLinecap: "round", strokeLinejoin: "round" }}
    >
      {/* Body outline — mirrored horizontally using scale(-1,1) translate */}
      <g transform="matrix(0.97945,0,0,0.97945,-86.170,-225.135)">
        <g transform="translate(282.78, 0) scale(-1, 1)">
          <path
            d="M136.492,231.022C142.521,234.638 146.288,231.022 146.288,231.022C146.288,231.022 145.74,234.986 147.697,237.999C149.029,240.048 151.297,241.956 154.587,242.487C159.433,243.27 170.593,244.916 172.912,249.301C177.473,257.925 181.076,280.94 183.766,296.149C183.766,296.149 186.838,313.147 186.838,319.905C186.838,326.664 184.534,334.497 184.534,339.208C184.534,339.208 190.202,355.745 180.167,361.685C170.132,367.624 187.082,354.271 180.922,350.031C180.922,350.031 180.167,353.471 178.487,356.671C178.487,356.671 177.182,352.751 180.167,338.111C180.167,338.111 174.167,312.563 175.767,304.151C175.767,304.151 165.047,280.791 165.127,271.511C165.127,271.511 165.073,278.311 159.367,280.791C157.301,281.25 156.068,302.645 160.807,311.498C166.071,321.331 169.43,334.789 169.43,346.951C169.43,362.333 168.796,378.069 160.807,403.791C160.807,403.791 159.367,412.158 159.367,415.858C159.367,415.858 167.706,429.116 156.997,470.558C156.997,470.558 154.937,482.151 159.367,485.251C163.797,488.351 161.597,495.351 150.097,491.451C150.097,491.451 146.997,490.851 151.297,485.251C151.297,485.251 150.832,468.909 150.097,460.773C149.262,451.53 146.257,436.455 146.288,429.795C146.332,420.285 148.224,420.497 147.697,415.858C146.221,402.857 141.85,356.261 143.597,350.031L139.183,350.031C140.929,356.261 136.559,402.857 135.083,415.858C134.556,420.497 136.448,420.285 136.492,429.795C136.523,436.455 133.518,451.53 132.683,460.773C131.948,468.909 131.483,485.251 131.483,485.251C135.783,490.851 132.683,491.451 132.683,491.451C121.183,495.351 118.983,488.351 123.413,485.251C127.843,482.151 125.783,470.558 125.783,470.558C115.074,429.116 123.413,415.858 123.413,415.858C123.413,412.158 121.973,403.791 121.973,403.791C113.984,378.069 113.35,362.333 113.35,346.951C113.35,334.789 116.709,321.331 121.973,311.498C126.712,302.645 125.479,281.25 123.413,280.791C117.706,278.311 117.653,271.511 117.653,271.511C117.733,280.791 107.013,304.151 107.013,304.151C108.613,312.563 102.613,338.111 102.613,338.111C105.598,352.751 104.293,356.671 104.293,356.671C102.613,353.471 101.858,350.031 101.858,350.031C95.698,354.271 112.648,367.624 102.613,361.685C92.578,355.745 98.246,339.208 98.246,339.208C98.246,334.497 95.942,326.664 95.942,319.905C95.942,313.147 99.014,296.149 99.014,296.149C101.704,280.94 105.306,257.925 109.868,249.301C112.187,244.916 123.347,243.27 128.193,242.487C131.483,241.956 133.751,240.048 135.083,237.999C137.04,234.986 136.492,231.022 136.492,231.022Z"
            style={{ fill: "white", stroke: "#FB4002", strokeWidth: "1.02px" }}
          />
        </g>
      </g>

      {/* Head — back of head, same ellipse */}
      <ellipse cx="51.5" cy="8" rx="10" ry="12" fill="white" stroke="#FB4002" strokeWidth="1"/>

      {/* Tappable regions — mirrored x positions (103 - x - width) */}
      <rect style={regionStyle("upper-back")}            x="38" y="22" width="27" height="18" rx="2" onClick={() => handleTap("upper-back")} />
      <rect style={regionStyle("lower-back")}            x="36" y="40" width="31" height="22" rx="2" onClick={() => handleTap("lower-back")} />
      <rect style={regionStyle("back-left-hip")}         x="57" y="62" width="22" height="18" rx="2" onClick={() => handleTap("back-left-hip")} />
      <rect style={regionStyle("back-right-hip")}        x="24" y="62" width="22" height="18" rx="2" onClick={() => handleTap("back-right-hip")} />
      <rect style={regionStyle("back-left-upper-thigh")} x="59" y="80" width="18" height="30" rx="2" onClick={() => handleTap("back-left-upper-thigh")} />
      <rect style={regionStyle("back-right-upper-thigh")} x="26" y="80" width="18" height="30" rx="2" onClick={() => handleTap("back-right-upper-thigh")} />
      <rect style={regionStyle("back-left-knee")}        x="60" y="110" width="16" height="14" rx="2" onClick={() => handleTap("back-left-knee")} />
      <rect style={regionStyle("back-right-knee")}       x="27" y="110" width="16" height="14" rx="2" onClick={() => handleTap("back-right-knee")} />
      <rect style={regionStyle("back-left-lower-leg")}   x="61" y="124" width="15" height="50" rx="2" onClick={() => handleTap("back-left-lower-leg")} />
      <rect style={regionStyle("back-right-lower-leg")}  x="27" y="124" width="15" height="50" rx="2" onClick={() => handleTap("back-right-lower-leg")} />
      <path style={regionStyle("back-left-upper-arm")}   d="M87,27 C93,30 96,38 95,46 C94,52 91,58 89,64 L83,62 C85,56 87,50 87,44 C87,38 85,31 81,28 Z" onClick={() => handleTap("back-left-upper-arm")} />
      <path style={regionStyle("back-right-upper-arm")}  d="M16,27 C10,30 7,38 8,46 C9,52 12,58 14,64 L20,62 C18,56 16,50 16,44 C16,38 18,31 22,28 Z" onClick={() => handleTap("back-right-upper-arm")} />
      <path style={regionStyle("back-left-forearm")}     d="M89,64 C92,72 94,82 94,90 C94,96 93,100 91,104 L85,102 C87,98 87,92 87,86 C87,78 85,70 83,62 Z" onClick={() => handleTap("back-left-forearm")} />
      <path style={regionStyle("back-right-forearm")}    d="M14,64 C11,72 9,82 9,90 C9,96 10,100 12,104 L18,102 C16,98 16,92 16,86 C16,78 18,70 20,62 Z" onClick={() => handleTap("back-right-forearm")} />
    </svg>
  );
}