import React from "react";
import { XCircle, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

const BeforeAfter = ({ before = [], after = [] }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <span>Before vs After Implementation</span>
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          Measurable Real-World Change
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BEFORE CARD */}
        <div className="bg-rose-50/40 rounded-3xl p-6 border border-rose-200/70 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-rose-200/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-500 text-white rounded-xl shadow-xs">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-rose-900 uppercase tracking-wider">
                BEFORE IMPLEMENTATION
              </span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
              Legacy Process
            </span>
          </div>

          <ul className="space-y-3">
            {before.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs text-rose-950 font-medium">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AFTER CARD */}
        <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-200 space-y-4 relative overflow-hidden shadow-xs">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-emerald-900 uppercase tracking-wider">
                AFTER IMPLEMENTATION
              </span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Deployed Solution
            </span>
          </div>

          <ul className="space-y-3">
            {after.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs text-emerald-950 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfter;
