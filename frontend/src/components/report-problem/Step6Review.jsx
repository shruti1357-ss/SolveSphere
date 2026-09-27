import React, { useMemo, useState } from "react";
import { Edit3, Sparkles, MapPin, Camera, Video, Mic, Tag, Users, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, FileText, Send, RefreshCw } from "lucide-react";
import DuplicateModal from "./DuplicateModal";
import { useLanguage } from "../../context/LanguageContext";
import { citizenText, localizeCategory, localizePriority, localizeCollaborator, localizeAddress } from "../../i18n/citizenUi";
import { analyzeProblem } from "../../utils/aiProblemAnalyzer";

const Step6Review = ({ formData, onEditStep, onSubmit, isSubmitting }) => {
  const { language } = useLanguage();
  const rt = (key, values) => citizenText(language, key, values);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateItem] = useState({
    id: "SS-2026-00089",
    title: "Overflowing Waste & Uncollected Garbage near University Gate 2",
    description: "Garbage has accumulated over the past week creating a foul smell and attracting strays near student hostel entrance.",
    distance: "0.3 km away",
    status: "Under Review",
    supporters: 24,
  });

  const aiAnalysis = useMemo(() => {
    return analyzeProblem(formData.title, formData.description, formData.estimatedImpact, language);
  }, [formData.title, formData.description, formData.estimatedImpact, language]);

  const handleTriggerSubmitCheck = () => {
    const isVoiceReport = sessionStorage.getItem("solvesphere_voice_report") === "true";
    // Voice is already the frontend-only recording flow; do not block it with
    // the demo duplicate modal. Backend/AI can perform the real check later.
    if (isVoiceReport) {
      onSubmit();
      return;
    }
    setShowDuplicateModal(true);
  };

  const handleProceedAnyway = () => {
    setShowDuplicateModal(false);
    onSubmit();
  };

  const handleViewExisting = () => {
    alert(rt("supportRedirect"));
    setShowDuplicateModal(false);
  };

  const displayCategory = formData.category && formData.category !== "Water & Sanitation" && formData.category !== "General Issue"
    ? formData.category
    : aiAnalysis.category;

  const displayPriority = formData.priority && formData.priority !== "Medium"
    ? formData.priority
    : aiAnalysis.priority;

  const displayAffectedCount = formData.estimatedImpact || aiAnalysis.impactEstimate;

  return (
    <div className="space-y-8">
      {/* 1. SOLVESPHERE AI COMPREHENSIVE ANALYSIS PANEL */}
      <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-cyan-950/40 p-6 shadow-2xl backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
            <Sparkles className="h-4 w-4" /> {rt("aiReport")}
          </div>
          <span className="text-xs font-semibold text-emerald-300">{rt("confidence")}: {aiAnalysis.aiConfidence}%</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{rt("classifiedCategory")}</span>
            <p className="mt-1 text-sm font-bold text-white flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-emerald-400" /> {localizeCategory(displayCategory, language)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{rt("priority")}</span>
            <p className="mt-1 text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> {localizePriority(displayPriority, language)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{rt("estimatedImpact")}</span>
            <p className="mt-1 text-sm font-bold text-cyan-400">
              {displayAffectedCount} {language === "hi" ? "नागरिक प्रभावित" : language === "bn" ? "নাগরিক প্রভাবিত" : language === "or" ? "ନାଗରିକ ପ୍ରଭାବିତ" : language === "sat" ? "ᱦᱚᱲ ᱯᱨᱚᱵᱷᱟᱵᱤᱛ" : "Citizens Affected"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 sm:col-span-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{rt("recommendedCollaborators")}</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {(aiAnalysis.whoCanHelp || ["Government", "Universities", "NGOs"]).map((h) => (
                <span key={h} className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                  {localizeCollaborator(h, language)}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{rt("potentialSolutions")}</span>
            <p className="mt-1 text-xs text-slate-300 font-medium">
              {aiAnalysis.potentialSolutions}
            </p>
          </div>
        </div>
      </div>

      {/* 2. COMPLETE SUBMITTED DATA REVIEW CARD */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" /> {rt("formReview")}
          </h3>
          <span className="text-xs text-slate-400">{rt("reviewDetails")}</span>
        </div>

        {/* STEP 1 SUMMARY */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {rt("whatProblem")}
            </span>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white"
            >
              <Edit3 className="h-3.5 w-3.5" /> {rt("edit")}
            </button>
          </div>

          <h4 className="text-base font-bold text-white mb-2">
            {formData.title || "Garbage is not being collected near our college"}
          </h4>
          <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
            {formData.description || "No description provided."}
          </p>

          {formData.isAnonymous && (
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-300">
              <Users className="h-3.5 w-3.5" /> {rt("anonymousSubmission")}
            </span>
          )}
        </div>

        {/* STEP 2 SUMMARY */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {rt("whereProblem")}
            </span>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white"
            >
              <Edit3 className="h-3.5 w-3.5" /> {rt("edit")}
            </button>
          </div>

          <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
            <div>
              <span className="text-slate-400">{rt("address")}:</span>{" "}
              <strong>{localizeAddress(formData.address || "Main Road", language)}</strong>
            </div>
            <div>
              <span className="text-slate-400">{rt("cityState")}:</span>{" "}
              <strong>{localizeAddress(formData.city || formData.district || "Ranchi", language)}, {localizeAddress(formData.state || "Jharkhand", language)}</strong>
            </div>
            <div>
              <span className="text-slate-400">{rt("coordinates")}:</span>{" "}
              <span className="font-mono">{formData.latitude || "23.3441"}, {formData.longitude || "85.3096"}</span>
            </div>
            <div>
              <span className="text-slate-400">{rt("privacyMode")}:</span>{" "}
              <strong>{formData.isApproximate ? rt("enabledRadius") : rt("exactAddress")}</strong>
            </div>
          </div>
        </div>

        {/* STEP 3 SUMMARY */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {rt("evidenceAttached")}
            </span>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white"
            >
              <Edit3 className="h-3.5 w-3.5" /> {rt("edit")}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300 flex items-center gap-1">
              <Camera className="h-3.5 w-3.5" /> {rt("photoEvidence")}: {formData.photos ? formData.photos.length : 0}
            </span>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300 flex items-center gap-1">
              <Video className="h-3.5 w-3.5" /> {rt("videoEvidence")}: {formData.videos ? formData.videos.length : 0}
            </span>
          </div>
        </div>

        {/* STEP 4 SUMMARY */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {rt("estimatedImpactStep")}
            </span>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white"
            >
              <Edit3 className="h-3.5 w-3.5" /> {rt("edit")}
            </button>
          </div>
          <p className="text-sm font-bold text-cyan-400">
            {rt("affectedPeople")}: {formData.estimatedImpact || rt("notSpecified")}
          </p>
        </div>
      </div>

      {/* FINAL ACTION BUTTONS */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center rounded-2xl border border-slate-800 bg-slate-950/90 p-5">
        <button
          type="button"
          onClick={() => onEditStep(1)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700 transition"
        >
          <Edit3 className="h-4 w-4" /> {rt("editDetails")}
        </button>

        <button
          type="button"
          onClick={handleTriggerSubmitCheck}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-8 py-3.5 text-base font-extrabold text-slate-950 shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 transition transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" /> {rt("uploading")}
            </>
          ) : (
            <>
              <Send className="h-5 w-5" /> {rt("confirmSubmit")}
            </>
          )}
        </button>
      </div>

      {/* AI DUPLICATE CHECK MODAL */}
      <DuplicateModal
        isOpen={showDuplicateModal}
        duplicateItem={duplicateItem}
        onClose={() => setShowDuplicateModal(false)}
        onProceedAnyway={handleProceedAnyway}
        onViewDetails={handleViewExisting}
      />
    </div>
  );
};

export default Step6Review;
