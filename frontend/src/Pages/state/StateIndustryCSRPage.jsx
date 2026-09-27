import React, { useMemo, useState } from "react";
import {
  Building2,
  MapPin,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Award,
  Search,
  Users,
  Target,
  X,
  ExternalLink,
  Layers,
  Sparkles,
  Phone,
  Mail,
  FileCheck,
  Calendar,
} from "lucide-react";

const mockIndustries = [
  {
    id: 1,
    name: "Tata Steel Foundation",
    shortName: "Tata Steel CSR",
    location: "Jamshedpur",
    district: "East Singhbhum",
    status: "Verified",
    csrFund: "₹18.5 Cr",
    focusAreas: "Rural Water Supply, Tribal Skill Centers, School Infrastructure, Healthcare Vans",
    activeCollaborations: 6,
    mentorships: 14,
    activeProjects: [
      {
        id: "CSR-TSF-01",
        title: "Clean Drinking Water Reverse-Osmosis Nodes in 18 Tribal Villages",
        partnerUni: "NIT Jamshedpur",
        leadMentor: "Rajeshwar Sen (CSR Head, Water Infra)",
        grantSpent: "₹4.2 Cr",
        status: "Active Deployment",
        timeline: "Jan 2026 – Dec 2026",
      },
      {
        id: "CSR-TSF-02",
        title: "Youth Digital Skill Acceleration Lab & Fab-Lab",
        partnerUni: "Birsa Agricultural University",
        leadMentor: "Sunita Mahapatra (Skill Development Lead)",
        grantSpent: "₹3.8 Cr",
        status: "Curriculum In-Progress",
        timeline: "Feb 2026 – Nov 2026",
      },
      {
        id: "CSR-TSF-03",
        title: "Subarnarekha River Basin Industrial Effluent Telemetry",
        partnerUni: "NIT Jamshedpur",
        leadMentor: "Dr. Alok Verma (Environmental Lead)",
        grantSpent: "₹3.5 Cr",
        status: "Sensor Installation",
        timeline: "Mar 2026 – Jan 2027",
      },
      {
        id: "CSR-TSF-04",
        title: "Solar Cold Storage Mesh for Tamar Tribal Mandis",
        partnerUni: "Central University of Jharkhand",
        leadMentor: "Vikramjit Singh (Agritech Fellow)",
        grantSpent: "₹2.9 Cr",
        status: "Testing & Validation",
        timeline: "Apr 2026 – Oct 2026",
      },
    ],
    mentors: [
      {
        name: "Rajeshwar Sen",
        designation: "Chief CSR Officer, Water Systems",
        email: "rajeshwar.sen@tatasteel.com",
        phone: "+91 94311 55201",
        allocatedTeams: 3,
        focus: "Water Sanitation & Civil Architecture",
      },
      {
        name: "Sunita Mahapatra",
        designation: "Head of Community Skill Development",
        email: "sunita.m@tatasteel.com",
        phone: "+91 98350 44192",
        allocatedTeams: 4,
        focus: "EdTech & Tribal Livelihoods",
      },
      {
        name: "Dr. Alok Verma",
        designation: "Senior Environmental Fellow",
        email: "alok.verma@tatasteel.com",
        phone: "+91 97712 33810",
        allocatedTeams: 4,
        focus: "Industrial Waste Telemetry",
      },
      {
        name: "Vikramjit Singh",
        designation: "Agri-Enterprise Architect",
        email: "vikramjit.s@tatasteel.com",
        phone: "+91 94301 88471",
        allocatedTeams: 3,
        focus: "Solar Refrigeration & Mandi Logistics",
      },
    ],
  },
  {
    id: 2,
    name: "Coal India Limited (CIL CSR)",
    shortName: "Coal India CSR",
    location: "Ranchi",
    district: "Ranchi",
    status: "Verified",
    csrFund: "₹24.0 Cr",
    focusAreas: "Environment Restoration, Air Quality, Community Health, Mine Reclamation",
    activeCollaborations: 8,
    mentorships: 18,
    activeProjects: [
      {
        id: "CSR-CIL-01",
        title: "Overburden Dump Afforestation & Micro-Dust Suppression",
        partnerUni: "IIT (ISM) Dhanbad",
        leadMentor: "P. K. Shrivastava (Director CSR)",
        grantSpent: "₹6.5 Cr",
        status: "Active Deployment",
        timeline: "Jan 2026 – Feb 2027",
      },
      {
        id: "CSR-CIL-02",
        title: "Mobile Primary Diagnostic Units for 40 Mining Clusters",
        partnerUni: "Ranchi University",
        leadMentor: "Dr. Mamta Tiwari (Community Medicine)",
        grantSpent: "₹5.2 Cr",
        status: "Field Route 60% Active",
        timeline: "Feb 2026 – Dec 2026",
      },
      {
        id: "CSR-CIL-03",
        title: "Mine Water Desalination & Village Piped Distribution",
        partnerUni: "IIT (ISM) Dhanbad",
        leadMentor: "A. K. Mishra (Hydrology Lead)",
        grantSpent: "₹7.0 Cr",
        status: "Plant Construction",
        timeline: "Mar 2026 – Jan 2027",
      },
    ],
    mentors: [
      {
        name: "P. K. Shrivastava",
        designation: "Director CSR & Sustainable Mining",
        email: "pk.shrivastava@coalindia.in",
        phone: "+91 94313 11094",
        allocatedTeams: 5,
        focus: "Dust Control & Forestry Tech",
      },
      {
        name: "Dr. Mamta Tiwari",
        designation: "Head of Mobile Medical Clinics",
        email: "mamta.t@coalindia.in",
        phone: "+91 98352 66410",
        allocatedTeams: 6,
        focus: "Rural Public Health Delivery",
      },
      {
        name: "A. K. Mishra",
        designation: "Principal Hydrologist",
        email: "ak.mishra@coalindia.in",
        phone: "+91 97715 22904",
        allocatedTeams: 7,
        focus: "Aquifer Reclamation & Filtration",
      },
    ],
  },
  {
    id: 3,
    name: "NTPC Corporate Social Responsibility",
    shortName: "NTPC CSR",
    location: "Hazaribagh / Ramgarh",
    district: "Hazaribagh",
    status: "Verified",
    csrFund: "₹12.0 Cr",
    focusAreas: "Solar Microgrids, Clean Energy, Rural Lighting, Women Self-Help Groups",
    activeCollaborations: 4,
    mentorships: 10,
    activeProjects: [
      {
        id: "CSR-NTPC-01",
        title: "Decentralized Village Solar Microgrids in Tandwa Corridor",
        partnerUni: "Central University of Jharkhand",
        leadMentor: "Deepak Sahu (Renewable Energy Lead)",
        grantSpent: "₹4.8 Cr",
        status: "Grid Installation",
        timeline: "Jan 2026 – Nov 2026",
      },
      {
        id: "CSR-NTPC-02",
        title: "Fly-Ash Brick Smart Manufacturing Units for SHGs",
        partnerUni: "NIT Jamshedpur",
        leadMentor: "Priya Mukherjee (Livelihood Manager)",
        grantSpent: "₹3.2 Cr",
        status: "Equipment Dispatched",
        timeline: "Mar 2026 – Oct 2026",
      },
    ],
    mentors: [
      {
        name: "Deepak Sahu",
        designation: "General Manager, Clean Energy CSR",
        email: "deepak.sahu@ntpc.co.in",
        phone: "+91 94301 77120",
        allocatedTeams: 5,
        focus: "Smart Grids & Battery Storage",
      },
      {
        name: "Priya Mukherjee",
        designation: "Social Enterprise Coordinator",
        email: "priya.m@ntpc.co.in",
        phone: "+91 98358 44093",
        allocatedTeams: 5,
        focus: "Circular Economy & Fly-Ash",
      },
    ],
  },
  {
    id: 4,
    name: "JSW Foundation",
    shortName: "JSW Foundation",
    location: "Bokaro",
    district: "Bokaro",
    status: "Verified",
    csrFund: "₹8.5 Cr",
    focusAreas: "Waste Management, Recycling, Sanitation Facilities, Anganwadi Upgrades",
    activeCollaborations: 3,
    mentorships: 8,
    activeProjects: [
      {
        id: "CSR-JSW-01",
        title: "Model Smart Anganwadis & Bio-Toilet Construction",
        partnerUni: "Ranchi University",
        leadMentor: "Ananya Sengupta (CSR Lead)",
        grantSpent: "₹3.5 Cr",
        status: "Active Construction",
        timeline: "Feb 2026 – Nov 2026",
      },
      {
        id: "CSR-JSW-02",
        title: "Slag Waste Bitumen Aggregate for Rural Roads",
        partnerUni: "NIT Jamshedpur",
        leadMentor: "S. K. Verma (Materials Lead)",
        grantSpent: "₹2.8 Cr",
        status: "Lab Quality Certification",
        timeline: "Jan 2026 – Sep 2026",
      },
    ],
    mentors: [
      {
        name: "Ananya Sengupta",
        designation: "Director of Community Infrastructure",
        email: "ananya.s@jsw.in",
        phone: "+91 94314 88310",
        allocatedTeams: 4,
        focus: "Sanitation & Early Childhood Infra",
      },
      {
        name: "S. K. Verma",
        designation: "Metallurgical Waste Specialist",
        email: "sk.verma@jsw.in",
        phone: "+91 97711 55902",
        allocatedTeams: 4,
        focus: "Eco-Friendly Paving & Aggregate",
      },
    ],
  },
  {
    id: 5,
    name: "Adani Foundation",
    shortName: "Adani Foundation",
    location: "Godda",
    district: "Godda",
    status: "Verified",
    csrFund: "₹10.0 Cr",
    focusAreas: "Vocational Training, Healthcare Vans, Drinking Water, Drip Irrigation",
    activeCollaborations: 5,
    mentorships: 12,
    activeProjects: [
      {
        id: "CSR-ADN-01",
        title: "Precision Drip Irrigation for Santhal Pargana Farmers",
        partnerUni: "Birsa Agricultural University",
        leadMentor: "R. K. Choudhary (Agritech Mentor)",
        grantSpent: "₹4.0 Cr",
        status: "Subsidized Node Setup",
        timeline: "Jan 2026 – Dec 2026",
      },
      {
        id: "CSR-ADN-02",
        title: "Skill Gurukul IT & Automobile Vocational Center",
        partnerUni: "Central University of Jharkhand",
        leadMentor: "Meera Soren (Vocational Head)",
        grantSpent: "₹3.5 Cr",
        status: "Batch 1 Enrolled",
        timeline: "Feb 2026 – Oct 2026",
      },
    ],
    mentors: [
      {
        name: "R. K. Choudhary",
        designation: "Vice President, Rural Agribusiness",
        email: "rk.choudhary@adani.com",
        phone: "+91 94318 66205",
        allocatedTeams: 6,
        focus: "Irrigation Telemetry & Crop Yield",
      },
      {
        name: "Meera Soren",
        designation: "Dean of Vocational Programs",
        email: "meera.soren@adani.com",
        phone: "+91 98354 33119",
        allocatedTeams: 6,
        focus: "Youth Placement & Automation Skills",
      },
    ],
  },
  {
    id: 6,
    name: "Usha Martin Foundation",
    shortName: "Usha Martin CSR",
    location: "Ranchi",
    district: "Ranchi",
    status: "Verified",
    csrFund: "₹4.2 Cr",
    focusAreas: "Empowerment, Water Harvesting, Primary Education, Tele-Medicine",
    activeCollaborations: 2,
    mentorships: 6,
    activeProjects: [
      {
        id: "CSR-UMF-01",
        title: "Check Dam & Rainwater Percolation Wells in Angara",
        partnerUni: "Birsa Agricultural University",
        leadMentor: "B. N. Pandey (Water Conservation Head)",
        grantSpent: "₹2.2 Cr",
        status: "Excavation Completed",
        timeline: "Jan 2026 – Sep 2026",
      },
      {
        id: "CSR-UMF-02",
        title: "Telemedicine Kiosks for Remote Panchayat Centers",
        partnerUni: "Ranchi University",
        leadMentor: "Dr. S. K. Mahato (Health Tech)",
        grantSpent: "₹1.5 Cr",
        status: "Telemetry Testing",
        timeline: "Mar 2026 – Nov 2026",
      },
    ],
    mentors: [
      {
        name: "B. N. Pandey",
        designation: "Chief Conservation Engineer",
        email: "bn.pandey@ushamartin.co.in",
        phone: "+91 94302 99401",
        allocatedTeams: 3,
        focus: "Rainwater Harvesting & Ground Recharge",
      },
      {
        name: "Dr. S. K. Mahato",
        designation: "Digital Health Incharge",
        email: "sk.mahato@ushamartin.co.in",
        phone: "+91 97716 77218",
        allocatedTeams: 3,
        focus: "Tele-Diagnostic Mesh",
      },
    ],
  },
];

const StateIndustryCSRPage = () => {
  const [search, setSearch] = useState("");
  const [modalData, setModalData] = useState(null); // { ind, type: 'active' | 'mentors' | 'budget' }

  const filtered = useMemo(() => {
    return mockIndustries.filter(
      (i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.location.toLowerCase().includes(search.toLowerCase()) ||
        i.focusAreas.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Real-time aggregate statistics for top KPI banner
  const summaryTotals = useMemo(() => {
    const totalPartners = mockIndustries.length;
    const totalActiveProjects = mockIndustries.reduce((sum, i) => sum + (i.activeCollaborations || 0), 0);
    const totalMentorships = mockIndustries.reduce((sum, i) => sum + (i.mentorships || 0), 0);
    return {
      totalPartners,
      totalActiveProjects,
      totalMentorships,
      totalBudget: "₹77.2 Cr",
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest flex items-center gap-1.5">
            <Building2 size={13} /> State Industry Network
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">Industry &amp; CSR Partners</h1>
          <p className="text-xs text-slate-500 mt-1">
            Corporate entities, CSR Foundations, and Industry leaders funding and mentoring societal impact solutions across Jharkhand. Click any metric to inspect live project and mentorship rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search partner, city or focus area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:bg-white focus:border-purple-400"
            />
          </div>
        </div>
      </div>

      {/* Top Real-Time Stat KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Corporate Partners</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Building2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{summaryTotals.totalPartners}</p>
          <span className="text-[10.5px] font-medium text-slate-400">Verified CSR Foundations</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total CSR Fund</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-900 mt-2">{summaryTotals.totalBudget}</p>
          <span className="text-[10.5px] font-medium text-emerald-600 font-semibold">Allocated for Jharkhand</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Projects</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Target size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-900 mt-2">{summaryTotals.totalActiveProjects}</p>
          <span className="text-[10.5px] font-medium text-blue-600 font-semibold">Under Joint Execution</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Mentorships</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-900 mt-2">{summaryTotals.totalMentorships}+</p>
          <span className="text-[10.5px] font-medium text-purple-600 font-semibold">Corporate Mentors</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((ind) => (
          <div
            key={ind.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-purple-300 hover:shadow-md transition space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700 font-bold border border-purple-100">
                  <Building2 size={20} />
                </div>
                <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[9.5px] font-extrabold">
                  {ind.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{ind.name}</h3>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-medium">
                  <MapPin size={12} className="text-purple-600" /> {ind.location}, Jharkhand
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <p className="text-[9.5px] font-bold text-slate-400 uppercase">CSR Focus Areas</p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">{ind.focusAreas}</p>
              </div>
            </div>

            {/* Interactive Inspection Action Buttons */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              {/* CSR Budget Button */}
              <button
                type="button"
                onClick={() => setModalData({ ind, type: "budget" })}
                className="group/btn p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition shadow-xs cursor-pointer flex flex-col items-center justify-center"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 group-hover/btn:text-emerald-100">
                  CSR Budget
                </span>
                <p className="text-base font-black text-emerald-900 group-hover/btn:text-white mt-0.5">
                  {ind.csrFund}
                </p>
                <span className="text-[8.5px] font-semibold text-emerald-600 group-hover/btn:text-emerald-200 mt-0.5">
                  View Grants →
                </span>
              </button>

              {/* Active Projects Button */}
              <button
                type="button"
                onClick={() => setModalData({ ind, type: "active" })}
                className="group/btn p-2 rounded-xl bg-blue-50/70 border border-blue-100 hover:bg-blue-600 hover:text-white transition shadow-xs cursor-pointer flex flex-col items-center justify-center"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 group-hover/btn:text-blue-100">
                  Active Projects
                </span>
                <p className="text-base font-black text-blue-900 group-hover/btn:text-white mt-0.5">
                  {ind.activeCollaborations}
                </p>
                <span className="text-[8.5px] font-semibold text-blue-600 group-hover/btn:text-blue-200 mt-0.5">
                  View Details →
                </span>
              </button>

              {/* Mentorships Button */}
              <button
                type="button"
                onClick={() => setModalData({ ind, type: "mentors" })}
                className="group/btn p-2 rounded-xl bg-purple-50/70 border border-purple-100 hover:bg-purple-600 hover:text-white transition shadow-xs cursor-pointer flex flex-col items-center justify-center"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-purple-700 group-hover/btn:text-purple-100">
                  Mentorships
                </span>
                <p className="text-base font-black text-purple-900 group-hover/btn:text-white mt-0.5">
                  {ind.mentorships}
                </p>
                <span className="text-[8.5px] font-semibold text-purple-600 group-hover/btn:text-purple-200 mt-0.5">
                  View Mentors →
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
                <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-extrabold text-purple-700 border border-purple-200 mb-1">
                  <Building2 size={12} />
                  {modalData.ind.name}
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {modalData.type === "active"
                    ? "Active CSR Impact Projects & Academic Collaborations"
                    : modalData.type === "mentors"
                    ? "Corporate Mentors & Industry Advisory Roster"
                    : "CSR Budget Allocation & Grant Disbursements"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {modalData.ind.location}, Jharkhand • Total Commitment: {modalData.ind.csrFund}
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
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-600">
                    Showing {modalData.ind.activeProjects?.length || 0} active co-funded solutions:
                  </p>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    {modalData.ind.activeCollaborations} Active Projects
                  </span>
                </div>
                <div className="space-y-2.5">
                  {modalData.ind.activeProjects?.map((proj) => (
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
                          <span className="text-slate-400 text-[10px] block font-bold">Academic Partner</span>
                          <span className="font-semibold text-slate-800">{proj.partnerUni}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block font-bold">Lead CSR Mentor</span>
                          <span className="font-semibold text-slate-800">{proj.leadMentor}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block font-bold">Grant Allocation</span>
                          <span className="font-bold text-emerald-700">{proj.grantSpent}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {modalData.type === "mentors" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-600">
                    Corporate Mentors actively guiding student teams across Jharkhand ({modalData.ind.mentorships} total assignments):
                  </p>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                    {modalData.ind.mentors?.length || 0} Lead Advisors
                  </span>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] font-extrabold uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Mentor Name</th>
                        <th className="py-2.5 px-3">Direct Contact</th>
                        <th className="py-2.5 px-3">Corporate Focus</th>
                        <th className="py-2.5 px-3 text-right">Teams Mentored</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {modalData.ind.mentors?.map((m, idx) => (
                        <tr key={idx} className="hover:bg-purple-50/30 transition">
                          <td className="py-2 px-3">
                            <p className="font-extrabold text-slate-900">{m.name}</p>
                            <p className="text-[10.5px] text-slate-500">{m.designation}</p>
                          </td>
                          <td className="py-2 px-3">
                            <div className="space-y-0.5 text-[11px]">
                              {m.phone && (
                                <a
                                  href={`tel:${m.phone.replace(/[^0-9+]/g, "")}`}
                                  className="flex items-center gap-1 text-slate-700 hover:text-purple-600 font-medium"
                                  title="Call Mentor"
                                >
                                  <Phone size={11} className="text-emerald-600 shrink-0" />
                                  <span>{m.phone}</span>
                                </a>
                              )}
                              {m.email && (
                                <a
                                  href={`mailto:${m.email}`}
                                  className="flex items-center gap-1 text-slate-500 hover:text-purple-600 font-mono text-[10px]"
                                  title="Email Mentor"
                                >
                                  <Mail size={11} className="text-purple-600 shrink-0" />
                                  <span>{m.email}</span>
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-3 text-slate-700 font-semibold">{m.focus}</td>
                          <td className="py-2 px-3 text-right">
                            <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 text-[10px] font-extrabold">
                              {m.allocatedTeams} Student Teams
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {modalData.type === "budget" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-600">
                    CSR Grant breakdown and domain capital investments for state challenges:
                  </p>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Total: {modalData.ind.csrFund}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Primary Focus Areas</span>
                    <p className="text-xs font-semibold text-slate-800">{modalData.ind.focusAreas}</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">District Footprint</span>
                    <p className="text-xs font-semibold text-slate-800">{modalData.ind.location} &amp; Surrounding Blocks</p>
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] font-bold text-slate-700 uppercase">Disbursed Projects</p>
                  {modalData.ind.activeProjects?.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/40 text-xs">
                      <span className="font-bold text-slate-800">{p.title}</span>
                      <span className="font-extrabold text-emerald-800 shrink-0 ml-2">{p.grantSpent}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[10px] text-slate-400 font-medium">
                Official State Government Corporate Social Responsibility Registry
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

export default StateIndustryCSRPage;

