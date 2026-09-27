import React from "react";
import { SearchX, RefreshCw } from "lucide-react";

const EmptyState = ({
  title = "No records found",
  message = "Try adjusting your search criteria or resetting filters to find what you're looking for.",
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
