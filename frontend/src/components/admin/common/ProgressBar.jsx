import React from "react";

const ProgressBar = ({ progress = 0, showPercent = true, className = "" }) => {
  const clamped = Math.min(100, Math.max(0, progress));

  let barColor = "bg-emerald-500";
  if (clamped < 35) {
    barColor = "bg-amber-500";
  } else if (clamped < 70) {
    barColor = "bg-sky-500";
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500 rounded-full`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showPercent && (
        <span className="text-xs font-semibold text-slate-600 min-w-[36px] text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
