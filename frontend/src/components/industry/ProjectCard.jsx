import { Link } from "react-router-dom";
import { Sparkles, MapPin, GraduationCap, ArrowRight, Handshake, Clock, CheckCircle2 } from "lucide-react";

const ProjectCard = ({ project, matchPercentage, onCollaborateClick, requestStatus }) => {
  const matchColor =
    matchPercentage >= 85
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : matchPercentage >= 70
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  const normalizedStatus = String(requestStatus || "").toUpperCase();
  const isPending = normalizedStatus === "PENDING";
  const isActive = normalizedStatus === "ACTIVE" || normalizedStatus === "ACCEPTED";
  const isCompleted = normalizedStatus === "COMPLETED" || normalizedStatus === "RESOLVED";

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-blue-300 hover:shadow-md">
      <div>
        {/* Top Header: Domain Chip & Match Percentage Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 border border-blue-100">
            {project.domain}
          </span>

          <span
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-xs font-bold ${matchColor}`}
          >
            <Sparkles size={13} className="text-blue-600" />
            {matchPercentage}% AI Match
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#0d3971] line-clamp-2 hover:text-blue-600 transition">
          {project.title}
        </h3>

        {/* Problem statement / Description */}
        <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed">
          {project.problemStatement}
        </p>

        {/* Metadata: Location & University */}
        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <GraduationCap size={15} className="text-blue-600 shrink-0" />
            <span className="font-semibold truncate text-[#164579]">{project.university}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-slate-400 shrink-0" />
            <span className="truncate text-slate-500">{project.location || project.district}</span>
          </div>
        </div>

        {/* Required Expertise Badges */}
        <div className="mt-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Required Expertise
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Array.isArray(project.requiredExpertise) &&
              project.requiredExpertise.map((tech) => (
                <span
                  key={tech}
                  className="inline-block rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-[#164579] border border-slate-200"
                >
                  {tech}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex items-center gap-2.5 border-t border-slate-100 pt-4">
        <Link
          to={`/industry-dashboard/projects/${project.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-bold text-[#164579] transition hover:bg-slate-50 hover:border-slate-300"
        >
          View Details
          <ArrowRight size={14} />
        </Link>

        {isPending ? (
          <div className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 py-2 px-3 text-xs font-bold text-amber-700 select-none shadow-xs">
            <Clock size={14} className="text-amber-600 shrink-0" />
            <span>Request Sent</span>
          </div>
        ) : isActive ? (
          <div className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 py-2 px-3 text-xs font-bold text-emerald-700 select-none shadow-xs">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            <span>Active Partner</span>
          </div>
        ) : isCompleted ? (
          <div className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 py-2 px-3 text-xs font-bold text-blue-700 select-none shadow-xs">
            <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
            <span>Completed</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onCollaborateClick(project)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0d3971] hover:bg-blue-700 py-2 px-3 text-xs font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Handshake size={14} />
            Collaborate
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
