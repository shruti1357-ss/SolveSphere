import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ChevronRight,
  FileBarChart2,
  GraduationCap,
  Lightbulb,
  MapPin,
  Search,
  Sparkles,
  X,
  ExternalLink,
  Mail,
  Users,
  CheckCircle2,
} from "lucide-react";
import Sidebar from "../../components/citizen-dashboard/Sidebar";
import Topbar from "../../components/citizen-dashboard/Topbar";
import { useAuth } from "../../context/AuthContext";
import universityBanner from "../../assets/university-banner.png";
import {
  getUniversityProfile,
  getUniversityExpertiseAreas,
  getUniversityAssignedChallenges,
  getUniversityRealStats,
  getUniversityCategoryDistribution,
  getUniversityExpertiseDistribution,
} from "../../utils/universityProfileUtils";

const DISTRICT_PEERS = [
  {
    id: "nit-jsr",
    name: "NIT Jamshedpur",
    district: "East Singhbhum",
    areas: "Smart Water Distribution, Clean Energy, AI/ML IoT Systems",
    score: "94%",
    departments: "Civil Engineering, Electrical & Electronics, Computer Science",
    contact: "dean.research@nitjsr.ac.in",
    papers: 42,
    activeProjects: 6,
  },
  {
    id: "bit-mesra",
    name: "BIT Mesra, Ranchi",
    district: "Ranchi",
    areas: "Autonomous Robotics, Renewable Microgrids, Environmental Remote Sensing",
    score: "89%",
    departments: "Mechanical Engineering, Space Eng., Robotics & Automation",
    contact: "research@bitmesra.ac.in",
    papers: 58,
    activeProjects: 8,
  },
  {
    id: "iit-dhanbad",
    name: "IIT (ISM) Dhanbad",
    district: "Dhanbad",
    areas: "Geo-Hydrology, Clean Tech, Sustainable Urban Infrastructure, Mining Safety",
    score: "86%",
    departments: "Environmental Engineering, Geo-Informatics, Applied Geology",
    contact: "rd@iitism.ac.in",
    papers: 67,
    activeProjects: 9,
  },
  {
    id: "iiit-ranchi",
    name: "IIIT Ranchi",
    district: "Ranchi",
    areas: "AI/ML, Smart Agriculture, Cyber-Physical Systems, Data Analytics",
    score: "82%",
    departments: "Computer Science & Engineering, Data Science",
    contact: "director@iiitranchi.ac.in",
    papers: 29,
    activeProjects: 4,
  },
  {
    id: "cuj-ranchi",
    name: "Central University of Jharkhand",
    district: "Ranchi",
    areas: "Water Resource Mgmt, Tribal Development Studies, Green Nanomaterials",
    score: "78%",
    departments: "Centre for Water Engineering, Environmental Sciences",
    contact: "academic@cuj.ac.in",
    papers: 34,
    activeProjects: 5,
  },
];

const priorityClass = {
  Critical: "bg-red-50 text-red-700 border-red-100",
  High: "bg-rose-50 text-rose-600 border-rose-100",
  Medium: "bg-amber-50 text-amber-700 border-amber-100",
  Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

const statusClass = {
  "In Progress": "bg-blue-50 text-blue-700",
  Accepted: "bg-emerald-50 text-emerald-700",
  Research: "bg-violet-50 text-violet-700",
  Prototype: "bg-emerald-50 text-emerald-700",
  "Field Study": "bg-amber-50 text-amber-700",
  "Awaiting Response": "bg-amber-50 text-amber-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

export default function UniversityDashboardPage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [version, setVersion] = useState(0);
  const [selectedPeer, setSelectedPeer] = useState(null);

  // Re-sync when assignments or profile changes
  useEffect(() => {
    const handleUpdate = () => setVersion((v) => v + 1);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("solvesphere_university_updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("solvesphere_university_updated", handleUpdate);
    };
  }, []);

  const profile = useMemo(() => getUniversityProfile(user), [user, version]);
  const universityName = profile.universityName || user?.organization || user?.name || "University Research Hub";
  const universityDistrict = profile.district || user?.district || "Jharkhand";

  const challenges = useMemo(() => getUniversityAssignedChallenges(user), [user, version]);
  const stats = useMemo(() => getUniversityRealStats(user), [user, version]);
  const categoryDistribution = useMemo(() => getUniversityCategoryDistribution(user, challenges), [user, challenges, version]);
  const expertiseDistribution = useMemo(() => getUniversityExpertiseDistribution(user, challenges), [user, challenges, version]);
  const expertiseAreas = useMemo(() => getUniversityExpertiseAreas(user), [user, version]);

  const districtPeers = useMemo(() => {
    const currentName = String(universityName).trim().toLowerCase();
    const list = DISTRICT_PEERS.filter(
      (p) => !currentName.includes(p.name.toLowerCase()) && !p.name.toLowerCase().includes(currentName)
    );
    return list.length > 0 ? list : DISTRICT_PEERS;
  }, [universityName]);

  const maxCategoryCount = useMemo(() => {
    const maxVal = Math.max(1, ...categoryDistribution.map((c) => c[1]));
    return maxVal;
  }, [categoryDistribution]);

  // Recent accepted / active challenges
  const acceptedChallenges = useMemo(() => {
    const active = challenges.filter(
      (c) => c.rawStatus === "ACCEPTED" || c.status === "In Progress" || c.status === "Research" || c.status === "Prototype" || c.status === "Field Study"
    );
    return active.length > 0 ? active : challenges;
  }, [challenges]);

  const filteredChallenges = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return acceptedChallenges.slice(0, 5);
    return acceptedChallenges.filter((item) =>
      [item.id, item.title, item.location, item.category].some((v) => (v || "").toLowerCase().includes(q))
    );
  }, [acceptedChallenges, query]);

  return (
    <div className="min-h-screen bg-[#f6f9fc] font-sans text-slate-800">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="ml-0 lg:ml-64">
        <Topbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="space-y-5 px-4 py-5 sm:px-6 lg:p-7">
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl border border-blue-100 bg-[#eaf4ff] min-h-[150px]">
            <img src={universityBanner} alt="University campus" className="absolute inset-0 h-full w-full object-cover object-center opacity-85" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#eaf4ff] via-[#eaf4ff]/90 to-transparent" />
            <div className="relative z-10 max-w-xl p-6 sm:p-7">
              <p className="text-sm font-medium text-slate-600">Welcome back, {user?.name || "Research Department"}!</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0d3970] sm:text-3xl">University Research & Innovation Hub</h1>
              <p className="mt-2 text-sm leading-5 text-slate-600">Here&apos;s an overview of civic challenges assigned by district government matching your registered expertise.</p>
            </div>
            <div className="absolute right-5 top-5 hidden rounded-xl border border-blue-100 bg-white/85 px-5 py-3 shadow-sm backdrop-blur md:block">
              <div className="flex items-center gap-2 text-sm font-bold text-[#124b87]"><MapPin size={17} /> {universityName}</div>
              <p className="ml-6 text-xs text-slate-500">{universityDistrict}, Jharkhand</p>
            </div>
          </motion.section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Assigned Challenges", String(stats.totalAssigned), `+${stats.newAssignedThisWeek} active`, Lightbulb, "bg-blue-50 text-blue-600"],
              ["Ongoing Projects", String(stats.ongoingProjects), `+${stats.newOngoingThisWeek} in progress`, FileBarChart2, "bg-emerald-50 text-emerald-600"],
              ["Completed Projects", String(stats.completedProjects), stats.completedProjects > 0 ? `+${stats.completedProjects} resolved` : "0 completed", GraduationCap, "bg-blue-50 text-blue-600"],
              ["Total Research Areas", String(stats.totalResearchAreas), "Registered domains", BookOpen, "bg-amber-50 text-amber-600"],
            ].map(([title, value, note, Icon, iconClass]) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
                    <p className="mt-1 text-xs font-semibold text-emerald-600">↑ {note}</p>
                  </div>
                  <span className={`flex h-11 w-11 items-center justify-center rounded-full ${iconClass}`}><Icon size={22} /></span>
                </div>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_1fr_280px]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900">Challenges by Category</h2>
                  <p className="text-xs text-slate-500">Real problems assigned matching your registered expertise</p>
                </div>
                <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {challenges.length} Total
                </span>
              </div>
              <div className="flex h-48 items-end justify-between gap-3 border-b border-slate-100 px-2">
                {categoryDistribution.map(([name, count]) => {
                  const heightPercent = Math.min(100, Math.max(20, Math.round((count / maxCategoryCount) * 100)));
                  return (
                    <div key={name} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                      <span className="text-xs font-bold text-slate-600">{count}</span>
                      <div
                        className="w-full max-w-10 rounded-t-md bg-blue-500 transition-all duration-500"
                        style={{ height: `${heightPercent}%` }}
                        title={`${name}: ${count}`}
                      />
                      <span className="h-9 truncate text-center text-[9px] font-medium leading-3 text-slate-500" title={name}>
                        {name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900">Your Expertise Areas</h2>
                  <p className="text-xs text-slate-500">Selected during university registration</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-blue-500 bg-blue-50/50">
                  <span className="text-base font-bold text-blue-700">{expertiseAreas.length}</span>
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                {expertiseDistribution.map(([name, pct]) => (
                  <div key={name} className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
                    <span className="flex-1 truncate text-slate-600 font-medium" title={name}>{name}</span>
                    <span className="font-bold text-slate-700">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 font-bold text-slate-900">
                <Sparkles size={17} className="text-blue-600" /> Quick Actions
              </h2>
              <div className="space-y-2">
                {[
                  ["View Accepted Challenges", "/university-dashboard/challenges", Search],
                  ["Manage Projects", "/university-dashboard/my-projects", FileBarChart2],
                  ["Update Research Areas", "/university-dashboard/profile?edit=research", BookOpen],
                  ["View Reports", "/university-dashboard/reports-analytics", FileBarChart2],
                ].map(([label, path, Icon]) => (
                  <Link key={label} to={path} className="flex items-center gap-3 rounded-xl border border-white bg-white px-3 py-3 text-xs font-semibold text-slate-700 shadow-sm hover:border-blue-200 hover:bg-slate-50 transition">
                    <Icon size={17} className="text-blue-600" />
                    <span className="flex-1">{label}</span>
                    <ChevronRight size={15} />
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-bold text-slate-900">Assigned & Active Challenges</h2>
                  <p className="text-xs text-slate-500">Government challenges assigned to your university.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search challenges"
                      className="w-44 rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-xs outline-none focus:border-blue-400"
                    />
                  </div>
                  <Link to="/university-dashboard/challenges" className="text-xs font-bold text-blue-600">View All</Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3">ID</th>
                      <th className="px-3 py-3">Issue</th>
                      <th className="px-3 py-3">Location</th>
                      <th className="px-3 py-3">Category</th>
                      <th className="px-3 py-3">Priority</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-5 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChallenges.map((item) => (
                      <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                        <td className="px-5 py-4 font-mono font-bold text-blue-600">{item.id}</td>
                        <td className="px-3 py-4 font-semibold text-slate-700 max-w-xs truncate">{item.title}</td>
                        <td className="px-3 py-4 text-slate-500">{item.location}</td>
                        <td className="px-3 py-4 text-slate-500">{item.category}</td>
                        <td className="px-3 py-4">
                          <span className={`rounded-full border px-2 py-1 text-[10px] font-bold ${priorityClass[item.priority] || priorityClass.Medium}`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusClass[item.status] || "bg-slate-100 text-slate-700"}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            to={`/university-dashboard/my-projects?challenge=${item.id}`}
                            className="rounded-lg border border-blue-200 px-3 py-1.5 text-[10px] font-bold text-blue-600 hover:bg-blue-50"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900">District Research Peers</h2>
                  <p className="text-[11px] text-slate-400">Jharkhand State Academic R&D Network</p>
                </div>
                <Link
                  to="/university-dashboard/profile"
                  className="rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 hover:text-blue-800 transition"
                >
                  View Profile
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {districtPeers.slice(0, 4).map((peer) => (
                  <div
                    key={peer.id || peer.name}
                    onClick={() => setSelectedPeer(peer)}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 hover:border-blue-200 hover:bg-blue-50/40 cursor-pointer transition group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                      <Building2 size={19} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-xs font-bold text-slate-800 group-hover:text-blue-700 transition">
                          {peer.name}
                        </p>
                        <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.2 text-[9px] font-medium text-slate-600">
                          {peer.district}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[10px] text-slate-400 font-medium">
                        {peer.areas}
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-50 border border-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">
                      {peer.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <div className="mr-2 flex items-center gap-2 font-bold text-slate-900">
                <BookOpen size={17} className="text-blue-600" /> Registered Research Areas
              </div>
              {expertiseAreas.map((tag) => (
                <span key={tag} className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1.5 text-[10px] font-semibold text-blue-700">
                  {tag}
                </span>
              ))}
              <Link to="/university-dashboard/profile?edit=research" className="ml-auto inline-flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50">
                Manage Research Areas <ArrowRight size={13} />
              </Link>
            </div>
          </section>

          {/* Peer Institutional Research Profile Modal */}
          <AnimatePresence>
            {selectedPeer && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4"
                >
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{selectedPeer.name}</h3>
                        <p className="text-xs text-slate-500">District: {selectedPeer.district}, Jharkhand</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPeer(null)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                      <span className="text-[10px] font-bold text-blue-700 uppercase">Research Match</span>
                      <p className="text-lg font-black text-blue-900">{selectedPeer.score}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Verified Publications</span>
                      <p className="text-lg font-black text-slate-800">{selectedPeer.papers || 35}+ Papers</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Specialized Research Areas
                    </label>
                    <p className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3 leading-relaxed">
                      {selectedPeer.areas}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Lead Departments & Faculty
                    </label>
                    <p className="text-xs text-slate-600">
                      {selectedPeer.departments}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <Mail size={14} className="text-blue-600" />
                    <span>Official Point of Contact: <span className="font-semibold text-slate-700">{selectedPeer.contact}</span></span>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPeer(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Close
                    </button>
                    <Link
                      to="/university-dashboard/collaboration-requests"
                      className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                    >
                      Collaborate
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
