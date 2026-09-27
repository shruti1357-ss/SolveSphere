import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";

import Sidebar from "../components/citizen-dashboard/Sidebar";
import Topbar from "../components/citizen-dashboard/Topbar";

import WorkspaceHeader from "../components/workspace/WorkspaceHeader";
import WorkspaceTabs from "../components/workspace/WorkspaceTabs";
import TaskBoard from "../components/workspace/TaskBoard";
import IdeaBoard from "../components/workspace/IdeaBoard";
import Discussion from "../components/workspace/Discussion";
import Resources from "../components/workspace/Resources";
import SolutionEditor from "../components/workspace/SolutionEditor";
import Members from "../components/workspace/Members";

const getDefaultTeam = (teamId) => ({
  id: teamId,
  name: "AquaTech",
  challengeName: "Clean Drinking Water in Rural Areas",
  members: [],
  progress: 64,
  deadline: "30 Sep 2026",
  role: "Team Leader",
  challengeId: "clean-water",
});

const getStoredTeam = (teamId) => {
  try {
    const savedTeam = localStorage.getItem(`team-${teamId}`);

    if (!savedTeam) {
      return getDefaultTeam(teamId);
    }

    const parsedTeam = JSON.parse(savedTeam);

    return {
      ...getDefaultTeam(teamId),
      ...parsedTeam,
      members: Array.isArray(parsedTeam.members)
        ? parsedTeam.members
        : [],
    };
  } catch (error) {
    console.error("Failed to load team:", error);
    return getDefaultTeam(teamId);
  }
};

const TeamWorkspace = () => {
  const { teamId } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [team, setTeam] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    try {
      const myTeams = JSON.parse(
        localStorage.getItem("myTeams") || "[]"
      );

      const foundTeam = myTeams.find(
        (item) => String(item.id) === String(id)
      );

      if (foundTeam) {
        setTeam(foundTeam);
      }

      const currentUser = JSON.parse(
        localStorage.getItem("solvesphere_auth_user") || "{}"
      );

      setUserEmail(currentUser?.email || "");
    } catch (error) {
      console.error("Failed to load workspace data:", error);
    }
  }, [id]);

  if (!team) {
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

          <main className="p-8 text-center">
            <h1 className="text-xl font-bold text-slate-800">
              Workspace Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              This workspace does not exist or you don't have access to it.
            </p>
          </main>
        </div>
      </div>
    );
  }

  const isLeader =
    team.leader?.email?.trim().toLowerCase() ===
    userEmail.trim().toLowerCase();

  const memberCount = Array.isArray(team.members)
    ? team.members.length
    : 1;

  const renderContent = () => {
    switch (activeTab) {
      case "tasks":
        return <Tasks isLeader={isLeader} />;

      case "ideas":
        return <Ideas isLeader={isLeader} />;

      case "discussion":
        return <Discussion userEmail={userEmail} />;

      case "resources":
        return <Resources />;

      case "solution":
        return <SolutionEditor />;

      case "members":
        return <Members />;

      default:
        return (
          <div>
            <div className="mb-6">
              <p className="text-xs text-slate-400">
                Welcome back
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                Team Overview
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Progress", `${team.progress}%`, <FiTrendingUp className="h-5 w-5 text-emerald-500" />],
                ["Tasks", "8", <FiCheckCircle className="h-5 w-5 text-blue-500" />],
                ["Ideas", "12", <FiLightbulb className="h-5 w-5 text-amber-500" />],
                ["Members", memberCount, <FiUsers className="h-5 w-5 text-purple-500" />],
              ].map(([label, value, icon]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {label}
                    </span>

                    <span className="text-lg">
                      {icon}
                    </span>
                  </div>

                  <p className="mt-3 text-2xl font-bold text-slate-800">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Solution Progress
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Overall team progress
                    </p>
                  </div>

                  <span className="text-sm font-bold text-emerald-600">
                    {team.progress}%
                  </span>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${team.progress}%`,
                    }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-emerald-500"
                  />
                </div>

                <div className="mt-5 flex justify-between text-[10px] text-slate-400">
                  <span>Started</span>
                  <span>In Progress</span>
                  <span>Submission</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-sm font-bold text-slate-800">
                  Recent Activity
                </h3>

                <div className="mt-5 space-y-4">
                  {[
                    "Priya added a new research resource",
                    "Rahul completed a task",
                    "Aman submitted a new idea",
                    "You updated the solution draft",
                  ].map((activity) => (
                    <div
                      key={activity}
                      className="flex gap-3"
                    >
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

                      <p className="text-xs text-slate-500">
                        {activity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-sm font-bold text-slate-800">
                Quick Actions
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab("tasks")}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-[10px] font-bold text-white"
                >
                  + Create Task
                </button>

                <button
                  onClick={() => setActiveTab("ideas")}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-[10px] font-bold text-slate-600 flex items-center gap-1.5"
                >
                  <FiLightbulb className="h-3.5 w-3.5 text-amber-500" /> Add Idea
                </button>

                <button
                  onClick={() => setActiveTab("discussion")}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-[10px] font-bold text-slate-600 flex items-center gap-1.5"
                >
                  <FiMessageSquare className="h-3.5 w-3.5 text-blue-500" /> Discuss
                </button>

                <button
                  onClick={() => setActiveTab("solution")}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-[10px] font-bold text-slate-600 flex items-center gap-1.5"
                >
                  <FiEdit3 className="h-3.5 w-3.5 text-emerald-500" /> Edit Solution
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

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

        <WorkspaceHeader team={team} />

        <WorkspaceTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="px-4 py-6 sm:px-6 lg:p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default TeamWorkspace;