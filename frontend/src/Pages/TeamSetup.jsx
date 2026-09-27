import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiUsers, FiCheckCircle } from "react-icons/fi";
import { FaRocket } from "react-icons/fa";

import Sidebar from "../components/citizen-dashboard/Sidebar";
import Topbar from "../components/citizen-dashboard/Topbar";

const USER_STORAGE_KEY = "solvesphere_auth_user";
const PROBLEMS_STORAGE_KEY = "solvesphere_user_problems";

const TeamSetup = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mode, setMode] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [teams, setTeams] = useState([]);

  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("Team Leader");

  const [member, setMember] = useState({
    name: "",
    email: "",
    university: "",
    department: "",
    course: "",
    role: "Developer",
    skills: "",
  });

  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);

        setUniversity(parsedUser?.university || "");
        setDepartment(parsedUser?.department || "");
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }

    try {
      const savedProblems = localStorage.getItem(
        PROBLEMS_STORAGE_KEY
      );

      const problems = savedProblems
        ? JSON.parse(savedProblems)
        : [];

      const foundChallenge = problems.find(
        (problem) => problem.id === id
      );

      if (foundChallenge) {
        setChallenge(foundChallenge);
      }
    } catch (error) {
      console.error("Failed to load challenge:", error);
    }

    loadTeams();
  }, [id]);

  const loadTeams = () => {
    try {
      const myTeams = JSON.parse(
        localStorage.getItem("myTeams") || "[]"
      );

      const allTeams = myTeams.filter(
        (team) => team.challengeId === id
      );

      setTeams(allTeams);

      const userEmail = JSON.parse(
        localStorage.getItem(USER_STORAGE_KEY) || "{}"
      )?.email;

      if (userEmail) {
        const alreadyRequested = allTeams
          .filter((team) =>
            (team.joinRequests || []).some(
              (request) =>
                request.email === userEmail &&
                request.status === "pending"
            )
          )
          .map((team) => team.id);

        setSentRequests(alreadyRequested);
      }
    } catch (error) {
      console.error("Failed to load teams:", error);
    }
  };

  const challengeName =
    challenge?.title ||
    (id === "clean-water"
      ? "Clean Drinking Water in Rural Areas"
      : "Community Challenge");

  const createTeam = () => {
    if (!teamName.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const teamId = `team-${Date.now()}`;

      const teamCode = `SS-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

      const leader = {
        id: `member-${Date.now()}`,
        name: currentUser?.name || "You",
        email: currentUser?.email || "",
        university,
        department,
        course: "",
        role: "Team Leader",
        skills: "",
        avatar:
          currentUser?.name?.charAt(0)?.toUpperCase() || "Y",
      };

      const initialMembers = [leader];

      if (member.name.trim() && member.email.trim()) {
        initialMembers.push({
          id: `member-${Date.now()}-2`,
          name: member.name.trim(),
          email: member.email.trim(),
          university: member.university.trim(),
          department: member.department.trim(),
          course: member.course.trim(),
          role: member.role,
          skills: member.skills.trim(),
          avatar:
            member.name.trim().charAt(0).toUpperCase(),
        });
      }

      const team = {
        id: teamId,
        name: teamName.trim(),
        description: teamDescription.trim(),
        teamCode,
        challengeId: id,
        challengeName,
        leader,
        members: initialMembers,
        joinRequests: [],
        role: "Team Leader",
        progress: 18,
        deadline: "30 Sep 2026",
      };

      localStorage.setItem(
        `team-${teamId}`,
        JSON.stringify(team)
      );

      const existingTeams = JSON.parse(
        localStorage.getItem("myTeams") || "[]"
      );

      localStorage.setItem(
        "myTeams",
        JSON.stringify([...existingTeams, team])
      );

      setLoading(false);

      navigate(`/workspace/${teamId}`);
    }, 2000);
  };

  const requestToJoin = (team) => {
    if (!currentUser?.email) return;

    setRequestLoading(team.id);

    setTimeout(() => {
      try {
        const teamKey = `team-${team.id}`;
        const savedTeam = localStorage.getItem(teamKey);

        const latestTeam = savedTeam
          ? JSON.parse(savedTeam)
          : team;

        const existingRequests =
          latestTeam.joinRequests || [];

        const alreadyMember = (
          latestTeam.members || []
        ).some(
          (item) => item.email === currentUser.email
        );

        const alreadyRequested = existingRequests.some(
          (request) =>
            request.email === currentUser.email &&
            request.status === "pending"
        );

        if (!alreadyMember && !alreadyRequested) {
          const newRequest = {
            id: `request-${Date.now()}`,
            name: currentUser.name || "University Student",
            email: currentUser.email,
            university:
              currentUser.university || "",
            department:
              currentUser.department || "",
            course: currentUser.course || "",
            role: currentUser.role || "Member",
            skills: currentUser.skills || "",
            status: "pending",
            requestedAt: new Date().toISOString(),
          };

          const updatedTeam = {
            ...latestTeam,
            joinRequests: [
              ...existingRequests,
              newRequest,
            ],
          };

          localStorage.setItem(
            teamKey,
            JSON.stringify(updatedTeam)
          );

          const allMyTeams = JSON.parse(
            localStorage.getItem("myTeams") || "[]"
          );

          const updatedMyTeams = allMyTeams.map(
            (item) =>
              item.id === team.id
                ? {
                    ...item,
                    joinRequests:
                      updatedTeam.joinRequests,
                  }
                : item
          );

          localStorage.setItem(
            "myTeams",
            JSON.stringify(updatedMyTeams)
          );
        }

        setSentRequests((prev) =>
          prev.includes(team.id)
            ? prev
            : [...prev, team.id]
        );

        setRequestLoading(null);
      } catch (error) {
        console.error(
          "Failed to send join request:",
          error
        );

        setRequestLoading(null);
      }
    }, 2000);
  };

  const resetMode = () => {
    setMode(null);
    setTeamName("");
    setTeamDescription("");
    setRole("Team Leader");

    setMember({
      name: "",
      email: "",
      university: "",
      department: "",
      course: "",
      role: "Developer",
      skills: "",
    });
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

        <main className="flex min-h-[calc(100vh-70px)] items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/40 sm:p-9"
          >
            {!mode ? (
              <>
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                    <FiUsers className="h-7 w-7 text-emerald-500" />
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                    {challengeName}
                  </p>

                  <h1 className="mt-2 text-2xl font-bold text-slate-800">
                    Build Your Team
                  </h1>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                    Choose whether you want to create a new
                    team or join an existing team for this
                    challenge.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => setMode("create")}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <FaRocket className="h-6 w-6" />
                    </div>

                    <h2 className="mt-5 text-base font-bold text-slate-800">
                      Create New Team
                    </h2>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      Create your own team, become the team
                      leader and invite members to work on
                      this challenge.
                    </p>

                    <div className="mt-5 text-[10px] font-bold text-emerald-600">
                      Create Team →
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setMode("join");
                      loadTeams();
                    }}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FiUsers className="h-6 w-6" />
                    </div>

                    <h2 className="mt-5 text-base font-bold text-slate-800">
                      Join Existing Team
                    </h2>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      Find a team working specifically on
                      this challenge and send a request to
                      join them.
                    </p>

                    <div className="mt-5 text-[10px] font-bold text-blue-600">
                      Find Teams →
                    </div>
                  </button>
                </div>
              </>
            ) : mode === "create" ? (
              <>
                <button
                  onClick={resetMode}
                  className="mb-6 text-[10px] font-bold text-slate-400 transition hover:text-emerald-600"
                >
                  ← Back
                </button>

                <div className="mb-7">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <FaRocket className="h-6 w-6" />
                  </div>

                  <h1 className="text-2xl font-bold text-slate-800">
                    Create New Team
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Create your team for this challenge and
                    become its leader.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-600">
                      Team Name
                    </label>

                    <input
                      value={teamName}
                      onChange={(e) =>
                        setTeamName(e.target.value)
                      }
                      placeholder="e.g. AquaTech"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-600">
                      Team Description
                    </label>

                    <textarea
                      value={teamDescription}
                      onChange={(e) =>
                        setTeamDescription(e.target.value)
                      }
                      placeholder="Briefly describe your team's idea or focus..."
                      rows={3}
                      className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600">
                      Team Leader
                    </label>

                    <input
                      value={currentUser?.name || "You"}
                      readOnly
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600">
                      Leader Email
                    </label>

                    <input
                      value={currentUser?.email || ""}
                      readOnly
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600">
                      University
                    </label>

                    <input
                      value={university}
                      onChange={(e) =>
                        setUniversity(e.target.value)
                      }
                      placeholder="University name"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600">
                      Department / Course
                    </label>

                    <input
                      value={department}
                      onChange={(e) =>
                        setDepartment(e.target.value)
                      }
                      placeholder="e.g. CSE"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                    />
                  </div>
                </div>

                <div className="mt-7 border-t border-slate-100 pt-6">
                  <div className="mb-4">
                    <h2 className="text-sm font-bold text-slate-700">
                      Add Initial Member
                    </h2>

                    <p className="mt-1 text-[10px] text-slate-400">
                      You can also add members later from the
                      workspace.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      value={member.name}
                      onChange={(e) =>
                        setMember({
                          ...member,
                          name: e.target.value,
                        })
                      }
                      placeholder="Full Name"
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                    />

                    <input
                      value={member.email}
                      onChange={(e) =>
                        setMember({
                          ...member,
                          email: e.target.value,
                        })
                      }
                      placeholder="Email"
                      type="email"
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                    />

                    <input
                      value={member.university}
                      onChange={(e) =>
                        setMember({
                          ...member,
                          university: e.target.value,
                        })
                      }
                      placeholder="University"
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                    />

                    <input
                      value={member.department}
                      onChange={(e) =>
                        setMember({
                          ...member,
                          department: e.target.value,
                        })
                      }
                      placeholder="Department"
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                    />

                    <input
                      value={member.course}
                      onChange={(e) =>
                        setMember({
                          ...member,
                          course: e.target.value,
                        })
                      }
                      placeholder="Course"
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                    />

                    <select
                      value={member.role}
                      onChange={(e) =>
                        setMember({
                          ...member,
                          role: e.target.value,
                        })
                      }
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                    >
                      <option>Developer</option>
                      <option>Researcher</option>
                      <option>Designer</option>
                      <option>Community Member</option>
                    </select>

                    <input
                      value={member.skills}
                      onChange={(e) =>
                        setMember({
                          ...member,
                          skills: e.target.value,
                        })
                      }
                      placeholder="Skills e.g. React, AI, UI/UX"
                      className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                    />
                  </div>
                </div>

                <button
                  disabled={!teamName.trim() || loading}
                  onClick={createTeam}
                  className="mt-7 w-full rounded-xl bg-emerald-500 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Creating Team..."
                    : "Create Team & Continue →"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={resetMode}
                  className="mb-6 text-[10px] font-bold text-slate-400 transition hover:text-blue-600"
                >
                  ← Back
                </button>

                <div className="mb-7 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                    <FiUsers className="h-7 w-7 text-blue-500" />
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                    {challengeName}
                  </p>

                  <h1 className="mt-2 text-2xl font-bold text-slate-800">
                    Join Existing Team
                  </h1>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                    Only teams created for this challenge are
                    shown below.
                  </p>
                </div>

                {teams.length > 0 ? (
                  <div className="space-y-4">
                    {teams.map((team) => {
                      const hasRequested =
                        sentRequests.includes(team.id);

                      const memberCount =
                        team.members?.length ||
                        team.members ||
                        0;

                      return (
                        <div
                          key={team.id}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-base font-bold text-slate-800">
                                  {team.name}
                                </h2>

                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-600">
                                  {memberCount} Members
                                </span>
                              </div>

                              <p className="mt-2 text-xs leading-5 text-slate-400">
                                {team.description ||
                                  "University team working on this challenge."}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-[9px] font-semibold text-slate-500">
                                  Leader:{" "}
                                  {team.leader?.name ||
                                    "Team Leader"}
                                </span>

                                {team.teamCode && (
                                  <span className="rounded-lg bg-blue-50 px-3 py-1.5 font-mono text-[9px] font-bold text-blue-600">
                                    {team.teamCode}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              disabled={
                                hasRequested ||
                                requestLoading === team.id
                              }
                              onClick={() =>
                                requestToJoin(team)
                              }
                              className={`shrink-0 rounded-xl px-4 py-2.5 text-[10px] font-bold transition flex items-center gap-1 ${
                                hasRequested
                                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                  : "bg-blue-500 text-white hover:bg-blue-600"
                              }`}
                            >
                              {requestLoading === team.id ? (
                                "Sending Request..."
                              ) : hasRequested ? (
                                <>
                                  <FiCheckCircle className="h-3 w-3" /> Request Sent
                                </>
                              ) : (
                                "Request to Join"
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                      <FiUsers className="h-6 w-6" />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-600">
                      No teams available yet
                    </p>

                    <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-400">
                      No team has been created for this
                      challenge yet. You can create the first
                      team.
                    </p>

                    <button
                      onClick={() => setMode("create")}
                      className="mt-5 rounded-xl bg-emerald-500 px-5 py-2.5 text-[10px] font-bold text-white hover:bg-emerald-600"
                    >
                      Create New Team
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default TeamSetup;