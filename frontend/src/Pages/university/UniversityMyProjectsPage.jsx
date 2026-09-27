import { useEffect, useMemo, useState } from "react";
import { Check, X, MapPin, Tag, Clock } from "lucide-react";
import Sidebar from "../../components/citizen-dashboard/Sidebar";
import Topbar from "../../components/citizen-dashboard/Topbar";
import { useAuth } from "../../context/AuthContext";
import { updateUniversityProjectProgress } from "../../utils/problemLifecycleUtils";

const STORAGE_KEY = "solvesphere_university_assignments";

const readAssignments = () => {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const getUniversityKey = (user) =>
  String(user?.organization || user?.university || user?.name || user?.email || "")
    .trim()
    .toLowerCase();

export default function UniversityMyProjectsPage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [assignments, setAssignments] = useState(readAssignments);

  const refresh = () => setAssignments(readAssignments());

  useEffect(() => {
    const currentKey = getUniversityKey(user);
    if (currentKey) {
      const existing = readAssignments();
      const hasMyAssignment = existing.some((item) => {
        const assigned = String(item?.assignedUniversity || "").trim().toLowerCase();
        return assigned && (assigned === currentKey || assigned === String(user?.email || "").trim().toLowerCase());
      });

      if (!hasMyAssignment) {
        const demoAssignment = {
          challengeId: "DEMO-GOV-001",
          assignedUniversity: user?.organization || user?.university || user?.name || user?.email,
          status: "PENDING",
          assignedAt: new Date().toISOString(),
          challenge: {
            id: "DEMO-GOV-001",
            title: "Clean Drinking Water in Rural Area",
            description: "Government-assigned challenge to improve access to safe and reliable drinking water in rural communities through an affordable, scalable solution.",
            category: "Water & Sanitation",
            location: "Jharkhand",
            district: "East Singhbhum",
            priority: "High",
          },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, demoAssignment]));
      }
    }

    refresh();
    window.addEventListener("storage", refresh);
    const timer = setInterval(refresh, 1000);
    return () => {
      window.removeEventListener("storage", refresh);
      clearInterval(timer);
    };
  }, [user]);

  const myProjects = useMemo(() => {
    const key = getUniversityKey(user);
    return assignments.filter((item) => {
      const assigned = String(item?.assignedUniversity || "").trim().toLowerCase();
      return assigned && (assigned === key || assigned === String(user?.email || "").trim().toLowerCase());
    });
  }, [assignments, user]);

  const updateStatus = (challengeId, status) => {
    const universityName =
      user?.organization || user?.university || user?.name || user?.email || "University";
    const updated = assignments.map((item) =>
      String(item.challengeId) === String(challengeId)
        ? {
            ...item,
            status,
            updatedAt: new Date().toISOString(),
            ...(status === "REJECTED"
              ? { rejectedBy: universityName, rejectedAt: new Date().toISOString() }
              : {}),
          }
        : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setAssignments(updated);

    updateUniversityProjectProgress(challengeId, {
      status,
      progress: status === "ACCEPTED" ? 50 : 25,
      stage: status === "ACCEPTED" ? "Active Solution Development" : "Assigned to University",
    });

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("solvesphere_university_updated"));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="ml-0 lg:ml-64">
        <Topbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="w-full space-y-6 px-4 py-6 sm:px-6 lg:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">University Projects</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">My Projects</h1>
            <p className="mt-1 text-sm text-slate-500">Government-assigned problems and challenges for your university.</p>
          </div>

          {myProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h2 className="text-base font-bold text-slate-700">No projects assigned yet</h2>
              <p className="mt-1 text-sm text-slate-400">Government-assigned challenges will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {myProjects.map((item) => {
                const challenge = item.challenge || {};
                const pending = item.status === "PENDING";
                return (
                  <article key={item.challengeId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex rounded-full bg-blue-50 border border-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                          {pending ? "AWAITING RESPONSE" : item.status}
                        </span>
                        <h2 className="mt-2 text-lg font-extrabold text-slate-900">{challenge.title || "Assigned Challenge"}</h2>
                      </div>
                      <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 font-mono text-[10px] font-bold text-slate-500">#{item.challengeId}</span>
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{challenge.description || "No description available."}</p>

                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{challenge.location || challenge.district || "Location not specified"}</span>
                      <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5" />{challenge.category || "General"}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{challenge.priority || "Medium"}</span>
                    </div>

                    {pending ? (
                      <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                        <button onClick={() => updateStatus(item.challengeId, "REJECTED")} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50">
                          <X className="h-4 w-4" /> Reject
                        </button>
                        <button onClick={() => updateStatus(item.challengeId, "ACCEPTED")} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-xs">
                          <Check className="h-4 w-4" /> Accept
                        </button>
                      </div>
                    ) : (
                      <div className={`mt-5 rounded-xl px-4 py-3 text-xs font-bold border ${item.status === "ACCEPTED" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                        {item.status === "ACCEPTED" ? "Accepted — available in My Workspace." : "Rejected — this challenge will not enter My Workspace."}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
