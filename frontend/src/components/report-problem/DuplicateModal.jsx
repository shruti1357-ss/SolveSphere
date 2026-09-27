import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { citizenText } from "../../i18n/citizenUi";
import { AlertTriangle, MapPin, ThumbsUp, ArrowRight, X, Eye, PlusCircle } from "lucide-react";

const DuplicateModal = ({ isOpen, onClose, duplicateItem, onProceedAnyway, onViewDetails }) => {
  const { language } = useLanguage();
  const rt = (key, values) => citizenText(language, key, values);
  if (!isOpen || !duplicateItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-amber-500/40 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                {rt("duplicateWarning")}
              </span>
              <h3 className="text-lg font-bold text-white">{rt("similarProblem")}</h3>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-5">
          <p className="text-xs leading-relaxed text-slate-300 mb-4">
            SolveSphere AI found an active reported problem matching your location & category description. Joining an existing problem boosts community upvotes & accelerates government action!
          </p>

          {/* Similar Problem Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                Status: {duplicateItem.status || "Under Review"}
              </span>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" /> {duplicateItem.distance || "0.3 km away"}
              </span>
            </div>

            <h4 className="text-base font-bold text-white mb-2">{duplicateItem.title}</h4>
            <p className="text-xs text-slate-400 line-clamp-2 mb-3">{duplicateItem.description}</p>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" /> {duplicateItem.supporters || 18} Citizens Supported
              </span>
              <button
                type="button"
                onClick={onViewDetails}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:underline"
              >
                <Eye className="h-3.5 w-3.5" /> View Existing Problem
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={onProceedAnyway}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
          >
            <PlusCircle className="h-4 w-4 text-slate-400" /> {rt("newProblemAnyway")}
          </button>
          <button
            type="button"
            onClick={onViewDetails}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
          >
            {rt("supportExisting")} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateModal;
