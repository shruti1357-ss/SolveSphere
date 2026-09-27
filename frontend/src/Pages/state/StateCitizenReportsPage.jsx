import React, { useState } from "react";
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Eye,
  FileText,
  X,
  GraduationCap,
  Building2,
  User,
  Calendar,
  Shield,
  Layers,
  Activity,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const sampleReports = [
  {
    id: "SS-2026-8091",
    title: "Drinking Water Shortage & Pipe Contamination",
    description: "Major water pipeline rupture causing muddy and contaminated drinking water supply across Ward 12 and adjoining localities for over 5 days.",
    district: "East Singhbhum",
    location: "Sakchi, Jamshedpur, East Singhbhum",
    category: "Water & Sanitation",
    priority: "High",
    severity: 8,
    status: "Under AI Analysis",
    aiClassification: "Water Pipeline Failure (Similarity: 92%)",
    date: "02 Sep 2026",
    citizen: "Ramesh Sharma",
    citizenPhone: "+91 98351 22910",
    upvotes: 42,
  },
  {
    id: "SS-2026-7912",
    title: "Pothole Hazards & Poor Road Condition",
    description: "Deep potholes on the main highway connecting Daltonganj town, causing severe vehicular damage and repeated traffic bottlenecks.",
    district: "Palamu",
    location: "Daltonganj By-Pass, Palamu",
    category: "Infrastructure",
    priority: "High",
    severity: 8,
    status: "Under AI Analysis",
    aiClassification: "Highway Structural Damage (Similarity: 88%)",
    date: "28 Aug 2026",
    citizen: "Sunita Verma",
    citizenPhone: "+91 94311 88412",
    upvotes: 29,
  },
  {
    id: "SS-2026-7450",
    title: "Broken Street Lights Near Community Center",
    description: "Over 14 street light fixtures non-operational for 3 weeks leading to public safety risks during evening hours.",
    district: "Ranchi",
    location: "Morabadi, Ranchi",
    category: "Public Safety",
    priority: "Medium",
    severity: 5,
    status: "Assigned to Ranchi University",
    assignedUniversity: "Ranchi University",
    assignedDepartment: "Department of Urban Infrastructure",
    aiClassification: "Municipal Lighting Defect",
    date: "20 Aug 2026",
    citizen: "Anil Kumar",
    citizenPhone: "+91 98355 41092",
    upvotes: 18,
  },
  {
    id: "SS-2026-7102",
    title: "Industrial Effluent Dumping into Subarnarekha River",
    description: "Untreated toxic runoff entering the river stream near the industrial belt, releasing pungent odors and harming local aquatic life.",
    district: "East Singhbhum",
    location: "Adityapur Border, East Singhbhum",
    category: "Environment",
    priority: "Critical",
    severity: 9.5,
    status: "Under AI Analysis",
    aiClassification: "Chemical Pollution / Environmental Threat",
    date: "01 Sep 2026",
    citizen: "Priya Das",
    citizenPhone: "+91 97714 62190",
    upvotes: 87,
  },
  {
    id: "SS-2026-6891",
    title: "Primary School Roof Leakage During Monsoons",
    description: "Severe seepage and plaster degradation in classrooms making classrooms unsafe for students during heavy rainfall.",
    district: "Khunti",
    location: "Torpa Block, Khunti",
    category: "Education",
    priority: "High",
    severity: 7.5,
    status: "Assigned to BIT Mesra, Ranchi",
    assignedUniversity: "BIT Mesra, Ranchi",
    assignedDepartment: "Civil & Environmental Engineering",
    aiClassification: "Public School Infrastructure Risk",
    date: "25 Aug 2026",
    citizen: "Birsa Munda",
    citizenPhone: "+91 94301 77312",
    upvotes: 35,
  },
  {
    id: "SS-2026-6540",
    title: "Primary Health Center Medicine Stock Out",
    description: "Critical essential antibiotics and fever medications depleted for more than 2 weeks, forcing patients to travel 45km.",
    district: "Garhwa",
    location: "Meral PHC, Garhwa",
    category: "Healthcare",
    priority: "Critical",
    severity: 9,
    status: "Under AI Analysis",
    aiClassification: "Medical Supply Shortage",
    date: "03 Sep 2026",
    citizen: "Sanjay Yadav",
    citizenPhone: "+91 99341 55019",
    upvotes: 64,
  },
];

const StateCitizenReportsPage = ({ tab = "all" }) => {
  const { userProblems } = useAuth();
  const [filterDistrict, setFilterDistrict] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const allReports = [...userProblems, ...sampleReports.filter((s) => !userProblems.some((u) => u.id === s.id))];

  const filteredReports = allReports.filter((r) => {
    const matchesDistrict = filterDistrict === "All" || r.district === filterDistrict || r.location?.includes(filterDistrict);
    const matchesCategory = filterCategory === "All" || r.category === filterCategory;
    const matchesSearch =
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.id?.toLowerCase().includes(search.toLowerCase()) ||
      r.district?.toLowerCase().includes(search.toLowerCase());
    return matchesDistrict && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Statewide Civic Monitoring</span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
            {tab === "ai-review" ? "AI Classification & Government Review" : "District & State Citizen Problem Reports"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time state overview of citizen grievance reports, AI categorization, risk scores, and district R&amp;D allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800">
            <span className="font-bold">{filteredReports.length}</span> Total Reports
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search report ID, title, keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:bg-white focus:border-blue-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Filter size={14} /> District:
          </div>
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="All">All Districts</option>
            <option value="Ranchi">Ranchi</option>
            <option value="Dhanbad">Dhanbad</option>
            <option value="East Singhbhum">East Singhbhum</option>
            <option value="West Singhbhum">West Singhbhum</option>
            <option value="Khunti">Khunti</option>
            <option value="Garhwa">Garhwa</option>
            <option value="Palamu">Palamu</option>
            <option value="Bokaro">Bokaro</option>
            <option value="Hazaribagh">Hazaribagh</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            Category:
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Water & Sanitation">Water &amp; Sanitation</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Environment">Environment</option>
            <option value="Public Safety">Public Safety</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="py-3 px-3">Report ID</th>
                <th className="py-3 px-3">Title &amp; Location</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">AI Risk &amp; Severity</th>
                <th className="py-3 px-3">AI Classification</th>
                <th className="py-3 px-3">Status / Assigned University</th>
                <th className="py-3 px-3 text-right">Details &amp; Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((r) => {
                const isAssigned = r.status?.includes("Assigned") || r.assignedUniversity || r.status?.includes("Approved");
                const isRejected = r.status === "Rejected by Government";

                return (
                  <tr key={r.id} className="hover:bg-blue-50/30 transition">
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">{r.id}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 leading-snug">{r.title}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} /> {r.district || r.location || "Jharkhand"}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[9.5px] font-extrabold ${
                          r.priority === "Critical"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : r.priority === "High"
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "bg-amber-50 text-amber-600 border border-amber-200"
                        }`}
                      >
                        {r.priority} ({r.urgency_score || r.severity || 8}/10)
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-700">
                        <Sparkles size={13} className="text-amber-500 shrink-0" />
                        <span>{r.aiClassification || "Automated Risk Scoring"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {isAssigned ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                            <GraduationCap size={12} />
                            {r.assignedUniversity || "Assigned to University"}
                          </span>
                          {r.assignedDepartment && (
                            <p className="text-[9.5px] text-slate-400 truncate max-w-xs">{r.assignedDepartment}</p>
                          )}
                        </div>
                      ) : isRejected ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] font-bold text-red-600">
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-block rounded-full px-2 py-0.5 text-[9.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {r.status || "Under AI Review"}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedReport(r)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0d3971] shadow-xs transition hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Eye size={13} className="text-blue-600" />
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal for State Government Review */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-fade-in">
            {/* Modal Top Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-700 border border-blue-200 mb-1">
                  <Shield size={12} />
                  State Grievance Dossier
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedReport.title}
                </h3>
                <p className="text-xs font-mono font-bold text-blue-600 mt-0.5">
                  Report ID: {selectedReport.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Core Status & AI Severity Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                <p className="text-xs font-black text-slate-900 mt-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  {selectedReport.status || "Under AI Review"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Priority &amp; Severity</span>
                <p className="text-xs font-black text-rose-600 mt-1">
                  {selectedReport.priority || "High"} ({selectedReport.urgency_score || selectedReport.severity || 8}/10)
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
                <p className="text-xs font-black text-blue-900 mt-1">
                  {selectedReport.category}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Citizen Problem Description</span>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {selectedReport.description ||
                  "Citizen reported severe civic infrastructure concern requiring state monitoring and institutional intervention. Automated telemetry has logged this event with high priority."}
              </p>
            </div>

            {/* AI Classification & Analysis */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <Sparkles size={15} className="text-amber-500" />
                AI Classification &amp; Confidence Match
              </div>
              <p className="text-xs text-blue-800 font-semibold">
                {selectedReport.aiClassification || "Multi-Modal Sensor and NLP Risk Match (94% Accuracy)"}
              </p>
              <p className="text-[11px] text-blue-600">
                Automated NLP has grouped this complaint under statewide civic clustering for district resolution tracking.
              </p>
            </div>

            {/* Citizen & Location Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} /> Citizen Information
                </span>
                <p className="font-bold text-slate-900">{selectedReport.citizen || "Ramesh Sharma"}</p>
                <p className="text-slate-500 text-[11px]">{selectedReport.citizenPhone || "+91 98351 00291"}</p>
                <p className="text-slate-400 text-[10px]">Logged on: {selectedReport.date || "Recent"}</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={12} /> Location &amp; District
                </span>
                <p className="font-bold text-slate-900">{selectedReport.district || "Jharkhand"}</p>
                <p className="text-slate-600 text-[11px]">{selectedReport.location || `${selectedReport.district}, Jharkhand`}</p>
                <p className="text-emerald-600 text-[10px] font-semibold">GPS Geo-tagged Verified</p>
              </div>
            </div>

            {/* University R&D Allocation Status (if assigned) */}
            {selectedReport.assignedUniversity && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <GraduationCap size={16} className="text-emerald-700" />
                  Assigned HEI / University Partner
                </div>
                <p className="text-xs font-extrabold text-emerald-950">
                  {selectedReport.assignedUniversity}
                </p>
                {selectedReport.assignedDepartment && (
                  <p className="text-[11px] text-emerald-700">
                    Department: {selectedReport.assignedDepartment}
                  </p>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[10px] text-slate-400 font-medium">
                State Government Audit &amp; Governance View
              </span>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-xl bg-[#0d3971] px-5 py-2 text-xs font-extrabold text-white hover:bg-blue-800 shadow-sm transition"
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

export default StateCitizenReportsPage;
