import React from "react";

const StatusBadge = ({ status, type = "status" }) => {
  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";

  const val = String(status || "").toLowerCase();

  if (type === "priority") {
    if (val === "high") {
      badgeStyle = "bg-amber-500/10 text-amber-600 border-amber-500/30";
    } else if (val === "medium") {
      badgeStyle = "bg-sky-500/10 text-sky-600 border-sky-500/30";
    } else if (val === "low") {
      badgeStyle = "bg-slate-500/10 text-slate-600 border-slate-500/30";
    }
  } else if (type === "health") {
    if (val === "on track") {
      badgeStyle = "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
    } else if (val === "at risk") {
      badgeStyle = "bg-amber-500/10 text-amber-600 border-amber-500/30";
    } else if (val === "delayed") {
      badgeStyle = "bg-rose-500/10 text-rose-600 border-rose-500/30";
    }
  } else {
    // Status badges
    if (val === "pending" || val === "pending scrutiny" || val === "pending verification") {
      badgeStyle = "bg-amber-500/10 text-amber-600 border-amber-500/30";
    } else if (val === "active" || val === "verified" || val === "approved" || val === "assigned") {
      badgeStyle = "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
    } else if (val === "completed") {
      badgeStyle = "bg-cyan-500/10 text-cyan-600 border-cyan-500/30";
    } else if (val === "rejected") {
      badgeStyle = "bg-rose-500/10 text-rose-600 border-rose-500/30";
    } else if (val === "revision requested") {
      badgeStyle = "bg-indigo-500/10 text-indigo-600 border-indigo-500/30";
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75" />
      {status}
    </span>
  );
};

export default StatusBadge;
