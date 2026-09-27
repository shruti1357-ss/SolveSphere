import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  CheckCircle2,
  Users,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Target,
  Award,
  Building2,
} from "lucide-react";

const ImpactCard = ({ project }) => {
  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {/* Top Banner Tag */}
      <div className="p-6 pb-4 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold tracking-wide uppercase border border-emerald-200">
              {project.domain}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-500" />
              {project.district}, Jharkhand
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1 shadow-xs shadow-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Implemented
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
          {project.title}
        </h3>

        {/* Problem & Solution Summaries */}
        <div className="space-y-2.5 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-100">
            <span className="font-bold text-slate-700 text-[11px] block uppercase tracking-wider mb-1">
              Problem
            </span>
            <p className="line-clamp-2 text-slate-600 leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100/60">
            <span className="font-bold text-emerald-800 text-[11px] block uppercase tracking-wider mb-1">
              Solution
            </span>
            <p className="line-clamp-2 text-emerald-950 font-medium leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Impact Highlights Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="p-3 bg-gradient-to-br from-indigo-50/80 to-indigo-100/40 rounded-xl border border-indigo-100 text-center">
            <Users className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
            <span className="text-[10px] text-slate-500 font-medium block">
              Benefited
            </span>
            <span className="text-sm font-extrabold text-indigo-900">
              {project.peopleBenefited.toLocaleString()}
            </span>
          </div>

          <div className="p-3 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 rounded-xl border border-emerald-100 text-center">
            <TrendingDown className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <span className="text-[10px] text-slate-500 font-medium block">
              Reduction
            </span>
            <span className="text-sm font-extrabold text-emerald-800">
              {project.problemReduction}
            </span>
          </div>

          <div className="p-3 bg-gradient-to-br from-amber-50/80 to-amber-100/40 rounded-xl border border-amber-100 text-center">
            <Target className="w-4 h-4 text-amber-600 mx-auto mb-1" />
            <span className="text-[10px] text-slate-500 font-medium block">
              Accuracy
            </span>
            <span className="text-sm font-extrabold text-amber-900">
              {project.solutionAccuracy}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Call To Action */}
      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[150px] font-semibold text-slate-700">
            {project.university}
          </span>
        </div>

        <Link
          to={`/impact/${project.id}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <span>VIEW IMPACT</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default ImpactCard;
