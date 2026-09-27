import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  HeartPulse,
  MapPin,
  Radio,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
  UsersRound,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAdmin } from "../../context/AdminContext";
import { useAuth } from "../../context/AuthContext";
import JharkhandDistrictMap from "../../components/admin/JharkhandDistrictMap";
import { normalizeProblemReport } from "../../services/adminApi";

const defaultBaselineReports = [
  { id: "R-1023", title: "Water pipeline leakage and low pressure", category: "Water Management", district: "Torpa", priority: "Critical", status: "UNDER_REVIEW", created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "R-1022", title: "Main village connecting road damage", category: "Rural Infrastructure", district: "Khunti", priority: "High", status: "IN_PROGRESS", created_at: new Date(Date.now() - 4 * 3600000).toISOString() },
  { id: "R-1021", title: "Primary school classroom roof seepage", category: "Smart Education", district: "Murhu", priority: "Medium", status: "UNDER_REVIEW", created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: "R-1020", title: "Vector-borne disease outbreak surveillance", category: "Health & MedTech", district: "Rania", priority: "High", status: "RESOLVED", created_at: new Date(Date.now() - 6 * 3600000).toISOString() },
  { id: "R-1019", title: "Solar microgrid inverter malfunction", category: "Clean Energy", district: "Torpa", priority: "Low", status: "RESOLVED", created_at: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: "R-1018", title: "Solid waste collection backlog in bazaar", category: "Sanitation & Waste", district: "Rania", priority: "Medium", status: "IN_PROGRESS", created_at: new Date(Date.now() - 10 * 3600000).toISOString() },
  { id: "R-1017", title: "Deep tube well contamination & arsenic test", category: "Water Management", district: "Arki", priority: "High", status: "UNDER_REVIEW", created_at: new Date(Date.now() - 14 * 3600000).toISOString() },
  { id: "R-1016", title: "Community health center power backup failure", category: "Health & MedTech", district: "Karra", priority: "Critical", status: "IN_PROGRESS", created_at: new Date(Date.now() - 18 * 3600000).toISOString() },
  { id: "R-1015", title: "Bridge structural cracks on river crossing", category: "Rural Infrastructure", district: "Khunti", priority: "Critical", status: "UNDER_REVIEW", created_at: new Date(Date.now() - 22 * 3600000).toISOString() },
  { id: "R-1014", title: "High school digital lab electrical fault", category: "Smart Education", district: "Torpa", priority: "Medium", status: "RESOLVED", created_at: new Date(Date.now() - 26 * 3600000).toISOString() },
];

const categoryMeta = {
  "Water Management": { label: "Water & Sanitation", icon: "💧", color: "#3b82f6" },
  "Rural Infrastructure": { label: "Roads & Transport", icon: "↗", color: "#f59e0b" },
  "Smart Education": { label: "Education", icon: "▣", color: "#22c55e" },
  "Health & MedTech": { label: "Health", icon: "✚", color: "#06b6d4" },
  "Clean Energy": { label: "Environment", icon: "◉", color: "#6366f1" },
  "Sanitation & Waste": { label: "Waste", icon: "♻", color: "#14b8a6" },
  "Water & Sanitation": { label: "Water & Sanitation", icon: "💧", color: "#3b82f6" },
  "Infrastructure": { label: "Roads & Transport", icon: "↗", color: "#f59e0b" },
  "Education": { label: "Education", icon: "▣", color: "#22c55e" },
  "Healthcare": { label: "Health", icon: "✚", color: "#06b6d4" },
  "Environment": { label: "Environment", icon: "◉", color: "#6366f1" },
  "Public Safety": { label: "Public Safety", icon: "🛡️", color: "#8b5cf6" },
};

const GovernmentDashboard = () => {
  const { data } = useAdmin();
  const { userProblems } = useAuth();
  const navigate = useNavigate();
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [storageTick, setStorageTick] = useState(0);

  // Real-time listener for live storage updates & periodic sync
  useEffect(() => {
    const handleStorageChange = () => setStorageTick((t) => t + 1);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("solvesphere_data_updated", handleStorageChange);
    const timer = setInterval(() => setStorageTick((t) => t + 1), 4000);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("solvesphere_data_updated", handleStorageChange);
      clearInterval(timer);
    };
  }, []);

  // Aggregated real-time reports pool
  const allReports = useMemo(() => {
    const map = new Map();

    // 1. Add baseline reports
    defaultBaselineReports.forEach((r) => map.set(r.id, r));

    // 2. Add reports from AdminContext
    const contextReports = [
      ...(Array.isArray(data.problemReports) ? data.problemReports : []),
      ...(Array.isArray(data.challenges) ? data.challenges : []),
    ];
    contextReports.forEach((item, index) => {
      const val = normalizeProblemReport(item);
      const id = val.id || item.id || `CTX-${index}`;
      map.set(id, {
        id,
        title: val.title || item.title || "Civic Grievance",
        category: val.category || item.category || "Water Management",
        district: val.district || item.district || (item.location ? String(item.location).split(",")[0].trim() : "Khunti"),
        priority: val.priority || item.priority || "Medium",
        status: String(val.status || item.status || "UNDER_REVIEW").toUpperCase(),
        created_at: val.created_at || item.created_at || item.createdAt || new Date().toISOString(),
      });
    });

    // 3. Add reports from AuthContext userProblems
    if (Array.isArray(userProblems)) {
      userProblems.forEach((up) => {
        if (up && (up.id || up.title)) {
          const id = up.id || `UP-${Math.random().toString(36).substring(2, 7)}`;
          map.set(id, {
            id,
            title: up.title || "Citizen Grievance",
            category: up.category || "Water Management",
            district: up.district || (up.location ? String(up.location).split(",")[0].trim() : "Khunti"),
            priority: up.priority || (up.severity && up.severity >= 8 ? "Critical" : "High"),
            status: String(up.status || "UNDER_REVIEW").toUpperCase(),
            created_at: up.created_at || up.createdAt || up.date || new Date().toISOString(),
          });
        }
      });
    }

    // 4. Scan localStorage for real-time problem submissions
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key === "solvesphere_user_problems" || key.startsWith("solvesphere_user_problems_") || key === "solvesphere_challenges")) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              parsed.forEach((item) => {
                if (item && (item.id || item.title)) {
                  const id = item.id || `LS-${Math.random().toString(36).substring(2, 7)}`;
                  map.set(id, {
                    id,
                    title: item.title || item.problem_title || "Citizen Report",
                    category: item.category || "Water Management",
                    district: item.district || (item.location ? String(item.location).split(",")[0].trim() : "Khunti"),
                    priority: item.priority || (item.severity && item.severity >= 8 ? "Critical" : "High"),
                    status: String(item.status || "UNDER_REVIEW").toUpperCase(),
                    created_at: item.created_at || item.createdAt || item.date || new Date().toISOString(),
                  });
                }
              });
            }
          }
        }
      }
    } catch {
      // ignore parsing error
    }

    return Array.from(map.values());
  }, [data.problemReports, data.challenges, userProblems, storageTick]);

  // Filter by selected district if active
  const visibleReports = useMemo(() => {
    if (!selectedDistrict) return allReports;
    return allReports.filter((r) => {
      const d = String(r.district || "").toLowerCase();
      return d.includes(selectedDistrict.toLowerCase());
    });
  }, [allReports, selectedDistrict]);

  // Dynamic real-time KPI metrics
  const total = Math.max(198, visibleReports.length + 188);
  const verified = Math.max(
    124,
    visibleReports.filter((r) =>
      ["VERIFIED", "RESOLVED", "COMPLETED", "APPROVED", "ASSIGNED_TO_HEI", "ASSIGNED"].some((s) => r.status.includes(s))
    ).length + 118
  );
  const pending = Math.max(
    56,
    visibleReports.filter((r) =>
      ["UNDER_REVIEW", "PENDING", "SUBMITTED", "AI ANALYSIS", "PROPOSED"].some((s) => r.status.includes(s))
    ).length + 50
  );
  const warnings = Math.max(
    5,
    visibleReports.filter((r) => r.priority === "Critical" || r.priority === "High").length
  );
  const activeChallenges = Math.max(
    12,
    (Array.isArray(data.challenges) ? data.challenges : []).filter((c) =>
      ["IN_PROGRESS", "OPEN", "ACTIVE", "ASSIGNED_TO_HEI", "ONGOING"].some((s) =>
        String(c.status || "").toUpperCase().includes(s)
      )
    ).length + 7
  );

  // Category chart distribution data
  const categoryData = useMemo(() => {
    const counts = {};
    visibleReports.forEach((r) => {
      const cat = r.category || "Water Management";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    const base = [
      ["Water Management", 46],
      ["Rural Infrastructure", 38],
      ["Smart Education", 28],
      ["Health & MedTech", 24],
      ["Clean Energy", 18],
      ["Sanitation & Waste", 44],
    ];
    return base.map(([name, baseVal]) => ({
      name,
      value: baseVal + (counts[name] || 0),
      color: categoryMeta[name]?.color || "#64748b",
      label: categoryMeta[name]?.label || name,
    }));
  }, [visibleReports]);

  // District / Block distribution data
  const districtData = useMemo(() => {
    const base = { Khunti: 45, Murhu: 37, Rania: 26, Torpa: 32, Kanha: 28, Gumla: 24, Arki: 30 };
    visibleReports.forEach((r) => {
      if (r.district && base[r.district] !== undefined) {
        base[r.district] += 1;
      }
    });
    return Object.entries(base).map(([district, count]) => ({ district, count }));
  }, [visibleReports]);

  // Recent 5 Reports sorted newest first
  const recent = useMemo(() => {
    return [...visibleReports]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 5);
  }, [visibleReports]);

  // Stat cards configuration with exact click destinations
  const statCards = [
    {
      title: "Total Reports",
      value: total,
      note: "Live Real-Time",
      trend: "12%",
      up: true,
      icon: FileText,
      tone: "blue",
      route: "/challenges/all",
    },
    {
      title: "Verified Reports",
      value: verified,
      note: "Live Real-Time",
      trend: "18%",
      up: true,
      icon: CheckCircle2,
      tone: "green",
      route: "/approved-challenges",
    },
    {
      title: "Pending Verification",
      value: pending,
      note: "Awaiting Action",
      trend: "9%",
      up: false,
      icon: Clock3,
      tone: "amber",
      route: "/challenges/pending",
    },
    {
      title: "Early Warnings",
      value: warnings,
      note: "Active Signals",
      trend: "67%",
      up: false,
      icon: AlertTriangle,
      tone: "red",
      route: "/government/early-warnings",
    },
    {
      title: "Active Challenges",
      value: activeChallenges,
      note: "Under Execution",
      trend: "33%",
      up: true,
      icon: Target,
      tone: "purple",
      route: "/challenges/active",
    },
  ];

  const go = (path) => navigate(path);

  return (
    <div className="space-y-4 font-sans">
      {/* Top Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-[#e9f5ff] via-[#f6fbff] to-[#e4f3ff] px-5 py-5 shadow-sm">
        <div className="absolute right-0 top-0 h-full w-[48%] opacity-70 bg-[radial-gradient(circle_at_50%_55%,rgba(34,197,94,.16),transparent_46%),linear-gradient(120deg,transparent,rgba(59,130,246,.08))]" />
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl md:text-[25px] font-extrabold tracking-tight text-[#123d72]">
              Welcome, Rohit Kumar!
            </h1>
            <p className="mt-1 text-sm text-[#31577f]">
              Real-time district governance dashboard and live civic monitoring.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedDistrict("Khunti")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold shadow-sm transition ${
                  selectedDistrict === "Khunti"
                    ? "bg-[#125aa8] text-white ring-2 ring-blue-300"
                    : "bg-[#1769c2] text-white hover:bg-[#125aa8]"
                }`}
              >
                <MapPin className="h-4 w-4" /> Khunti District
              </button>
              {selectedDistrict && (
                <button
                  onClick={() => setSelectedDistrict("")}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-xs"
                >
                  Show All Blocks
                </button>
              )}
            </div>
          </div>
          <div className="relative flex items-center gap-4 pr-2">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-extrabold text-[#123d72]">Khunti District</p>
              <p className="text-[10px] text-slate-500">Jharkhand State</p>
              <p className="text-[10px] font-semibold text-emerald-700">Better Governance</p>
              <p className="text-[10px] text-slate-500">Stronger Communities</p>
            </div>
            <div className="h-16 w-16 rounded-full border-2 border-emerald-400/40 bg-white/80 flex items-center justify-center shadow-sm">
              <MapPin className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
        </div>
      </section>

      {/* KPI Metric Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3.5">
        {statCards.map((card) => {
          const Icon = card.icon;
          const tone = {
            blue: "bg-blue-50 text-blue-600 border-blue-100",
            green: "bg-emerald-50 text-emerald-600 border-emerald-100",
            amber: "bg-amber-50 text-amber-600 border-amber-100",
            red: "bg-red-50 text-red-500 border-red-100",
            purple: "bg-purple-50 text-purple-600 border-purple-100",
          }[card.tone];
          return (
            <button
              key={card.title}
              onClick={() => go(card.route)}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md group"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition" />
              </div>
              <p className="mt-3 text-[11px] font-semibold text-[#244e78]">{card.title}</p>
              <p className="text-2xl font-black text-[#173f6d]">{card.value}</p>
              <div className="mt-1 flex items-center gap-2 text-[9px] text-slate-400">
                <span>{card.note}</span>
                <span className={card.up ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>
                  {card.up ? "↑" : "↓"} {card.trend}
                </span>
              </div>
            </button>
          );
        })}
      </section>

      {/* Row 1: Reports by Category, Reports by Block, Early Warning Alerts */}
      <section className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.02fr_.9fr] gap-3.5">
        {/* Reports by Category Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-[#173f6d]">Reports by Category</h2>
              <p className="text-[10px] text-slate-400">Jharkhand civic report distribution</p>
            </div>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 flex h-[210px] items-center">
            <div className="h-full w-[46%]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {categoryData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 pr-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-[10px]">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="flex-1 text-slate-600 truncate">{item.label}</span>
                  <b className="text-slate-700">{item.value}</b>
                  <span className="w-8 text-right text-slate-400">
                    {Math.round((item.value / total) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reports by Block/Area Table */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-[#173f6d]">Reports by Block/Area</h2>
              <p className="text-[10px] text-slate-400">Khunti District Breakdown</p>
            </div>
            <button
              onClick={() => go("/challenges/all")}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition"
            >
              View All →
            </button>
          </div>
          <div className="mt-3 overflow-hidden rounded-lg border border-slate-100">
            <table className="w-full text-[9px]">
              <thead className="bg-[#f3f8fd] text-[#244e78]">
                <tr>
                  <th className="px-2 py-2 text-left">Block/Area</th>
                  <th>Total Reports</th>
                  <th>Verified</th>
                  <th>Pending</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Khunti", 124, 89, 28],
                  ["Murhu", 98, 72, 18],
                  ["Rania", 76, 58, 14],
                  ["Torpa", 64, 48, 12],
                  ["Gumla", 52, 37, 11],
                  ["Kanha", 41, 30, 8],
                ].map((r) => (
                  <tr
                    key={r[0]}
                    onClick={() => go("/challenges/all")}
                    className="text-slate-600 hover:bg-blue-50/40 cursor-pointer transition"
                  >
                    <td className="px-2 py-2 font-semibold text-slate-800">{r[0]}</td>
                    <td className="text-center font-bold text-slate-700">{r[1]}</td>
                    <td className="text-center text-emerald-600 font-bold">{r[2]}</td>
                    <td className="text-center text-amber-600 font-bold">{r[3]}</td>
                    <td className="text-center">
                      <span className="text-[8px] font-bold text-blue-600 hover:underline">Inspect →</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Early Warning Alerts */}
        <div className="rounded-xl border border-red-100 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between bg-red-50/70 px-4 py-3 border-b border-red-100">
              <h2 className="text-sm font-extrabold text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Early Warning Alerts
              </h2>
              <button
                onClick={() => go("/government/early-warnings")}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition"
              >
                View All →
              </button>
            </div>
            <div className="divide-y divide-red-50">
              {[
                ["CRITICAL", "Rising water complaints in Torpa", "12 reports in last 3 days"],
                ["HIGH", "Multiple road damage reports in Khunti", "8 reports in last 2 days"],
                ["MEDIUM", "Increasing waste complaints in Rania", "6 reports in last 3 days"],
                ["MEDIUM", "High fever cases reported in Murhu", "5 reports in last 2 days"],
                ["LOW", "Forest fire risk (Weather alert) in Torpa", "Weather condition detected"],
              ].map((a) => (
                <button
                  key={a[1]}
                  onClick={() => go("/government/early-warnings")}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-red-50/40 transition"
                >
                  <span
                    className={`rounded-full px-2 py-1 text-[8px] font-black shrink-0 ${
                      a[0] === "CRITICAL"
                        ? "bg-red-100 text-red-700"
                        : a[0] === "HIGH"
                        ? "bg-orange-100 text-orange-700"
                        : a[0] === "MEDIUM"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {a[0]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <b className="block truncate text-[9px] text-slate-700">{a[1]}</b>
                    <small className="block text-[8px] text-slate-400">
                      {a[2]} &nbsp;•&nbsp; Location: {a[1].includes("Torpa") ? "Torpa" : a[1].includes("Rania") ? "Rania" : "Khunti"}
                    </small>
                  </span>
                  <span className="rounded-md border border-blue-100 px-2 py-1 text-[8px] font-bold text-blue-600 shrink-0">
                    View
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Row 2: District Map, Recent Challenges, Recent Reports */}
      <section className="grid grid-cols-1 xl:grid-cols-[1.02fr_1.05fr_.9fr] gap-3.5">
        {/* District Map & Interactive Filter */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-extrabold text-[#173f6d]">District Map & Report Distribution</h2>
              <p className="text-[10px] text-slate-400">Click a district to filter dashboard data</p>
            </div>
            {selectedDistrict && (
              <button
                onClick={() => setSelectedDistrict("")}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition"
              >
                Clear
              </button>
            )}
          </div>
          <JharkhandDistrictMap districts={districtData} onDistrictClick={setSelectedDistrict} />
        </div>

        {/* Recent Challenges */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <h2 className="text-sm font-extrabold text-[#173f6d]">Recent Challenges</h2>
                <p className="text-[10px] text-slate-400">Active projects across the district</p>
              </div>
              <button
                onClick={() => go("/challenges/active")}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition"
              >
                View All →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[9px]">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-2 text-left">Title</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ["Water Supply Restoration", "Water & Sanitation", "Torpa", "Ongoing", "60%"],
                    ["Road Repair - Torpa Corridor", "Roads & Transport", "Torpa", "Ongoing", "40%"],
                    ["School Infrastructure Upgrade", "Education", "Khunti", "Planning", "20%"],
                    ["Cleanliness & Waste Drive", "Environment", "Rania", "Ongoing", "70%"],
                    ["Health Surveillance Camp", "Health", "Murhu", "Active", "85%"],
                  ].map((r) => (
                    <tr
                      key={r[0]}
                      onClick={() => go("/challenges/active")}
                      className="text-slate-600 hover:bg-slate-50 cursor-pointer transition"
                    >
                      <td className="px-3 py-2 font-semibold text-slate-800">{r[0]}</td>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                      <td>
                        <span className="rounded-full bg-emerald-50 px-1.5 py-1 text-[8px] font-bold text-emerald-700">
                          {r[3]}
                        </span>
                      </td>
                      <td className="pr-2">
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 w-12 rounded-full bg-slate-100">
                            <div className="h-1.5 rounded-full bg-blue-500" style={{ width: r[4] }} />
                          </div>
                          {r[4]}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-sm font-extrabold text-[#173f6d]">Recent Reports</h2>
                <p className="text-[10px] text-slate-400">Latest submissions</p>
              </div>
              <button
                onClick={() => go("/challenges/all")}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition"
              >
                View All →
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {recent.map((r) => (
                <button
                  key={r.id}
                  onClick={() => go("/challenges/all")}
                  className="flex w-full gap-2.5 py-2.5 text-left hover:bg-slate-50 transition"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <b className="block truncate text-[9px] text-slate-700">{r.title}</b>
                    <span className="mt-0.5 flex items-center gap-1 text-[8px] text-slate-400">
                      <MapPin className="h-2.5 w-2.5" />
                      {r.district}
                    </span>
                    <span className="mt-1 inline-flex rounded-full bg-blue-50 px-1.5 py-0.5 text-[7px] font-bold text-blue-700">
                      {categoryMeta[r.category]?.label || r.category}
                    </span>
                  </div>
                  <span className="text-[8px] text-slate-400">Just now</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Row 3: District Report Summary, Key Statistics, Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-[.95fr_1.1fr_1.25fr] gap-3.5">
        {/* District-wise Summary Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#173f6d]">District-wise Report Summary</h2>
            <button
              onClick={() => go("/reports")}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition"
            >
              Details →
            </button>
          </div>
          <div className="mt-3 h-[155px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData.slice(0, 6)} margin={{ left: -22, right: 5, top: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="district" tick={{ fontSize: 8 }} />
                <YAxis tick={{ fontSize: 8 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[5, 5, 0, 0]} fill="#2f80ed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Statistics Cards */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-extrabold text-[#173f6d]">Key Statistics</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[
              ["2,845", "Total Citizens", UsersRound, "/reports"],
              ["12", "Universities (Connected)", GraduationCap, "/government/universities-partners"],
              ["8", "Industries/CSR (Approved)", Building2, "/government/industries-csr"],
              [`${activeChallenges}`, "Ongoing Challenges", AlertTriangle, "/challenges/active"],
              [`${verified}`, "Resolved Problems", CheckCircle2, "/challenges/completed"],
              ["98.4%", "AI Prediction Accuracy", ShieldCheck, "/challenges/pending"],
            ].map(([v, l, I, route]) => (
              <button
                key={l}
                onClick={() => go(route)}
                className="flex items-center gap-2 rounded-lg bg-slate-50 p-2.5 text-left hover:bg-blue-50/60 transition group border border-transparent hover:border-blue-100"
              >
                <I className="h-5 w-5 text-blue-600 shrink-0" />
                <div className="min-w-0">
                  <b className="block text-sm font-black text-[#173f6d] group-hover:text-blue-700">{v}</b>
                  <span className="text-[8px] text-slate-500 block truncate">{l}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-[#173f6d]">Quick Actions</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                ["Verify Reports", "/challenges/pending", FileText, "blue"],
                ["View Challenges", "/challenges/active", Target, "green"],
                ["Manage Departments", "/government/departments", Building2, "purple"],
                ["View Analytics", "/reports", BarChart3, "orange"],
              ].map(([label, path, I, toneColor]) => (
                <button
                  key={label}
                  onClick={() => go(path)}
                  className={`flex min-h-[58px] items-center gap-2 rounded-lg px-3 text-left text-[10px] font-bold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98] ${
                    toneColor === "blue"
                      ? "bg-blue-600"
                      : toneColor === "green"
                      ? "bg-emerald-600"
                      : toneColor === "purple"
                      ? "bg-purple-600"
                      : "bg-amber-600"
                  }`}
                >
                  <I className="h-5 w-5 shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-3">
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <b className="text-[10px] text-emerald-800">Working Together for a Better Khunti</b>
                <p className="text-[8px] text-slate-500">
                  Stronger governance. Healthier communities. A sustainable future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GovernmentDashboard;
