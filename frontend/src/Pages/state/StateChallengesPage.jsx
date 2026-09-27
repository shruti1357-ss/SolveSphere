import React, { useMemo, useState } from "react";
import {
  Target,
  Search,
  MapPin,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  ChevronRight,
  Filter,
  Layers,
  BarChart3,
  Eye,
  FileText,
  Building2,
  GraduationCap,
  Sparkles,
  X,
  ExternalLink,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

const JHARKHAND_DISTRICTS = [
  "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum",
  "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara",
  "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu",
  "Ramgarh", "Ranchi", "Sahebganj", "Seraikela-Kharsawan", "Simdega", "West Singhbhum",
];

const DEMO_STATE_CHALLENGES = [
  { id: "STATE-DEMO-001", title: "Rural Drinking Water Reliability", category: "Water Management", district: "Ranchi", location: "Ranchi, Jharkhand", priority: "Critical", status: "Active", description: "Improve reliable drinking-water access and telemetry monitoring across underserved rural settlements.", department: "Drinking Water & Sanitation Dept", university: "Birsa Agricultural University", budget: "₹45 Lakhs" },
  { id: "STATE-DEMO-002", title: "Mining-Area Air Quality Alerts", category: "Environment", district: "Dhanbad", location: "Dhanbad, Jharkhand", priority: "Critical", status: "In Progress", description: "Deploy community-level air-quality alerts and mist cannon telemetry around high-exposure mining corridors.", department: "Jharkhand State Pollution Control Board", university: "IIT (ISM) Dhanbad", budget: "₹80 Lakhs" },
  { id: "STATE-DEMO-003", title: "Industrial Water Contamination Watch", category: "Water Management", district: "East Singhbhum", location: "East Singhbhum, Jharkhand", priority: "Critical", status: "Active", description: "Create faster detection and reporting for heavy metal water contamination near industrial discharge canals.", department: "Water Resources Dept", university: "NIT Jamshedpur", budget: "₹60 Lakhs" },
  { id: "STATE-DEMO-004", title: "Rural Road Safety Improvements", category: "Infrastructure", district: "West Singhbhum", location: "West Singhbhum, Jharkhand", priority: "Medium", status: "In Progress", description: "Identify dangerous rural road sections and prioritize low-cost safety interventions and solar beacons.", department: "Road Construction Dept", university: "Ranchi University", budget: "₹35 Lakhs" },
  { id: "STATE-DEMO-005", title: "School Attendance Connectivity", category: "Education", district: "Bokaro", location: "Bokaro, Jharkhand", priority: "Low", status: "Active", description: "Improve digital attendance reporting and solar mesh WiFi from schools with unreliable cellular connectivity.", department: "School Education & Literacy Dept", university: "BIT Mesra, Ranchi", budget: "₹25 Lakhs" },
  { id: "STATE-DEMO-006", title: "Flood-Prone Village Warning Network", category: "Disaster Management", district: "Garhwa", location: "Garhwa, Jharkhand", priority: "Critical", status: "Active", description: "Build local early warning workflows and siren stations for villages exposed to seasonal flash flooding.", department: "Disaster Management Dept", university: "Central University of Jharkhand", budget: "₹50 Lakhs" },
  { id: "STATE-DEMO-007", title: "Forest Fire Early Detection", category: "Environment", district: "Latehar", location: "Latehar, Jharkhand", priority: "Critical", status: "In Progress", description: "Use low-cost thermal infrared sensors and community reporting to detect forest fires earlier in tiger reserves.", department: "Forest & Environment Dept", university: "Vinoba Bhave University", budget: "₹40 Lakhs" },
  { id: "STATE-DEMO-008", title: "Primary Health Centre Medicine Tracking", category: "Health", district: "Palamu", location: "Palamu, Jharkhand", priority: "Medium", status: "Active", description: "Track essential medicine stock levels in real time and reduce avoidable inventory outages in remote PHCs.", department: "Health & Family Welfare Dept", university: "RIMS Ranchi", budget: "₹30 Lakhs" },
  { id: "STATE-DEMO-009", title: "Smart Irrigation Advisory", category: "Agriculture", district: "Hazaribagh", location: "Hazaribagh, Jharkhand", priority: "Low", status: "Active", description: "Provide farmers with practical soil moisture recommendations and automated drip schedules using local micro-sensors.", department: "Agriculture & Co-operative Dept", university: "Birsa Agricultural University", budget: "₹28 Lakhs" },
  { id: "STATE-DEMO-010", title: "Tourism Sanitation Upgrade", category: "Sanitation", district: "Deoghar", location: "Deoghar, Jharkhand", priority: "Medium", status: "In Progress", description: "Improve smart sanitation facilities and bio-toilet maintenance monitoring around high-footfall pilgrimage areas.", department: "Urban Development & Housing", university: "NIT Jamshedpur", budget: "₹32 Lakhs" },
  { id: "STATE-DEMO-011", title: "Village Solar Street Lighting", category: "Clean Energy", district: "Dumka", location: "Dumka, Jharkhand", priority: "Low", status: "Active", description: "Expand dependable solar street lighting and smart battery health monitoring in underserved village corridors.", department: "JREDA (Renewable Energy)", university: "BIT Mesra", budget: "₹22 Lakhs" },
  { id: "STATE-DEMO-012", title: "Groundwater Level Monitoring", category: "Water Management", district: "Giridih", location: "Giridih, Jharkhand", priority: "Critical", status: "Active", description: "Monitor aquifer depths and flag stressed extraction zones before summer water shortages worsen.", department: "Groundwater Directorate", university: "IIT (ISM) Dhanbad", budget: "₹55 Lakhs" },
  { id: "STATE-DEMO-013", title: "School Transport Safety Mapping", category: "Education", district: "Chatra", location: "Chatra, Jharkhand", priority: "Medium", status: "Active", description: "Map school transport hazard zones and establish safer pickup points along rural state highways.", department: "Transport Department", university: "Central University of Jharkhand", budget: "₹18 Lakhs" },
  { id: "STATE-DEMO-014", title: "Crop Loss Reporting Network", category: "Agriculture", district: "Godda", location: "Godda, Jharkhand", priority: "Critical", status: "In Progress", description: "Create a satellite-assisted crop-loss reporting workflow for faster district-level drought compensation.", department: "Agriculture Dept", university: "Birsa Agricultural University", budget: "₹42 Lakhs" },
  { id: "STATE-DEMO-015", title: "Last-Mile Electricity Reliability", category: "Electricity", district: "Gumla", location: "Gumla, Jharkhand", priority: "Critical", status: "Active", description: "Identify recurring transformer feeder failures and prioritize last-mile smart grid reliability fixes.", department: "JUVNL (Jharkhand Urja)", university: "NIT Jamshedpur", budget: "₹65 Lakhs" },
  { id: "STATE-DEMO-016", title: "Village Waste Collection Routes", category: "Sanitation", district: "Jamtara", location: "Jamtara, Jharkhand", priority: "Low", status: "Active", description: "Optimize collection routes for rural cluster panchayats with irregular solid waste collection.", department: "Panchayati Raj Dept", university: "Ranchi University", budget: "₹15 Lakhs" },
  { id: "STATE-DEMO-017", title: "Safe Drinking Water Kiosks", category: "Water Management", district: "Khunti", location: "Khunti, Jharkhand", priority: "Medium", status: "Active", description: "Improve access to verified, tested drinking water through IoT-monitored community purification kiosks.", department: "DWSD Jharkhand", university: "Central University of Jharkhand", budget: "₹38 Lakhs" },
  { id: "STATE-DEMO-018", title: "Digital Land Record Help Desk", category: "Governance", district: "Koderma", location: "Koderma, Jharkhand", priority: "Low", status: "Active", description: "Deploy automated kiosks to help residents verify land mutation status and download digitized maps.", department: "Revenue & Land Reforms", university: "BIT Mesra", budget: "₹20 Lakhs" },
  { id: "STATE-DEMO-019", title: "Village Solar Pump Maintenance", category: "Agriculture", district: "Lohardaga", location: "Lohardaga, Jharkhand", priority: "Medium", status: "In Progress", description: "Create an on-demand IoT maintenance response system for solar irrigation pumps.", department: "Agriculture Directorate", university: "Birsa Agricultural University", budget: "₹26 Lakhs" },
  { id: "STATE-DEMO-020", title: "Market Access for Local Producers", category: "Agriculture", district: "Pakur", location: "Pakur, Jharkhand", priority: "Low", status: "Active", description: "Improve digital marketplace visibility and cold-chain logistics access for tribal honey and millet producers.", department: "JHASMCOL / Rural Development", university: "Ranchi University", budget: "₹24 Lakhs" },
];

const getDistrict = (challenge) => {
  if (challenge.district) return challenge.district;
  const location = challenge.location || "";
  const match = JHARKHAND_DISTRICTS.find((district) =>
    location.toLowerCase().includes(district.toLowerCase())
  );
  return match || "Jharkhand";
};

const getSeverity = (challenge) => {
  const value = String(challenge.priority || challenge.severity || "").toLowerCase();
  if (value === "critical" || value === "high") return "Critical";
  if (value === "medium" || value === "moderate") return "Medium";
  return "Low";
};

const severityStyles = {
  Critical: "border-rose-200 bg-rose-50 text-rose-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const StateChallengesPage = () => {
  const { challenges = [] } = useAdmin();
  const [activeTab, setActiveTab] = useState("challenges"); // "challenges" | "district-report"
  const [districtFilter, setDistrictFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const stateChallenges = useMemo(() => {
    const liveJharkhandChallenges = challenges.filter((challenge) => {
      const location = String(challenge.location || "").toLowerCase();
      const district = String(challenge.district || "").toLowerCase();
      return (
        location.includes("jharkhand") ||
        JHARKHAND_DISTRICTS.some((name) =>
          `${district} ${location}`.toLowerCase().includes(name.toLowerCase())
        )
      );
    });

    const demoIds = new Set(DEMO_STATE_CHALLENGES.map((challenge) => challenge.id));
    return [
      ...DEMO_STATE_CHALLENGES,
      ...liveJharkhandChallenges.filter((challenge) => !demoIds.has(challenge.id)),
    ];
  }, [challenges]);

  const filteredChallenges = useMemo(() => {
    return stateChallenges.filter((c) => {
      const d = getDistrict(c);
      const sev = getSeverity(c);
      const matchesDistrict = districtFilter === "All" || d.toLowerCase() === districtFilter.toLowerCase();
      const matchesCategory = categoryFilter === "All" || c.category?.toLowerCase() === categoryFilter.toLowerCase();
      const matchesSeverity = severityFilter === "All" || sev.toLowerCase() === severityFilter.toLowerCase();
      const matchesSearch =
        search === "" ||
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.id?.toLowerCase().includes(search.toLowerCase()) ||
        d.toLowerCase().includes(search.toLowerCase()) ||
        c.category?.toLowerCase().includes(search.toLowerCase());

      return matchesDistrict && matchesCategory && matchesSeverity && matchesSearch;
    });
  }, [stateChallenges, districtFilter, categoryFilter, severityFilter, search]);

  // District-wise report aggregation
  const districtReportData = useMemo(() => {
    const map = {};
    JHARKHAND_DISTRICTS.forEach((d) => {
      map[d] = {
        district: d,
        total: 0,
        critical: 0,
        medium: 0,
        low: 0,
        active: 0,
        inProgress: 0,
        resolved: 0,
        categories: new Set(),
      };
    });

    stateChallenges.forEach((c) => {
      const d = getDistrict(c);
      if (map[d]) {
        map[d].total += 1;
        const sev = getSeverity(c).toLowerCase();
        if (sev === "critical") map[d].critical += 1;
        else if (sev === "medium") map[d].medium += 1;
        else map[d].low += 1;

        const st = String(c.status || "").toUpperCase();
        if (st.includes("RESOLV") || st.includes("COMPLET")) map[d].resolved += 1;
        else if (st.includes("PROGRESS")) map[d].inProgress += 1;
        else map[d].active += 1;

        if (c.category) map[d].categories.add(c.category);
      }
    });

    return Object.values(map);
  }, [stateChallenges]);

  const stats = useMemo(() => {
    return filteredChallenges.reduce(
      (acc, challenge) => {
        acc.total += 1;
        acc[getSeverity(challenge).toLowerCase()] += 1;
        return acc;
      },
      { total: 0, critical: 0, medium: 0, low: 0 }
    );
  }, [filteredChallenges]);

  return (
    <div className="space-y-6 pb-8">
      {/* Page Heading Banner */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
              <Target size={14} /> State Challenge Management
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              All Districts Challenges &amp; Report
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Comprehensive state-level monitoring of R&amp;D challenges, severity distribution, and district-wise execution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs">
              <button
                onClick={() => setActiveTab("challenges")}
                className={`rounded-lg px-3.5 py-1.5 font-bold transition ${
                  activeTab === "challenges" ? "bg-white text-[#0d3971] shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Challenges List ({filteredChallenges.length})
              </button>
              <button
                onClick={() => setActiveTab("district-report")}
                className={`rounded-lg px-3.5 py-1.5 font-bold transition flex items-center gap-1.5 ${
                  activeTab === "district-report" ? "bg-white text-[#0d3971] shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers size={13} />
                District-Wise Report
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Challenges</p>
              <p className="mt-1.5 text-2xl font-black text-[#0d3971]">{stats.total}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Target size={20} />
            </div>
          </div>
          <p className="mt-2 text-[10px] font-semibold text-slate-400">Across 24 districts</p>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Critical Challenges</p>
              <p className="mt-1.5 text-2xl font-black text-rose-600">{stats.critical}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="mt-2 text-[10px] font-semibold text-rose-600">High intervention priority</p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Medium Challenges</p>
              <p className="mt-1.5 text-2xl font-black text-amber-600">{stats.medium}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={20} />
            </div>
          </div>
          <p className="mt-2 text-[10px] font-semibold text-amber-600">Active R&amp;D development</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Low Challenges</p>
              <p className="mt-1.5 text-2xl font-black text-emerald-600">{stats.low}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="mt-2 text-[10px] font-semibold text-emerald-600">Routine maintenance &amp; ops</p>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search challenges by title, keyword, ID, or district..."
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs font-medium text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
              <Filter size={13} />
              District:
            </div>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="All">All Districts (24)</option>
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Water Management">Water Management</option>
              <option value="Environment">Environment</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Clean Energy">Clean Energy</option>
              <option value="Disaster Management">Disaster Management</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Content Area based on Active Tab */}
      {activeTab === "challenges" ? (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-[#0d3971]">
                Challenges Registry
              </h2>
              <p className="text-[10px] text-slate-400">Showing {filteredChallenges.length} challenges across Jharkhand</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-0.5 text-[10px] font-bold text-slate-600">
              {districtFilter === "All" ? "All 24 Districts" : districtFilter}
            </span>
          </div>

          {filteredChallenges.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <Target className="mx-auto text-slate-300" size={36} />
              <h3 className="mt-2 text-sm font-extrabold text-slate-800">No challenges match your filters</h3>
              <p className="mt-1 text-xs text-slate-500">Try adjusting your search criteria or resetting filters.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredChallenges.map((challenge) => {
                const severity = getSeverity(challenge);
                const district = getDistrict(challenge);
                return (
                  <article
                    key={challenge.id}
                    onClick={() => setSelectedChallenge(challenge)}
                    className="group rounded-xl border border-slate-200/90 bg-slate-50/40 p-4 transition hover:bg-blue-50/30 hover:border-blue-300 hover:shadow-xs cursor-pointer"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700">
                            {challenge.id}
                          </span>
                          <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold ${severityStyles[severity]}`}>
                            {severity} Priority
                          </span>
                          <span className="rounded-md bg-slate-200/70 px-2 py-0.5 text-[9.5px] font-semibold text-slate-700">
                            {challenge.category}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition">
                          {challenge.title}
                        </h3>
                        <p className="line-clamp-1 text-xs text-slate-500">
                          {challenge.description || "Challenge details available in the state challenge registry."}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-3 border-t border-slate-100 pt-2 sm:border-t-0 sm:pt-0">
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1 text-[10px] font-semibold text-slate-400">
                            <MapPin size={11} className="text-blue-500" /> District
                          </div>
                          <p className="text-xs font-black text-slate-800">{district}</p>
                        </div>

                        <div className="text-right min-w-[70px]">
                          <span className="text-[10px] font-semibold text-slate-400 block">Status</span>
                          <span className="inline-block rounded-full px-2 py-0.5 text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {challenge.status || "Active"}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="rounded-xl border border-slate-200 bg-white p-1.5 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-300 transition"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        /* District-Wise Report Summary Table */
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-[#0d3971]">District-Wise Challenges Report</h2>
              <p className="text-[10px] text-slate-400">Aggregate breakdown of state challenges, severity tiers, and execution status across all 24 districts</p>
            </div>
            <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-[10px] font-bold">
              24 Districts Audited
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-extrabold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-2 text-right">Total Challenges</th>
                  <th className="py-2.5 px-2 text-right text-rose-600">Critical</th>
                  <th className="py-2.5 px-2 text-right text-amber-600">Medium</th>
                  <th className="py-2.5 px-2 text-right text-emerald-600">Low</th>
                  <th className="py-2.5 px-2 text-right text-blue-700">Active / In-Prog</th>
                  <th className="py-2.5 px-3">Primary Domains</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {districtReportData
                  .filter((d) => districtFilter === "All" || d.district.toLowerCase() === districtFilter.toLowerCase())
                  .map((row) => (
                    <tr key={row.district} className="hover:bg-blue-50/40 transition">
                      <td className="py-2.5 px-3 font-extrabold text-slate-900 flex items-center gap-1.5">
                        <MapPin size={13} className="text-blue-500" />
                        {row.district}
                      </td>
                      <td className="py-2.5 px-2 text-right font-black text-slate-900">{row.total}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-rose-600">{row.critical}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-amber-600">{row.medium}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-emerald-600">{row.low}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-blue-700">{row.active + row.inProgress}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {Array.from(row.categories).slice(0, 2).map((cat) => (
                            <span key={cat} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9.5px] font-medium text-slate-700">
                              {cat}
                            </span>
                          ))}
                          {row.categories.size > 2 && (
                            <span className="text-[9.5px] font-bold text-slate-400">+{row.categories.size - 2} more</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setDistrictFilter(row.district);
                            setActiveTab("challenges");
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10.5px] font-bold text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition"
                        >
                          View ({row.total})
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Challenge Details Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                  {selectedChallenge.id}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">{selectedChallenge.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin size={12} className="text-blue-500" /> {getDistrict(selectedChallenge)}, Jharkhand
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedChallenge(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase">Priority</span>
                <p className="font-extrabold text-rose-600 mt-0.5">{getSeverity(selectedChallenge)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase">Category</span>
                <p className="font-extrabold text-slate-800 mt-0.5">{selectedChallenge.category}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase">Grant / Budget</span>
                <p className="font-extrabold text-emerald-700 mt-0.5">{selectedChallenge.budget || "₹30 Lakhs"}</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Challenge Objective &amp; Scope</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedChallenge.description}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              {selectedChallenge.department && (
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-blue-50/40">
                  <span className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Building2 size={14} className="text-blue-600" /> Nodal Department:
                  </span>
                  <span className="font-extrabold text-blue-900">{selectedChallenge.department}</span>
                </div>
              )}
              {selectedChallenge.university && (
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-emerald-50/40">
                  <span className="flex items-center gap-1.5 font-bold text-slate-700">
                    <GraduationCap size={14} className="text-emerald-600" /> Allocated HEI Partner:
                  </span>
                  <span className="font-extrabold text-emerald-900">{selectedChallenge.university}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setSelectedChallenge(null)}
                className="rounded-xl bg-[#0d3971] px-5 py-2 text-xs font-bold text-white hover:bg-blue-800 transition shadow-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateChallengesPage;
