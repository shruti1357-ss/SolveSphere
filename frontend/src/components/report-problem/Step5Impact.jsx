import React from "react";
import { Users } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { citizenText } from "../../i18n/citizenUi";

const Step5Impact = ({ formData, updateFormData, onNext, onBack, error }) => {
  const { language } = useLanguage();
  const rt = (key, values) => citizenText(language, key, values);
  return (
    <div className="space-y-6">
      {/* Validation Error */}
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs font-bold text-red-300">
          {error}
        </div>
      )}

      {/* ESTIMATED NUMBER AFFECTED */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <div className="mb-4">
          <label className="block text-sm font-bold text-white flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-emerald-400" /> {rt("affectedPeople")} <span className="text-emerald-400">*</span>
          </label>
          <p className="text-xs text-slate-400">
            {rt("affectedPeopleDesc")}
          </p>
        </div>

        <div className="space-y-4 max-w-md">
          <input
            type="number"
            min="1"
            placeholder={rt("enterAffected")}
            value={formData.estimatedImpact || ""}
            onChange={(e) => updateFormData({ estimatedImpact: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none text-sm font-medium"
          />

          <div className="flex flex-wrap gap-2">
            {["50", "200", "500", "1000", "2500", "5000+"].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => updateFormData({ estimatedImpact: count.replace("+", "") })}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                  formData.estimatedImpact === count.replace("+", "")
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
                }`}
              >
                {count} People
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800"
        >
          {rt("previous")}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400"
        >
          {rt("next")}
        </button>
      </div>
    </div>
  );
};

export default Step5Impact;
