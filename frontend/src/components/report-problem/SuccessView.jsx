import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, Share2, Copy, ArrowRight, Download, RefreshCw, Layers, Sparkles, Building, MapPin } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { citizenText, localizeCategory, localizePriority, localizeCollaborator, localizeAddress, localizeProblemTitle } from "../../i18n/citizenUi";

const SuccessView = ({ problemId, formData, role = "citizen", onReset }) => {
  const [copied, setCopied] = useState(false);
  const { t, language } = useLanguage();
  const rt = (key, values) => citizenText(language, key, values);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const displayTitle = localizeProblemTitle(language, formData.title);
  const displayCategory = localizeCategory(formData.category || "Clean Energy", language);
  const displayPriority = localizePriority(formData.priority || "High", language);
  const displayLocation = `${localizeAddress(formData.city || formData.district || "Ranchi", language)}, ${localizeAddress(formData.state || "Jharkhand", language)}`;

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in">
      {/* SUCCESS HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-cyan-950/60 p-8 text-center shadow-2xl backdrop-blur-md">
        {/* Glow orb */}
        <div className="absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-bounce">
          <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 mb-3">
          <ShieldCheck className="h-4 w-4" /> {rt("reportSubmitted") || "PROBLEM SUCCESSFULLY REPORTED"}
        </span>

        <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
          {rt("thankYou")}
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
          {formData.offlinePending
            ? t("report.offlineSaved")
            : rt("reportSuccessMessage")}
        </p>

        {/* TICKET DETAILS BADGE */}
        <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 px-6 py-4 shadow-xl">
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{rt("uniqueProblemId")}</span>
            <div className="text-xl font-black font-mono text-emerald-400 tracking-wider">
              {problemId || "SS-2026-00124"}
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block" />

          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{rt("currentStatus")}</span>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-extrabold text-emerald-300 border border-emerald-500/40">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                {formData.offlinePending ? rt("pendingSync") : rt("underReview")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY RECEIPT CARD */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="h-5 w-5 text-emerald-400" /> {rt("ticketSummary")}
        </h3>

        <div className="grid gap-3 text-xs text-slate-300 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <span className="text-slate-400">{rt("problemTitleLabel")}</span>
            <p className="font-bold text-white mt-1 truncate">{displayTitle}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <span className="text-slate-400">{rt("reportedLocationRole")}</span>
            <p className="font-bold text-white mt-1 truncate">
              {displayLocation}{" "}
              <span className="capitalize text-emerald-400">({rt(role) || role})</span>
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <span className="text-slate-400">{rt("categoryPriority")}</span>
            <p className="font-bold text-emerald-400 mt-1">
              {displayCategory} ({displayPriority})
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <span className="text-slate-400">{rt("matchedCollaborators")}</span>
            <p className="font-bold text-cyan-400 mt-1">
              {(formData.whoCanHelp || ["Government", "Universities"]).map(h => localizeCollaborator(h, language)).join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
            {copied ? rt("copied") : rt("copyLink")}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
          >
            <ArrowRight className="h-4 w-4" /> {rt("backToDashboard")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessView;
