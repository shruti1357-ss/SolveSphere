import React, { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity,
  CheckCircle2,
  Shield,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  Zap,
  GraduationCap,
  Building2,
  Users,
  Award,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Monthly reporting trend dataset by selected financial year
const TREND_DATA_BY_TIMEFRAME = {
  "FY 2026-27": [
    { month: "Apr 2026", reports: 180, resolved: 145, verified: 160 },
    { month: "May 2026", reports: 240, resolved: 190, verified: 215 },
    { month: "Jun 2026", reports: 310, resolved: 260, verified: 285 },
    { month: "Jul 2026", reports: 450, resolved: 380, verified: 410 },
    { month: "Aug 2026", reports: 620, resolved: 530, verified: 575 },
    { month: "Sep 2026", reports: 845, resolved: 710, verified: 790 },
  ],
  "FY 2025-26": [
    { month: "Apr 2025", reports: 110, resolved: 85, verified: 95 },
    { month: "May 2025", reports: 145, resolved: 115, verified: 130 },
    { month: "Jun 2025", reports: 190, resolved: 150, verified: 175 },
    { month: "Jul 2025", reports: 270, resolved: 220, verified: 250 },
    { month: "Aug 2025", reports: 380, resolved: 320, verified: 350 },
    { month: "Sep 2025", reports: 510, resolved: 440, verified: 480 },
  ],
  "FY 2024-25": [
    { month: "Apr 2024", reports: 65, resolved: 45, verified: 55 },
    { month: "May 2024", reports: 85, resolved: 60, verified: 75 },
    { month: "Jun 2024", reports: 120, resolved: 90, verified: 105 },
    { month: "Jul 2024", reports: 160, resolved: 130, verified: 145 },
    { month: "Aug 2024", reports: 210, resolved: 175, verified: 190 },
    { month: "Sep 2024", reports: 290, resolved: 245, verified: 270 },
  ],
};

// Problem category breakdown with hex colors
const categoryData = [
  { name: "Water Management & Sanitation", value: 32, count: 685, color: "#2563eb" },
  { name: "Rural & Urban Infrastructure", value: 26, count: 556, color: "#d97706" },
  { name: "Healthcare & MedTech", value: 18, count: 385, color: "#7c3aed" },
  { name: "Smart Education & Schools", value: 14, count: 299, color: "#059669" },
  { name: "Environment & Clean Energy", value: 10, count: 214, color: "#0891b2" },
];

// District Velocity Performance
const districtVelocityData = [
  { district: "Ranchi", avgDays: 12.4, target: 15 },
  { district: "Dhanbad", avgDays: 14.2, target: 15 },
  { district: "East Singhbhum", avgDays: 13.8, target: 15 },
  { district: "Bokaro", avgDays: 16.5, target: 15 },
  { district: "Hazaribagh", avgDays: 17.1, target: 15 },
  { district: "Palamu", avgDays: 19.4, target: 15 },
];

const StateAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("FY 2026-27");
  const [activeCategory, setActiveCategory] = useState(null);

  const activeTrendData = useMemo(() => {
    return TREND_DATA_BY_TIMEFRAME[timeRange] || TREND_DATA_BY_TIMEFRAME["FY 2026-27"];
  }, [timeRange]);

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1">
          <p className="font-extrabold text-slate-900">{label}</p>
          {payload.map((item, index) => (
            <p key={index} className="font-semibold" style={{ color: item.color }}>
              {item.name}: <span className="font-extrabold text-slate-800">{item.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
            <Activity size={13} /> State Data Intelligence
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">State Analytics &amp; Impact Performance</h1>
          <p className="text-xs text-slate-500 mt-1">
            Statewide governance analytics on citizen problem reporting velocities, AI triage precision, and HEI solution execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700">
            <Calendar size={13} className="text-blue-600" />
            <span>Timeframe:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent font-extrabold text-blue-800 outline-none cursor-pointer"
            >
              <option value="FY 2026-27">FY 2026–27 (Current)</option>
              <option value="FY 2025-26">FY 2025–26</option>
              <option value="FY 2024-25">FY 2024–25</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top 4 Key Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
              Avg Resolution Time
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">18.4 Days</p>
          <p className="text-[10.5px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
            <ArrowDownRight size={13} /> 4.2 days vs last quarter
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
              AI Classification Accuracy
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <Sparkles size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-900 mt-2">94.8%</p>
          <p className="text-[10.5px] font-semibold text-slate-400 mt-1">
            Based on 2,845 verified cases
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
              University Match Speed
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <GraduationCap size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-900 mt-2">3.2 Days</p>
          <p className="text-[10.5px] font-semibold text-purple-600 mt-1">
            From proposal to assignment
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
              CSR Capital Deployed
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Building2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-900 mt-2">₹72.8 Cr</p>
          <p className="text-[10.5px] font-semibold text-emerald-600 mt-1">
            Across 48 state initiatives
          </p>
        </div>
      </div>

      {/* Main Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Monthly Volume & Resolution Trend Area Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <TrendingUp size={15} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Monthly Problem Reports &amp; Resolution Trend</h2>
                <p className="text-[10px] text-slate-400">Total volume vs. verified solutions delivered</p>
              </div>
            </div>
            <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-[9.5px] font-bold">
              +18.4% MoM Growth
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip content={customTooltip} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Area type="monotone" dataKey="reports" name="Total Reports" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReports)" />
                <Area type="monotone" dataKey="resolved" name="Resolved Solutions" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Problem Category Breakdown with interactive percentage meters */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                <PieChartIcon size={15} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Problem Category Breakdown (%)</h2>
                <p className="text-[10px] text-slate-400">Distribution across 2,139 state cases</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {categoryData.map((cat) => (
              <div
                key={cat.name}
                onMouseEnter={() => setActiveCategory(cat.name)}
                onMouseLeave={() => setActiveCategory(null)}
                className={`p-2.5 rounded-xl border transition cursor-default ${
                  activeCategory === cat.name
                    ? "border-blue-300 bg-blue-50/40 shadow-xs"
                    : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="truncate max-w-[200px]">{cat.name}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-semibold">{cat.count} cases</span>
                    <span className="font-extrabold text-slate-900 w-8 text-right">{cat.value}%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200/80 overflow-hidden">
                  <div
                    style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: District Resolution Speed Benchmark */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Target size={15} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">District-Level Resolution Velocity (Days)</h2>
              <p className="text-[10px] text-slate-400">Average days to address citizen problems vs. 15-day SLA target</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500">
            State Target: <strong className="text-emerald-700">≤ 15 Days</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {districtVelocityData.map((d) => {
            const isFaster = d.avgDays <= d.target;
            return (
              <div
                key={d.district}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 text-center space-y-1"
              >
                <span className="text-[10.5px] font-bold text-slate-500 uppercase">{d.district}</span>
                <p className={`text-lg font-black ${isFaster ? "text-emerald-900" : "text-amber-900"}`}>
                  {d.avgDays} <span className="text-xs font-medium text-slate-400">Days</span>
                </p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                    isFaster
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {isFaster ? "Within SLA" : "Needs Attention"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StateAnalyticsPage;

