import { useNavigate } from "react-router-dom";
import { FaRocket } from "react-icons/fa";

const WorkspaceHeader = ({ team }) => {
  const navigate = useNavigate();

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <button
            onClick={() => navigate("/workspace")}
            className="mb-3 text-[10px] font-semibold text-slate-400 hover:text-emerald-600"
          >
            ← My Workspace
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FaRocket className="h-5 w-5" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800">
                  {team.name}
                </h1>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-600">
                  ACTIVE
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                {team.challengeName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-600 hover:border-emerald-200 hover:text-emerald-600">
            + Invite
          </button>

          <button
            onClick={() =>
              navigate(`/challenges/${team.challengeId || "clean-water"}`)
            }
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-[10px] font-bold text-white hover:bg-emerald-600"
          >
            View Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceHeader;