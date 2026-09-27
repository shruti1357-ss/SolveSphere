import { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  Handshake,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  GraduationCap,
  MessageSquare,
  Layers,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Eye,
  Plus,
  ArrowRight,
  X,
  Building2,
  Calendar,
  Briefcase,
  TrendingUp,
} from "lucide-react";

import IndustrySidebar from "../../components/industry/IndustrySidebar";
import IndustryTopbar from "../../components/industry/IndustryTopbar";
import { useAuth } from "../../context/AuthContext";
import {
  getCompanyProfile,
  MOCK_INITIAL_COLLABORATIONS,
} from "../../utils/industryMockData";

const MyCollaborationsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [version, setVersion] = useState(0);

  const [activeCollabDetail, setActiveCollabDetail] = useState(null);

  const { user } = useAuth();

  // Real-time synchronization listeners
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

  const userKey = String(
    user?.email || user?.organization || user?.name || "industry"
  ).toLowerCase().trim();

  // Load live shared collaborations
  const collaborations = useMemo(() => {
    try {
      const saved =
        localStorage.getItem(`solvesphere_collaborations_${userKey}`) ||
        localStorage.getItem("solvesphere_collaboration_requests") ||
        localStorage.getItem("solvesphere_collaborations");

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const seen = new Set();
          const unique = [];
          parsed.forEach((item) => {
            const key = String(item.id || item.projectId || item.projectName);
            if (!seen.has(key)) {
              seen.add(key);
              unique.push(item);
            }
          });
          return unique;
        }
      }
    } catch {}
    return MOCK_INITIAL_COLLABORATIONS;
  }, [userKey, version]);

  // Dynamic KPI counts
  const totalCount = collaborations.length;
  const activeCount = collaborations.filter(
    (c) => c.status === "ACTIVE" || c.status === "ACCEPTED" || c.status === "IN_PROGRESS"
  ).length;
  const pendingCount = collaborations.filter(
    (c) => !c.status || c.status === "PENDING" || c.status === "Pending"
  ).length;
  const completedCount = collaborations.filter(
    (c) => c.status === "COMPLETED" || c.status === "Completed" || c.status === "RESOLVED"
  ).length;

  // Filtered collaborations
  const filteredCollaborations = useMemo(() => {
    return collaborations.filter((item) => {
      const normStatus = String(item.status || "PENDING").toUpperCase();

      // Tab filter
      let matchesTab = true;
      if (activeTab === "Pending") matchesTab = normStatus === "PENDING";
      else if (activeTab === "Active") matchesTab = normStatus === "ACTIVE" || normStatus === "ACCEPTED" || normStatus === "IN_PROGRESS";
      else if (activeTab === "Completed") matchesTab = normStatus === "COMPLETED" || normStatus === "RESOLVED";
      else if (activeTab === "Rejected") matchesTab = normStatus === "REJECTED" || normStatus === "DECLINED";

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        (item.projectName || "").toLowerCase().includes(q) ||
        (item.university || "").toLowerCase().includes(q) ||
        (item.domain || "").toLowerCase().includes(q) ||
        (item.district || "").toLowerCase().includes(q) ||
        (item.id || "").toLowerCase().includes(q) ||
        (item.collaborationType || "").toLowerCase().includes(q);

      // Domain filter
      const matchesDomain =
        selectedDomain === "All" ||
        (item.domain || "").toLowerCase() === selectedDomain.toLowerCase();

      return matchesTab && matchesSearch && matchesDomain;
    });
  }, [collaborations, activeTab, searchQuery, selectedDomain]);

  // Unique domains for filter
  const domainsList = useMemo(() => {
    return ["All", ...new Set(collaborations.map((c) => c.domain).filter(Boolean))];
  }, [collaborations]);

  const getStatusBadge = (status) => {
    const norm = String(status || "PENDING").toUpperCase();
    switch (norm) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200 shadow-xs">
            <Clock size={13} /> PENDING APPROVAL
          </span>
        );
      case "ACCEPTED":
      case "ACTIVE":
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-xs">
            <PlayCircle size={13} /> ACTIVE COLLABORATION
          </span>
        );
      case "COMPLETED":
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200 shadow-xs">
            <CheckCircle2 size={13} /> COMPLETED
          </span>
        );
      case "REJECTED":
      case "DECLINED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200 shadow-xs">
            <XCircle size={13} /> REJECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f9fd] text-slate-800">
      <IndustrySidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="ml-0 lg:ml-64">
        <IndustryTopbar isSidebarOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <main className="w-full px-4 py-6 sm:px-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                <Link to="/industry-dashboard" className="hover:text-blue-600 transition">Industry Dashboard</Link>
                <span>&gt;</span>
                <span className="text-[#164579] font-bold">My Collaborations</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0d3971] sm:text-3xl flex items-center gap-2.5">
                <Handshake className="text-blue-600" />
                My Collaborations
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#275587] font-medium">
                Track, manage, and coordinate your submitted R&D proposals, mentorship offers, and active university workspaces.
              </p>
            </div>

            <Link
              to="/industry-dashboard/recommended"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0d3971] hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition active:scale-95 self-start sm:self-auto"
            >
              <Plus size={15} /> Explore Recommended Projects
            </Link>
          </motion.div>

          {/* Top KPI Cards */}
          <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Total Proposals",
                value: String(totalCount),
                trend: "12%",
                icon: Briefcase,
                color: "bg-blue-50 text-blue-600",
              },
              {
                title: "Active Partnerships",
                value: String(activeCount),
                trend: "Live Workspaces",
                icon: PlayCircle,
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                title: "Pending Approval",
                value: String(pendingCount),
                trend: "Under HEI Review",
                icon: Clock,
                color: "bg-amber-50 text-amber-600",
              },
              {
                title: "Completed Projects",
                value: String(completedCount),
                trend: "Impact Achieved",
                icon: CheckCircle2,
                color: "bg-cyan-50 text-cyan-600",
              },
            ].map((kpi) => (
              <div
                key={kpi.title}
                className="rounded-2xl border border-blue-100 bg-white p-5 shadow-xs transition hover:border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {kpi.title}
                  </span>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${kpi.color}`}>
                    <kpi.icon size={18} />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-[#0d3971]">{kpi.value}</span>
                  <span className="text-xs font-bold text-slate-500">{kpi.trend}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Search, Filter Bar & Status Tabs */}
          <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-4 shadow-xs">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                {["All", "Active", "Pending", "Completed", "Rejected"].map((tab) => {
                  const count =
                    tab === "All"
                      ? totalCount
                      : tab === "Active"
                      ? activeCount
                      : tab === "Pending"
                      ? pendingCount
                      : tab === "Completed"
                      ? completedCount
                      : collaborations.filter((c) => String(c.status).toUpperCase() === "REJECTED").length;

                  const isSelected = activeTab === tab;

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition shrink-0 ${
                        isSelected
                          ? "bg-[#0d3971] text-white shadow-xs"
                          : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {tab}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-white text-slate-700 border border-slate-200"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Domain Filter */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search collaborations..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                {domainsList.length > 2 && (
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    aria-label="Filter by Domain"
                    className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                  >
                    {domainsList.map((d) => (
                      <option key={d} value={d}>{d === "All" ? "All Domains" : d}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* List of Collaborations */}
          {filteredCollaborations.length === 0 ? (
            <div className="rounded-2xl border border-blue-100 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3">
                <Handshake size={28} />
              </div>
              <h3 className="text-base font-extrabold text-[#0d3971]">
                No Collaborations Found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {activeTab === "All"
                  ? "You have not submitted any collaboration proposals yet. Explore recommended academic R&D projects to initiate partnerships."
                  : `No collaboration proposals match the active filter "${activeTab}".`}
              </p>
              <Link
                to="/industry-dashboard/recommended"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
              >
                Browse Recommended Projects <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredCollaborations.map((item) => {
                const normStatus = String(item.status || "PENDING").toUpperCase();
                const isActive = normStatus === "ACTIVE" || normStatus === "ACCEPTED" || normStatus === "IN_PROGRESS";
                const isCompleted = normStatus === "COMPLETED" || normStatus === "RESOLVED";

                const typesList = Array.isArray(item.collaborationTypes)
                  ? item.collaborationTypes
                  : String(item.collaborationType || "Technical Mentorship").split(",").map((s) => s.trim());

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-blue-100 bg-white p-5 shadow-xs transition hover:border-blue-300 hover:shadow-md"
                  >
                    {/* Top Row: Domain, ID, Status & Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-800 border border-blue-100">
                          {item.domain || "Civic Innovation"}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-400">
                          {item.id}
                        </span>
                        {item.currentStage && (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            Stage: {item.currentStage}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {getStatusBadge(item.status)}
                        <span className="text-xs font-medium text-slate-400">
                          {item.requestDate || "Recent"}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Title, University, Location & Support Tags */}
                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#0d3971] hover:text-blue-600 transition cursor-pointer" onClick={() => setActiveCollabDetail(item)}>
                          {item.projectName || item.title || "Collaborative R&D Project"}
                        </h3>

                        {/* University & District Location */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                            <GraduationCap size={15} className="text-blue-600 shrink-0" />
                            <span>{item.university || "Jharkhand University"}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-slate-500">
                            <MapPin size={14} className="text-slate-400 shrink-0" />
                            <span>{item.district || "Jharkhand District"}</span>
                          </div>

                          {item.fundingOffered && (
                            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              {item.fundingOffered}
                            </span>
                          )}
                        </div>

                        {/* Collaboration Support Badges */}
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                            Offered Support:
                          </span>
                          {typesList.map((type) => (
                            <span
                              key={type}
                              className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 border border-slate-200"
                            >
                              <Sparkles size={10} className="text-blue-500" />
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Proposal Message & Progress */}
                      <div className="flex flex-col justify-between rounded-xl bg-slate-50/80 border border-slate-100 p-3.5">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                            <MessageSquare size={12} /> Submitted Proposal Message
                          </p>
                          <p className="text-xs text-slate-700 italic leading-relaxed line-clamp-3">
                            "{item.message || "We would like to partner on this project and provide engineering resources and CSR sponsorship."}"
                          </p>
                        </div>

                        {item.progressPercentage !== undefined && (
                          <div className="mt-3 pt-2 border-t border-slate-200/60">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                              <span>Milestone Progress</span>
                              <span className="text-[#0d3971] font-bold">{item.progressPercentage}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${item.progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="mt-4 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => setActiveCollabDetail(item)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
                      >
                        <Eye size={13} /> View Proposal Details
                      </button>

                      {(isActive || isCompleted) && (
                        <Link
                          to={`/collaboration-workspace/${item.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d3971] hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition active:scale-95"
                        >
                          <Layers size={14} />
                          OPEN WORKSPACE
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Collaboration Proposal Details Modal */}
      {activeCollabDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-blue-100 px-6 py-4 bg-blue-50/70">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                  {activeCollabDetail.id}
                </span>
                {getStatusBadge(activeCollabDetail.status)}
              </div>
              <button
                onClick={() => setActiveCollabDetail(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-100 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {activeCollabDetail.domain}
                </span>
                <h3 className="text-lg font-extrabold text-[#0d3971] mt-0.5">
                  {activeCollabDetail.projectName}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <GraduationCap size={14} className="text-blue-600" />
                  <span className="font-semibold text-slate-700">{activeCollabDetail.university}</span>
                  <span>•</span>
                  <MapPin size={13} className="text-slate-400" />
                  <span>{activeCollabDetail.district}</span>
                </p>
              </div>

              {/* Proposal Message */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0d3971] mb-1">
                  Submitted Collaboration Proposal
                </p>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{activeCollabDetail.message}"
                </p>
              </div>

              {/* Support & Timeline */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Collaboration Type</p>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {activeCollabDetail.collaborationType || "Technical Mentorship"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Request Date</p>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {activeCollabDetail.requestDate || "Recent"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveCollabDetail(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Close
                </button>

                {(String(activeCollabDetail.status).toUpperCase() === "ACTIVE" ||
                  String(activeCollabDetail.status).toUpperCase() === "ACCEPTED") && (
                  <Link
                    to={`/collaboration-workspace/${activeCollabDetail.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d3971] hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-xs transition"
                  >
                    <Layers size={14} /> Open Workspace
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCollaborationsPage;
