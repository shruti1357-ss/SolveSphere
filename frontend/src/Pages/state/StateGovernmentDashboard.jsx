import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  TrendingUp,
  TrendingDown,
  Building2,
  GraduationCap,
  Users,
  Target,
  MapPin,
  ShieldCheck,
  Landmark,
  Leaf,
  Eye,
  Search,
  RefreshCw,
  Clock,
  Shield,
  Layers,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { governmentService } from "../../services/api";
import JharkhandDistrictMap from "../../components/admin/JharkhandDistrictMap";
import stateBanner from "../../assets/sih-state-banner.png";

// Comprehensive 24 Jharkhand District Baseline Master Data
const BASE_DISTRICT_STATS = [
  { district: "Ranchi", total: 412, verified: 289, pending: 78, rejected: 45 },
  { district: "Dhanbad", total: 198, verified: 142, pending: 38, rejected: 18 },
  { district: "East Singhbhum", total: 189, verified: 134, pending: 36, rejected: 19 },
  { district: "West Singhbhum", total: 156, verified: 118, pending: 28, rejected: 10 },
  { district: "Bokaro", total: 134, verified: 102, pending: 24, rejected: 8 },
  { district: "Khunti", total: 124, verified: 89, pending: 23, rejected: 12 },
  { district: "Giridih", total: 96, verified: 71, pending: 17, rejected: 8 },
  { district: "Garhwa", total: 98, verified: 64, pending: 20, rejected: 14 },
  { district: "Palamu", total: 112, verified: 79, pending: 22, rejected: 11 },
  { district: "Hazaribagh", total: 95, verified: 68, pending: 18, rejected: 9 },
  { district: "Deoghar", total: 82, verified: 58, pending: 16, rejected: 8 },
  { district: "Dumka", total: 88, verified: 62, pending: 18, rejected: 8 },
  { district: "Ramgarh", total: 65, verified: 45, pending: 14, rejected: 6 },
  { district: "Jamtara", total: 52, verified: 36, pending: 11, rejected: 5 },
  { district: "Latehar", total: 73, verified: 50, pending: 16, rejected: 7 },
  { district: "Lohardaga", total: 45, verified: 31, pending: 10, rejected: 4 },
  { district: "Simdega", total: 48, verified: 33, pending: 11, rejected: 4 },
  { district: "Gumla", total: 58, verified: 40, pending: 13, rejected: 5 },
  { district: "Koderma", total: 54, verified: 38, pending: 12, rejected: 4 },
  { district: "Chatra", total: 62, verified: 42, pending: 14, rejected: 6 },
  { district: "Godda", total: 56, verified: 39, pending: 12, rejected: 5 },
  { district: "Sahibganj", total: 64, verified: 44, pending: 14, rejected: 6 },
  { district: "Pakur", total: 46, verified: 32, pending: 10, rejected: 4 },
  { district: "Saraikela Kharsawan", total: 78, verified: 54, pending: 17, rejected: 7 },
  { district: "Others", total: 130, verified: 90, pending: 26, rejected: 14 },
];

const defaultVerificationRequests = [
  { id: 1, name: "Indian Institute of Technology (IIT)", type: "University", location: "Ranchi", status: "Pending" },
  { id: 2, name: "Tata Steel Foundation", type: "Industry", location: "Jamshedpur", status: "Pending" },
  { id: 3, name: "Birsa Agricultural University", type: "University", location: "Ranchi", status: "Verified" },
  { id: 4, name: "JSW Foundation", type: "Industry", location: "Dolvi", status: "Pending" },
  { id: 5, name: "Central University of Jharkhand", type: "University", location: "Ranchi", status: "Verified" },
];

const defaultUniversities = [
  ["IIT (ISM) Dhanbad", "Verified"],
  ["Birsa Agricultural University", "Verified"],
  ["Central University of Jharkhand", "Verified"],
  ["NIT Jamshedpur", "Pending"],
  ["Ranchi University", "Pending"],
];

const defaultIndustries = [
  ["Tata Steel Foundation", "Pending"],
  ["JSW Foundation", "Pending"],
  ["Coal India Limited (CIL)", "Verified"],
  ["NTPC Ltd.", "Verified"],
  ["Adani Foundation", "Verified"],
];

const warnings = [
  ["Khunti", "Water Supply", "High", "2h ago"],
  ["Dhanbad", "Air Pollution", "High", "4h ago"],
  ["Ranchi", "Road Damage", "Medium", "6h ago"],
  ["East Singhbhum", "Flood Risk", "Medium", "8h ago"],
  ["Garhwa", "Heat Wave", "Low", "12h ago"],
];

const categoryBars = [
  { district: "Ranchi", water: 120, roads: 110, edu: 80, health: 50, env: 30, others: 22 },
  { district: "Dhanbad", water: 60, roads: 50, edu: 40, health: 25, env: 15, others: 8 },
  { district: "East Singhbhum", water: 55, roads: 48, edu: 38, health: 24, env: 14, others: 10 },
  { district: "West Singhbhum", water: 45, roads: 40, edu: 32, health: 20, env: 12, others: 7 },
  { district: "Bokaro", water: 40, roads: 35, edu: 28, health: 18, env: 10, others: 3 },
  { district: "Others", water: 130, roads: 115, edu: 90, health: 55, env: 30, others: 18 },
];

const toneClasses = {
  blue: "bg-blue-50 text-blue-600 border border-blue-100",
  green: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  amber: "bg-amber-50 text-amber-600 border border-amber-100",
  red: "bg-rose-50 text-rose-600 border border-rose-100",
  purple: "bg-violet-50 text-violet-600 border border-violet-100",
};

const StateGovernmentDashboard = () => {
  const navigate = useNavigate();
  const { user, userProblems } = useAuth();
  const [partnerTab, setPartnerTab] = useState("universities");
  const [districtFilter, setDistrictFilter] = useState("All Districts");
  const [verificationRequests, setVerificationRequests] = useState(defaultVerificationRequests);
  const [liveUniversities, setLiveUniversities] = useState(defaultUniversities);
  const [liveIndustries, setLiveIndustries] = useState(defaultIndustries);
  const [version, setVersion] = useState(0);

  // Real-time synchronization listeners for citizen reports, problems, and university assignments
  useEffect(() => {
    const handleUpdate = () => setVersion((v) => v + 1);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("solvesphere_problems_updated", handleUpdate);
    window.addEventListener("solvesphere_reports_updated", handleUpdate);
    window.addEventListener("solvesphere_university_assignments_updated", handleUpdate);
    window.addEventListener("solvesphere_university_updated", handleUpdate);

    const interval = setInterval(handleUpdate, 2000);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("solvesphere_problems_updated", handleUpdate);
      window.removeEventListener("solvesphere_reports_updated", handleUpdate);
      window.removeEventListener("solvesphere_university_assignments_updated", handleUpdate);
      window.removeEventListener("solvesphere_university_updated", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  // Fetch live organization verifications from backend
  useEffect(() => {
    const fetchLiveVerifications = async () => {
      try {
        const res = await governmentService.getOrganizationVerifications();
        const liveList = Array.isArray(res?.results) ? res.results : Array.isArray(res) ? res : [];
        if (liveList.length > 0) {
          const liveEmails = new Set(liveList.map((o) => String(o.email || "").toLowerCase()));
          const unseeded = defaultVerificationRequests.filter((d) => !liveEmails.has(String(d.email || "").toLowerCase()));
          const combined = [...liveList, ...unseeded];
          setVerificationRequests(combined.slice(0, 6));

          const unis = liveList.filter((o) => o.type?.includes("University")).map((o) => [o.name, o.status]);
          const unseededUnis = defaultUniversities.filter((u) => !unis.some(([n]) => n === u[0]));
          setLiveUniversities([...unis, ...unseededUnis].slice(0, 5));

          const inds = liveList.filter((o) => !o.type?.includes("University")).map((o) => [o.name, o.status]);
          const unseededInds = defaultIndustries.filter((i) => !inds.some(([n]) => n === i[0]));
          setLiveIndustries([...inds, ...unseededInds].slice(0, 5));
        }
      } catch (err) {
        console.warn("Could not fetch verifications for state dashboard:", err);
      }
    };
    fetchLiveVerifications();
  }, [version]);

  // Aggregate All Real-Time Live Reports & Citizen Problems
  const allLiveReports = useMemo(() => {
    let list = [];
    try {
      const saved = localStorage.getItem("solvesphere_problems");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) list = parsed;
      }
    } catch {}

    let assignments = [];
    try {
      const savedAssignments = localStorage.getItem("solvesphere_university_assignments");
      if (savedAssignments) {
        const parsedA = JSON.parse(savedAssignments);
        if (Array.isArray(parsedA)) assignments = parsedA;
      }
    } catch {}

    const combined = [...(userProblems || []), ...list];
    const seen = new Set();
    const unique = [];

    combined.forEach((item) => {
      const id = String(item.id || item.title || "");
      if (!seen.has(id)) {
        seen.add(id);

        // Check if assigned in assignments
        const matchAssign = assignments.find((a) => a.challengeId === item.id || a.challenge?.id === item.id);
        const effectiveStatus = matchAssign ? matchAssign.status || "VERIFIED" : item.status || "PENDING";

        unique.push({
          ...item,
          status: effectiveStatus,
          district: item.district || item.location?.split(",")[0] || "Ranchi",
        });
      }
    });

    return unique;
  }, [userProblems, version]);

  // Dynamic Real-Time District-Wise Report Summary Calculation
  const dynamicDistrictSummary = useMemo(() => {
    // Clone baseline district records
    const districtMap = {};
    BASE_DISTRICT_STATS.forEach((d) => {
      districtMap[d.district] = { ...d };
    });

    // Add / overlay live reports into their corresponding districts
    allLiveReports.forEach((report) => {
      const dist = report.district || "Ranchi";
      const matchedKey = Object.keys(districtMap).find(
        (k) => k.toLowerCase() === dist.toLowerCase() || dist.toLowerCase().includes(k.toLowerCase())
      ) || "Others";

      const current = districtMap[matchedKey];
      const st = String(report.status || "").toUpperCase();

      if (st === "ACCEPTED" || st === "VERIFIED" || st === "ASSIGNED" || st === "COMPLETED" || st === "RESOLVED") {
        current.verified += 1;
      } else if (st === "REJECTED") {
        current.rejected += 1;
      } else {
        current.pending += 1;
      }
      current.total += 1;
    });

    return Object.values(districtMap);
  }, [allLiveReports, version]);

  // Filtered District Table Rows
  const districtRows = useMemo(() => {
    if (districtFilter === "All Districts") return dynamicDistrictSummary;
    return dynamicDistrictSummary.filter((item) => item.district === districtFilter);
  }, [districtFilter, dynamicDistrictSummary]);

  // Real-Time Total Metrics for the 5 Top KPI Cards
  const liveKPIs = useMemo(() => {
    const totalReports = dynamicDistrictSummary.reduce((acc, d) => acc + d.total, 0);
    const verifiedReports = dynamicDistrictSummary.reduce((acc, d) => acc + d.verified, 0);
    const pendingVerification = dynamicDistrictSummary.reduce((acc, d) => acc + d.pending, 0);
    const rejectedReports = dynamicDistrictSummary.reduce((acc, d) => acc + d.rejected, 0);

    let assignedChallengesCount = 0;
    try {
      const savedA = localStorage.getItem("solvesphere_university_assignments");
      if (savedA) {
        const parsed = JSON.parse(savedA);
        if (Array.isArray(parsed)) assignedChallengesCount = parsed.length;
      }
    } catch {}

    const activeChallenges = 218 + assignedChallengesCount;

    return [
      {
        label: "Total Reports",
        sub: "All Districts",
        value: totalReports.toLocaleString("en-IN"),
        delta: "12%",
        up: true,
        icon: FileText,
        tone: "blue",
      },
      {
        label: "Verified Reports",
        sub: "This Month",
        value: verifiedReports.toLocaleString("en-IN"),
        delta: "18%",
        up: true,
        icon: CheckCircle2,
        tone: "green",
      },
      {
        label: "Pending Verification",
        sub: "District/Dpt. Level",
        value: pendingVerification.toLocaleString("en-IN"),
        delta: "6%",
        up: false,
        icon: AlertTriangle,
        tone: "amber",
      },
      {
        label: "Rejected Reports",
        sub: "This Month",
        value: rejectedReports.toLocaleString("en-IN"),
        delta: "3%",
        up: true,
        icon: XCircle,
        tone: "red",
      },
      {
        label: "Active Challenges",
        sub: "Across Districts",
        value: activeChallenges.toLocaleString("en-IN"),
        delta: "15%",
        up: true,
        icon: Zap,
        tone: "purple",
      },
    ];
  }, [dynamicDistrictSummary, version]);

  // Dynamic Map Data
  const mapData = useMemo(() => {
    return dynamicDistrictSummary.map((d) => ({
      district: d.district,
      count: d.total,
    }));
  }, [dynamicDistrictSummary]);

  return (
    <div className="w-full space-y-4 text-slate-800">
      {/* Welcome State Banner */}
      <section className="relative h-[110px] overflow-hidden rounded-2xl border border-blue-100 shadow-sm">
        <img
          src={stateBanner}
          alt="Jharkhand landscape"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
        <div className="relative z-10 flex h-full items-center justify-between px-5 sm:px-7 text-white">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-0.5 text-[10px] font-bold text-blue-200 border border-blue-400/30 backdrop-blur-xs mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Governance & Civic Ledger
            </div>
            <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
              WELCOME, JHARKHAND STATE
            </h1>
            <p className="mt-0.5 text-xs text-blue-100">
              Real-time administrative overview of all 24 districts, citizen grievances, and institutional R&D partnerships.
            </p>
          </div>
          <div className="hidden items-center gap-3 pr-2 sm:flex">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md shadow-xs border border-white/20">
              <Landmark size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-white">Government of Jharkhand</p>
              <p className="text-[10px] text-blue-200">Better Governance • Stronger Communities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Dynamic KPI Cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {liveKPIs.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="min-h-[116px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-blue-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-extrabold text-[#0d3971] uppercase tracking-wider">{item.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium">({item.sub})</p>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClasses[item.tone]}`}>
                  <Icon size={19} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">{item.value}</p>
              <div
                className={`mt-1 flex items-center gap-1 text-[10px] font-bold ${
                  item.tone === "red"
                    ? "text-rose-600"
                    : item.tone === "amber"
                    ? "text-amber-600"
                    : "text-emerald-600"
                }`}
              >
                {item.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>
                  {item.up ? "↑" : "↓"} {item.delta} <span className="font-normal text-slate-400">vs. last 7 days</span>
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Upper Content: Interactive Jharkhand Map + District-wise Report Summary */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Left: Map */}
        <div className="xl:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <MapPin size={15} />
              </span>
              <h2 className="text-sm font-extrabold text-[#0d3971]">Live Reports by District</h2>
            </div>

            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="All Districts">All Districts (24)</option>
              {dynamicDistrictSummary
                .filter((d) => d.district !== "Others")
                .map((d) => (
                  <option key={d.district} value={d.district}>
                    {d.district} ({d.total} reports)
                  </option>
                ))}
            </select>
          </div>

          <div className="min-h-[410px] overflow-hidden rounded-xl bg-[#f8fbff] p-2 border border-slate-100">
            <JharkhandDistrictMap
              districtData={mapData}
              onDistrictClick={(district) =>
                navigate(`/state/all-districts?district=${encodeURIComponent(district)}`)
              }
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t border-slate-100 pt-3 text-[10px] text-slate-500">
            <span className="font-bold text-slate-800">Density Scale:</span>
            {["0 - 50", "51 - 100", "101 - 150", "151 - 200", "201+"].map((label, i) => (
              <span key={label} className="flex items-center gap-1.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    ["bg-blue-100", "bg-blue-200", "bg-blue-400", "bg-blue-600", "bg-blue-800"][i]
                  }`}
                />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Right: District-wise Report Summary Table */}
        <div className="xl:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  <Layers size={15} />
                </span>
                <div>
                  <h2 className="text-sm font-extrabold text-[#0d3971]">District-wise Report Summary</h2>
                  <p className="text-[10px] text-slate-400">Real-time status breakdown across districts</p>
                </div>
              </div>

              <Link
                to="/state/all-districts"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
              >
                View All Districts →
              </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="max-h-[420px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">District</th>
                      <th className="py-2.5 px-2 text-right">Total Reports</th>
                      <th className="py-2.5 px-2 text-right text-emerald-700">Verified</th>
                      <th className="py-2.5 px-2 text-right text-amber-700">Pending</th>
                      <th className="py-2.5 px-3 text-right text-rose-700">Rejected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {districtRows.map((row) => (
                      <tr
                        key={row.district}
                        onClick={() => navigate(`/state/all-districts?district=${encodeURIComponent(row.district)}`)}
                        className="hover:bg-blue-50/50 transition cursor-pointer"
                      >
                        <td className="py-2 px-3 font-bold text-slate-800">{row.district}</td>
                        <td className="py-2 px-2 text-right font-black text-slate-900">{row.total}</td>
                        <td className="py-2 px-2 text-right font-bold text-emerald-600">{row.verified}</td>
                        <td className="py-2 px-2 text-right font-bold text-amber-600">{row.pending}</td>
                        <td className="py-2 px-3 text-right font-bold text-rose-500">{row.rejected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3">
            <span>
              Showing <span className="font-bold text-slate-800">{districtRows.length}</span> districts
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Real-Time Synced
            </span>
          </div>
        </div>
      </section>

      {/* Lower Content: Problem Categories / Early Warnings / Partners */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Problem Categories */}
        <div className="xl:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  <BarChart3 size={15} />
                </span>
                <div>
                  <h2 className="text-sm font-extrabold text-[#0d3971]">District-wise Problem Categories</h2>
                  <p className="text-[10px] text-slate-400">Hover bars to view category counts across districts</p>
                </div>
              </div>
              <Link to="/state/analytics" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition">
                View Analytics →
              </Link>
            </div>

            {/* Custom Chart Legend */}
            <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] font-semibold text-slate-600 pt-1">
              {[
                { name: "Water & Sanitation", color: "#0284c7" },
                { name: "Roads & Transport", color: "#f59e0b" },
                { name: "Education", color: "#10b981" },
                { name: "Health", color: "#8b5cf6" },
                { name: "Environment", color: "#06b6d4" },
                { name: "Others", color: "#94a3b8" },
              ].map((c) => (
                <span key={c.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full shadow-xs" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Responsive Recharts Bar Graph */}
          <div className="h-[175px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryBars}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                barCategoryGap="16%"
                barGap={1}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="district"
                  tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const totalInDist = payload.reduce((acc, p) => acc + Number(p.value || 0), 0);
                      return (
                        <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-md text-xs min-w-[170px] z-50">
                          <p className="font-extrabold text-[#0d3971] border-b border-slate-100 pb-1.5 flex items-center justify-between">
                            <span>{label}</span>
                            <span className="text-[10px] text-slate-500 font-bold">{totalInDist} Total</span>
                          </p>
                          <div className="space-y-1 pt-1.5">
                            {payload.map((entry, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[11px]">
                                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                                  <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  {entry.name}:
                                </span>
                                <span className="font-bold text-slate-900">{entry.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="water" name="Water & Sanitation" fill="#0284c7" radius={[2, 2, 0, 0]} />
                <Bar dataKey="roads" name="Roads & Transport" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                <Bar dataKey="edu" name="Education" fill="#10b981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="health" name="Health" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="env" name="Environment" fill="#06b6d4" radius={[2, 2, 0, 0]} />
                <Bar dataKey="others" name="Others" fill="#94a3b8" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Early Warnings */}
        <div className="xl:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                  <AlertTriangle size={15} />
                </span>
                <h2 className="text-sm font-extrabold text-[#0d3971]">Early Warnings (Top 5)</h2>
              </div>
              <Link to="/state/early-warnings" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition">
                View All →
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-extrabold text-slate-500 uppercase">
                    <th className="px-3 py-2">Location</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-2 py-2 text-center">Risk Level</th>
                    <th className="px-2 py-2 text-right">Detected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {warnings.map(([location, category, risk, detected]) => (
                    <tr key={location} className="hover:bg-slate-50 transition">
                      <td className="px-3 py-2 font-bold text-slate-800">{location}</td>
                      <td className="px-3 py-2 text-slate-600">{category}</td>
                      <td className="px-2 py-2 text-center">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                            risk === "High"
                              ? "bg-rose-50 text-rose-600 border border-rose-200"
                              : risk === "Medium"
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          }`}
                        >
                          {risk}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-right text-slate-400 text-[10px]">{detected}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Partners */}
        <div className="xl:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-[#0d3971]">HEI & Industry Partners</h2>
              <Link
                to={partnerTab === "universities" ? "/state/universities-partners" : "/state/industry-csr-partners"}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
              >
                View All →
              </Link>
            </div>
            <div className="mb-3 flex rounded-xl bg-slate-100 p-1 text-xs">
              <button
                onClick={() => setPartnerTab("universities")}
                className={`flex-1 rounded-lg py-1.5 font-bold transition ${
                  partnerTab === "universities" ? "bg-white text-[#0d3971] shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                HEIs ({liveUniversities.length})
              </button>
              <button
                onClick={() => setPartnerTab("industry")}
                className={`flex-1 rounded-lg py-1.5 font-bold transition ${
                  partnerTab === "industry" ? "bg-white text-[#0d3971] shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Industry ({liveIndustries.length})
              </button>
            </div>
            <div className="space-y-2">
              {(partnerTab === "universities" ? liveUniversities : liveIndustries).map(([name, status]) => (
                <div
                  key={name}
                  onClick={() =>
                    navigate(
                      partnerTab === "universities"
                        ? `/state/universities-partners`
                        : `/state/industry-csr-partners`
                    )
                  }
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 p-2 hover:bg-blue-50/50 hover:border-blue-200 transition cursor-pointer"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        partnerTab === "universities"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {partnerTab === "universities" ? <GraduationCap size={14} /> : <Building2 size={14} />}
                    </div>
                    <span className="truncate text-xs font-bold text-slate-800">{name}</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold shrink-0 ${
                      status === "Verified"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Organization Verification Requests */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <ShieldCheck size={15} />
            </span>
            <h2 className="text-sm font-extrabold text-[#0d3971]">Recent Organization Accreditation Requests</h2>
          </div>
          <Link
            to="/state/organization-verification"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
          >
            Open Verification Console →
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-extrabold uppercase text-slate-500">
                <th className="py-2.5 px-3">Organization Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {verificationRequests.map((req, idx) => (
                <tr key={req.id || idx} className="hover:bg-blue-50/30 transition">
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    <div>
                      {req.name}
                      {req.email && <span className="block text-[10px] font-normal text-slate-400">{req.email}</span>}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    <span className="flex items-center gap-1">
                      {String(req.type).toLowerCase().includes("university") ? (
                        <GraduationCap size={13} className="text-blue-600 shrink-0" />
                      ) : (
                        <Building2 size={13} className="text-purple-600 shrink-0" />
                      )}
                      {req.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{req.location}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                        req.status === "Verified"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : req.status === "Rejected"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => {
                        const targetType = String(req.type).toLowerCase().includes("university") ? "University" : "Industry";
                        navigate(`/state/organization-verification?search=${encodeURIComponent(req.name)}&type=${targetType}`);
                      }}
                      className={`rounded-xl px-3 py-1 text-xs font-bold transition inline-block ${
                        req.status === "Verified"
                          ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          : "bg-[#0d3971] text-white hover:bg-blue-800 shadow-xs"
                      }`}
                    >
                      {req.status === "Verified" ? "View Details" : "Authorize"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Impact Strip */}
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-white via-blue-50/40 to-blue-50/70 p-4 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            ["1,250", "Total Challenges", Leaf],
            ["48", "Partner Universities", GraduationCap],
            ["37", "Verified Industries/CSR", Building2],
            [liveKPIs[0].value, "Total Citizen Reports", Users],
            ["612", "Problems Resolved", Target],
          ].map(([value, label, IconComponent]) => (
            <div
              key={label}
              className="flex items-center justify-center gap-3 border-r border-slate-200/80 px-3 py-1 last:border-0"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <IconComponent size={20} />
              </div>
              <div>
                <p className="text-base font-black text-[#0d3971]">{value}</p>
                <p className="text-[10px] font-semibold text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StateGovernmentDashboard;
