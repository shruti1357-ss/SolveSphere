import { useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleAlert } from "lucide-react";
import sihMap from "../../assets/sih-map.png";

// The zones follow the districts visible in the local SIH map image.
// Positions are percentages so the map and hit areas stay aligned at every size.
const DISTRICT_ZONES = {
  'Garhwa': [[12, 71], [10, 76], [17, 85], [12, 87], [13, 94], [6, 107], [23, 115], [25, 126], [39, 134], [44, 152], [60, 157], [62, 150], [70, 149], [69, 138], [62, 132], [60, 123], [52, 123], [56, 113], [67, 106], [48, 90], [51, 67], [39, 72]],
  'Palamu': [[67, 57], [60, 68], [54, 69], [49, 83], [58, 99], [70, 107], [59, 114], [55, 123], [60, 120], [70, 135], [82, 122], [96, 128], [103, 121], [113, 126], [119, 121], [120, 104], [107, 95], [110, 92], [107, 84], [94, 76], [97, 71], [94, 65], [84, 71], [80, 68], [77, 75]],
  'Chatra': [[142, 69], [132, 74], [126, 83], [119, 81], [110, 95], [124, 104], [120, 109], [122, 120], [136, 114], [141, 120], [152, 122], [156, 130], [152, 140], [163, 148], [169, 146], [171, 139], [164, 136], [160, 123], [177, 118], [169, 100], [172, 96], [181, 97], [183, 90], [169, 91], [161, 80], [150, 84], [147, 76], [142, 76]],
  'Latehar': [[152, 124], [140, 123], [135, 117], [112, 129], [106, 123], [99, 130], [83, 124], [69, 141], [73, 148], [69, 152], [71, 162], [67, 175], [88, 177], [101, 156], [113, 157], [124, 151], [133, 156], [139, 153], [147, 161], [154, 160], [157, 149], [150, 141], [154, 136]],
  'Lohardaga': [[113, 159], [116, 170], [121, 166], [145, 167], [147, 171], [142, 174], [109, 171], [120, 181], [135, 179], [139, 185], [150, 181], [150, 168], [156, 164], [153, 161], [146, 164], [138, 156], [132, 159], [118, 155]],
  'Gumla': [[75, 180], [71, 195], [80, 202], [80, 209], [95, 215], [99, 210], [104, 212], [105, 216], [97, 224], [100, 229], [118, 224], [122, 230], [126, 227], [137, 234], [156, 223], [151, 217], [154, 211], [147, 209], [148, 199], [154, 192], [149, 188], [151, 184], [140, 188], [134, 182], [112, 181], [106, 171], [110, 160], [101, 159], [89, 179]],
  'Simdega': [[63, 247], [88, 271], [111, 266], [131, 268], [141, 258], [155, 261], [168, 255], [160, 230], [155, 227], [133, 237], [129, 231], [121, 234], [120, 227], [113, 226], [104, 233], [89, 232], [85, 240], [71, 241]],
  'Khunti': [[154, 216], [167, 245], [176, 227], [184, 221], [206, 230], [222, 222], [217, 219], [219, 206], [211, 206], [197, 195], [180, 197], [179, 192], [173, 190], [163, 197], [164, 203]],
  'Ranchi': [[159, 149], [159, 164], [152, 173], [156, 193], [150, 200], [151, 209], [156, 208], [162, 201], [161, 196], [172, 188], [182, 194], [190, 191], [206, 196], [212, 204], [220, 204], [223, 213], [234, 207], [242, 178], [213, 171], [194, 148], [184, 142], [177, 151], [174, 147]],
  'Hazaribagh': [[166, 84], [168, 88], [186, 90], [183, 100], [172, 99], [173, 109], [180, 118], [173, 124], [162, 124], [167, 129], [166, 135], [174, 138], [170, 144], [177, 146], [184, 139], [192, 145], [197, 133], [212, 121], [227, 119], [232, 125], [241, 123], [234, 117], [236, 113], [226, 109], [225, 103], [236, 99], [196, 92], [188, 81], [191, 75], [185, 71], [176, 73]],
  'Koderma': [[241, 46], [227, 46], [219, 54], [218, 64], [210, 62], [207, 68], [195, 65], [189, 72], [194, 74], [192, 82], [197, 89], [209, 88], [221, 94], [238, 92], [235, 87], [238, 68], [232, 60]],
  'Giridih': [[238, 52], [235, 59], [241, 68], [240, 93], [237, 101], [227, 104], [239, 112], [236, 116], [249, 129], [277, 127], [282, 114], [295, 116], [300, 112], [301, 106], [296, 106], [299, 94], [288, 82], [279, 79], [279, 65], [265, 65], [262, 52], [254, 48]],
  'Deoghar': [[309, 65], [305, 72], [299, 73], [295, 85], [301, 93], [299, 106], [320, 106], [324, 112], [339, 114], [338, 106], [348, 96], [336, 86], [333, 79], [336, 71], [327, 70], [323, 64]],
  'Dumka': [[339, 62], [336, 80], [342, 90], [351, 95], [342, 107], [346, 105], [360, 115], [388, 120], [386, 118], [393, 115], [392, 108], [398, 110], [400, 102], [409, 103], [406, 96], [399, 95], [397, 74], [382, 77], [374, 65], [362, 67], [349, 63], [347, 66]],
  'Godda': [[382, 7], [371, 23], [364, 22], [354, 28], [358, 43], [351, 46], [354, 50], [349, 60], [362, 64], [374, 62], [382, 69], [381, 53], [393, 44], [387, 32], [390, 26], [385, 22], [387, 11]],
  'Sahibganj': [[392, 9], [395, 12], [389, 13], [395, 48], [402, 47], [410, 54], [413, 50], [424, 50], [431, 34], [414, 25], [413, 14], [409, 16]],
  'Pakur': [[388, 50], [383, 54], [387, 57], [383, 74], [397, 71], [402, 95], [409, 96], [421, 80], [420, 70], [427, 72], [430, 63], [424, 60], [427, 55], [414, 52], [410, 57], [400, 49]],
  'Ramgarh': [[198, 140], [219, 151], [224, 146], [235, 149], [239, 158], [249, 149], [267, 154], [267, 142], [261, 129], [249, 132], [241, 125], [232, 128], [228, 122], [212, 124], [209, 130], [201, 132]],
  'Bokaro': [[195, 142], [214, 169], [235, 174], [241, 168], [233, 151], [209, 151], [207, 146]],
  'Dhanbad': [[264, 130], [270, 151], [286, 159], [303, 149], [318, 151], [329, 149], [331, 144], [329, 137], [287, 115], [282, 117], [278, 129]],
  'Jamtara': [[332, 151], [304, 152], [289, 160], [288, 166], [297, 176], [314, 182], [325, 172], [332, 174], [332, 168], [338, 166]],
  'Saraikela-Kharsawan': [[241, 195], [229, 215], [219, 218], [231, 227], [232, 239], [241, 237], [249, 242], [248, 250], [254, 256], [273, 241], [279, 222], [276, 204], [268, 206], [262, 199]],
  'East Singhbhum': [[279, 209], [281, 228], [267, 252], [293, 276], [310, 275], [317, 283], [326, 281], [330, 276], [323, 260], [328, 256], [326, 249], [316, 249], [314, 241], [296, 228], [299, 218], [304, 217], [301, 211], [290, 207]],
  'West Singhbhum': [[177, 229], [179, 232], [168, 249], [172, 255], [169, 262], [173, 263], [162, 286], [171, 283], [185, 290], [192, 279], [201, 277], [223, 286], [237, 281], [241, 285], [236, 287], [237, 293], [251, 289], [259, 278], [256, 274], [261, 271], [261, 265], [245, 250], [247, 243], [230, 241], [225, 226], [207, 232], [186, 224]],
};


const FALLBACK = {
  totalProblems: 74,
  completedProjects: 31,
  utilization: 72,
  activeAlerts: 2,
  bottlenecks: "Field verification",
};

const DETAIL_OVERRIDES = {
  Ranchi: { totalProblems: 412, completedProjects: 156, utilization: 84, activeAlerts: 2, bottlenecks: "Road repair approvals" },
  Dhanbad: { totalProblems: 198, completedProjects: 82, utilization: 68, activeAlerts: 4, bottlenecks: "Air-quality mitigation" },
  "East Singhbhum": { totalProblems: 189, completedProjects: 79, utilization: 76, activeAlerts: 3, bottlenecks: "Flood-prone drainage" },
  "West Singhbhum": { totalProblems: 156, completedProjects: 61, utilization: 63, activeAlerts: 2, bottlenecks: "Remote-area logistics" },
  Bokaro: { totalProblems: 134, completedProjects: 59, utilization: 79, activeAlerts: 1, bottlenecks: "Tender finalization" },
  Khunti: { totalProblems: 124, completedProjects: 48, utilization: 58, activeAlerts: 5, bottlenecks: "Water supply capacity" },
  Giridih: { totalProblems: 96, completedProjects: 43, utilization: 71, activeAlerts: 2, bottlenecks: "Contractor availability" },
  Garhwa: { totalProblems: 98, completedProjects: 39, utilization: 61, activeAlerts: 3, bottlenecks: "Heat-wave response" },
  Palamu: { totalProblems: 112, completedProjects: 47, utilization: 66, activeAlerts: 2, bottlenecks: "Irrigation coverage" },
  Chatra: { totalProblems: 87, completedProjects: 38, utilization: 73, activeAlerts: 1, bottlenecks: "Road connectivity" },
  Latehar: { totalProblems: 73, completedProjects: 31, utilization: 69, activeAlerts: 2, bottlenecks: "Forest-area access" },
  Lohardaga: { totalProblems: 45, completedProjects: 21, utilization: 77, activeAlerts: 1, bottlenecks: "Last-mile works" },
  Gumla: { totalProblems: 68, completedProjects: 29, utilization: 64, activeAlerts: 2, bottlenecks: "School infrastructure" },
  Simdega: { totalProblems: 38, completedProjects: 18, utilization: 81, activeAlerts: 1, bottlenecks: "Health staffing" },
  Hazaribagh: { totalProblems: 91, completedProjects: 42, utilization: 75, activeAlerts: 2, bottlenecks: "Urban drainage" },
  Koderma: { totalProblems: 52, completedProjects: 25, utilization: 78, activeAlerts: 1, bottlenecks: "Water treatment" },
  Ramgarh: { totalProblems: 83, completedProjects: 37, utilization: 74, activeAlerts: 2, bottlenecks: "Industrial compliance" },
  Deoghar: { totalProblems: 72, completedProjects: 34, utilization: 82, activeAlerts: 1, bottlenecks: "Tourism-area traffic" },
  Dumka: { totalProblems: 63, completedProjects: 28, utilization: 67, activeAlerts: 2, bottlenecks: "Rural connectivity" },
  Godda: { totalProblems: 44, completedProjects: 19, utilization: 62, activeAlerts: 2, bottlenecks: "Power reliability" },
  Sahibganj: { totalProblems: 46, completedProjects: 22, utilization: 70, activeAlerts: 1, bottlenecks: "River-side drainage" },
  Pakur: { totalProblems: 41, completedProjects: 20, utilization: 73, activeAlerts: 1, bottlenecks: "Mineral-area roads" },
  Jamtara: { totalProblems: 37, completedProjects: 18, utilization: 76, activeAlerts: 1, bottlenecks: "Project monitoring" },
  "Saraikela-Kharsawan": { totalProblems: 58, completedProjects: 26, utilization: 72, activeAlerts: 2, bottlenecks: "Industrial water demand" },
};

const getStatus = (data) => {
  if (data.activeAlerts >= 4 || data.utilization < 60) return { label: "Critical", tone: "critical", Icon: CircleAlert };
  if (data.activeAlerts >= 2 || data.utilization < 70) return { label: "Warning", tone: "warning", Icon: AlertTriangle };
  return { label: "Normal", tone: "normal", Icon: CheckCircle2 };
};

const getData = (district, countMap) => ({
  ...FALLBACK,
  ...(countMap[district] ? { totalProblems: countMap[district] } : {}),
  ...(DETAIL_OVERRIDES[district] || {}),
});

const JharkhandDistrictMap = ({ districtData = [], onDistrictClick }) => {
  const mapRef = useRef(null);
  const tooltipRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState({ left: 0, top: 0 });

  const countMap = useMemo(
    () => Object.fromEntries(
      districtData.map((item) => [
        item.district,
        Number(item.count ?? item.total ?? 0),
      ])
    ),
    [districtData]
  );

  const positionTooltip = (event) => {
    const host = mapRef.current;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const tooltipWidth = Math.min(246, rect.width - 20);
    const tooltipHeight = tooltipRef.current?.offsetHeight || 184;
    const gap = 14;
    const pad = 10;

    // Keep the card inside the map. Try the side first, then below/above.
    const candidates = [
      { left: x + gap, top: y - tooltipHeight / 2 },
      { left: x - tooltipWidth - gap, top: y - tooltipHeight / 2 },
      { left: x - tooltipWidth / 2, top: y + gap },
      { left: x - tooltipWidth / 2, top: y - tooltipHeight - gap },
    ];

    const fits = ({ left, top }) =>
      left >= pad &&
      top >= pad &&
      left + tooltipWidth <= rect.width - pad &&
      top + tooltipHeight <= rect.height - pad;

    const selected = candidates.find(fits);
    const fallbackLeft = Math.max(
      pad,
      Math.min(rect.width - tooltipWidth - pad, x < rect.width / 2 ? x + gap : x - tooltipWidth - gap)
    );
    const fallbackTop = Math.max(
      pad,
      Math.min(rect.height - tooltipHeight - pad, y > rect.height / 2 ? y - tooltipHeight - gap : y + gap)
    );

    setTooltip({
      left: selected ? selected.left : fallbackLeft,
      top: selected ? selected.top : fallbackTop,
    });
  };

  const handleEnter = (district, event) => {
    setHovered(district);
    requestAnimationFrame(() => positionTooltip(event));
  };

  return (
    <div
      ref={mapRef}
      className="relative mx-auto aspect-[439/298] w-full max-w-[760px] overflow-hidden rounded-xl bg-[#f8fbff] select-none"
      onMouseLeave={() => setHovered(null)}
    >
      <img
        src={sihMap}
        alt="Jharkhand 24 district map"
        draggable="false"
        className="absolute inset-0 block h-full w-full object-contain object-center"
      />

      {/* Exact image-space district hit areas. The SVG and PNG share the same 439x298 viewBox,
          so the zones remain aligned even when the dashboard is resized. */}
      <svg
        viewBox="0 0 439 298"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        aria-label="Interactive Jharkhand district map"
        role="img"
      >
        {Object.entries(DISTRICT_ZONES).map(([district, points]) => {
          const active = hovered === district;
          const data = getData(district, countMap);
          const status = getStatus(data);
          const fill =
            status.tone === "critical"
              ? "rgba(244,63,94,0.10)"
              : status.tone === "warning"
                ? "rgba(245,158,11,0.10)"
                : "rgba(34,197,94,0.08)";

          return (
            <polygon
              key={district}
              points={points.map(([x, y]) => `${x},${y}`).join(" ")}
              fill={active ? fill : "rgba(255,255,255,0.001)"}
              stroke={active ? "rgba(37,99,235,0.90)" : "transparent"}
              strokeWidth={active ? 2.2 : 0}
              vectorEffect="non-scaling-stroke"
              className="cursor-pointer transition-all duration-100"
              onMouseEnter={(event) => handleEnter(district, event)}
              onMouseMove={(event) => hovered === district && positionTooltip(event)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onDistrictClick?.(district)}
            />
          );
        })}
      </svg>

      {hovered && (
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-50 w-[246px] max-w-[calc(100%-20px)] rounded-2xl border border-slate-200 bg-white/96 p-3 shadow-[0_16px_42px_rgba(15,23,42,0.20)] backdrop-blur-md"
          style={{ left: tooltip.left, top: tooltip.top }}
        >
          {(() => {
            const data = getData(hovered, countMap);
            const status = getStatus(data);
            const StatusIcon = status.Icon;
            const statusClasses =
              status.tone === "critical"
                ? "bg-rose-50 text-rose-600 border-rose-100"
                : status.tone === "warning"
                  ? "bg-amber-50 text-amber-600 border-amber-100"
                  : "bg-emerald-50 text-emerald-600 border-emerald-100";

            return (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      District overview
                    </p>
                    <h3 className="mt-0.5 truncate text-sm font-black text-[#173f6e]">
                      {hovered}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[8px] font-extrabold ${statusClasses}`}
                  >
                    <StatusIcon size={11} /> {status.label}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {[
                    ["Total Problems", data.totalProblems],
                    ["Completed Projects", data.completedProjects],
                    ["Fund Utilization", `${data.utilization}%`],
                    ["Active Alerts", data.activeAlerts],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-slate-50 px-2 py-2">
                      <p className="text-[7px] font-semibold text-slate-400">{label}</p>
                      <p className="mt-0.5 text-[12px] font-black text-slate-700">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-1.5 rounded-xl border border-slate-100 bg-white px-2.5 py-2">
                  <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-slate-400">
                    Bottleneck
                  </p>
                  <p className="mt-0.5 text-[9px] font-bold leading-snug text-slate-700">
                    {data.bottlenecks}
                  </p>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default JharkhandDistrictMap;
