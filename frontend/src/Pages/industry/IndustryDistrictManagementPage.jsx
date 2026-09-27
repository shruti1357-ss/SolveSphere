import { useState, useMemo, useEffect } from "react";
import {
  Map,
  MapPin,
  Activity,
  Building2,
  Search,
  Filter,
  Sparkles,
  GraduationCap,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Eye,
  Handshake,
  CheckCircle2,
  Clock,
  Layers,
  X,
  Compass,
  FileText,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import IndustryModuleLayout from "../../components/industry/IndustryModuleLayout";
import IndustryDistrictCollaborationMap from "../../components/industry/IndustryDistrictCollaborationMap";
import CollaborationModal from "../../components/industry/CollaborationModal";
import { useAuth } from "../../context/AuthContext";

// Complete 24 Districts Dataset of Jharkhand with administrative divisions
const JHARKHAND_DISTRICTS_DATA = [
  // South Chotanagpur Division
  {
    name: "Ranchi",
    division: "South Chotanagpur",
    leadUniversity: "BIT Mesra, Ranchi University & IIIT Ranchi",
    focusDomain: "Smart City Transit & Water Telemetry",
    activeProjects: 8,
    reportedIssues: 42,
    csrCapital: "₹ 2.45 Cr",
    partnerDistricts: ["East Singhbhum", "Dhanbad", "Bokaro", "Ramgarh", "Khunti"],
    keyInitiatives: [
      "AI Smart Traffic Corridor with Emergency Vehicle Corridors",
      "Subarnarekha River Basin Real-Time Sensor Telemetry",
      "Solar Microgrid Automated Load Balancer & Battery Storage",
    ],
    highlight: "State Capital Innovation Center & Apex R&D Hub",
  },
  {
    name: "Khunti",
    division: "South Chotanagpur",
    leadUniversity: "Birsa College Khunti",
    focusDomain: "Clean Water & AgriTech",
    activeProjects: 3,
    reportedIssues: 16,
    csrCapital: "₹ 35 L",
    partnerDistricts: ["Ranchi", "West Singhbhum", "Gumla"],
    keyInitiatives: [
      "Organic Lac Cultivation AI Grading & Quality Tester",
      "Solar-Powered Community Drinking Water Filtration Plants",
    ],
    highlight: "Tribal Organic Agricultural Zone",
  },
  {
    name: "Gumla",
    division: "South Chotanagpur",
    leadUniversity: "Kartik Oraon College",
    focusDomain: "AgriTech & Rural Health",
    activeProjects: 3,
    reportedIssues: 18,
    csrCapital: "₹ 35 L",
    partnerDistricts: ["Ranchi", "Lohardaga", "Simdega", "Khunti"],
    keyInitiatives: [
      "Millet Processing Unit Automation & Solar Dryer Mesh",
      "Tribal Health Tele-Consultation Sub-Centers",
    ],
    highlight: "Nutri-Cereals & Indigenous Agro-Cluster",
  },
  {
    name: "Simdega",
    division: "South Chotanagpur",
    leadUniversity: "Simdega College",
    focusDomain: "Sports Analytics & Rural Economy",
    activeProjects: 2,
    reportedIssues: 14,
    csrCapital: "₹ 32 L",
    partnerDistricts: ["Gumla", "West Singhbhum", "Khunti"],
    keyInitiatives: [
      "Grassroots Athlete Biometric & Performance Telemetry",
      "Minor Forest Produce (MFP) Value Addition Hub",
    ],
    highlight: "National Cradle for Hockey & Sports Excellence",
  },
  {
    name: "Lohardaga",
    division: "South Chotanagpur",
    leadUniversity: "BS College Lohardaga",
    focusDomain: "Logistics IoT & STEM Labs",
    activeProjects: 2,
    reportedIssues: 12,
    csrCapital: "₹ 38 L",
    partnerDistricts: ["Ranchi", "Latehar", "Gumla"],
    keyInitiatives: [
      "Bauxite Haulage Fleet GPS Telemetry & Road Safety Sensors",
      "Primary School STEM Innovation Mobile Labs",
    ],
    highlight: "Mineral Haulage Infrastructure Corridor",
  },

  // North Chotanagpur Division
  {
    name: "Dhanbad",
    division: "North Chotanagpur",
    leadUniversity: "IIT (ISM) Dhanbad & BIT Sindri",
    focusDomain: "Clean Mining & Air Quality",
    activeProjects: 7,
    reportedIssues: 31,
    csrCapital: "₹ 1.70 Cr",
    partnerDistricts: ["Ranchi", "Bokaro", "Giridih", "Jamtara"],
    keyInitiatives: [
      "Underground Mine Gas & Toxic Smog Telemetry",
      "Air Quality Fine-Mist Filtration & Carbon Capture Mesh",
      "Vocational Technical Skill & AI Coding Lab",
    ],
    highlight: "Energy Capital & Mineral Technology Apex",
  },
  {
    name: "Bokaro",
    division: "North Chotanagpur",
    leadUniversity: "IIT Ranchi Extension & Bokaro Steel City College",
    focusDomain: "Clean Tech & Steel Waste Recovery",
    activeProjects: 6,
    reportedIssues: 28,
    csrCapital: "₹ 1.25 Cr",
    partnerDistricts: ["Dhanbad", "Ranchi", "Ramgarh", "Giridih"],
    keyInitiatives: [
      "Industrial Slag & Solid Waste Byproduct Processing",
      "Solar Rooftop Microgrid Grid-Tied Inverter Balancing",
    ],
    highlight: "Steel & Heavy Industrial Manufacturing Core",
  },
  {
    name: "Hazaribagh",
    division: "North Chotanagpur",
    leadUniversity: "Vinoba Bhave University",
    focusDomain: "Solar Irrigation & Soil Health",
    activeProjects: 5,
    reportedIssues: 24,
    csrCapital: "₹ 88 L",
    partnerDistricts: ["Koderma", "Chatra", "Ramgarh", "Ranchi"],
    keyInitiatives: [
      "Precision Soil Nutrient Mapping & Solar Borewell Controllers",
      "Rural Bio-Gas Energy Sharing Micro-Grids",
    ],
    highlight: "Agricultural Plateau & Education Center",
  },
  {
    name: "Giridih",
    division: "North Chotanagpur",
    leadUniversity: "Giridih College & VBU Center",
    focusDomain: "Renewable Solar & Clean Tech",
    activeProjects: 3,
    reportedIssues: 19,
    csrCapital: "₹ 55 L",
    partnerDistricts: ["Dhanbad", "Koderma", "Deoghar", "Bokaro"],
    keyInitiatives: [
      "Solar Water Pump Remote IoT Monitoring Grid",
      "Parasnath Eco-Tourism Digital Crowd Analytics",
    ],
    highlight: "Solar City Model & Cultural Heritage Hub",
  },
  {
    name: "Ramgarh",
    division: "North Chotanagpur",
    leadUniversity: "Ramgarh Engineering College",
    focusDomain: "Highway AI & Industrial Water Treatment",
    activeProjects: 4,
    reportedIssues: 21,
    csrCapital: "₹ 60 L",
    partnerDistricts: ["Ranchi", "Bokaro", "Hazaribagh"],
    keyInitiatives: [
      "Highway AI Emergency Lane Automated Dispatch Net",
      "Coal Belt Industrial Runoff Neutralization Plant",
    ],
    highlight: "Industrial Logistics & Transport Arterial",
  },
  {
    name: "Koderma",
    division: "North Chotanagpur",
    leadUniversity: "JJ College Koderma",
    focusDomain: "Clean Tech & Water Table Sensors",
    activeProjects: 2,
    reportedIssues: 15,
    csrCapital: "₹ 30 L",
    partnerDistricts: ["Hazaribagh", "Giridih"],
    keyInitiatives: [
      "Mica Belt Groundwater Heavy Metal Filtration",
      "Renewable Commercial Solar Rooftop Network",
    ],
    highlight: "Mica Mining Heritage & Reservoir Basin",
  },
  {
    name: "Chatra",
    division: "North Chotanagpur",
    leadUniversity: "Chatra College",
    focusDomain: "Horticulture Drones & Road Sensors",
    activeProjects: 2,
    reportedIssues: 14,
    csrCapital: "₹ 40 L",
    partnerDistricts: ["Hazaribagh", "Palamu", "Latehar"],
    keyInitiatives: [
      "Horticulture Drone Topography & Yield Mapping",
      "Rural Road Cratering & Pothole Early Detection Mesh",
    ],
    highlight: "Forest Horticulture & Hill Agri-Zone",
  },

  // Kolhan Division
  {
    name: "East Singhbhum",
    division: "Kolhan",
    leadUniversity: "NIT Jamshedpur & Arka Jain University",
    focusDomain: "River Hydrology & Air Quality Mesh",
    activeProjects: 8,
    reportedIssues: 36,
    csrCapital: "₹ 1.95 Cr",
    partnerDistricts: ["Ranchi", "Saraikela-Kharsawan", "West Singhbhum", "Dhanbad"],
    keyInitiatives: [
      "Subarnarekha & Kharkai River Real-Time Hydrology Telemetry",
      "Industrial Effluent Neutralization Sensor Mesh",
      "Smart Urban Stormwater Drainage Simulation",
    ],
    highlight: "Industrial Metropole & High-Tech Manufacturing",
  },
  {
    name: "West Singhbhum",
    division: "Kolhan",
    leadUniversity: "Kolhan University",
    focusDomain: "Tribal Healthcare & Bio-Diagnostics",
    activeProjects: 4,
    reportedIssues: 20,
    csrCapital: "₹ 70 L",
    partnerDistricts: ["East Singhbhum", "Saraikela-Kharsawan", "Khunti", "Simdega"],
    keyInitiatives: [
      "Portable Clinical Diagnostic Suitcases for Remote Clinics",
      "Saranda Forest Produce Sustainable Supply Chain Traceability",
    ],
    highlight: "Saranda Forest & Iron Ore Mining District",
  },
  {
    name: "Saraikela-Kharsawan",
    division: "Kolhan",
    leadUniversity: "Arka Jain University",
    focusDomain: "Auto Cluster Effluent & Clean Supply",
    activeProjects: 3,
    reportedIssues: 17,
    csrCapital: "₹ 65 L",
    partnerDistricts: ["East Singhbhum", "West Singhbhum", "Ranchi"],
    keyInitiatives: [
      "Adityapur Auto Cluster Effluent Treatment Monitoring",
      "Micro-Industrial Green Manufacturing Common Facility",
    ],
    highlight: "Asia's Largest Industrial Ancillary Cluster",
  },

  // Santhal Pargana Division
  {
    name: "Dumka",
    division: "Santhal Pargana",
    leadUniversity: "Sido Kanhu Murmu University",
    focusDomain: "Agri-AI Drones & Vernacular EdTech",
    activeProjects: 5,
    reportedIssues: 22,
    csrCapital: "₹ 95 L",
    partnerDistricts: ["Deoghar", "Godda", "Sahibganj", "Pakur"],
    keyInitiatives: [
      "Santhal Pargana Crop Disease Drone Diagnostic Station",
      "Vernacular Primary School Speech AI Learning Tablet Net",
    ],
    highlight: "Sub-Capital of Jharkhand & Cultural Anchor",
  },
  {
    name: "Deoghar",
    division: "Santhal Pargana",
    leadUniversity: "AIIMS Deoghar & BIT Deoghar",
    focusDomain: "Smart Transit & Tele-Medicine",
    activeProjects: 4,
    reportedIssues: 18,
    csrCapital: "₹ 80 L",
    partnerDistricts: ["Dumka", "Jamtara", "Giridih", "Godda"],
    keyInitiatives: [
      "Pilgrim Transit AI Crowd Analytics & Incident Response",
      "Rural Tele-Diagnostics Screening Network with AIIMS",
    ],
    highlight: "Spiritual Tourism & Apex Healthcare City",
  },
  {
    name: "Godda",
    division: "Santhal Pargana",
    leadUniversity: "Godda College",
    focusDomain: "Thermal Ash Waste & Precision Irrigation",
    activeProjects: 2,
    reportedIssues: 14,
    csrCapital: "₹ 30 L",
    partnerDistricts: ["Dumka", "Deoghar", "Sahibganj"],
    keyInitiatives: [
      "Thermal Power Fly Ash Geopolymer Construction Blocks",
      "Checkdam Solar Micro-Lift Irrigation Controllers",
    ],
    highlight: "Power Generation & Agrarian Basin",
  },
  {
    name: "Sahibganj",
    division: "Santhal Pargana",
    leadUniversity: "Sahibganj College",
    focusDomain: "Riverbank Telemetry & Logistics",
    activeProjects: 2,
    reportedIssues: 13,
    csrCapital: "₹ 28 L",
    partnerDistricts: ["Godda", "Pakur", "Dumka"],
    keyInitiatives: [
      "Ganga Riverbank Erosion Acoustic Telemetry",
      "Multi-Modal River Port Freight Fleet IoT Telemetry",
    ],
    highlight: "Inland Waterway Port on the River Ganga",
  },
  {
    name: "Pakur",
    division: "Santhal Pargana",
    leadUniversity: "KKM College Pakur",
    focusDomain: "Dust Suppression & Maternal Health",
    activeProjects: 2,
    reportedIssues: 11,
    csrCapital: "₹ 25 L",
    partnerDistricts: ["Dumka", "Sahibganj", "Godda"],
    keyInitiatives: [
      "Stone Crusher Acoustic Fogging Dust Suppression Mesh",
      "Mobile Maternal Health Diagnostic Vans",
    ],
    highlight: "Black Stone Mining & Craft Economy",
  },
  {
    name: "Jamtara",
    division: "Santhal Pargana",
    leadUniversity: "Jamtara College",
    focusDomain: "Youth Tech Labs & Cyber Awareness",
    activeProjects: 2,
    reportedIssues: 12,
    csrCapital: "₹ 28 L",
    partnerDistricts: ["Dhanbad", "Deoghar", "Dumka"],
    keyInitiatives: [
      "Community Coding Innovation Labs for Youth Empowerment",
      "Rural Digital Literacy Mobile Coaching Pods",
    ],
    highlight: "Digital Skill Reformation & Vocational Centers",
  },

  // Palamu Division
  {
    name: "Palamu",
    division: "Palamu",
    leadUniversity: "Nilamber-Pitamber University",
    focusDomain: "Drought Early Warning & Irrigation",
    activeProjects: 3,
    reportedIssues: 17,
    csrCapital: "₹ 50 L",
    partnerDistricts: ["Garhwa", "Latehar", "Chatra"],
    keyInitiatives: [
      "Drought Early Warning & Soil Moisture Telemetry Array",
      "Solar Micro-Cold Storage for Horticulture Harvest",
    ],
    highlight: "Agrarian Heartland & Water Management Focus",
  },
  {
    name: "Garhwa",
    division: "Palamu",
    leadUniversity: "Govt Polytechnic Garhwa & NPU",
    focusDomain: "Groundwater Table Sensors & Solar Pumping",
    activeProjects: 2,
    reportedIssues: 12,
    csrCapital: "₹ 45 L",
    partnerDistricts: ["Palamu", "Latehar"],
    keyInitiatives: [
      "Solar Water Pumping Flow Rate Automated Telemetry",
      "Aquifer Table Depth Acoustic Monitoring Mesh",
    ],
    highlight: "Tri-Junction Border & Renewable Agriculture",
  },
  {
    name: "Latehar",
    division: "Palamu",
    leadUniversity: "Latehar Polytechnic",
    focusDomain: "Forest Fire Telemetry & Eco Tech",
    activeProjects: 2,
    reportedIssues: 11,
    csrCapital: "₹ 40 L",
    partnerDistricts: ["Palamu", "Lohardaga", "Garhwa", "Ranchi"],
    keyInitiatives: [
      "Betla National Park Forest Fire Early Warning Telemetry",
      "Solar Deep-Bore Pumping Pods for Hill Villages",
    ],
    highlight: "Betla Tiger Reserve & Eco-Forestry Core",
  },
];

const DIVISIONS = [
  "All",
  "South Chotanagpur",
  "North Chotanagpur",
  "Kolhan",
  "Santhal Pargana",
  "Palamu",
];

export default function IndustryDistrictManagementPage() {
  const { user } = useAuth();
  const [version, setVersion] = useState(0);

  // Sync real-time storage
  useEffect(() => {
    const handleUpdate = () => setVersion((v) => v + 1);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("solvesphere_collaborations_updated", handleUpdate);
    window.addEventListener("solvesphere_university_updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("solvesphere_collaborations_updated", handleUpdate);
      window.removeEventListener("solvesphere_university_updated", handleUpdate);
    };
  }, []);

  const userKey = String(
    user?.email || user?.organization || user?.name || "industry"
  ).toLowerCase().trim();

  // Real-time map of requested districts
  const requestedDistrictMap = useMemo(() => {
    const map = {};
    try {
      const saved =
        localStorage.getItem(`solvesphere_collaborations_${userKey}`) ||
        localStorage.getItem("solvesphere_collaboration_requests") ||
        localStorage.getItem("solvesphere_collaborations");

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((req) => {
            if (req.district) {
              map[req.district.trim().toLowerCase()] = req.status || "PENDING";
            }
            if (req.projectId) {
              map[String(req.projectId).trim().toLowerCase()] = req.status || "PENDING";
            }
            if (req.projectName) {
              map[req.projectName.trim().toLowerCase()] = req.status || "PENDING";
            }
          });
        }
      }
    } catch {}
    return map;
  }, [userKey, version]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "map"

  const [selectedDistrictModal, setSelectedDistrictModal] = useState(null);
  const [collaborationProject, setCollaborationProject] = useState(null);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    return JHARKHAND_DISTRICTS_DATA.filter((d) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        d.name.toLowerCase().includes(q) ||
        d.division.toLowerCase().includes(q) ||
        d.leadUniversity.toLowerCase().includes(q) ||
        d.focusDomain.toLowerCase().includes(q);

      const matchesDivision =
        selectedDivision === "All" ||
        d.division.toLowerCase() === selectedDivision.toLowerCase();

      return matchesSearch && matchesDivision;
    });
  }, [searchQuery, selectedDivision]);

  // Dynamic Totals
  const totalDistrictsCount = JHARKHAND_DISTRICTS_DATA.length;
  const totalProjectsInField = JHARKHAND_DISTRICTS_DATA.reduce(
    (acc, curr) => acc + curr.activeProjects,
    0
  );
  const totalReportsResolved = JHARKHAND_DISTRICTS_DATA.reduce(
    (acc, curr) => acc + curr.reportedIssues,
    0
  );

  const handleInitiateProject = (district) => {
    setCollaborationProject({
      id: `DIST-${district.name.toUpperCase().slice(0, 3)}-01`,
      title: `CSR Innovation Program in ${district.name} District`,
      university: district.leadUniversity.split(",")[0],
      district: district.name,
      domain: district.focusDomain.split("&")[0].trim(),
      currentStage: "District Field Deployment",
      progressPercentage: 45,
    });
    setIsCollabModalOpen(true);
  };

  const handleCollaborationSuccess = () => {
    setVersion((v) => v + 1);
  };

  return (
    <IndustryModuleLayout
      title="District Management & Field Deployments"
      subtitle="Track district-level opportunities, university R&D partnerships, and deployment coverage across all 24 districts of Jharkhand."
      icon={Map}
    >
      {/* Top Standard Metric Cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Statewide District Coverage",
            value: "24 / 24",
            trend: "100% Jharkhand",
            icon: MapPin,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "Active Projects in Field",
            value: String(totalProjectsInField),
            trend: "Across 5 Divisions",
            icon: Activity,
            color: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "Civic Reports Addressed",
            value: String(totalReportsResolved),
            trend: "Real-time sync",
            icon: FileText,
            color: "text-cyan-600 bg-cyan-50",
          },
          {
            label: "Total State CSR Capital",
            value: "₹ 14.8 Cr",
            trend: "Multi-Partner",
            icon: DollarSign,
            color: "text-indigo-600 bg-indigo-50",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-blue-100 bg-white p-5 shadow-xs transition hover:border-blue-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {item.label}
              </span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.color}`}>
                <item.icon size={18} />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#0d3971]">{item.value}</span>
              <span className="text-xs font-bold text-slate-500">{item.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Section */}
      <section className="mt-6 rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
        {/* Search, Filter Bar & View Toggle */}
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Division Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {DIVISIONS.map((div) => {
                const count =
                  div === "All"
                    ? totalDistrictsCount
                    : JHARKHAND_DISTRICTS_DATA.filter((d) => d.division === div).length;

                const isSelected = selectedDivision === div;

                return (
                  <button
                    key={div}
                    onClick={() => setSelectedDivision(div)}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shrink-0 ${
                      isSelected
                        ? "bg-[#0d3971] text-white shadow-xs"
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {div}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input & View Mode Switcher */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search district, university, domain..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div className="flex items-center rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-[#0d3971] shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Grid ({filteredDistricts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("map")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    viewMode === "map"
                      ? "bg-white text-[#0d3971] shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Map View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode: Map View */}
        {viewMode === "map" && (
          <div className="p-6 bg-slate-50/50">
            <div className="max-w-4xl mx-auto rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-[#0d3971]">
                    Interactive Jharkhand District Collaboration & Deployment Map
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hover any district to inspect active CSR projects, lead universities, and inter-district collaboration linkages.
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-100">
                  24 Districts
                </span>
              </div>
              <IndustryDistrictCollaborationMap
                onDistrictSelect={(districtName) => {
                  const d = JHARKHAND_DISTRICTS_DATA.find(
                    (item) => item.name.toLowerCase() === districtName.toLowerCase()
                  );
                  if (d) setSelectedDistrictModal(d);
                }}
              />
            </div>
          </div>
        )}

        {/* View Mode: Grid View */}
        {viewMode === "grid" && (
          <div className="p-5">
            {filteredDistricts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3">
                  <Compass size={22} />
                </div>
                <h3 className="text-base font-bold text-[#0d3971]">No Districts Found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try clearing your search query or selecting another division.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredDistricts.map((district) => {
                  const distKey = district.name.toLowerCase().trim();
                  const reqStatus =
                    requestedDistrictMap[distKey] ||
                    requestedDistrictMap[`dist-${district.name.toUpperCase().slice(0, 3)}-01`.toLowerCase()] ||
                    requestedDistrictMap[`csr innovation program in ${district.name} district`.toLowerCase()];

                  const isPending = String(reqStatus || "").toUpperCase() === "PENDING";
                  const isActive =
                    String(reqStatus || "").toUpperCase() === "ACTIVE" ||
                    String(reqStatus || "").toUpperCase() === "ACCEPTED";
                  const isCompleted =
                    String(reqStatus || "").toUpperCase() === "COMPLETED" ||
                    String(reqStatus || "").toUpperCase() === "RESOLVED";

                  return (
                    <div
                      key={district.name}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-300 hover:shadow-md"
                    >
                      <div>
                        {/* Top: Division Chip & Location Icon */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 border border-blue-100">
                            {district.division}
                          </span>
                          <span className="font-extrabold text-xs text-blue-700 bg-blue-50/70 px-2 py-0.5 rounded border border-blue-100">
                            {district.csrCapital} CSR
                          </span>
                        </div>

                        {/* District Name */}
                        <h3
                          className="text-lg font-bold text-[#0d3971] hover:text-blue-600 transition cursor-pointer"
                          onClick={() => setSelectedDistrictModal(district)}
                        >
                          {district.name} District
                        </h3>

                        {/* Lead University */}
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                          <GraduationCap size={14} className="text-blue-600 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">
                            {district.leadUniversity}
                          </span>
                        </div>

                        {/* Focus Domain */}
                        <p className="mt-2 text-xs font-medium text-slate-500">
                          Focus: <span className="font-bold text-slate-700">{district.focusDomain}</span>
                        </p>

                        {/* Stats Grid */}
                        <div className="mt-3.5 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 text-center border border-slate-100">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Field Projects</p>
                            <p className="text-base font-extrabold text-[#0d3971]">{district.activeProjects}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Civic Issues</p>
                            <p className="text-base font-extrabold text-slate-800">{district.reportedIssues}</p>
                          </div>
                        </div>

                        {/* Inter-District Partner Tags */}
                        <div className="mt-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Collaborating Districts ({district.partnerDistricts.length})
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {district.partnerDistricts.slice(0, 3).map((partner) => (
                              <span
                                key={partner}
                                className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200"
                              >
                                {partner}
                              </span>
                            ))}
                            {district.partnerDistricts.length > 3 && (
                              <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                                +{district.partnerDistricts.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() => setSelectedDistrictModal(district)}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                          <Eye size={12} /> Overview
                        </button>

                        {isPending ? (
                          <div className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 py-2 px-3 text-xs font-bold text-amber-700 shadow-xs select-none">
                            <Clock size={13} className="text-amber-600 shrink-0" />
                            <span>Request Sent</span>
                          </div>
                        ) : isActive ? (
                          <div className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 py-2 px-3 text-xs font-bold text-emerald-700 shadow-xs select-none">
                            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                            <span>Active Partner</span>
                          </div>
                        ) : isCompleted ? (
                          <div className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 py-2 px-3 text-xs font-bold text-blue-700 shadow-xs select-none">
                            <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                            <span>Completed</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleInitiateProject(district)}
                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-[#0d3971] hover:bg-blue-700 py-2 px-3 text-xs font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
                          >
                            <Handshake size={12} /> Partner in District
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* District Overview & Deep Dive Modal */}
      {selectedDistrictModal && (() => {
        const d = selectedDistrictModal;
        const distKey = d.name.toLowerCase().trim();
        const reqStatus =
          requestedDistrictMap[distKey] ||
          requestedDistrictMap[`dist-${d.name.toUpperCase().slice(0, 3)}-01`.toLowerCase()] ||
          requestedDistrictMap[`csr innovation program in ${d.name} district`.toLowerCase()];

        const isPending = String(reqStatus || "").toUpperCase() === "PENDING";
        const isActive =
          String(reqStatus || "").toUpperCase() === "ACTIVE" ||
          String(reqStatus || "").toUpperCase() === "ACCEPTED";
        const isCompleted =
          String(reqStatus || "").toUpperCase() === "COMPLETED" ||
          String(reqStatus || "").toUpperCase() === "RESOLVED";

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-blue-100 px-6 py-4 bg-blue-50/70">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  <span className="text-sm font-extrabold text-[#0d3971]">
                    {d.name} District Deployment Profile
                  </span>
                  {isPending && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                      Request Sent
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedDistrictModal(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-100 hover:text-slate-700 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100">
                    {d.division} Division
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#0d3971] mt-1">
                    {d.name} District
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {d.highlight}
                  </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                  <div className="rounded-xl bg-blue-50/50 p-3 border border-blue-100">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Field Deployments</p>
                    <p className="text-lg font-extrabold text-[#0d3971]">{d.activeProjects}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50/50 p-3 border border-blue-100">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Citizen Reports</p>
                    <p className="text-lg font-extrabold text-slate-800">{d.reportedIssues}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50/50 p-3 border border-blue-100">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Allocated CSR</p>
                    <p className="text-lg font-extrabold text-blue-700">{d.csrCapital}</p>
                  </div>
                </div>

                {/* Lead University & Research Focus */}
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2 text-xs">
                  <div>
                    <p className="font-bold text-slate-400 uppercase text-[10px]">Lead Academic Innovation Partner</p>
                    <p className="font-extrabold text-slate-800 mt-0.5 text-sm">{d.leadUniversity}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-400 uppercase text-[10px]">Priority Focus Area</p>
                    <p className="font-semibold text-blue-700 mt-0.5">{d.focusDomain}</p>
                  </div>
                </div>

                {/* Key Joint Initiatives in this District */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0d3971] mb-2 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-blue-600" /> Active Joint Innovations
                  </p>
                  <div className="space-y-1.5 text-xs">
                    {d.keyInitiatives.map((init, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-xl bg-blue-50/40 p-2.5 font-medium text-slate-800 border border-blue-100"
                      >
                        <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                        <span>{init}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inter-District Collaborations */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Inter-District Collaboration Network
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {d.partnerDistricts.map((partner) => (
                      <span
                        key={partner}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200"
                      >
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedDistrictModal(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Close
                  </button>

                  {isPending ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 text-xs font-bold text-amber-700">
                      <Clock size={14} className="text-amber-600" /> Proposal Sent (Pending Approval)
                    </span>
                  ) : isActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700">
                      <CheckCircle2 size={14} className="text-emerald-600" /> Active District Partner
                    </span>
                  ) : isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-xs font-bold text-blue-700">
                      <CheckCircle2 size={14} className="text-blue-600" /> Completed
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDistrictModal(null);
                        handleInitiateProject(d);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d3971] hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer active:scale-95"
                    >
                      <Handshake size={14} /> Partner in {d.name}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Collaboration Modal */}
      <CollaborationModal
        isOpen={isCollabModalOpen}
        onClose={() => setIsCollabModalOpen(false)}
        project={collaborationProject}
        onSuccess={handleCollaborationSuccess}
      />
    </IndustryModuleLayout>
  );
}
