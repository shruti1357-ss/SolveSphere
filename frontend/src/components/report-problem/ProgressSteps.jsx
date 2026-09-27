import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { citizenText } from "../../i18n/citizenUi";
import { FileText, MapPin, Camera, Tag, Users, CheckCircle2, Sparkles } from "lucide-react";

const steps = [
  { id: 1, key: "problem", icon: FileText, descKey: "whatIsIt" },
  { id: 2, key: "location", icon: MapPin, descKey: "whereIsIt" },
  { id: 3, key: "evidence", icon: Camera, descKey: "photosVideos" },
  { id: 4, key: "impact", icon: Users, descKey: "affectedPeople" },
  { id: 5, key: "review", icon: Sparkles, descKey: "confirmSubmit" },
];

const ProgressSteps = ({ currentStep, onStepClick, highestVisitedStep = 5 }) => {
  const { language } = useLanguage();
  const rt = (key, values) => citizenText(language, key, values);
  const percentage = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
      {/* Header bar */}
      <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            {rt("stepDetails", { step: currentStep })}
          </span>
          <h2 className="text-xl font-bold text-white">
            {rt(steps[currentStep - 1].key)} {rt("details")}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-800 sm:w-48">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs font-bold text-emerald-300">{percentage}%</span>
        </div>
      </div>

      {/* Steps indicator bar */}
      <div className="no-scrollbar flex items-center justify-between gap-2 overflow-x-auto pb-2 pt-1">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isClickable = step.id <= highestVisitedStep;

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.id)}
                className={`group relative flex min-w-[110px] flex-1 flex-col items-center rounded-xl p-2.5 transition-all duration-200 sm:min-w-[130px] ${
                  isCurrent
                    ? "border border-emerald-500/50 bg-emerald-500/10 text-white shadow-lg shadow-emerald-500/10"
                    : isCompleted
                    ? "bg-slate-800/40 text-emerald-300 hover:bg-slate-800/80 cursor-pointer"
                    : "bg-slate-950/40 text-slate-500 cursor-not-allowed opacity-60"
                }`}
              >
                {/* Step badge */}
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105 ${
                    isCurrent
                      ? "bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_#10b981]"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <Icon className="h-4 w-4" />}
                </div>

                {/* Step title */}
                <span className="mt-2 text-xs font-bold whitespace-nowrap">
                  {step.id}. {rt(step.key)}
                </span>

                <span className="text-[10px] text-slate-400 hidden sm:block whitespace-nowrap">
                  {rt(step.descKey)}
                </span>

                {isCurrent && (
                  <span className="absolute -bottom-1 h-1 w-8 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                )}
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`hidden h-0.5 w-6 shrink-0 md:block ${
                    step.id < currentStep ? "bg-emerald-500/60" : "bg-slate-800"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;
