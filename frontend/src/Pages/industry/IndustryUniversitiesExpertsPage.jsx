import { useState, useMemo, useEffect } from "react";
import {
  GraduationCap,
  UsersRound,
  Star,
  MapPin,
  Search,
  Filter,
  Sparkles,
  Building2,
  BookOpen,
  FlaskConical,
  Award,
  ExternalLink,
  ChevronRight,
  Handshake,
  CheckCircle2,
  Eye,
  Mail,
  Phone,
  X,
  Layers,
  FileText,
  BadgeCheck,
  Clock,
} from "lucide-react";
import IndustryModuleLayout from "../../components/industry/IndustryModuleLayout";
import CollaborationModal from "../../components/industry/CollaborationModal";
import { useAuth } from "../../context/AuthContext";
import { getCompanyProfile } from "../../utils/industryMockData";

// Comprehensive Jharkhand Universities & Institutes Data
const UNIVERSITIES_DATA = [
  {
    id: "UNI-01",
    name: "NIT Jamshedpur",
    type: "Institute of National Importance",
    district: "East Singhbhum",
    location: "Adityapur, Jamshedpur",
    matchScore: 94,
    established: "1960",
    ranking: "NIRF Rank #86",
    description: "Premier engineering institute with high-impact research facilities in municipal hydraulic telemetry, flood mitigation systems, and industrial wastewater treatment.",
    specializations: [
      "Civil & Environmental Engineering",
      "IoT Sensor Networks",
      "Hydraulic Modeling",
      "Renewable Energy",
    ],
    labs: [
      "Subarnarekha Hydrology & River Telemetry Lab",
      "Environmental Water Quality & Membrane Tech Center",
      "Smart Structural Health Monitoring Testbed",
    ],
    facultyCount: 24,
    activeProjects: 6,
    publicationsCount: 184,
    leadFaculty: "Dr. Ananya Sen (Dept. of Environmental Engineering)",
    email: "rnd.partnerships@nitjsr.ac.in",
    website: "https://www.nitjsr.ac.in",
  },
  {
    id: "UNI-02",
    name: "BIT Mesra, Ranchi",
    type: "Premier Deemed University",
    district: "Ranchi",
    location: "Mesra, Ranchi",
    matchScore: 91,
    established: "1955",
    ranking: "NAAC A+ Grade",
    description: "Leading technical powerhouse specializing in autonomous edge computing, agricultural robotics, automated micro-grids, and drone-based spatial surveys.",
    specializations: [
      "Artificial Intelligence & Machine Learning",
      "Robotics & Automation",
      "Data Science",
      "Precision Agriculture",
    ],
    labs: [
      "Center for Artificial Intelligence & Robotics",
      "Precision Agronomy Drone & Multispectral Vision Hub",
      "Solar Microgrid Power Electronics Facility",
    ],
    facultyCount: 32,
    activeProjects: 8,
    publicationsCount: 246,
    leadFaculty: "Dr. Rajesh Kumar Sharma (Dept. of Computer Science & AI)",
    email: "dean.research@bitmesra.ac.in",
    website: "https://www.bitmesra.ac.in",
  },
  {
    id: "UNI-03",
    name: "IIT (ISM) Dhanbad",
    type: "Institute of National Importance",
    district: "Dhanbad",
    location: "Sardar Patel Nagar, Dhanbad",
    matchScore: 89,
    established: "1926",
    ranking: "NIRF Rank #17",
    description: "India's premier institution for earth sciences, clean coal tech, underground sensor telemetry, carbon sequestration, and smart city traffic AI.",
    specializations: [
      "Computer Vision & Edge AI",
      "Mining & Environmental Clean Tech",
      "Smart City Mobility",
      "Sensors & Embedded Systems",
    ],
    labs: [
      "TexMin Innovation Hub on Mining & Sensor Telemetry",
      "Adaptive Traffic Control & Smart Mobility Lab",
      "Air Quality & Dust Suppression Engineering Center",
    ],
    facultyCount: 28,
    activeProjects: 7,
    publicationsCount: 310,
    leadFaculty: "Prof. S. K. Mitra (Dept. of Computer Science & AI)",
    email: "industry.liaison@iitism.ac.in",
    website: "https://www.iitism.ac.in",
  },
  {
    id: "UNI-04",
    name: "Ranchi University",
    type: "State Premier University",
    district: "Ranchi",
    location: "Morabadi, Ranchi",
    matchScore: 84,
    established: "1960",
    ranking: "NAAC Accredited",
    description: "Multi-disciplinary state university with extensive grassroots field engagement in tribal healthcare kits, public health diagnostic validation, and rural ecology.",
    specializations: [
      "Public Health & Bio-Medical Tech",
      "Environmental Sciences",
      "Rural Development",
      "Water Resource Management",
    ],
    labs: [
      "Tribal Health & Clinical Diagnostics Lab",
      "Environmental Toxic Trace Element Testing Unit",
      "Community Water Filtration Research Cell",
    ],
    facultyCount: 22,
    activeProjects: 5,
    publicationsCount: 128,
    leadFaculty: "Dr. Meera Verma (Dept. of Bio-Medical Sciences)",
    email: "registrar@ranchiuniversity.ac.in",
    website: "https://www.ranchiuniversity.ac.in",
  },
  {
    id: "UNI-05",
    name: "Vinoba Bhave University",
    type: "State University",
    district: "Hazaribagh",
    location: "Sindoor, Hazaribagh",
    matchScore: 81,
    established: "1992",
    ranking: "NAAC Accredited",
    description: "Key regional university specializing in renewable off-grid solar micro-grids, decentralized power trading, and agricultural soil telemetry.",
    specializations: [
      "Renewable Energy & Solar Microgrids",
      "Soil Chemistry & Telemetry",
      "Electrical Infrastructure",
      "Rural STEM Education",
    ],
    labs: [
      "Solar Microgrid & Energy Storage Innovation Hub",
      "Soil Health & Precision Agriculture Testing Facility",
    ],
    facultyCount: 16,
    activeProjects: 4,
    publicationsCount: 92,
    leadFaculty: "Dr. Alok Prasad (Dept. of Electrical Engineering)",
    email: "rnd@vbu.ac.in",
    website: "https://www.vbu.ac.in",
  },
  {
    id: "UNI-06",
    name: "AIIMS Deoghar",
    type: "Institute of National Importance",
    district: "Deoghar",
    location: "Kunjbona, Deoghar",
    matchScore: 86,
    established: "2019",
    ranking: "Premier Medical Institute",
    description: "Apex medical institute driving telemedicine, AI-assisted rural diagnostic kits, and maternal healthcare telemetry across Santhal Pargana.",
    specializations: [
      "Telemedicine & Digital Health",
      "Clinical AI Diagnostics",
      "Epidemiological Surveillance",
      "Point-of-Care Bio-Sensors",
    ],
    labs: [
      "Rural Tele-Diagnostics & AI Screening Hub",
      "Community Health Informatics Lab",
    ],
    facultyCount: 19,
    activeProjects: 4,
    publicationsCount: 115,
    leadFaculty: "Dr. Anjali Gupta (Dept. of Community & Digital Medicine)",
    email: "research@aiimsdeoghar.edu.in",
    website: "https://www.aiimsdeoghar.edu.in",
  },
  {
    id: "UNI-07",
    name: "Sido Kanhu Murmu University",
    type: "State University",
    district: "Dumka",
    location: "Dighi, Dumka",
    matchScore: 80,
    established: "1992",
    ranking: "NAAC Accredited",
    description: "Specialized in vernacular AI educational tablets for primary schools, regional language NLP, and smallholder farm disease diagnostics.",
    specializations: [
      "Vernacular AI & NLP",
      "Educational Technology",
      "AgriTech Disease Diagnostics",
      "Rural Water Security",
    ],
    labs: [
      "Regional Language Speech Annotation & EdTech Lab",
      "Santhal Pargana Agri-AI Field Testing Station",
    ],
    facultyCount: 14,
    activeProjects: 4,
    publicationsCount: 78,
    leadFaculty: "Prof. Priya Nath (Dept. of Educational Technology)",
    email: "research@skmu.ac.in",
    website: "https://www.skmu.ac.in",
  },
  {
    id: "UNI-08",
    name: "IIIT Ranchi",
    type: "Institute of National Importance (PPP)",
    district: "Ranchi",
    location: "Namkum, Ranchi",
    matchScore: 92,
    established: "2016",
    ranking: "Premier IT Institute",
    description: "Focused on neural network quantization, edge computer vision for smart traffic corridors, cyber-physical sensor meshes, and IoT telemetry.",
    specializations: [
      "Artificial Intelligence & Deep Learning",
      "Computer Vision",
      "IoT & Edge Devices",
      "Cybersecurity",
    ],
    labs: [
      "Smart City Computer Vision & Edge AI Lab",
      "Cyber-Physical Systems & Sensor Mesh Testbed",
    ],
    facultyCount: 18,
    activeProjects: 5,
    publicationsCount: 134,
    leadFaculty: "Dr. Pooja Deshmukh (Lead AI Architect & Assoc. Professor)",
    email: "industry@iiitranchi.ac.in",
    website: "https://www.iiitranchi.ac.in",
  },
];

// Comprehensive Faculty Experts & Researchers Data
const FACULTY_EXPERTS_DATA = [
  {
    id: "EXP-01",
    name: "Dr. Ananya Sen",
    title: "Professor & Head of Environmental Engineering",
    university: "NIT Jamshedpur",
    district: "East Singhbhum",
    domain: "Water & Sanitation",
    specializations: ["Hydrology Telemetry", "Membrane Water Filtration", "Stormwater Drainage", "IoT Sensors"],
    experience: "16+ Years Research & Consultancy",
    publications: 48,
    patents: 3,
    activeCivicProjects: 3,
    csrFocus: "Urban Flood Telemetry & River Contamination Mesh",
    email: "ananya.sen@nitjsr.ac.in",
    bio: "Pioneered real-time municipal hydraulic telemetry models for Jamshedpur and authored key state environmental drainage reports.",
  },
  {
    id: "EXP-02",
    name: "Dr. Rajesh Kumar Sharma",
    title: "Chief Research Scientist & Professor of AI",
    university: "BIT Mesra, Ranchi",
    district: "Ranchi",
    domain: "Agriculture & AI",
    specializations: ["Computer Vision", "Crop Disease Drone Diagnostics", "Edge AI", "Deep Learning"],
    experience: "14+ Years Enterprise & Academic R&D",
    publications: 62,
    patents: 4,
    activeCivicProjects: 4,
    csrFocus: "Drone Diagnostics for Paddy Crop Blight",
    email: "rksharma@bitmesra.ac.in",
    bio: "Lead investigator for Jharkhand Agri-Drone Diagnostic project delivering 92%+ accuracy in early foliage infection detection.",
  },
  {
    id: "EXP-03",
    name: "Prof. S. K. Mitra",
    title: "Chair Professor of Computer Science",
    university: "IIT (ISM) Dhanbad",
    district: "Dhanbad",
    domain: "Smart City & Transport",
    specializations: ["Adaptive Traffic Systems", "Edge Computer Vision", "Cloud Infrastructure", "Neural Networks"],
    experience: "19+ Years Advanced Tech R&D",
    publications: 74,
    patents: 5,
    activeCivicProjects: 3,
    csrFocus: "AI Green Corridors for Emergency Vehicles",
    email: "skmitra@iitism.ac.in",
    bio: "Designed multi-camera vehicle tracking and green corridor signal optimization algorithms tested on dense urban arterial junctions.",
  },
  {
    id: "EXP-04",
    name: "Dr. Meera Verma",
    title: "Associate Professor of Bio-Medical Sciences",
    university: "Ranchi University",
    district: "Ranchi",
    domain: "Healthcare",
    specializations: ["Tele-Diagnostics", "Point-of-Care Bio-Sensors", "Tribal Healthcare", "Digital Health"],
    experience: "12+ Years Clinical R&D",
    publications: 36,
    patents: 2,
    activeCivicProjects: 2,
    csrFocus: "Portable ECG & Cardio-Respiratory Suitcase for ASHA Workers",
    email: "meera.verma@ranchiuniv.ac.in",
    bio: "Developing low-cost, battery-powered clinical diagnostic kits deployed across primary health centers in West Singhbhum and Khunti.",
  },
  {
    id: "EXP-05",
    name: "Dr. Alok Prasad",
    title: "Head of Electrical & Power Systems",
    university: "Vinoba Bhave University",
    district: "Hazaribagh",
    domain: "Energy & Electricity",
    specializations: ["Solar Microgrids", "Smart Inverters", "Battery Energy Storage (BESS)", "Blockchain Billing"],
    experience: "15+ Years Power Grid R&D",
    publications: 41,
    patents: 2,
    activeCivicProjects: 2,
    csrFocus: "Peer-to-Peer Solar Microgrid Load Balancer",
    email: "alok.prasad@vbu.ac.in",
    bio: "Architected 5kW off-grid solar micro-grids with automated battery balancing for remote villages in Hazaribagh and Koderma.",
  },
  {
    id: "EXP-06",
    name: "Dr. Pooja Deshmukh",
    title: "Lead AI Architect & Associate Professor",
    university: "IIIT Ranchi",
    district: "Ranchi",
    domain: "Smart City & Infrastructure",
    specializations: ["Edge AI Quantization", "Road Pothole Detection", "IoT Telemetry", "Embedded Vision"],
    experience: "11+ Years AI System Design",
    publications: 39,
    patents: 3,
    activeCivicProjects: 3,
    csrFocus: "Automated Pothole Mapping & Civic Infrastructure Sensors",
    email: "pooja.d@iiitranchi.ac.in",
    bio: "Specializes in quantized deep learning models runnable on lightweight raspberry pi edge camera modules for public utility fleet monitoring.",
  },
];

export default function IndustryUniversitiesExpertsPage() {
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

  const companyProfile = useMemo(() => getCompanyProfile(user), [user, version]);

  const userKey = String(
    user?.email || user?.organization || user?.name || "industry"
  ).toLowerCase().trim();

  // Real-time map of requested universities / experts
  const requestedCollabMap = useMemo(() => {
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
            if (req.university) {
              map[req.university.trim().toLowerCase()] = req.status || "PENDING";
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

  const [activeTab, setActiveTab] = useState("universities"); // "universities" | "experts"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedDomain, setSelectedDomain] = useState("All");

  const [selectedUniversityForModal, setSelectedUniversityForModal] = useState(null);
  const [selectedExpertForModal, setSelectedExpertForModal] = useState(null);

  const [collaborationProject, setCollaborationProject] = useState(null);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);

  // Filtered Universities
  const filteredUniversities = useMemo(() => {
    return UNIVERSITIES_DATA.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        u.name.toLowerCase().includes(q) ||
        u.district.toLowerCase().includes(q) ||
        u.specializations.some((s) => s.toLowerCase().includes(q)) ||
        u.leadFaculty.toLowerCase().includes(q);

      const matchesDistrict =
        selectedDistrict === "All" ||
        u.district.toLowerCase() === selectedDistrict.toLowerCase();

      const matchesDomain =
        selectedDomain === "All" ||
        u.specializations.some((s) => s.toLowerCase().includes(selectedDomain.toLowerCase()));

      return matchesSearch && matchesDistrict && matchesDomain;
    });
  }, [searchQuery, selectedDistrict, selectedDomain]);

  // Filtered Faculty Experts
  const filteredExperts = useMemo(() => {
    return FACULTY_EXPERTS_DATA.filter((exp) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        exp.name.toLowerCase().includes(q) ||
        exp.university.toLowerCase().includes(q) ||
        exp.district.toLowerCase().includes(q) ||
        exp.domain.toLowerCase().includes(q) ||
        exp.specializations.some((s) => s.toLowerCase().includes(q));

      const matchesDistrict =
        selectedDistrict === "All" ||
        exp.district.toLowerCase() === selectedDistrict.toLowerCase();

      const matchesDomain =
        selectedDomain === "All" ||
        exp.domain.toLowerCase().includes(selectedDomain.toLowerCase()) ||
        exp.specializations.some((s) => s.toLowerCase().includes(selectedDomain.toLowerCase()));

      return matchesSearch && matchesDistrict && matchesDomain;
    });
  }, [searchQuery, selectedDistrict, selectedDomain]);

  // Unique lists for dropdowns
  const districtsList = useMemo(() => {
    return ["All", ...new Set(UNIVERSITIES_DATA.map((u) => u.district))];
  }, []);

  const domainsList = [
    "All",
    "Water & Sanitation",
    "Agriculture & AI",
    "Smart City",
    "Healthcare",
    "Energy & Electricity",
    "IoT",
    "Robotics",
  ];

  const handleOpenCollaborate = (item, type = "university") => {
    setCollaborationProject({
      id: type === "university" ? item.id : `EXP-${item.id}`,
      title: type === "university" ? `R&D Partnership with ${item.name}` : `Consultation on ${item.csrFocus}`,
      university: type === "university" ? item.name : item.university,
      district: item.district,
      domain: type === "university" ? item.specializations[0] : item.domain,
      currentStage: "Research & Development Partnership",
      progressPercentage: 40,
    });
    setIsCollabModalOpen(true);
  };

  const handleCollaborationSuccess = () => {
    setVersion((v) => v + 1);
  };

  return (
    <IndustryModuleLayout
      title="Universities & Academic Experts"
      subtitle="Discover top Jharkhand engineering institutions, specialized research labs, and faculty mentors matching your CSR innovation requirements."
      icon={GraduationCap}
    >
      {/* Top Standard Metric Cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Matching Universities",
            value: String(UNIVERSITIES_DATA.length),
            trend: "8 Premier HEIs",
            icon: GraduationCap,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "Available Faculty Mentors",
            value: String(FACULTY_EXPERTS_DATA.length * 12),
            trend: "PhD & HOD Leads",
            icon: UsersRound,
            color: "text-cyan-600 bg-cyan-50",
          },
          {
            label: "Specialized R&D Labs",
            value: "26+",
            trend: "IoT & AI Testbeds",
            icon: FlaskConical,
            color: "text-indigo-600 bg-indigo-50",
          },
          {
            label: "Avg. Domain Match",
            value: "88%",
            trend: "AI-Calculated",
            icon: Sparkles,
            color: "text-emerald-600 bg-emerald-50",
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

      {/* Main Container */}
      <section className="mt-6 rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
        {/* Header with Dual-View Switcher & Filter Controls */}
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Tab Switcher: Universities vs Experts */}
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-100/80 p-1 self-start">
              <button
                onClick={() => setActiveTab("universities")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                  activeTab === "universities"
                    ? "bg-[#0d3971] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap size={15} />
                Universities & Institutes ({UNIVERSITIES_DATA.length})
              </button>
              <button
                onClick={() => setActiveTab("experts")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                  activeTab === "experts"
                    ? "bg-[#0d3971] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UsersRound size={15} />
                Faculty Experts & Mentors ({FACULTY_EXPERTS_DATA.length})
              </button>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === "universities"
                      ? "Search university, district, lab..."
                      : "Search professor, research field..."
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {/* District Dropdown */}
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                aria-label="Filter by District"
                className="rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
              >
                {districtsList.map((d) => (
                  <option key={d} value={d}>
                    {d === "All" ? "All Districts" : d}
                  </option>
                ))}
              </select>

              {/* Domain Dropdown */}
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                aria-label="Filter by Domain"
                className="rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
              >
                {domainsList.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain === "All" ? "All Domains" : domain}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content View: Universities */}
        {activeTab === "universities" && (
          <div className="p-5">
            {filteredUniversities.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3">
                  <GraduationCap size={22} />
                </div>
                <h3 className="text-base font-bold text-[#0d3971]">No Universities Found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search keywords or district filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUniversities.map((uni) => {
                  const reqStatus =
                    requestedCollabMap[uni.name.toLowerCase().trim()] ||
                    requestedCollabMap[uni.id.toLowerCase().trim()] ||
                    requestedCollabMap[`r&d partnership with ${uni.name}`.toLowerCase().trim()];

                  const isPending = String(reqStatus || "").toUpperCase() === "PENDING";
                  const isActive =
                    String(reqStatus || "").toUpperCase() === "ACTIVE" ||
                    String(reqStatus || "").toUpperCase() === "ACCEPTED";
                  const isCompleted =
                    String(reqStatus || "").toUpperCase() === "COMPLETED" ||
                    String(reqStatus || "").toUpperCase() === "RESOLVED";

                  return (
                    <div
                      key={uni.id}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-300 hover:shadow-md"
                    >
                      <div>
                        {/* Top Row: Type & Match Badge */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                            <BadgeCheck size={12} className="text-blue-600" />
                            {uni.type}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                            <Sparkles size={11} /> {uni.matchScore}% Match
                          </span>
                        </div>

                        {/* University Name */}
                        <h3
                          className="text-lg font-bold text-[#0d3971] hover:text-blue-600 transition cursor-pointer"
                          onClick={() => setSelectedUniversityForModal(uni)}
                        >
                          {uni.name}
                        </h3>

                        {/* Location & Ranking */}
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-slate-400" /> {uni.location}, {uni.district}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">{uni.ranking}</span>
                        </div>

                        {/* Description */}
                        <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {uni.description}
                        </p>

                        {/* Specializations */}
                        <div className="mt-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            Key Research Areas
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {uni.specializations.map((spec) => (
                              <span
                                key={spec}
                                className="rounded-md bg-blue-50/70 px-2 py-0.5 text-[11px] font-medium text-[#164579] border border-blue-100"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Faculty & Project Stats */}
                        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
                          <div className="rounded-xl bg-slate-50 p-2">
                            <p className="text-[10px] font-bold text-slate-400">Faculty</p>
                            <p className="text-sm font-extrabold text-slate-800">{uni.facultyCount}+</p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-2">
                            <p className="text-[10px] font-bold text-slate-400">Civic Projects</p>
                            <p className="text-sm font-extrabold text-[#0d3971]">{uni.activeProjects}</p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-2">
                            <p className="text-[10px] font-bold text-slate-400">Publications</p>
                            <p className="text-sm font-extrabold text-slate-800">{uni.publicationsCount}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() => setSelectedUniversityForModal(uni)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
                        >
                          <Eye size={13} /> View Profile & Labs
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
                            onClick={() => handleOpenCollaborate(uni, "university")}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0d3971] hover:bg-blue-700 py-2 px-3 text-xs font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
                          >
                            <Handshake size={13} /> Propose Partnership
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

        {/* Content View: Faculty Experts */}
        {activeTab === "experts" && (
          <div className="p-5">
            {filteredExperts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3">
                  <UsersRound size={22} />
                </div>
                <h3 className="text-base font-bold text-[#0d3971]">No Faculty Experts Found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search keywords or domain filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredExperts.map((expert) => {
                  const expStatus =
                    requestedCollabMap[expert.name.toLowerCase().trim()] ||
                    requestedCollabMap[expert.university.toLowerCase().trim()] ||
                    requestedCollabMap[`exp-${expert.id}`.toLowerCase().trim()] ||
                    requestedCollabMap[`consultation on ${expert.csrFocus}`.toLowerCase().trim()];

                  const isExpPending = String(expStatus || "").toUpperCase() === "PENDING";
                  const isExpActive =
                    String(expStatus || "").toUpperCase() === "ACTIVE" ||
                    String(expStatus || "").toUpperCase() === "ACCEPTED";
                  const isExpCompleted =
                    String(expStatus || "").toUpperCase() === "COMPLETED" ||
                    String(expStatus || "").toUpperCase() === "RESOLVED";

                  return (
                    <div
                      key={expert.id}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-300 hover:shadow-md"
                    >
                      <div>
                        {/* Top: Domain Chip & Experience */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 border border-blue-100">
                            {expert.domain}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {expert.experience}
                          </span>
                        </div>

                        {/* Expert Name */}
                        <h3
                          className="text-base font-bold text-[#0d3971] hover:text-blue-600 transition cursor-pointer"
                          onClick={() => setSelectedExpertForModal(expert)}
                        >
                          {expert.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-700 line-clamp-1">
                          {expert.title}
                        </p>

                        {/* University & District */}
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <GraduationCap size={13} className="text-blue-600 shrink-0" />
                          <span className="truncate">{expert.university}</span>
                          <span>•</span>
                          <span className="truncate">{expert.district}</span>
                        </div>

                        {/* Specialization Tags */}
                        <div className="mt-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Research Focus
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {expert.specializations.map((spec) => (
                              <span
                                key={spec}
                                className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Research Metrics */}
                        <div className="mt-3.5 grid grid-cols-3 gap-1.5 rounded-xl bg-slate-50 p-2 text-center border border-slate-100">
                          <div>
                            <p className="text-[9px] font-bold text-slate-400">Papers</p>
                            <p className="text-xs font-extrabold text-slate-800">{expert.publications}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-slate-400">Patents</p>
                            <p className="text-xs font-extrabold text-blue-700">{expert.patents}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-slate-400">Civic R&D</p>
                            <p className="text-xs font-extrabold text-emerald-700">{expert.activeCivicProjects}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() => setSelectedExpertForModal(expert)}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2 px-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                          <Eye size={12} /> Profile
                        </button>

                        {isExpPending ? (
                          <div className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-amber-50 border border-amber-200 py-2 px-2 text-xs font-bold text-amber-700 shadow-xs select-none">
                            <Clock size={12} className="text-amber-600 shrink-0" /> Request Sent
                          </div>
                        ) : isExpActive ? (
                          <div className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200 py-2 px-2 text-xs font-bold text-emerald-700 shadow-xs select-none">
                            <CheckCircle2 size={12} className="text-emerald-600 shrink-0" /> Active Partner
                          </div>
                        ) : isExpCompleted ? (
                          <div className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-blue-50 border border-blue-200 py-2 px-2 text-xs font-bold text-blue-700 shadow-xs select-none">
                            <CheckCircle2 size={12} className="text-blue-600 shrink-0" /> Completed
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenCollaborate(expert, "expert")}
                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-[#0d3971] hover:bg-blue-700 py-2 px-2 text-xs font-bold text-white shadow-xs transition cursor-pointer active:scale-95"
                          >
                            <Handshake size={12} /> Invite Mentor
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

      {/* University Profile & Lab Details Modal */}
      {selectedUniversityForModal && (() => {
        const uni = selectedUniversityForModal;
        const reqStatus =
          requestedCollabMap[uni.name.toLowerCase().trim()] ||
          requestedCollabMap[uni.id.toLowerCase().trim()] ||
          requestedCollabMap[`r&d partnership with ${uni.name}`.toLowerCase().trim()];

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
                  <GraduationCap size={20} className="text-blue-600" />
                  <span className="text-sm font-extrabold text-[#0d3971]">
                    {uni.name} R&D Profile
                  </span>
                  {isPending && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                      Request Sent
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedUniversityForModal(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-100 hover:text-slate-700 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100">
                    {uni.type}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#0d3971] mt-1">
                    {uni.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <MapPin size={13} className="text-slate-400" />
                    <span>{uni.location}, {uni.district}</span>
                    <span>•</span>
                    <span>Est. {uni.established}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{uni.ranking}</span>
                  </p>
                </div>

                {/* Description */}
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-700 leading-relaxed">
                  {uni.description}
                </div>

                {/* Research Facilities / Labs */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0d3971] mb-2 flex items-center gap-1.5">
                    <FlaskConical size={14} className="text-blue-600" /> Advanced Research Labs & Testbeds
                  </p>
                  <div className="space-y-1.5">
                    {uni.labs.map((lab, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-xl bg-blue-50/50 p-2.5 text-xs font-semibold text-[#164579] border border-blue-100"
                      >
                        <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                        <span>{lab}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lead Faculty & Contact */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4 text-xs space-y-2">
                  <p className="font-bold text-[#0d3971]">Key Point of Contact / Faculty Lead</p>
                  <p className="font-semibold text-slate-800">{uni.leadFaculty}</p>
                  <div className="flex flex-wrap items-center gap-4 text-slate-600 pt-1">
                    <span className="flex items-center gap-1"><Mail size={13} className="text-blue-600" /> {uni.email}</span>
                    <a
                      href={uni.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                    >
                      <ExternalLink size={13} /> Visit Institute Portal
                    </a>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedUniversityForModal(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Close
                  </button>

                  {isPending ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 text-xs font-bold text-amber-700">
                      <Clock size={14} className="text-amber-600" /> Proposal Sent (Pending Review)
                    </span>
                  ) : isActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700">
                      <CheckCircle2 size={14} className="text-emerald-600" /> Active R&D Partner
                    </span>
                  ) : isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-xs font-bold text-blue-700">
                      <CheckCircle2 size={14} className="text-blue-600" /> Completed
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUniversityForModal(null);
                        handleOpenCollaborate(uni, "university");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d3971] hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer"
                    >
                      <Handshake size={14} /> Propose Partnership / Sponsorship
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Faculty Expert Profile Details Modal */}
      {selectedExpertForModal && (() => {
        const exp = selectedExpertForModal;
        const expStatus =
          requestedCollabMap[exp.name.toLowerCase().trim()] ||
          requestedCollabMap[exp.university.toLowerCase().trim()] ||
          requestedCollabMap[`exp-${exp.id}`.toLowerCase().trim()] ||
          requestedCollabMap[`consultation on ${exp.csrFocus}`.toLowerCase().trim()];

        const isExpPending = String(expStatus || "").toUpperCase() === "PENDING";
        const isExpActive =
          String(expStatus || "").toUpperCase() === "ACTIVE" ||
          String(expStatus || "").toUpperCase() === "ACCEPTED";
        const isExpCompleted =
          String(expStatus || "").toUpperCase() === "COMPLETED" ||
          String(expStatus || "").toUpperCase() === "RESOLVED";

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-blue-100 px-6 py-4 bg-blue-50/70">
                <div className="flex items-center gap-2">
                  <UsersRound size={18} className="text-blue-600" />
                  <span className="text-sm font-extrabold text-[#0d3971]">
                    Faculty Researcher Profile
                  </span>
                  {isExpPending && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                      Request Sent
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedExpertForModal(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-100 hover:text-slate-700 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100">
                    {exp.domain}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0d3971] mt-1">
                    {exp.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700">
                    {exp.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <GraduationCap size={13} className="text-blue-600" />
                    <span>{exp.university}, {exp.district}</span>
                  </p>
                </div>

                {/* Bio */}
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-700 leading-relaxed">
                  {exp.bio}
                </div>

                {/* Research Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-blue-50/60 p-3 border border-blue-100">
                    <p className="text-[10px] font-bold text-slate-500">Publications</p>
                    <p className="text-base font-extrabold text-[#0d3971]">{exp.publications}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50/60 p-3 border border-blue-100">
                    <p className="text-[10px] font-bold text-slate-500">Patents Filed</p>
                    <p className="text-base font-extrabold text-blue-700">{exp.patents}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50/60 p-3 border border-blue-100">
                    <p className="text-[10px] font-bold text-slate-500">Civic Projects</p>
                    <p className="text-base font-extrabold text-emerald-700">{exp.activeCivicProjects}</p>
                  </div>
                </div>

                {/* CSR Focus */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-3.5 text-xs">
                  <p className="font-bold text-[#0d3971]">Primary CSR & Industrial Research Focus</p>
                  <p className="text-slate-700 mt-0.5">{exp.csrFocus}</p>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedExpertForModal(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Close
                  </button>

                  {isExpPending ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 text-xs font-bold text-amber-700">
                      <Clock size={14} className="text-amber-600" /> Mentorship Request Sent
                    </span>
                  ) : isExpActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700">
                      <CheckCircle2 size={14} className="text-emerald-600" /> Active Mentor
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedExpertForModal(null);
                        handleOpenCollaborate(exp, "expert");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d3971] hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer"
                    >
                      <Handshake size={14} /> Request Mentorship / Collaboration
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
