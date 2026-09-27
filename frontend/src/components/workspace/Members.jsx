import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Check, UserPlus, X } from "lucide-react";

const USER_STORAGE_KEY = "solvesphere_auth_user";

const getCurrentUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem(USER_STORAGE_KEY) || "null"
    );
  } catch {
    return null;
  }
};

const getTeam = (teamId) => {
  try {
    const savedTeam = localStorage.getItem(`team-${teamId}`);

    if (!savedTeam) return null;

    return JSON.parse(savedTeam);
  } catch {
    return null;
  }
};

const getAllTeams = () => {
  try {
    return JSON.parse(
      localStorage.getItem("myTeams") || "[]"
    );
  } catch {
    return [];
  }
};

const Members = () => {
  const { teamId } = useParams();

  const [team, setTeam] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingRequestId, setLoadingRequestId] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    const savedTeam = getTeam(teamId);

    setCurrentUser(user);
    setTeam(savedTeam);
  }, [teamId]);

  const saveTeam = (updatedTeam) => {
    localStorage.setItem(
      `team-${teamId}`,
      JSON.stringify(updatedTeam)
    );

    const allTeams = getAllTeams();

    const teamExists = allTeams.some(
      (item) => item.id === teamId
    );

    const updatedAllTeams = teamExists
      ? allTeams.map((item) =>
          item.id === teamId ? updatedTeam : item
        )
      : [...allTeams, updatedTeam];

    localStorage.setItem(
      "myTeams",
      JSON.stringify(updatedAllTeams)
    );

    setTeam(updatedTeam);
  };

  if (!team) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">
          Team information not found.
        </p>
      </div>
    );
  }

  const members = Array.isArray(team.members)
    ? team.members
    : [];

  const joinRequests = Array.isArray(team.joinRequests)
    ? team.joinRequests
    : [];

  const pendingRequests = joinRequests.filter(
    (request) => request.status === "pending"
  );

  const leaderEmail =
    team?.leader?.email?.trim().toLowerCase();

  const currentUserEmail =
    currentUser?.email?.trim().toLowerCase();

  const isLeader =
    Boolean(leaderEmail) &&
    Boolean(currentUserEmail) &&
    leaderEmail === currentUserEmail;

  const handleAccept = (request) => {
    if (!isLeader || loadingRequestId) return;

    setLoadingRequestId(request.id);

    setTimeout(() => {
      try {
        const latestTeam = getTeam(teamId) || team;

        const latestMembers = Array.isArray(
          latestTeam.members
        )
          ? latestTeam.members
          : [];

        const latestRequests = Array.isArray(
          latestTeam.joinRequests
        )
          ? latestTeam.joinRequests
          : [];

        const requestEmail =
          request?.email?.trim().toLowerCase();

        const alreadyMember = latestMembers.some(
          (member) =>
            member?.email?.trim().toLowerCase() ===
            requestEmail
        );

        let updatedMembers = latestMembers;

        if (!alreadyMember) {
          updatedMembers = [
            ...latestMembers,
            {
              id:
                request.id ||
                `member-${Date.now()}`,
              name: request.name || "Team Member",
              email: request.email || "",
              university: request.university || "",
              department: request.department || "",
              course: request.course || "",
              role: request.role || "Member",
              skills: request.skills || "",
              avatar:
                request.name
                  ?.charAt(0)
                  ?.toUpperCase() || "M",
            },
          ];
        }

        const updatedRequests = latestRequests.map(
          (item) =>
            item.id === request.id
              ? {
                  ...item,
                  status: "accepted",
                  respondedAt:
                    new Date().toISOString(),
                }
              : item
        );

        const updatedTeam = {
          ...latestTeam,
          members: updatedMembers,
          joinRequests: updatedRequests,
        };

        saveTeam(updatedTeam);
      } catch (error) {
        console.error(
          "Failed to accept join request:",
          error
        );
      } finally {
        setLoadingRequestId(null);
      }
    }, 2000);
  };

  const handleReject = (request) => {
    if (!isLeader || loadingRequestId) return;

    setLoadingRequestId(request.id);

    setTimeout(() => {
      try {
        const latestTeam = getTeam(teamId) || team;

        const latestRequests = Array.isArray(
          latestTeam.joinRequests
        )
          ? latestTeam.joinRequests
          : [];

        const updatedRequests = latestRequests.map(
          (item) =>
            item.id === request.id
              ? {
                  ...item,
                  status: "rejected",
                  respondedAt:
                    new Date().toISOString(),
                }
              : item
        );

        const updatedTeam = {
          ...latestTeam,
          joinRequests: updatedRequests,
        };

        saveTeam(updatedTeam);
      } catch (error) {
        console.error(
          "Failed to reject join request:",
          error
        );
      } finally {
        setLoadingRequestId(null);
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* TEAM MEMBERS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Team Members
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              People currently working on this challenge.
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <UserPlus size={18} />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {members.length === 0 ? (
            <p className="py-5 text-center text-xs text-slate-400">
              No members found.
            </p>
          ) : (
            members.map((member, index) => (
              <div
                key={
                  member?.id ||
                  member?.email ||
                  index
                }
                className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {(member?.name || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-700">
                      {member?.name ||
                        "Unknown Member"}
                    </p>

                    <p className="truncate text-[10px] text-slate-400">
                      {member?.email ||
                        "No email"}
                    </p>

                    <p className="mt-1 text-[9px] text-slate-400">
                      {member?.role || "Member"}
                    </p>
                  </div>
                </div>

                {member?.email
                  ?.trim()
                  .toLowerCase() ===
                  leaderEmail && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-bold text-emerald-600">
                    LEADER
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* JOIN REQUESTS */}
      {isLeader && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Join Requests
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Students requesting to join your team.
              </p>
            </div>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-600">
              {pendingRequests.length} Pending
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                <p className="text-xs text-slate-400">
                  No pending join requests.
                </p>
              </div>
            ) : (
              pendingRequests.map((request) => {
                const isProcessing =
                  loadingRequestId === request.id;

                return (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                          {(request.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-slate-800">
                            {request.name ||
                              "University Student"}
                          </h3>

                          <p className="mt-1 truncate text-[10px] text-slate-400">
                            {request.email ||
                              "No email"}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase text-amber-600">
                        Pending
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-[9px] text-slate-400">
                          University
                        </p>

                        <p className="mt-1 text-[10px] font-semibold text-slate-600">
                          {request.university ||
                            "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] text-slate-400">
                          Department / Course
                        </p>

                        <p className="mt-1 text-[10px] font-semibold text-slate-600">
                          {request.department ||
                            request.course ||
                            "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] text-slate-400">
                          Role
                        </p>

                        <p className="mt-1 text-[10px] font-semibold text-slate-600">
                          {request.role ||
                            "Member"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] text-slate-400">
                          Skills
                        </p>

                        <p className="mt-1 text-[10px] font-semibold text-slate-600">
                          {request.skills ||
                            "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button
                        disabled={isProcessing}
                        onClick={() =>
                          handleAccept(request)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-[10px] font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Check size={14} />

                        {isProcessing
                          ? "Accepting..."
                          : "Accept"}
                      </button>

                      <button
                        disabled={isProcessing}
                        onClick={() =>
                          handleReject(request)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[10px] font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <X size={14} />

                        {isProcessing
                          ? "Rejecting..."
                          : "Reject"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;