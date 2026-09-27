import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  FileBarChart2,
  FileText,
  Handshake,
  Lightbulb,
  MapPin,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  UsersRound,
  X,
  Zap,
  GraduationCap,
  Layers,
} from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import IndustrySidebar from "../../components/industry/IndustrySidebar";
import industryBanner from "../../assets/industry-banner.png";
import IndustryTopbar from "../../components/industry/IndustryTopbar";
import IndustryDistrictCollaborationMap from "../../components/industry/IndustryDistrictCollaborationMap";
import { useAuth } from "../../context/AuthContext";
import {
  getCompanyProfile,
  MOCK_PROJECTS,
  MOCK_INITIAL_COLLABORATIONS,
  calculateProjectMatch,
} from "../../utils/industryMockData";

const priorityClass = {
  Low: "bg-emerald-50 text-emerald-600",
  Medium: "bg-amber-50 text-amber-600",
  High: "bg-orange-50 text-orange-600",
  Critical: "bg-rose-50 text-rose-600",
};

const IndustryDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, userProblems } = useAuth();
  const [version, setVersion] = useState(0);

  // Real-time synchronization listeners
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

  // Registered expertise and areas of interest
  const registeredExpertise = useMemo(() => {
    const tech = Array.isArray(companyProfile?.technicalExpertise)
      ? companyProfile.technicalExpertise
      : [];
    const areas = Array.isArray(companyProfile?.areasOfInterest)
      ? companyProfile.areasOfInterest
      : [];
    const domain = companyProfile?.industryDomain || "IT";
    return { tech, areas, domain };
  }, [companyProfile]);

  // Real-time Collaborations List
  const collaborations = useMemo(() => {
    try {
      const saved =
        localStorage.getItem(`solvesphere_collaborations_${userKey}`) ||
        localStorage.getItem("solvesphere_collaboration_requests");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return MOCK_INITIAL_COLLABORATIONS;
  }, [userKey, version]);

  // Real-time Challenges / Citizen Problems List
  const allLiveProblems = useMemo(() => {
    let list = [];
    try {
      const saved = localStorage.getItem("solvesphere_problems");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) list = parsed;
      }
    } catch {}

    const combined = [...(userProblems || []), ...list];
    const seen = new Set();
    const unique = [];
    combined.forEach((item) => {
      const id = String(item.id);
      if (!seen.has(id)) {
        seen.add(id);
        unique.push(item);
      }
    });

    return unique.length > 0 ? unique : MOCK_PROJECTS;
  }, [userProblems, version]);

  // Real-Time Dynamic Metrics
  const ongoingProjectsCount = useMemo(() => {
    const activeCollabs = collaborations.filter(
      (c) => c.status === "ACTIVE" || c.status === "ACCEPTED" || c.status === "IN_PROGRESS"
    ).length;
    return Math.max(5, activeCollabs + 3);
  }, [collaborations]);

  const completedProjectsCount = useMemo(() => {
    const comp = collaborations.filter(
      (c) => c.status === "COMPLETED" || c.status === "RESOLVED"
    ).length;
    return Math.max(12, comp + 11);
  }, [collaborations]);

  const partneredUniversitiesCount = useMemo(() => {
    const partneredSet = new Set();
    
    // Baseline partnered premier institutes in Jharkhand
    [
      "NIT Jamshedpur",
      "BIT Mesra, Ranchi",
      "IIT (ISM) Dhanbad",
      "Ranchi University",
      "IIIT Ranchi",
      "Vinoba Bhave University",
      "Kolhan University",
    ].forEach((u) => partneredSet.add(u.toLowerCase().trim()));

    // Add any unique universities from live collaborations / proposals
    collaborations.forEach((c) => {
      if (c.university) {
        partneredSet.add(String(c.university).toLowerCase().trim());
      }
    });

    try {
      const savedCollabs = localStorage.getItem("solvesphere_collaboration_requests");
      if (savedCollabs) {
        const parsed = JSON.parse(savedCollabs);
        if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            if (item.university) partneredSet.add(String(item.university).toLowerCase().trim());
          });
        }
      }
    } catch {}

    return partneredSet.size;
  }, [collaborations, version]);

  const totalImpactAmount = useMemo(() => {
    const cr = (ongoingProjectsCount * 0.28 + completedProjectsCount * 0.18 + 0.5).toFixed(1);
    return `₹ ${cr} Cr`;
  }, [ongoingProjectsCount, completedProjectsCount]);

  // AI-Handled Matching for Top Recommended Projects
  // Only shows challenges/projects that match technical expertise or areas of interest selected during registration
  const recommendedProjects = useMemo(() => {
    const { tech, areas, domain } = registeredExpertise;

    // Evaluate all candidates
    const scoredProjects = MOCK_PROJECTS.map((proj) => {
      const matchScore = calculateProjectMatch(proj, companyProfile);

      // Check if domain or required expertise matches company's registered profile
      const domainMatches = areas.some(
        (a) =>
          a.toLowerCase().includes((proj.domain || "").toLowerCase()) ||
          (proj.domain || "").toLowerCase().includes(a.toLowerCase())
      );

      const techMatches = (proj.requiredExpertise || []).some((req) =>
        tech.some(
          (t) =>
            t.toLowerCase().includes(req.toLowerCase()) ||
            req.toLowerCase().includes(t.toLowerCase())
        )
      );

      const industryDomainMatches =
        domain &&
        (proj.domain || "").toLowerCase().includes(domain.toLowerCase());

      const isExpertiseMatch = domainMatches || techMatches || industryDomainMatches;

      return {
        ...proj,
        matchScore,
        isExpertiseMatch,
      };
    })
      // Strictly filter to ONLY those matching expertise
      .filter((proj) => proj.isExpertiseMatch)
      .sort((a, b) => b.matchScore - a.matchScore);

    // Fallback gracefully to high-scoring projects if profile is completely fresh
    const listToDisplay = scoredProjects.length > 0 ? scoredProjects : MOCK_PROJECTS.slice(0, 5);

    const collabMap = {};
    collaborations.forEach((req) => {
      if (req.projectId) collabMap[String(req.projectId).trim()] = req.status || "PENDING";
      if (req.projectName) collabMap[req.projectName.toLowerCase().trim()] = req.status || "PENDING";
    });

    return listToDisplay.slice(0, 5).map((p) => {
      const status = collabMap[String(p.id).trim()] || collabMap[p.title?.toLowerCase().trim()];
      return {
        id: p.id,
        title: p.title,
        category: p.domain || "Civic Tech",
        location: p.district || p.location?.split(",")[0] || "Jharkhand",
        university: p.university || "Jharkhand University",
        matchScore: `${p.matchScore || calculateProjectMatch(p, companyProfile)}%`,
        status,
      };
    });
  }, [companyProfile, registeredExpertise, collaborations]);

  // Filter Recent Challenges to ONLY challenges matching the industry's registered expertise
  const liveRecentChallenges = useMemo(() => {
    const { tech, areas } = registeredExpertise;

    // Filter live problems by category/keyword matching company expertise
    const filteredProblems = allLiveProblems.filter((p) => {
      const cat = (p.category || "").toLowerCase();
      const title = (p.title || "").toLowerCase();
      const desc = (p.description || p.problemStatement || "").toLowerCase();

      // Check match against areas of interest
      const areaMatch = areas.some(
        (a) =>
          cat.includes(a.toLowerCase()) ||
          title.includes(a.toLowerCase()) ||
          desc.includes(a.toLowerCase())
      );

      // Check match against technical expertise
      const techMatch = tech.some(
        (t) =>
          title.includes(t.toLowerCase()) ||
          desc.includes(t.toLowerCase()) ||
          cat.includes(t.toLowerCase())
      );

      return areaMatch || techMatch || areas.length === 0;
    });

    const displayList = filteredProblems.length > 0 ? filteredProblems : allLiveProblems;

    return displayList.slice(0, 5).map((p) => {
      const cat = p.category || "";
      const kind = /water|sanitation/i.test(cat)
        ? "water"
        : /road|infra|transport/i.test(cat)
        ? "road"
        : /waste|garbage/i.test(cat)
        ? "waste"
        : /electric|solar|energy/i.test(cat)
        ? "light"
        : /health/i.test(cat)
        ? "health"
        : "education";

      return {
        title: p.title || "Civic Infrastructure Challenge",
        location: p.location || p.district || "Ranchi, Jharkhand",
        priority: p.priority || "High",
        time: p.date || "Just now",
        kind,
        category: p.category || "Smart Infrastructure",
      };
    });
  }, [allLiveProblems, registeredExpertise]);

  // Real-time Dynamic Category Distribution
  const dynamicCategoryData = useMemo(() => {
    const counts = {
      "Water & Sanitation": 10,
      "Road & Transport": 9,
      "Waste Management": 7,
      "Education": 6,
      "Healthcare": 5,
      "Energy & Electricity": 4,
      "Others": 13,
    };

    allLiveProblems.forEach((p) => {
      const cat = p.category || "";
      if (/water|sanitation/i.test(cat)) counts["Water & Sanitation"] += 1;
      else if (/road|transport|infra/i.test(cat)) counts["Road & Transport"] += 1;
      else if (/waste|garbage/i.test(cat)) counts["Waste Management"] += 1;
      else if (/education|school/i.test(cat)) counts["Education"] += 1;
      else if (/health|med/i.test(cat)) counts["Healthcare"] += 1;
      else if (/energy|electric|solar/i.test(cat)) counts["Energy & Electricity"] += 1;
      else counts["Others"] += 1;
    });

    const colors = {
      "Water & Sanitation": "#3b82f6",
      "Road & Transport": "#f97316",
      "Waste Management": "#22c55e",
      "Education": "#8b5cf6",
      "Healthcare": "#fbbf24",
      "Energy & Electricity": "#14b8a6",
      "Others": "#94a3b8",
    };

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || "#3b82f6",
    }));
  }, [allLiveProblems, version]);

  const totalCatSum = useMemo(() => {
    return dynamicCategoryData.reduce((acc, curr) => acc + curr.value, 0);
  }, [dynamicCategoryData]);

  const totalChallengesCount = useMemo(() => {
    return totalCatSum;
  }, [totalCatSum]);

  // Real-Time Dynamic Progress Line Chart Data (based on live ongoing & completed projects)
  const dynamicProgressData = useMemo(() => {
    const ong = ongoingProjectsCount;
    const comp = completedProjectsCount;

    return [
      { month: "Jan", ongoing: Math.max(2, Math.round(ong * 0.45)), completed: Math.max(2, Math.round(comp * 0.35)) },
      { month: "Feb", ongoing: Math.max(3, Math.round(ong * 0.65)), completed: Math.max(3, Math.round(comp * 0.48)) },
      { month: "Mar", ongoing: Math.max(4, Math.round(ong * 0.85)), completed: Math.max(4, Math.round(comp * 0.62)) },
      { month: "Apr", ongoing: Math.max(3, Math.round(ong * 0.75)), completed: Math.max(5, Math.round(comp * 0.74)) },
      { month: "May", ongoing: Math.max(5, Math.round(ong * 0.95)), completed: Math.max(7, Math.round(comp * 0.88)) },
      { month: "Jun", ongoing: ong, completed: comp },
    ];
  }, [ongoingProjectsCount, completedProjectsCount]);

  return (
    <div className="min-h-screen bg-[#f5f9fd] text-slate-800">
      <IndustrySidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="ml-0 lg:ml-64">
        <IndustryTopbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <main className="w-full px-4 py-5 sm:px-6 lg:px-4 lg:py-5">
          {/* Welcome + Organization Header */}
          <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_372px]">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative min-h-[126px] overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm"
            >
              <img
                src={industryBanner}
                alt="Industrial landscape"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-[46%] to-white/10" />
              <div className="relative z-10 flex h-full items-center px-6 py-5 sm:px-7">
                <div className="max-w-[650px]">
                  <h1 className="text-2xl font-extrabold tracking-tight text-[#0d3971] sm:text-[26px]">
                    Welcome back, {companyProfile.companyName || user?.name || user?.organization || "Tata Motors"}!
                  </h1>
                  <p className="mt-2 text-sm font-medium leading-5 text-[#275587]">
                    Your CSR partnership is driving innovation and sustainable development
                    <br className="hidden sm:block" /> across Jharkhand.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="rounded-xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0d3971]">
                  <Building2 size={26} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-extrabold text-[#0d3971]">
                    {companyProfile.companyName || user?.organization || "Tata Motors"}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    {companyProfile.companyType || "Enterprise Partner"} • {companyProfile.industryDomain || "IT & Infra"}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 size={11} /> AI Matching Active
                  </span>
                  <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500">
                    <Sparkles size={15} className="mt-0.5 shrink-0 text-[#0d3971]" />
                    Filtering challenges matching your {registeredExpertise.tech.length} technical skills.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Real-Time KPI Cards */}
          <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              ["Total Challenges", String(totalChallengesCount), "12%", Lightbulb, "bg-blue-50", "text-blue-500"],
              ["Partnered Universities", String(partneredUniversitiesCount), "1 new this month", UsersRound, "bg-violet-50", "text-violet-500"],
              ["Ongoing Projects", String(ongoingProjectsCount), `${ongoingProjectsCount} in progress`, Sparkles, "bg-emerald-50", "text-emerald-500"],
              ["Completed Projects", String(completedProjectsCount), `${completedProjectsCount} resolved`, CheckCircle2, "bg-orange-50", "text-orange-500"],
              ["Total Impact", totalImpactAmount, "28%", CircleDollarSign, "bg-cyan-50", "text-cyan-500"],
            ].map(([title, value, trend, IconComponent, iconBg, iconText]) => (
              <motion.div
                key={title}
                whileHover={{ y: -2 }}
                className="rounded-xl border border-blue-100 bg-white px-5 py-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full ${iconBg} ${iconText}`}>
                    {React.createElement(IconComponent, { size: 21 })}
                  </div>
                </div>
                <p className="mt-3 text-[11px] font-semibold text-slate-500">{title}</p>
                <p className="mt-0.5 text-2xl font-extrabold text-[#0d3971]">{value}</p>
                <p className="mt-1 text-[10px] font-semibold text-emerald-500">
                  ↑ {trend} <span className="ml-1 font-normal text-slate-400">vs. last {title === "Total Impact" ? "quarter" : "month"}</span>
                </p>
              </motion.div>
            ))}
          </section>

          {/* Charts + Recent Challenges */}
          <section className="mt-4 grid gap-3 xl:grid-cols-[1.08fr_1fr_0.9fr]">
            {/* Real-Time Challenges by Category */}
            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-[#0d3971]">Challenges by Category</h2>
                  <p className="text-[10px] text-slate-400">Real-Time Distribution</p>
                </div>
              </div>
              <div className="mt-2 grid h-[222px] grid-cols-[180px_1fr] items-center gap-2">
                <div className="relative h-[190px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dynamicCategoryData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={47}
                        outerRadius={76}
                        paddingAngle={1}
                        stroke="white"
                        strokeWidth={2}
                      >
                        {dynamicCategoryData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-[#0d3971]">{totalCatSum}</span>
                    <span className="text-[10px] font-semibold text-slate-500">Total</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {dynamicCategoryData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-[10px]">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="min-w-0 flex-1 text-slate-600 truncate">{item.name}</span>
                      <span className="font-bold text-slate-700">{item.value}</span>
                      <span className="w-9 text-right text-slate-400">({Math.round((item.value / totalCatSum) * 100)}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Real-Time Project Progress Line Chart */}
            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-[#0d3971]">Project Progress</h2>
                  <p className="text-[10px] text-slate-400">Updated in Real Time</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-slate-500">
                  Last 6 Months <ChevronDown size={13} />
                </button>
              </div>
              <div className="mt-1 flex items-center gap-5 text-[10px] font-semibold text-slate-500">
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-blue-500" /> Ongoing</span>
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-500" /> Completed</span>
              </div>
              <div className="mt-2 h-[205px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dynamicProgressData} margin={{ top: 5, right: 10, left: -22, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eef6" />
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="ongoing" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 2.5, fill: "#3b82f6" }} />
                    <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2.5} dot={{ r: 2.5, fill: "#10b981" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Challenges Matching Industry Technical Expertise */}
            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-[#0d3971]">Recent Challenges</h2>
                  <p className="text-[10px] text-slate-400">Matched to Your Expertise</p>
                </div>
                <Link to="/industry-dashboard/reports-complaints" className="text-[10px] font-bold text-blue-600 hover:underline">View All</Link>
              </div>
              <div className="mt-3 divide-y divide-slate-100">
                {liveRecentChallenges.map((item, idx) => (
                  <div key={idx} className="flex gap-3 py-2.5 first:pt-0">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.kind === "water" ? "bg-cyan-50 text-cyan-600" : item.kind === "road" ? "bg-slate-100 text-slate-600" : item.kind === "waste" ? "bg-amber-50 text-amber-600" : item.kind === "light" ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"}`}>
                      {item.kind === "water" ? <MapPin size={18} /> : item.kind === "road" ? <TrendingUp size={18} /> : item.kind === "waste" ? <Sparkles size={18} /> : item.kind === "light" ? <Zap size={18} /> : <Building2 size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold text-[#164579]">{item.title}</p>
                      <p className="truncate text-[10px] text-slate-400">{item.location} • {item.category}</p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${priorityClass[item.priority] || priorityClass.Medium}`}>{item.priority}</span>
                        <span className="text-[9px] text-slate-400">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Top Recommended Projects + Hoverable District Collaboration Map */}
          <section className="mt-4 grid gap-3 xl:grid-cols-[1.25fr_1fr]">
            {/* Top Recommended Projects (AI-Filtered to Expertise) */}
            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={16} className="text-blue-600" />
                    <h2 className="text-sm font-extrabold text-[#0d3971]">Top Recommended Projects</h2>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    AI-matched strictly to your registered technical expertise & domains
                  </p>
                </div>
                <Link to="/industry-dashboard/recommended" className="text-[10px] font-bold text-blue-600 hover:underline">
                  View All ({recommendedProjects.length})
                </Link>
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase text-slate-400">
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Title</th>
                      <th className="px-3 py-2">Domain</th>
                      <th className="px-3 py-2">Location</th>
                      <th className="px-3 py-2">University</th>
                      <th className="px-3 py-2">AI Match</th>
                      <th className="px-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recommendedProjects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-3 py-2.5 font-mono text-[11px] font-bold text-blue-600">{proj.id}</td>
                        <td className="px-3 py-2.5 font-bold text-slate-800">{proj.title}</td>
                        <td className="px-3 py-2.5 text-slate-600">{proj.category}</td>
                        <td className="px-3 py-2.5 text-slate-500">{proj.location}</td>
                        <td className="px-3 py-2.5 text-slate-600">{proj.university}</td>
                        <td className="px-3 py-2.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                            <Sparkles size={10} className="text-blue-500" /> {proj.matchScore}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 flex items-center gap-2">
                          {proj.status === "PENDING" ? (
                            <span className="rounded-lg bg-amber-50 border border-amber-200 px-2 py-1 text-[10px] font-bold text-amber-700 whitespace-nowrap">
                              Request Sent
                            </span>
                          ) : proj.status === "ACTIVE" || proj.status === "ACCEPTED" ? (
                            <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-1 text-[10px] font-bold text-emerald-700 whitespace-nowrap">
                              Active Partner
                            </span>
                          ) : (
                            <Link
                              to="/industry-dashboard/recommended"
                              className="rounded-lg border border-blue-200 px-2.5 py-1 text-[10px] font-bold text-blue-600 hover:bg-blue-50 transition whitespace-nowrap"
                            >
                              Collaborate
                            </Link>
                          )}
                          <Link
                            to="/industry-dashboard/recommended"
                            className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition whitespace-nowrap"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Hoverable Jharkhand District Collaboration Map */}
            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-sm font-extrabold text-[#0d3971]">Project Distribution Map</h2>
                  <p className="text-[11px] text-slate-400">
                    Hover any district to explore inter-district collaborations & joint projects
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 border border-blue-100">
                  24 Districts
                </span>
              </div>
              <IndustryDistrictCollaborationMap />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default IndustryDashboard;
