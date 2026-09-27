import React, { useMemo, useRef, useState } from "react";
import {
  Handshake,
  Layers,
  MapPin,
  Sparkles,
  Building2,
  GraduationCap,
  TrendingUp,
  ArrowRight,
  CircleDot,
} from "lucide-react";
import sihMap from "../../assets/sih-map.png";

// Exact calibrated polygon coordinates for Jharkhand's 24 districts (viewBox: 439 x 298)
const DISTRICT_ZONES = {
  Garhwa: [
    [12, 71], [10, 76], [17, 85], [12, 87], [13, 94], [6, 107], [23, 115],
    [25, 126], [39, 134], [44, 152], [60, 157], [62, 150], [70, 149],
    [69, 138], [62, 132], [60, 123], [52, 123], [56, 113], [67, 106],
    [48, 90], [51, 67], [39, 72],
  ],
  Palamu: [
    [67, 57], [60, 68], [54, 69], [49, 83], [58, 99], [70, 107], [59, 114],
    [55, 123], [60, 120], [70, 135], [82, 122], [96, 128], [103, 121],
    [113, 126], [119, 121], [120, 104], [107, 95], [110, 92], [107, 84],
    [94, 76], [97, 71], [94, 65], [84, 71], [80, 68], [77, 75],
  ],
  Chatra: [
    [142, 69], [132, 74], [126, 83], [119, 81], [110, 95], [124, 104],
    [120, 109], [122, 120], [136, 114], [141, 120], [152, 122], [156, 130],
    [152, 140], [163, 148], [169, 146], [171, 139], [164, 136], [160, 123],
    [177, 118], [169, 100], [172, 96], [181, 97], [183, 90], [169, 91],
    [161, 80], [150, 84], [147, 76], [142, 76],
  ],
  Latehar: [
    [152, 124], [140, 123], [135, 117], [112, 129], [106, 123], [99, 130],
    [83, 124], [69, 141], [73, 148], [69, 152], [71, 162], [67, 175],
    [88, 177], [101, 156], [113, 157], [124, 151], [133, 156], [139, 153],
    [147, 161], [154, 160], [157, 149], [150, 141], [154, 136],
  ],
  Lohardaga: [
    [113, 159], [116, 170], [121, 166], [145, 167], [147, 171], [142, 174],
    [109, 171], [120, 181], [135, 179], [139, 185], [150, 181], [150, 168],
    [156, 164], [153, 161], [146, 164], [138, 156], [132, 159], [118, 155],
  ],
  Gumla: [
    [75, 180], [71, 195], [80, 202], [80, 209], [95, 215], [99, 210],
    [104, 212], [105, 216], [97, 224], [100, 229], [118, 224], [122, 230],
    [126, 227], [137, 234], [156, 223], [151, 217], [154, 211], [147, 209],
    [148, 199], [154, 192], [149, 188], [151, 184], [140, 188], [134, 182],
    [112, 181], [106, 171], [110, 160], [101, 159], [89, 179],
  ],
  Simdega: [
    [63, 247], [88, 271], [111, 266], [131, 268], [141, 258], [155, 261],
    [168, 255], [160, 230], [155, 227], [133, 237], [129, 231], [121, 234],
    [120, 227], [113, 226], [104, 233], [89, 232], [85, 240], [71, 241],
  ],
  Khunti: [
    [154, 216], [167, 245], [176, 227], [184, 221], [206, 230], [222, 222],
    [217, 219], [219, 206], [211, 206], [197, 195], [180, 197], [179, 192],
    [173, 190], [163, 197], [164, 203],
  ],
  Ranchi: [
    [159, 149], [159, 164], [152, 173], [156, 193], [150, 200], [151, 209],
    [156, 208], [162, 201], [161, 196], [172, 188], [182, 194], [190, 191],
    [206, 196], [212, 204], [220, 204], [223, 213], [234, 207], [242, 178],
    [213, 171], [194, 148], [184, 142], [177, 151], [174, 147],
  ],
  Hazaribagh: [
    [166, 84], [168, 88], [186, 90], [183, 100], [172, 99], [173, 109],
    [180, 118], [173, 124], [162, 124], [167, 129], [166, 135], [174, 138],
    [170, 144], [177, 146], [184, 139], [192, 145], [197, 133], [212, 121],
    [227, 119], [232, 125], [241, 123], [234, 117], [236, 113], [226, 109],
    [225, 103], [236, 99], [196, 92], [188, 81], [191, 75], [185, 71],
    [176, 73],
  ],
  Koderma: [
    [241, 46], [227, 46], [219, 54], [218, 64], [210, 62], [207, 68],
    [195, 65], [189, 72], [194, 74], [192, 82], [197, 89], [209, 88],
    [221, 94], [238, 92], [235, 87], [238, 68], [232, 60],
  ],
  Giridih: [
    [238, 52], [235, 59], [241, 68], [240, 93], [237, 101], [227, 104],
    [239, 112], [236, 116], [249, 129], [277, 127], [282, 114], [295, 116],
    [300, 112], [301, 106], [296, 106], [299, 94], [288, 82], [279, 79],
    [279, 65], [265, 65], [262, 52], [254, 48],
  ],
  Deoghar: [
    [309, 65], [305, 72], [299, 73], [295, 85], [301, 93], [299, 106],
    [320, 106], [324, 112], [339, 114], [338, 106], [348, 96], [336, 86],
    [333, 79], [336, 71], [327, 70], [323, 64],
  ],
  Dumka: [
    [339, 62], [336, 80], [342, 90], [351, 95], [342, 107], [346, 105],
    [360, 115], [388, 120], [386, 118], [393, 115], [392, 108], [398, 110],
    [400, 102], [409, 103], [406, 96], [399, 95], [397, 74], [382, 77],
    [374, 65], [362, 67], [349, 63], [347, 66],
  ],
  Godda: [
    [382, 7], [371, 23], [364, 22], [354, 28], [358, 43], [351, 46],
    [354, 50], [349, 60], [362, 64], [374, 62], [382, 69], [381, 53],
    [393, 44], [387, 32], [390, 26], [385, 22], [387, 11],
  ],
  Sahibganj: [
    [392, 9], [395, 12], [389, 13], [395, 48], [402, 47], [410, 54],
    [413, 50], [424, 50], [431, 34], [414, 25], [413, 14], [409, 16],
  ],
  Pakur: [
    [388, 50], [383, 54], [387, 57], [383, 74], [397, 71], [402, 95],
    [409, 96], [421, 80], [420, 70], [427, 72], [430, 63], [424, 60],
    [427, 55], [414, 52], [410, 57], [400, 49],
  ],
  Ramgarh: [
    [198, 140], [219, 151], [224, 146], [235, 149], [239, 158], [249, 149],
    [267, 154], [267, 142], [261, 129], [249, 132], [241, 125], [232, 128],
    [228, 122], [212, 124], [209, 130], [201, 132],
  ],
  Bokaro: [
    [195, 142], [214, 169], [235, 174], [241, 168], [233, 151], [209, 151],
    [207, 146],
  ],
  Dhanbad: [
    [264, 130], [270, 151], [286, 159], [303, 149], [318, 151], [329, 149],
    [331, 144], [329, 137], [287, 115], [282, 117], [278, 129],
  ],
  Jamtara: [
    [332, 151], [304, 152], [289, 160], [288, 166], [297, 176], [314, 182],
    [325, 172], [332, 174], [332, 168], [338, 166],
  ],
  "Saraikela-Kharsawan": [
    [241, 195], [229, 215], [219, 218], [231, 227], [232, 239], [241, 237],
    [249, 242], [248, 250], [254, 256], [273, 241], [279, 222], [276, 204],
    [268, 206], [262, 199],
  ],
  "East Singhbhum": [
    [279, 209], [281, 228], [267, 252], [293, 276], [310, 275], [317, 283],
    [326, 281], [330, 276], [323, 260], [328, 256], [326, 249], [316, 249],
    [314, 241], [296, 228], [299, 218], [304, 217], [301, 211], [290, 207],
  ],
  "West Singhbhum": [
    [177, 229], [179, 232], [168, 249], [172, 255], [169, 262], [173, 263],
    [162, 286], [171, 283], [185, 290], [192, 279], [201, 277], [223, 286],
    [237, 281], [241, 285], [236, 287], [237, 293], [251, 289], [259, 278],
    [256, 274], [261, 271], [261, 265], [245, 250], [247, 243], [230, 241],
    [225, 226], [207, 232], [186, 224],
  ],
};

// Visual centroids for inter-district collaboration arcs
const DISTRICT_CENTROIDS = {
  Garhwa: [38, 110],
  Palamu: [85, 95],
  Chatra: [148, 105],
  Latehar: [118, 145],
  Lohardaga: [135, 168],
  Gumla: [115, 205],
  Simdega: [115, 245],
  Khunti: [185, 210],
  Ranchi: [188, 175],
  Hazaribagh: [198, 110],
  Koderma: [215, 70],
  Giridih: [265, 85],
  Deoghar: [320, 85],
  Dumka: [368, 90],
  Godda: [372, 38],
  Sahibganj: [408, 30],
  Pakur: [405, 70],
  Ramgarh: [235, 140],
  Bokaro: [218, 160],
  Dhanbad: [298, 142],
  Jamtara: [310, 165],
  "Saraikela-Kharsawan": [250, 225],
  "East Singhbhum": [300, 245],
  "West Singhbhum": [215, 260],
};

// District Collaborations & Projects Data
export const JHARKHAND_DISTRICT_COLLABORATIONS = {
  Ranchi: {
    collaborations: ["East Singhbhum", "Dhanbad", "Bokaro", "Ramgarh", "Khunti"],
    leadUniversity: "BIT Mesra & Ranchi University",
    activeProjects: 8,
    csrFund: "₹ 2.45 Cr",
    keyInitiatives: [
      "AI Smart Traffic Corridor (w/ Dhanbad)",
      "Subarnarekha Water Telemetry (w/ East Singhbhum)",
      "Solar Microgrid Automation (w/ Ramgarh)",
    ],
    domainFocus: "Smart City & Water Management",
  },
  "East Singhbhum": {
    collaborations: ["Ranchi", "Saraikela-Kharsawan", "West Singhbhum", "Dhanbad"],
    leadUniversity: "NIT Jamshedpur",
    activeProjects: 6,
    csrFund: "₹ 1.95 Cr",
    keyInitiatives: [
      "River Hydrology Sensor Network (w/ Ranchi)",
      "Industrial Air Filtration Mesh (w/ Saraikela)",
      "Tribal Health Telemedicine (w/ West Singhbhum)",
    ],
    domainFocus: "Water & Environmental Monitoring",
  },
  Dhanbad: {
    collaborations: ["Ranchi", "Bokaro", "Giridih", "Jamtara"],
    leadUniversity: "IIT (ISM) Dhanbad & BIT Sindri",
    activeProjects: 5,
    csrFund: "₹ 1.70 Cr",
    keyInitiatives: [
      "Mining Air Quality & Carbon Capture (w/ Bokaro)",
      "Industrial IoT Automation (w/ Ranchi)",
      "Vocational Tech Skill Hub (w/ Giridih)",
    ],
    domainFocus: "Industrial IoT & Clean Tech",
  },
  Bokaro: {
    collaborations: ["Dhanbad", "Ranchi", "Ramgarh", "Giridih"],
    leadUniversity: "IIT Ranchi Extension & Bokaro College",
    activeProjects: 4,
    csrFund: "₹ 1.25 Cr",
    keyInitiatives: [
      "Solar Grid Load Balancer (w/ Ramgarh)",
      "Industrial Waste Resource Recovery (w/ Dhanbad)",
    ],
    domainFocus: "Renewable Energy & Waste Recovery",
  },
  Dumka: {
    collaborations: ["Deoghar", "Godda", "Sahibganj", "Pakur"],
    leadUniversity: "Sido Kanhu Murmu University",
    activeProjects: 4,
    csrFund: "₹ 95 L",
    keyInitiatives: [
      "Santhal Pargana Agri-AI Drone Diagnostics (w/ Deoghar)",
      "Vernacular AI Education Tablet Network (w/ Godda)",
    ],
    domainFocus: "AgriTech & Rural Education",
  },
  Hazaribagh: {
    collaborations: ["Koderma", "Chatra", "Ramgarh", "Ranchi"],
    leadUniversity: "Vinoba Bhave University",
    activeProjects: 4,
    csrFund: "₹ 88 L",
    keyInitiatives: [
      "Precision Soil Health & Solar Irrigation (w/ Chatra)",
      "Rural Bio-gas & Power Sharing (w/ Koderma)",
    ],
    domainFocus: "AgriTech & Rural Infrastructure",
  },
  Deoghar: {
    collaborations: ["Dumka", "Jamtara", "Giridih", "Godda"],
    leadUniversity: "AIIMS Deoghar & BIT Deoghar",
    activeProjects: 3,
    csrFund: "₹ 80 L",
    keyInitiatives: [
      "Pilgrim Crowd Analytics & Smart Transit (w/ Dumka)",
      "Rural Tele-Diagnostic Health Mesh (w/ AIIMS)",
    ],
    domainFocus: "Healthcare & Smart Tourism",
  },
  "West Singhbhum": {
    collaborations: ["East Singhbhum", "Saraikela-Kharsawan", "Khunti", "Simdega"],
    leadUniversity: "Kolhan University",
    activeProjects: 3,
    csrFund: "₹ 70 L",
    keyInitiatives: [
      "Tribal Health Diagnostic Kit (w/ East Singhbhum)",
      "Forest Produce Supply Chain Tracking (w/ Simdega)",
    ],
    domainFocus: "Healthcare & Tribal Welfare",
  },
  "Saraikela-Kharsawan": {
    collaborations: ["East Singhbhum", "West Singhbhum", "Ranchi"],
    leadUniversity: "Arka Jain University",
    activeProjects: 3,
    csrFund: "₹ 65 L",
    keyInitiatives: [
      "Auto Cluster Effluent Monitoring (w/ East Singhbhum)",
      "Micro-Industrial Green Supply Hub",
    ],
    domainFocus: "Industrial Sustainability",
  },
  Ramgarh: {
    collaborations: ["Ranchi", "Bokaro", "Hazaribagh"],
    leadUniversity: "Ramgarh Engineering College",
    activeProjects: 3,
    csrFund: "₹ 60 L",
    keyInitiatives: [
      "Highway AI Emergency Lane Dispatch (w/ Ranchi)",
      "Coal Belt Water Reclamation System",
    ],
    domainFocus: "Transport & Water Treatment",
  },
  Giridih: {
    collaborations: ["Dhanbad", "Koderma", "Deoghar", "Bokaro"],
    leadUniversity: "Giridih College & VBU",
    activeProjects: 3,
    csrFund: "₹ 55 L",
    keyInitiatives: [
      "Solar Water Pump Monitoring Grid (w/ Koderma)",
      "Eco-Tourism Digital Infrastructure",
    ],
    domainFocus: "Renewable Energy & Tourism",
  },
  Palamu: {
    collaborations: ["Garhwa", "Latehar", "Chatra"],
    leadUniversity: "Nilamber-Pitamber University",
    activeProjects: 2,
    csrFund: "₹ 50 L",
    keyInitiatives: [
      "Drought Early Warning & Checkdam Telemetry (w/ Garhwa)",
      "Solar Micro-Cold Storage",
    ],
    domainFocus: "AgriTech & Water Security",
  },
  Garhwa: {
    collaborations: ["Palamu", "Latehar"],
    leadUniversity: "Govt Polytechnic Garhwa & NPU",
    activeProjects: 2,
    csrFund: "₹ 45 L",
    keyInitiatives: [
      "Solar Irrigation Flow Controller (w/ Palamu)",
      "Groundwater Table Sensors",
    ],
    domainFocus: "Water & Agriculture",
  },
  Chatra: {
    collaborations: ["Hazaribagh", "Palamu", "Latehar"],
    leadUniversity: "Chatra College",
    activeProjects: 2,
    csrFund: "₹ 40 L",
    keyInitiatives: [
      "Horticulture Drone Mapping (w/ Hazaribagh)",
      "Rural Road Damage Sensor Mapping",
    ],
    domainFocus: "Rural Roads & AgriTech",
  },
  Latehar: {
    collaborations: ["Palamu", "Lohardaga", "Garhwa", "Ranchi"],
    leadUniversity: "Latehar Polytechnic",
    activeProjects: 2,
    csrFund: "₹ 40 L",
    keyInitiatives: [
      "Forest Fire Early Warning Telemetry (w/ Ranchi)",
      "Solar Water Pumping Pods",
    ],
    domainFocus: "Forest Protection & Renewable Energy",
  },
  Lohardaga: {
    collaborations: ["Ranchi", "Latehar", "Gumla"],
    leadUniversity: "BS College Lohardaga",
    activeProjects: 2,
    csrFund: "₹ 38 L",
    keyInitiatives: [
      "Bauxite Transport Fleet Tracking (w/ Ranchi)",
      "Primary School STEM Labs",
    ],
    domainFocus: "Logistics & Education",
  },
  Gumla: {
    collaborations: ["Ranchi", "Lohardaga", "Simdega", "Khunti"],
    leadUniversity: "Kartik Oraon College",
    activeProjects: 2,
    csrFund: "₹ 35 L",
    keyInitiatives: [
      "Millet Processing Unit Automation (w/ Ranchi)",
      "Tribal Health Tele-consultation",
    ],
    domainFocus: "AgriTech & Healthcare",
  },
  Simdega: {
    collaborations: ["Gumla", "West Singhbhum", "Khunti"],
    leadUniversity: "Simdega College",
    activeProjects: 2,
    csrFund: "₹ 32 L",
    keyInitiatives: [
      "Sports Analytics & Athlete Monitoring Unit",
      "Minor Forest Produce Processing Grid",
    ],
    domainFocus: "Sports Tech & Rural Economy",
  },
  Khunti: {
    collaborations: ["Ranchi", "West Singhbhum", "Gumla"],
    leadUniversity: "Birsa College Khunti",
    activeProjects: 2,
    csrFund: "₹ 35 L",
    keyInitiatives: [
      "Organic Lac Cultivation AI Quality Tester",
      "Solar Drinking Water Plants (w/ Ranchi)",
    ],
    domainFocus: "AgriTech & Clean Water",
  },
  Koderma: {
    collaborations: ["Hazaribagh", "Giridih"],
    leadUniversity: "JJ College Koderma",
    activeProjects: 2,
    csrFund: "₹ 30 L",
    keyInitiatives: [
      "Mica Belt Water Table Filtration",
      "Renewable Rooftop Solar Grid (w/ Giridih)",
    ],
    domainFocus: "Clean Tech & Water",
  },
  Jamtara: {
    collaborations: ["Dhanbad", "Deoghar", "Dumka"],
    leadUniversity: "Jamtara College",
    activeProjects: 2,
    csrFund: "₹ 28 L",
    keyInitiatives: [
      "Cybersecurity Awareness & Youth Coding Labs (w/ Dhanbad)",
      "Digital Literacy Vans",
    ],
    domainFocus: "Cybersecurity & Education",
  },
  Godda: {
    collaborations: ["Dumka", "Deoghar", "Sahibganj"],
    leadUniversity: "Godda College",
    activeProjects: 2,
    csrFund: "₹ 30 L",
    keyInitiatives: [
      "Thermal Power Ash Waste Utilization (w/ Dumka)",
      "Precision Farm Irrigation",
    ],
    domainFocus: "Waste Recovery & Power",
  },
  Sahibganj: {
    collaborations: ["Godda", "Pakur", "Dumka"],
    leadUniversity: "Sahibganj College",
    activeProjects: 2,
    csrFund: "₹ 28 L",
    keyInitiatives: [
      "Ganga Riverbank Erosion Telemetry (w/ Dumka)",
      "Multi-modal Cargo Logistics Tracking",
    ],
    domainFocus: "Water & Logistics",
  },
  Pakur: {
    collaborations: ["Dumka", "Sahibganj", "Godda"],
    leadUniversity: "KKM College Pakur",
    activeProjects: 2,
    csrFund: "₹ 25 L",
    keyInitiatives: [
      "Stone Crusher Dust Suppression Mesh",
      "Rural Maternal Health Diagnostics (w/ Dumka)",
    ],
    domainFocus: "Environmental Tech & Health",
  },
};

const IndustryDistrictCollaborationMap = ({ onDistrictSelect }) => {
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [pinnedDistrict, setPinnedDistrict] = useState(null);
  const containerRef = useRef(null);

  const activeDistrict = hoveredDistrict || pinnedDistrict || "Ranchi";
  const activeData =
    JHARKHAND_DISTRICT_COLLABORATIONS[activeDistrict] ||
    JHARKHAND_DISTRICT_COLLABORATIONS["Ranchi"];

  // Partnered districts list for the active district
  const partneredDistricts = useMemo(() => {
    return activeData?.collaborations || [];
  }, [activeData]);

  // Generate inter-district collaboration curve lines
  const collaborationLines = useMemo(() => {
    if (!activeDistrict || !DISTRICT_CENTROIDS[activeDistrict]) return [];
    const [x1, y1] = DISTRICT_CENTROIDS[activeDistrict];

    return partneredDistricts
      .map((target) => {
        const targetCoord = DISTRICT_CENTROIDS[target];
        if (!targetCoord) return null;
        const [x2, y2] = targetCoord;

        // Quadratic bezier midpoint with curvature
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - 12; // arc upward

        return {
          target,
          d: `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`,
          targetCoord,
        };
      })
      .filter(Boolean);
  }, [activeDistrict, partneredDistricts]);

  return (
    <div className="flex flex-col gap-3">
      {/* Interactive Map Canvas */}
      <div
        ref={containerRef}
        className="relative mx-auto aspect-[439/298] w-full overflow-hidden rounded-xl border border-blue-100 bg-[#f8fbff] shadow-inner select-none"
        onMouseLeave={() => setHoveredDistrict(null)}
      >
        {/* Base Map Image */}
        <img
          src={sihMap}
          alt="Jharkhand State 24 District Collaboration Map"
          draggable="false"
          className="absolute inset-0 block h-full w-full object-contain object-center"
        />

        {/* SVG Interactive Overlay for Districts & Collaboration Links */}
        <svg
          viewBox="0 0 439 298"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full pointer-events-none"
          aria-label="Jharkhand Interactive District Collaboration Map"
        >
          {/* Animated Collaboration Arcs */}
          {collaborationLines.map(({ target, d, targetCoord }) => (
            <g key={target} className="transition-opacity duration-300">
              {/* Glow line */}
              <path
                d={d}
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                opacity="0.8"
                className="animate-pulse"
              />
              {/* Moving Pulse Dot */}
              <circle
                cx={targetCoord[0]}
                cy={targetCoord[1]}
                r="3.5"
                fill="#0284c7"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          ))}

          {/* Active District Center Indicator */}
          {DISTRICT_CENTROIDS[activeDistrict] && (
            <g>
              <circle
                cx={DISTRICT_CENTROIDS[activeDistrict][0]}
                cy={DISTRICT_CENTROIDS[activeDistrict][1]}
                r="5"
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Clickable/Hoverable District Polygons */}
          {Object.entries(DISTRICT_ZONES).map(([district, points]) => {
            const isHovered = hoveredDistrict === district;
            const isSelected = activeDistrict === district;
            const isPartner = partneredDistricts.includes(district);

            let fill = "rgba(255,255,255,0.001)";
            let stroke = "transparent";
            let strokeWidth = 0;

            if (isSelected) {
              fill = "rgba(37,99,235,0.22)";
              stroke = "#1d4ed8";
              strokeWidth = 2.4;
            } else if (isPartner) {
              fill = "rgba(14,165,233,0.14)";
              stroke = "#0284c7";
              strokeWidth = 1.6;
            }

            return (
              <polygon
                key={district}
                points={points.map(([x, y]) => `${x},${y}`).join(" ")}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                vectorEffect="non-scaling-stroke"
                className="pointer-events-auto cursor-pointer transition-all duration-150 hover:brightness-110"
                onMouseEnter={() => setHoveredDistrict(district)}
                onClick={() => {
                  setPinnedDistrict(district);
                  onDistrictSelect?.(district);
                }}
              />
            );
          })}
        </svg>

        {/* Live Hover Status Badge */}
        <div className="pointer-events-none absolute top-2 left-2 flex items-center gap-1.5 rounded-md bg-white/90 px-2 py-1 shadow-sm backdrop-blur-sm border border-blue-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="text-[10px] font-bold text-[#0d3971]">
            {activeDistrict} District
          </span>
        </div>
      </div>

      {/* Real-time District Collaboration & Joint Projects Card */}
      <div className="rounded-xl border border-blue-100 bg-white p-3.5 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-600 shrink-0" />
              <h3 className="truncate text-sm font-extrabold text-[#0d3971]">
                {activeDistrict} Collaboration Hub
              </h3>
            </div>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">
              Lead: {activeData.leadUniversity}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100">
              <Sparkles size={11} /> {activeData.csrFund} CSR
            </span>
          </div>
        </div>

        {/* Partnered Districts Collaboration Badges */}
        <div className="mt-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Inter-District Collaborations ({partneredDistricts.length})
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {partneredDistricts.map((partner) => (
              <button
                key={partner}
                type="button"
                onClick={() => setPinnedDistrict(partner)}
                className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 hover:bg-sky-100 border border-sky-200/60 transition"
              >
                <Handshake size={10} /> {partner}
              </button>
            ))}
          </div>
        </div>

        {/* Key Joint Initiatives */}
        <div className="mt-2.5 border-t border-slate-100 pt-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Joint Projects
          </p>
          <div className="mt-1 space-y-1">
            {activeData.keyInitiatives.slice(0, 2).map((initiative, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-[10px] font-medium text-slate-700 truncate"
              >
                <CircleDot size={9} className="text-blue-500 shrink-0" />
                <span className="truncate">{initiative}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryDistrictCollaborationMap;
