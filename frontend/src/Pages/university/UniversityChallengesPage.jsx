import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Users, Clock3, ArrowRight, CheckCircle2 } from "lucide-react";
import Sidebar from "../../components/citizen-dashboard/Sidebar";
import Topbar from "../../components/citizen-dashboard/Topbar";
import { useAuth } from "../../context/AuthContext";
import { getUniversityAssignedChallenges } from "../../utils/universityProfileUtils";

export default function UniversityChallengesPage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setVersion((v) => v + 1);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("solvesphere_university_updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("solvesphere_university_updated", handleUpdate);
    };
  }, []);

  const allChallenges = useMemo(() => getUniversityAssignedChallenges(user), [user, version]);

  const categories = useMemo(() => {
    return ["All", ...new Set(allChallenges.map((x) => x.category).filter(Boolean))];
  }, [allChallenges]);

  const data = useMemo(() => {
    return allChallenges.filter((x) => {
      const q = search.toLowerCase();
      const matchesCategory = category === "All" || x.category === category;
      const matchesSearch = [x.id, x.title, x.location, x.category, x.district].some((v) =>
        (v || "").toLowerCase().includes(q)
      );
      return matchesCategory && matchesSearch;
    });
  }, [allChallenges, search, category]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="lg:ml-64">
        <Topbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="p-5 lg:p-7">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">University Workspace</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Accepted & Assigned Challenges</h1>
            <p className="mt-1 text-sm text-slate-500">
              Civic problems assigned by district government matching your registered expertise.
            </p>
          </div>

          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search challenge, location or category"
                className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-400"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-600">{item.id}</span>
                    <h2 className="mt-1 text-base font-bold text-slate-900">{item.title}</h2>
                    {item.description && (
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                    <CheckCircle2 size={13} /> {item.rawStatus || "Assigned"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><MapPin size={14} />{item.location}</span>
                  <span className="flex items-center gap-1.5"><Users size={14} />{item.team} members</span>
                  <span className="flex items-center gap-1.5"><Clock3 size={14} />{item.updated}</span>
                  <span className="font-semibold text-slate-600">{item.category}</span>
                </div>

                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Project progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                    {item.status}
                  </span>
                  <Link
                    to={`/university-dashboard/my-projects?challenge=${item.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
                  >
                    Open Project <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {data.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
              No assigned challenges match your search or filter.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
