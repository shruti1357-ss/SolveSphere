import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRocket } from "react-icons/fa";
import { CheckCircle2 } from "lucide-react";

import Sidebar from "../components/citizen-dashboard/Sidebar";
import Topbar from "../components/citizen-dashboard/Topbar";

const getCurrentUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem("solvesphere_auth_user") || "null"
    );
  } catch {
    return null;
  }
};

const getAllTeams = () => {
  try {
    const teams = JSON.parse(
      localStorage.getItem("myTeams") || "[]"
    );

    return Array.isArray(teams) ? teams : [];
  } catch {
    return [];
  }
};

const MyWorkspace = () => {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [allTeams, setAllTeams] = useState(getAllTeams());
  const [acceptedProjects, setAcceptedProjects] = useState([]);

  useEffect(() => {
    const refreshData = () => {
      setCurrentUser(getCurrentUser());
      setAllTeams(getAllTeams());
      try {
        const assignments = JSON.parse(localStorage.getItem("solvesphere_university_assignments") || "[]");
        setAcceptedProjects(Array.isArray(assignments)
          ? assignments.filter((item) => item?.status === "ACCEPTED")
          : []);
      } catch {
        setAcceptedProjects([]);
      }
    };

    refreshData();

    window.addEventListener("storage", refreshData);

    const interval = setInterval(refreshData, 1000);

    return () => {
      window.removeEventListener("storage", refreshData);
      clearInterval(interval);
    };
  }, []);

  const currentUserEmail = currentUser?.email
    ?.trim()
    .toLowerCase();

  const userTeams = allTeams.filter((team) => {
    if (!team) return false;

    const leaderEmail = team?.leader?.email
      ?.trim()
      .toLowerCase();

    const members = Array.isArray(team?.members)
      ? team.members
      : [];

    const isLeader =
      leaderEmail &&
      currentUserEmail &&
      leaderEmail === currentUserEmail;

    const isMember = members.some(
      (member) =>
        member?.email?.trim().toLowerCase() === currentUserEmail
    );

    return isLeader || isMember;
  });

  const universityKey = String(
    currentUser?.organization || currentUser?.university || currentUser?.name || currentUser?.email || ""
  ).trim().toLowerCase();

  const userAcceptedProjects = acceptedProjects.filter((item) => {
    const assigned = String(item?.assignedUniversity || "").trim().toLowerCase();
    return assigned && (assigned === universityKey || assigned === String(currentUser?.email || "").trim().toLowerCase());
  });

  const formattedTeams = userTeams.map((team) => {
    const members = Array.isArray(team?.members)
      ? team.members
      : [];

    const joinRequests = Array.isArray(team?.joinRequests)
      ? team.joinRequests
      : [];

    const pendingRequests = joinRequests.filter(
      (request) => request?.status === "pending"
    );

    const leaderEmail = team?.leader?.email
      ?.trim()
      .toLowerCase();

    const isLeader =
      leaderEmail &&
      currentUserEmail &&
      leaderEmail === currentUserEmail;

    return {
      ...team,
      memberCount: members.length,
      pendingRequests: pendingRequests.length,
      isLeader,
    };
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="ml-0 lg:ml-64">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="px-4 py-6 sm:px-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">
              Collaboration
            </span>

            <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
              My Workspace
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Continue working on the challenges you've joined.
            </p>
          </motion.div>

          {userAcceptedProjects.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-3 text-base font-bold text-slate-800">Government Assigned Challenges</h2>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {userAcceptedProjects.map((item) => (
                  <motion.div key={`government-${item.challengeId}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[9px] font-bold text-blue-700">ACCEPTED</span>
                    </div>
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-blue-600">Government Challenge</p>
                    <h3 className="mt-1 text-base font-bold text-slate-800">{item.challenge?.title || "Assigned Challenge"}</h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">{item.challenge?.description || "No description available."}</p>
                    <button onClick={() => navigate(`/challenges/${item.challengeId}`)} className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-[11px] font-bold text-white hover:bg-blue-600 transition">Open Challenge →</button>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {formattedTeams.length === 0 && userAcceptedProjects.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div className="flex justify-center text-4xl text-blue-600">
                <FaRocket size={40} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-800">
                No Workspace Yet
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Join or create a team to start working on a challenge.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {formattedTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <FaRocket className="h-6 w-6" />
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-bold text-emerald-600">
                      ACTIVE
                    </span>
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                    Team
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-800">
                    {team.name || "Unnamed Team"}
                  </h2>

                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                    {team.challengeName || "Challenge"}
                  </p>

                  {team.isLeader && team.pendingRequests > 0 && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-amber-700">
                          Join Request
                          {team.pendingRequests > 1 ? "s" : ""}
                        </p>

                        <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[9px] font-bold text-amber-800">
                          {team.pendingRequests}
                        </span>
                      </div>

                      <p className="mt-1 text-[9px] text-amber-600">
                        New member request
                        {team.pendingRequests > 1 ? "s are" : " is"}{" "}
                        waiting for your approval.
                      </p>
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-[9px] text-slate-400">
                        Role
                      </p>

                      <p className="mt-1 text-[10px] font-semibold text-slate-600">
                        {team.isLeader
                          ? "Team Leader"
                          : "Member"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-400">
                        Members
                      </p>

                      <p className="mt-1 text-[10px] font-semibold text-slate-600">
                        {team.memberCount}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-400">
                        Deadline
                      </p>

                      <p className="mt-1 text-[10px] font-semibold text-slate-600">
                        {team.deadline || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between">
                      <span className="text-[10px] font-semibold text-slate-500">
                        Progress
                      </span>

                      <span className="text-[10px] font-bold text-blue-600">
                        {team.progress || 0}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                          width: `${team.progress || 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/workspace/${team.id}`)
                    }
                    className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-[11px] font-bold text-white transition hover:bg-blue-600"
                  >
                    {team.isLeader && team.pendingRequests > 0
                      ? "Review Team Requests →"
                      : "Open Workspace →"}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyWorkspace;