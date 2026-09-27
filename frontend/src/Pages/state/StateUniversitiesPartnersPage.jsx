import React, { useMemo, useState } from "react";
import {
  GraduationCap,
  MapPin,
  Award,
  CheckCircle2,
  BookOpen,
  Users,
  Search,
  ChevronRight,
  Clock,
  Sparkles,
  Layers,
  X,
  ExternalLink,
  Target,
  UserCheck,
  Building2,
  FileCheck,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";

const mockUniversities = [
  {
    id: 1,
    name: "Indian Institute of Technology (IIT ISM) Dhanbad",
    shortName: "IIT Dhanbad",
    district: "Dhanbad",
    status: "Verified",
    expertise: "Mining Technology, Water Sensors, Environmental Engineering",
    rating: 4.9,
    activeProjectsCount: 5,
    completedProjectsCount: 12,
    studentsInvolvedCount: 140,
    activeProjects: [
      { id: "PRJ-DHN-01", title: "Smart Ground Sensor Network for Mine Water Ingress", lead: "Dr. Ananya Ray (Mining Dept)", status: "Milestone 2/3 (Field Prototyping)", grant: "₹42 Lakhs", timeline: "Jan 2026 – Nov 2026", domain: "IoT & Mining" },
      { id: "PRJ-DHN-02", title: "Real-time Particulate (PM2.5) Air Monitoring Array", lead: "Prof. S. K. Mahato (Env Sci)", status: "Active (Telemetry Deployed)", grant: "₹35 Lakhs", timeline: "Mar 2026 – Oct 2026", domain: "Air Quality" },
      { id: "PRJ-DHN-03", title: "Heavy Metal Water Purification Bio-Filter", lead: "Dr. Rohit Sinha (Chemical)", status: "Testing & Validation", grant: "₹28 Lakhs", timeline: "Feb 2026 – Dec 2026", domain: "Water & Sanitation" },
      { id: "PRJ-DHN-04", title: "Seismic Micro-Tremor Detection in Coal Belts", lead: "Dr. V. Rao (Geophysics)", status: "Algorithm Calibration", grant: "₹50 Lakhs", timeline: "Apr 2026 – Jan 2027", domain: "Disaster Tech" },
      { id: "PRJ-DHN-05", title: "Solar Micro-Grid Automated Load Balancer", lead: "Prof. N. K. Jha (Electrical)", status: "Prototype Bench Testing", grant: "₹30 Lakhs", timeline: "May 2026 – Nov 2026", domain: "Clean Energy" },
    ],
    completedProjects: [
      { id: "PRJ-DHN-C01", title: "Automated Coal Dust Mist Suppression Cannons", year: "2025", impact: "Deployed across 4 BCCL loading zones", lead: "Dr. A. Ray" },
      { id: "PRJ-DHN-C02", title: "IoT Aquifer Depth Mapping for Dhanbad Municipal", year: "2025", impact: "Helped drill 28 successful community borewells", lead: "Prof. S. K. Mahato" },
      { id: "PRJ-DHN-C03", title: "Drone LiDAR Topographic Survey for Slag Dumps", year: "2024", impact: "Identified 6 hazardous slide zones", lead: "Prof. V. Rao" },
    ],
    students: [
      { name: "Rahul Mukherjee", roll: "22BT-MN042", phone: "+91 98351 44021", email: "rahul.m@iitism.ac.in", program: "B.Tech Final Year", project: "Mine Water Ingress Detection", role: "Hardware Lead" },
      { name: "Pooja Banerjee", roll: "24MT-ES012", phone: "+91 94311 22890", email: "pooja.b@iitism.ac.in", program: "M.Tech Environmental Eng", project: "PM2.5 Array Deployment", role: "Data Analyst" },
      { name: "Aman Gupta", roll: "23BT-CS098", phone: "+91 98355 77123", email: "aman.g@iitism.ac.in", program: "B.Tech CSE", project: "Solar Micro-Grid Telemetry", role: "Firmware Developer" },
      { name: "Sneha Soren", roll: "21PH-CH005", phone: "+91 97714 88301", email: "sneha.s@iitism.ac.in", program: "Ph.D. Scholar", project: "Heavy Metal Bio-Filter", role: "Primary Researcher" },
    ],
  },
  {
    id: 2,
    name: "Birsa Agricultural University",
    shortName: "BAU Ranchi",
    district: "Ranchi",
    status: "Verified",
    expertise: "Agritech, Soil Health, Crop Monitoring, Organic Farming",
    rating: 4.8,
    activeProjectsCount: 4,
    completedProjectsCount: 9,
    studentsInvolvedCount: 95,
    activeProjects: [
      { id: "PRJ-BAU-01", title: "Low-Cost Soil Moisture & NPK Micro-Sensor Node", lead: "Dr. B. K. Singh (Agronomy)", status: "Field Trials in Ormanjhi Block", grant: "₹25 Lakhs", timeline: "Feb 2026 – Dec 2026", domain: "Agritech" },
      { id: "PRJ-BAU-02", title: "Satellite Drought Early Warning & Crop Advisory", lead: "Dr. Meena Soren (Agri-Meteorology)", status: "Active (SMS Dispatch)", grant: "₹38 Lakhs", timeline: "Jan 2026 – Oct 2026", domain: "Remote Sensing" },
      { id: "PRJ-BAU-03", title: "Bio-Enriched Vermicompost for Degraded Plateau Soils", lead: "Prof. R. P. Sharma (Soil Sci)", status: "Pilot Distribution", grant: "₹18 Lakhs", timeline: "Apr 2026 – Nov 2026", domain: "Soil Health" },
      { id: "PRJ-BAU-04", title: "Automated Drip Irrigation Timer for Tribal Farmers", lead: "Dr. Alok Verma (Agri Eng)", status: "Prototyping", grant: "₹22 Lakhs", timeline: "May 2026 – Dec 2026", domain: "Irrigation" },
    ],
    completedProjects: [
      { id: "PRJ-BAU-C01", title: "Drought Tolerant Millet Seed Bank", year: "2025", impact: "Supplied to 1,200 farmers in Latehar & Khunti", lead: "Dr. B. K. Singh" },
      { id: "PRJ-BAU-C02", title: "Bio-Pesticide from Local Karanj & Neem Extracts", year: "2024", impact: "Reduced chemical runoff in 18 villages", lead: "Prof. R. P. Sharma" },
    ],
    students: [
      { name: "Sunil Marandi", roll: "22AG-045", phone: "+91 94301 66120", email: "sunil.m@bau.edu.in", program: "B.Sc. Agriculture (Hons)", project: "Soil Moisture Node", role: "Field Data Collector" },
      { name: "Kavita Kumari", roll: "24MAG-011", phone: "+91 99341 88452", email: "kavita.k@bau.edu.in", program: "M.Sc. Agronomy", project: "Drought Advisory Models", role: "GIS Analyst" },
      { name: "Deepak Hansda", roll: "23AG-089", phone: "+91 98352 11904", email: "deepak.h@bau.edu.in", program: "B.Sc. Agri Eng", project: "Automated Drip Timer", role: "Circuit Designer" },
    ],
  },
  {
    id: 3,
    name: "Central University of Jharkhand",
    shortName: "CUJ Ranchi",
    district: "Ranchi",
    status: "Verified",
    expertise: "Clean Energy, Public Policy, Tribal Education Tech",
    rating: 4.7,
    activeProjectsCount: 3,
    completedProjectsCount: 8,
    studentsInvolvedCount: 80,
    activeProjects: [
      { id: "PRJ-CUJ-01", title: "Tribal Language (Santhali/Ho/Kurukh) Audio Learning Kiosks", lead: "Dr. Saroj K. Mishra (EdTech)", status: "Field Pilot in 12 Anganwadis", grant: "₹32 Lakhs", timeline: "Feb 2026 – Nov 2026", domain: "EdTech" },
      { id: "PRJ-CUJ-02", title: "Village Decentralized Biomass-Solar Hybrid Microgrid", lead: "Prof. A. N. Bhattacharya (Energy)", status: "Turbine Installation", grant: "₹48 Lakhs", timeline: "Jan 2026 – Dec 2026", domain: "Clean Energy" },
      { id: "PRJ-CUJ-03", title: "Forest Rights & Geo-Spatial Land Claim Tracking Tool", lead: "Dr. Rashmi Oraon (Tribal Studies)", status: "Software Verification", grant: "₹20 Lakhs", timeline: "Mar 2026 – Oct 2026", domain: "Governance" },
    ],
    completedProjects: [
      { id: "PRJ-CUJ-C01", title: "Solar Cold Storage for Minor Forest Produce", year: "2025", impact: "Installed in Tamar & Torpa mandis", lead: "Prof. A. N. Bhattacharya" },
      { id: "PRJ-CUJ-C02", title: "Fluoride Filtration via Locally Sourced Clay Ceramics", year: "2024", impact: "Zero-energy filters supplied to 400 households", lead: "Dr. Saroj K. Mishra" },
    ],
    students: [
      { name: "Birsa Tigga", roll: "23TS-014", phone: "+91 94313 55091", email: "birsa.t@cuj.ac.in", program: "M.A. Tribal Studies", project: "Forest Rights Mapping", role: "Field Investigator" },
      { name: "Neha Paul", roll: "24EN-008", phone: "+91 98357 22180", email: "neha.p@cuj.ac.in", program: "M.Tech Energy Eng", project: "Biomass Hybrid Microgrid", role: "System Modeler" },
      { name: "Vikram Kumar", roll: "22CS-033", phone: "+91 97711 66345", email: "vikram.k@cuj.ac.in", program: "B.Tech CSE", project: "Audio Learning Kiosk", role: "App Developer" },
    ],
  },
  {
    id: 4,
    name: "National Institute of Technology (NIT) Jamshedpur",
    shortName: "NIT Jamshedpur",
    district: "East Singhbhum",
    status: "Verified",
    expertise: "Smart Infrastructure, Traffic Automation, Heavy Manufacturing",
    rating: 4.9,
    activeProjectsCount: 6,
    completedProjectsCount: 15,
    studentsInvolvedCount: 180,
    activeProjects: [
      { id: "PRJ-NIT-01", title: "AI-Powered Pothole & Road Quality Fleet Scanner", lead: "Dr. Manoj Kumar (Civil)", status: "Installed on 20 City Buses", grant: "₹40 Lakhs", timeline: "Jan 2026 – Oct 2026", domain: "Smart Roads" },
      { id: "PRJ-NIT-02", title: "Industrial Effluent Real-Time Spectral Analyzer", lead: "Prof. S. Majumdar (Electronics)", status: "Field Trials on Subarnarekha", grant: "₹55 Lakhs", timeline: "Feb 2026 – Dec 2026", domain: "Water Pollution" },
      { id: "PRJ-NIT-03", title: "Smart Adaptive Traffic Signal Synchronization", lead: "Dr. R. K. Tiwari (Computer Science)", status: "Piloting at 6 Jamshedpur Junctions", grant: "₹35 Lakhs", timeline: "Mar 2026 – Nov 2026", domain: "Traffic AI" },
      { id: "PRJ-NIT-04", title: "Structural Health Telemetry for Old Highway Bridges", lead: "Prof. P. K. Roy (Structural Eng)", status: "Sensor Calibration", grant: "₹45 Lakhs", timeline: "Apr 2026 – Jan 2027", domain: "Infrastructure" },
    ],
    completedProjects: [
      { id: "PRJ-NIT-C01", title: "Automated Industrial Gas Leakage Warning Network", year: "2025", impact: "Integrated in Adityapur Industrial Area", lead: "Prof. S. Majumdar" },
      { id: "PRJ-NIT-C02", title: "Recycled Plastic Aggregate for Heavy Duty Roads", year: "2024", impact: "Paved 14km stretch near Mango bridge", lead: "Dr. Manoj Kumar" },
    ],
    students: [
      { name: "Aniket Sharma", roll: "22CE-072", phone: "+91 98350 11299", email: "aniket.s@nitjsr.ac.in", program: "B.Tech Civil Eng", project: "Road Scanner Fleet", role: "Computer Vision Lead" },
      { name: "Shreya Sen", roll: "23EC-031", phone: "+91 94318 44028", email: "shreya.s@nitjsr.ac.in", program: "B.Tech ECE", project: "Effluent Spectral Analyzer", role: "Sensor Circuit Designer" },
      { name: "Tanmay Roy", roll: "24CS-104", phone: "+91 97715 88912", email: "tanmay.r@nitjsr.ac.in", program: "M.Tech CSE", project: "Adaptive Traffic AI", role: "Algorithm Engineer" },
    ],
  },
  {
    id: 5,
    name: "Ranchi University",
    shortName: "Ranchi University",
    district: "Ranchi",
    status: "Verified",
    expertise: "Social Work, Health Administration, Rural Development",
    rating: 4.5,
    activeProjectsCount: 2,
    completedProjectsCount: 6,
    studentsInvolvedCount: 65,
    activeProjects: [
      { id: "PRJ-RU-01", title: "Community Health Worker (ASHA) Mobile Diagnostic Kit", lead: "Dr. Pratibha Das (Life Sciences)", status: "Piloting across 30 Anganwadis", grant: "₹20 Lakhs", timeline: "Feb 2026 – Nov 2026", domain: "Public Health" },
      { id: "PRJ-RU-02", title: "Rural Women Self-Help Group Digital Market Access", lead: "Dr. Sanjay Tirkey (Social Work)", status: "Active Onboarding", grant: "₹15 Lakhs", timeline: "Jan 2026 – Sep 2026", domain: "Rural Economy" },
    ],
    completedProjects: [
      { id: "PRJ-RU-C01", title: "Maternal Anemia Mapping in Tamar Block", year: "2025", impact: "Helped state health dept distribute iron supplements to 1,800 mothers", lead: "Dr. Pratibha Das" },
    ],
    students: [
      { name: "Anita Ekka", roll: "23MSW-019", phone: "+91 98353 77012", email: "anita.e@ranchiuniv.ac.in", program: "Master of Social Work", project: "SHG Digital Market", role: "Field Facilitator" },
      { name: "Rajesh Mahto", roll: "24LS-005", phone: "+91 94310 99451", email: "rajesh.m@ranchiuniv.ac.in", program: "M.Sc. Life Sciences", project: "ASHA Diagnostic Kit", role: "Kit Assembly & Training" },
    ],
  },
  {
    id: 6,
    name: "Vinoba Bhave University",
    shortName: "VBU Hazaribagh",
    district: "Hazaribagh",
    status: "Verified",
    expertise: "Botany, Biodiversity, Forestry Conservation",
    rating: 4.6,
    activeProjectsCount: 2,
    completedProjectsCount: 4,
    studentsInvolvedCount: 50,
    activeProjects: [
      { id: "PRJ-VBU-01", title: "Medicinal Plant Geo-Tagging & Conservation Database", lead: "Dr. Ashok Vidyarthi (Botany)", status: "Forest Inventory 70% Complete", grant: "₹18 Lakhs", timeline: "Jan 2026 – Oct 2026", domain: "Biodiversity" },
      { id: "PRJ-VBU-02", title: "Biochar Soil Regeneration in Abandoned Mining Pits", lead: "Dr. Geeta Prasad (Env Studies)", status: "Field Trials in Ramgarh border", grant: "₹24 Lakhs", timeline: "Mar 2026 – Dec 2026", domain: "Soil Reclamation" },
    ],
    completedProjects: [
      { id: "PRJ-VBU-C01", title: "Hazaribagh Wildlife Corridor Drone Monitoring", year: "2025", impact: "Prevented elephant-human conflict in 4 villages", lead: "Dr. Ashok Vidyarthi" },
    ],
    students: [
      { name: "Manoj Hansda", roll: "23BT-041", phone: "+91 94314 33290", email: "manoj.h@vbu.ac.in", program: "M.Sc. Botany", project: "Medicinal Plant Database", role: "Flora Surveyor" },
      { name: "Suman Bhengra", roll: "24ES-015", phone: "+91 98358 11674", email: "suman.b@vbu.ac.in", program: "M.Sc. Env Studies", project: "Biochar Pit Regeneration", role: "Soil Testing Lead" },
    ],
  },
];

const StateUniversitiesPartnersPage = () => {
  const [search, setSearch] = useState("");
  const [modalData, setModalData] = useState(null); // { uni, type: 'active' | 'completed' | 'students' }

  const filtered = useMemo(() => {
    return mockUniversities.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.district.toLowerCase().includes(search.toLowerCase()) ||
        u.expertise.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Aggregate Real-time Summary Counters
  const summaryTotals = useMemo(() => {
    const totalHEIs = mockUniversities.length;
    const totalActiveProjects = mockUniversities.reduce((sum, u) => sum + (u.activeProjectsCount || 0), 0);
    const totalCompletedProjects = mockUniversities.reduce((sum, u) => sum + (u.completedProjectsCount || 0), 0);
    const totalStudentsInvolved = mockUniversities.reduce((sum, u) => sum + (u.studentsInvolvedCount || 0), 0);
    return { totalHEIs, totalActiveProjects, totalCompletedProjects, totalStudentsInvolved };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
            <GraduationCap size={13} /> State Academic Network
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">Universities &amp; Higher Education Partners</h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered Higher Education Institutions (HEIs) in Jharkhand developing solutions for state challenges. Click any metric to inspect live project and student rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search university or expertise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:bg-white focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Top Real-Time Stat KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Partner HEIs</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <GraduationCap size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{summaryTotals.totalHEIs}</p>
          <span className="text-[10.5px] font-medium text-slate-400">Accredited Institutions</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Projects</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Target size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-900 mt-2">{summaryTotals.totalActiveProjects}</p>
          <span className="text-[10.5px] font-medium text-blue-600 font-semibold">Under State Allocation</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Completed Projects</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-900 mt-2">{summaryTotals.totalCompletedProjects}</p>
          <span className="text-[10.5px] font-medium text-emerald-600 font-semibold">Delivered to State</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Students</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-900 mt-2">{summaryTotals.totalStudentsInvolved.toLocaleString("en-IN")}+</p>
          <span className="text-[10.5px] font-medium text-purple-600 font-semibold">Student Researchers</span>
        </div>
      </div>

      {/* Grid of Universities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((uni) => (
          <div
            key={uni.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-100">
                  <GraduationCap size={20} />
                </div>
                <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[9.5px] font-extrabold">
                  {uni.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{uni.name}</h3>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-medium">
                  <MapPin size={12} className="text-blue-600" /> {uni.district}, Jharkhand
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <p className="text-[9.5px] font-bold text-slate-400 uppercase">Expertise &amp; R&amp;D Focus</p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">{uni.expertise}</p>
              </div>
            </div>

            {/* Interactive Stat Buttons for Government Inspection */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              {/* Active Projects Button */}
              <button
                type="button"
                onClick={() => setModalData({ uni, type: "active" })}
                className="group/btn p-2 rounded-xl bg-blue-50/70 border border-blue-100 hover:bg-blue-600 hover:text-white transition shadow-xs cursor-pointer flex flex-col items-center justify-center"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 group-hover/btn:text-blue-100">
                  Active
                </span>
                <p className="text-base font-black text-blue-900 group-hover/btn:text-white mt-0.5">
                  {uni.activeProjectsCount}
                </p>
                <span className="text-[8.5px] font-semibold text-blue-600 group-hover/btn:text-blue-200 mt-0.5">
                  View Details →
                </span>
              </button>

              {/* Completed Projects Button */}
              <button
                type="button"
                onClick={() => setModalData({ uni, type: "completed" })}
                className="group/btn p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition shadow-xs cursor-pointer flex flex-col items-center justify-center"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 group-hover/btn:text-emerald-100">
                  Completed
                </span>
                <p className="text-base font-black text-emerald-900 group-hover/btn:text-white mt-0.5">
                  {uni.completedProjectsCount}
                </p>
                <span className="text-[8.5px] font-semibold text-emerald-600 group-hover/btn:text-emerald-200 mt-0.5">
                  View Details →
                </span>
              </button>

              {/* Students Involved Button */}
              <button
                type="button"
                onClick={() => setModalData({ uni, type: "students" })}
                className="group/btn p-2 rounded-xl bg-purple-50/70 border border-purple-100 hover:bg-purple-600 hover:text-white transition shadow-xs cursor-pointer flex flex-col items-center justify-center"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-purple-700 group-hover/btn:text-purple-100">
                  Students
                </span>
                <p className="text-base font-black text-purple-900 group-hover/btn:text-white mt-0.5">
                  {uni.studentsInvolvedCount}
                </p>
                <span className="text-[8.5px] font-semibold text-purple-600 group-hover/btn:text-purple-200 mt-0.5">
                  View Roster →
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inspection Modal */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-fade-in">
            {/* Modal Top Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-700 border border-blue-200 mb-1">
                  <GraduationCap size={12} />
                  {modalData.uni.name}
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {modalData.type === "active"
                    ? "Active R&D Projects Under State Allocation"
                    : modalData.type === "completed"
                    ? "Completed State Impact Projects & Deployments"
                    : "Student Researchers & Academic Roster"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {modalData.uni.district}, Jharkhand • Rating: {modalData.uni.rating}/5.0
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalData(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content Based on Type */}
            {modalData.type === "active" && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-600">
                  Showing {modalData.uni.activeProjects?.length || 0} ongoing state problem solutions:
                </p>
                <div className="space-y-2.5">
                  {modalData.uni.activeProjects?.map((proj) => (
                    <div
                      key={proj.id}
                      className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 space-y-2 hover:bg-blue-50/30 transition"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                          {proj.id}
                        </span>
                        <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[9.5px] font-extrabold">
                          {proj.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900">{proj.title}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                        <div>
                          <span className="text-slate-400 text-[10px] block font-bold">Principal Lead</span>
                          <span className="font-semibold text-slate-800">{proj.lead}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block font-bold">Grant Allocation</span>
                          <span className="font-bold text-emerald-700">{proj.grant}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block font-bold">Timeline</span>
                          <span className="font-semibold text-slate-800">{proj.timeline}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {modalData.type === "completed" && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-600">
                  Showing successful solutions delivered to the state:
                </p>
                <div className="space-y-2.5">
                  {modalData.uni.completedProjects?.map((proj) => (
                    <div
                      key={proj.id}
                      className="rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          {proj.id}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800">
                          Delivered: {proj.year}
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900">{proj.title}</h4>
                      <p className="text-xs text-slate-700">
                        <strong className="text-emerald-900">State Impact:</strong> {proj.impact}
                      </p>
                      <p className="text-[10px] text-slate-500">Lead: {proj.lead}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {modalData.type === "students" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-600">
                    Student innovators &amp; researchers credited in state projects ({modalData.uni.studentsInvolvedCount} enrolled):
                  </p>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                    {modalData.uni.studentsInvolvedCount} Active Students
                  </span>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] font-extrabold uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-2">Roll / ID</th>
                        <th className="py-2.5 px-3">Direct Contact</th>
                        <th className="py-2.5 px-3">Academic Program</th>
                        <th className="py-2.5 px-3">Assigned Solution</th>
                        <th className="py-2.5 px-3 text-right">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {modalData.uni.students?.map((s, idx) => (
                        <tr key={idx} className="hover:bg-purple-50/30 transition">
                          <td className="py-2 px-3 font-extrabold text-slate-900">{s.name}</td>
                          <td className="py-2 px-2 font-mono text-slate-500 text-[11px]">{s.roll}</td>
                          <td className="py-2 px-3">
                            <div className="space-y-0.5 text-[11px]">
                              {s.phone && (
                                <a
                                  href={`tel:${s.phone.replace(/[^0-9+]/g, "")}`}
                                  className="flex items-center gap-1 text-slate-700 hover:text-blue-600 font-medium"
                                  title="Call Student"
                                >
                                  <Phone size={11} className="text-emerald-600 shrink-0" />
                                  <span>{s.phone}</span>
                                </a>
                              )}
                              {s.email && (
                                <a
                                  href={`mailto:${s.email}`}
                                  className="flex items-center gap-1 text-slate-500 hover:text-blue-600 font-mono text-[10px]"
                                  title="Email Student"
                                >
                                  <Mail size={11} className="text-blue-600 shrink-0" />
                                  <span>{s.email}</span>
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-3 text-slate-600">{s.program}</td>
                          <td className="py-2 px-3 font-semibold text-purple-950">{s.project}</td>
                          <td className="py-2 px-3 text-right">
                            <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-[9.5px] font-bold">
                              {s.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[10px] text-slate-400 font-medium">
                Official State Government Academic Accreditation Registry
              </span>
              <button
                type="button"
                onClick={() => setModalData(null)}
                className="rounded-xl bg-[#0d3971] px-5 py-2 text-xs font-extrabold text-white hover:bg-blue-800 shadow-sm transition"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateUniversitiesPartnersPage;
