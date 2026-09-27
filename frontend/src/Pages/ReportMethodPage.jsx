import React from "react";
import { useNavigate } from "react-router-dom";
import { Mic, FileText, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { citizenText } from "../i18n/citizenUi";

export default function ReportMethodPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const rt = (key, values) => citizenText(language, key, values);

  return (
    <div className="min-h-screen bg-[#06132d] flex items-center justify-center px-4 py-24 relative">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700/40 bg-white p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {rt("reportMethodTitle")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {rt("reportMethodSubtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/report/voice")}
            className="group rounded-xl border border-slate-200 p-6 text-left transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Mic size={25} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">{rt("throughVoice")}</h2>
            <p className="mt-1 text-sm text-slate-500">{rt("throughVoiceDesc")}</p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/report/manual")}
            className="group rounded-xl border border-slate-200 p-6 text-left transition hover:-translate-y-0.5 hover:border-cyan-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <FileText size={25} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">{rt("throughManual")}</h2>
            <p className="mt-1 text-sm text-slate-500">{rt("throughManualDesc")}</p>
          </button>
        </div>
      </div>


      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label={rt("close")}
        title={rt("close")}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 sm:right-6 sm:top-6"
      >
        <X size={19} />
      </button>
    </div>
  );
}
