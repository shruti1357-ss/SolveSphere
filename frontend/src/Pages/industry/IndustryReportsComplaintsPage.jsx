import { useState, useMemo, useEffect } from "react";
import {
  FileText,
  MapPin,
  Clock3,
  Clock,
  Search,
  Filter,
  Sparkles,
  Handshake,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Building2,
  GraduationCap,
  ChevronDown,
  X,
  Send,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import IndustryModuleLayout from "../../components/industry/IndustryModuleLayout";
import CollaborationModal from "../../components/industry/CollaborationModal";
import { useAuth } from "../../context/AuthContext";
import { getCompanyProfile } from "../../utils/industryMockData";

const INITIAL_REPORTS = [
  {
    id: "HF-0123",
    title: "Severe Waterlogging & Open Drain Overflow near Government High School",
    category: "Water & Sanitation",
    district: "East Singhbhum",
    location: "Sakchi, Jamshedpur",
    priority: "Critical",
    status: "Under Review",
    date: "2 hours ago",
    university: "NIT Jamshedpur",
    citizenName: "Rameshwar Mahato",
    description: "Monsoon rainwater overflows the broken municipal stormwater culvert directly onto the school access road, blocking 600+ students and posing flood and infection risks.",
    assignedFaculty: "Dr. Ananya Sen (Dept. of Environmental Engineering)",
    csrFundRequired: "₹ 4,50,000",
    techDomain: "IoT Drainage Telemetry & Culvert Redesign",
  },
  {
    id: "HF-0118",
    title: "Unsegregated Garbage Accumulation & Biomass Burning in Market Cluster",
    category: "Waste Management",
    district: "Bokaro",
    location: "Sector 4 Market, Bokaro Steel City",
    priority: "Medium",
    status: "In Progress",
    date: "4 hours ago",
    university: "IIT Ranchi Extension",
    citizenName: "Pooja Kumari",
    description: "Over 8 tons of mixed commercial solid waste dumped openly near residential quarters with frequent open burning causing toxic particulate smog.",
    assignedFaculty: "Prof. S. K. Mitra (Dept. of Clean Tech)",
    csrFundRequired: "₹ 3,20,000",
    techDomain: "Mechanized Organic Composters & Solar Incinerator",
  },
  {
    id: "HF-0107",
    title: "Structural Roof Cracks & Water Leakage in Primary School Classrooms",
    category: "Education",
    district: "Hazaribagh",
    location: "Barhi Block, Hazaribagh",
    priority: "High",
    status: "Assigned",
    date: "6 hours ago",
    university: "Vinoba Bhave University",
    citizenName: "Sunil Soren",
    description: "Heavy seepage in two primary classroom slabs during rains. Ceiling plaster falling with risk to children.",
    assignedFaculty: "Dr. Alok Prasad (Dept. of Civil Infrastructure)",
    csrFundRequired: "₹ 5,80,000",
    techDomain: "Waterproof Polymer Grouting & STEM Lab Upgrade",
  },
  {
    id: "HF-0095",
    title: "Solar & Grid Street Lighting Failure on Dark Arterial Road",
    category: "Energy & Electricity",
    district: "Ranchi",
    location: "Kanke Road, Ranchi",
    priority: "Low",
    status: "Open",
    date: "8 hours ago",
    university: "BIT Mesra",
    citizenName: "Amitabh Verma",
    description: "14 street light poles non-functional for past 3 weeks leading to pedestrian accidents and safety issues at night.",
    assignedFaculty: "Dr. Rajesh Kumar Sharma (Electrical Engg)",
    csrFundRequired: "₹ 1,80,000",
    techDomain: "Smart LED Inverter & IoT Fault Detection Node",
  },
  {
    id: "HF-0089",
    title: "Seasonal Low-Lying Flooding & Blocked River Tributary Channel",
    category: "Water & Sanitation",
    district: "Dhanbad",
    location: "Katras, Dhanbad",
    priority: "Critical",
    status: "Assigned",
    date: "10 hours ago",
    university: "IIT (ISM) Dhanbad",
    citizenName: "Manoj Singh",
    description: "Silted natural canal overflows into 120+ households during flash rains, disrupting drinking water borewells.",
    assignedFaculty: "Prof. Rajeshwar Rao (Mining & Hydrology Dept)",
    csrFundRequired: "₹ 6,50,000",
    techDomain: "Hydraulic Dredging Simulation & Sensor Mesh",
  },
  {
    id: "HF-0074",
    title: "Potholed State Highway Stretch Causing Heavy Vehicle Bottlenecks",
    category: "Road & Transport",
    district: "Ramgarh",
    location: "NH-33 Bypass, Ramgarh",
    priority: "High",
    status: "In Progress",
    date: "1 day ago",
    university: "Ramgarh Engineering College",
    citizenName: "Vikash Pandey",
    description: "Severe cratering over a 1.2 km industrial haulage corridor causing axle breakage and traffic jams.",
    assignedFaculty: "Dr. Meera Verma (Transportation Tech)",
    csrFundRequired: "₹ 7,00,000",
    techDomain: "Cold Mix Bitumen & AI Pothole Detection",
  },
  {
    id: "HF-0062",
    title: "Lack of Clean Drinking Water Filtration at Community Health Sub-Center",
    category: "Healthcare",
    district: "Dumka",
    location: "Ranishwar, Dumka",
    priority: "High",
    status: "Open",
    date: "2 days ago",
    university: "Sido Kanhu Murmu University",
    citizenName: "Anjali Hansda",
    description: "High iron and arsenic content in sub-center tubewell water. Patients and expectant mothers forced to fetch water from afar.",
    assignedFaculty: "Prof. Priya Nath (Biomedical Sciences)",
    csrFundRequired: "₹ 2,90,000",
    techDomain: "Solar Arsenic/Iron Ultrafiltration Unit",
  },
];

const priorityClass = {
  Critical: "bg-red-50 text-red-700 border border-red-200",
  High: "bg-orange-50 text-orange-700 border border-orange-200",
  Medium: "bg-amber-50 text-amber-700 border border-amber-200",
  Low: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const statusClass = {
  Open: "bg-blue-50 text-blue-700 border border-blue-200",
  "Under Review": "bg-purple-50 text-purple-700 border border-purple-200",
  Assigned: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "In Progress": "bg-amber-50 text-amber-700 border border-amber-200",
  Resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

export default function IndustryReportsComplaintsPage() {
  const { user, userProblems } = useAuth();
  const [version, setVersion] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [activeReportForDrawer, setActiveReportForDrawer] = useState(null);
  const [activeProjectForModal, setActiveProjectForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync real-time storage
  useEffect(() => {
    const handleUpdate = () => setVersion((v) => v + 1);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("solvesphere_problems_updated", handleUpdate);
    window.addEventListener("solvesphere_collaborations_updated", handleUpdate);
    window.addEventListener("solvesphere_university_updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("solvesphere_problems_updated", handleUpdate);
      window.removeEventListener("solvesphere_collaborations_updated", handleUpdate);
      window.removeEventListener("solvesphere_university_updated", handleUpdate);
    };
  }, []);

  const companyProfile = useMemo(() => getCompanyProfile(user), [user, version]);

  const userKey = String(
    user?.email || user?.organization || user?.name || "industry"
  ).toLowerCase().trim();

  // Real-time map of reportId / problem title -> collaboration request status
  const collabStatusMap = useMemo(() => {
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
            if (req.projectId) map[String(req.projectId).trim().toLowerCase()] = req.status || "PENDING";
            if (req.projectName) map[req.projectName.trim().toLowerCase()] = req.status || "PENDING";
          });
        }
      }
    } catch {}
    return map;
  }, [userKey, version]);

  // Combine live citizen reports with initial reports
  const allReports = useMemo(() => {
    let list = [];
    try {
      const saved = localStorage.getItem("solvesphere_problems");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) list = parsed;
      }
    } catch {}

    const liveItems = [...(userProblems || []), ...list].map((p, idx) => ({
      id: p.id ? String(p.id) : `HF-${String(100 + idx).padStart(4, "0")}`,
      title: p.title || "Civic Infrastructure Issue",
      category: p.category || "Infrastructure",
      district: p.district || p.location?.split(",")[1]?.trim() || "Ranchi",
      location: p.location || "Jharkhand",
      priority: p.priority || "High",
      status: p.status || "Under Review",
      date: p.date || p.createdAt || "Recent",
      university: p.assignedUniversity || "BIT Mesra",
      citizenName: p.citizenName || p.author || "Concerned Citizen",
      description: p.description || p.problemStatement || "Civic problem submitted for resolution.",
      assignedFaculty: p.facultyMentor || "Academic R&D Department",
      csrFundRequired: p.estimatedBudget || "₹ 4,00,000",
      techDomain: p.domain || p.category || "Civic Innovation",
    }));

    const seen = new Set();
    const combined = [];

    [...liveItems, ...INITIAL_REPORTS].forEach((item) => {
      const key = String(item.id).toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(item);
      }
    });

    return combined;
  }, [userProblems, version]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return allReports.filter((r) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.university || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === "All" ||
        r.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesDistrict =
        selectedDistrict === "All" ||
        r.district.toLowerCase() === selectedDistrict.toLowerCase();

      const matchesPriority =
        selectedPriority === "All" ||
        r.priority.toLowerCase() === selectedPriority.toLowerCase();

      const matchesStatus =
        selectedStatus === "All" ||
        r.status.toLowerCase() === selectedStatus.toLowerCase();

      return (
        matchesSearch &&
        matchesCat &&
        matchesDistrict &&
        matchesPriority &&
        matchesStatus
      );
    });
  }, [allReports, searchQuery, selectedCategory, selectedDistrict, selectedPriority, selectedStatus]);

  // Dynamic KPIs
  const totalReportsCount = allReports.length;
  const pendingReviewCount = allReports.filter((r) => r.status === "Under Review" || r.status === "Open").length;
  const assignedCount = allReports.filter((r) => r.status === "Assigned" || r.status === "In Progress").length;
  const industryRelevantCount = useMemo(() => {
    const areas = companyProfile.areasOfInterest || [];
    return allReports.filter((r) =>
      areas.some((a) => (r.category || "").toLowerCase().includes(a.toLowerCase()))
    ).length || Math.round(totalReportsCount * 0.65);
  }, [allReports, companyProfile]);

  // Unique lists for filter dropdowns
  const categoriesList = useMemo(() => {
    return ["All", ...new Set(allReports.map((r) => r.category).filter(Boolean))];
  }, [allReports]);

  const districtsList = useMemo(() => {
    return ["All", ...new Set(allReports.map((r) => r.district).filter(Boolean))];
  }, [allReports]);

  const handleOpenSponsorModal = (report) => {
    setActiveProjectForModal({
      id: report.id,
      title: report.title,
      university: report.university || "Jharkhand University",
      domain: report.category,
      district: report.district,
      location: report.location,
      currentStage: "Community Field Implementation",
      progressPercentage: 50,
    });
    setIsModalOpen(true);
  };

  const handleCollaborationSuccess = () => {
    setVersion((v) => v + 1);
  };

  return (
    <IndustryModuleLayout
      title="Reports & Complaints"
      subtitle="Review verified citizen reports and sponsor impactful solutions through university R&D partnerships."
      icon={FileText}
    >
      {/* KPI Overview Cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Civic Reports",
            value: totalReportsCount,
            trend: "12%",
            icon: FileText,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "Pending Review / Open",
            value: pendingReviewCount,
            trend: "8%",
            icon: Clock3,
            color: "text-amber-600 bg-amber-50",
          },
          {
            label: "CSR Relevant to You",
            value: industryRelevantCount,
            trend: "18%",
            icon: Sparkles,
            color: "text-cyan-600 bg-cyan-50",
          },
          {
            label: "HEI Assigned & In Progress",
            value: assignedCount,
            trend: "15%",
            icon: Handshake,
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
              <span className="text-xs font-bold text-emerald-600">↑ {item.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Card with Search & Filters */}
      <section className="mt-5 rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
        {/* Header Bar */}
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#0d3971]">
                Citizen Reports & Civic Complaints
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Explore real-time problems from Jharkhand districts and sponsor technological solutions.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-100 self-start md:self-auto">
              <Sparkles size={13} className="text-blue-600" /> {filteredReports.length} Available
            </span>
          </div>

          {/* Search and Filters Bar */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, issue, district, category..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by Category"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="All">All Categories</option>
                {categoriesList.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* District Dropdown */}
            <div>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                aria-label="Filter by District"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="All">All Districts</option>
                {districtsList.filter((d) => d !== "All").map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Priority Dropdown */}
            <div>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                aria-label="Filter by Priority"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {filteredReports.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3">
                <Filter size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0d3971]">No Reports Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                No reports matched your active filter or search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedDistrict("All");
                  setSelectedPriority("All");
                  setSelectedStatus("All");
                }}
                className="mt-3 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <table className="w-full min-w-[950px] text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">ID</th>
                  <th className="px-5 py-3.5">Issue & Category</th>
                  <th className="px-5 py-3.5">District / Location</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Assigned University</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((r) => {
                  const reqStatus =
                    collabStatusMap[String(r.id).trim().toLowerCase()] ||
                    collabStatusMap[r.title?.trim().toLowerCase()];

                  const isPending = String(reqStatus || "").toUpperCase() === "PENDING";
                  const isActive =
                    String(reqStatus || "").toUpperCase() === "ACTIVE" ||
                    String(reqStatus || "").toUpperCase() === "ACCEPTED";
                  const isCompleted =
                    String(reqStatus || "").toUpperCase() === "COMPLETED" ||
                    String(reqStatus || "").toUpperCase() === "RESOLVED";

                  return (
                    <tr key={r.id} className="hover:bg-blue-50/30 transition">
                      {/* ID */}
                      <td className="px-5 py-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                        {r.id}
                      </td>

                      {/* Issue Title & Category */}
                      <td className="px-5 py-4 max-w-[280px]">
                        <p
                          className="font-bold text-slate-800 line-clamp-1 hover:text-blue-600 cursor-pointer"
                          onClick={() => setActiveReportForDrawer(r)}
                        >
                          {r.title}
                        </p>
                        <span className="mt-1 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-100">
                          {r.category}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-slate-400 shrink-0" />
                          <span className="font-medium">{r.location || r.district}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 pl-4">{r.district}</span>
                      </td>

                      {/* Priority */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            priorityClass[r.priority] || priorityClass.Medium
                          }`}
                        >
                          {r.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            statusClass[r.status] || statusClass.Open
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      {/* Assigned University */}
                      <td className="px-5 py-4 text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <GraduationCap size={14} className="text-blue-600 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate max-w-[160px]">
                            {r.university || "Pending Assignment"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveReportForDrawer(r)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
                          >
                            <Eye size={12} /> View Details
                          </button>

                          {isPending ? (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-[11px] font-bold text-amber-700 shadow-xs select-none">
                              <Clock size={12} className="text-amber-600" /> Request Sent
                            </span>
                          ) : isActive ? (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 shadow-xs select-none">
                              <CheckCircle2 size={12} className="text-emerald-600" /> Active Partner
                            </span>
                          ) : isCompleted ? (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 shadow-xs select-none">
                              <CheckCircle2 size={12} className="text-blue-600" /> Completed
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenSponsorModal(r)}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#0d3971] hover:bg-blue-700 px-3 py-1.5 text-[11px] font-bold text-white shadow-xs transition cursor-pointer active:scale-95"
                            >
                              <Handshake size={12} /> Collaborate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Response Workflow Banner */}
      <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-slate-700 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-[#0d3971]">
          <Clock3 size={17} className="text-blue-600" /> Response & CSR Sponsorship Workflow
        </div>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
          Civic complaints validated by District Administration can be reviewed and sponsored by Industry CSR programs. Matched university engineering teams receive direct funding and technical mentorship to develop field solutions without disrupting citizen reporting workflows.
        </p>
      </div>

      {/* Report Detail Modal / Drawer */}
      {activeReportForDrawer && (() => {
        const reqStatus =
          collabStatusMap[String(activeReportForDrawer.id).trim().toLowerCase()] ||
          collabStatusMap[activeReportForDrawer.title?.trim().toLowerCase()];

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
                  <span className="font-mono text-xs font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                    {activeReportForDrawer.id}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${priorityClass[activeReportForDrawer.priority]}`}>
                    {activeReportForDrawer.priority} Priority
                  </span>
                  {isPending && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                      Request Sent
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setActiveReportForDrawer(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-100 hover:text-slate-700 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0d3971]">
                    {activeReportForDrawer.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin size={14} className="text-blue-600" /> {activeReportForDrawer.location}, {activeReportForDrawer.district}
                    </span>
                    <span>•</span>
                    <span>Reported {activeReportForDrawer.date}</span>
                    <span>•</span>
                    <span className="text-blue-700 font-semibold">{activeReportForDrawer.category}</span>
                  </div>
                </div>

                {/* Citizen Description */}
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Problem Description
                  </p>
                  <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                    {activeReportForDrawer.description}
                  </p>
                </div>

                {/* University Match & CSR Opportunity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0d3971]">
                      <GraduationCap size={15} className="text-blue-600" /> Assigned University
                    </div>
                    <p className="mt-1 text-xs font-semibold text-slate-800">
                      {activeReportForDrawer.university}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Lead: {activeReportForDrawer.assignedFaculty}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0d3971]">
                      <Sparkles size={15} className="text-blue-600" /> Estimated CSR Funding
                    </div>
                    <p className="mt-1 text-sm font-extrabold text-blue-700">
                      {activeReportForDrawer.csrFundRequired}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Domain: {activeReportForDrawer.techDomain}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveReportForDrawer(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Close
                  </button>

                  {isPending ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 text-xs font-bold text-amber-700">
                      <Clock size={14} className="text-amber-600" /> Request Sent (Pending Approval)
                    </span>
                  ) : isActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700">
                      <CheckCircle2 size={14} className="text-emerald-600" /> Active Partnership
                    </span>
                  ) : isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-xs font-bold text-blue-700">
                      <CheckCircle2 size={14} className="text-blue-600" /> Completed
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const r = activeReportForDrawer;
                        setActiveReportForDrawer(null);
                        handleOpenSponsorModal(r);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d3971] hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer active:scale-95"
                    >
                      <Handshake size={14} /> Sponsor Solution / Collaborate
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={activeProjectForModal}
        onSuccess={handleCollaborationSuccess}
      />
    </IndustryModuleLayout>
  );
}
