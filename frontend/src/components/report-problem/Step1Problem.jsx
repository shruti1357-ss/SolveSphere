import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  AlertCircle,
  UserX,
  Building,
  Landmark,
  RefreshCw,
  Check,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { citizenText } from "../../i18n/citizenUi";
import { analyzeProblem } from "../../utils/aiProblemAnalyzer";

const Step1Problem = ({ formData, updateFormData, role, onNext }) => {
  const { language } = useLanguage();
  const rt = (key, values) => citizenText(language, key, values);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isImprovingAI, setIsImprovingAI] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState("");

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const baseTextRef = useRef("");

  /*
   * Parent may pass role as:
   * "citizen", "university", "government"
   *
   * If role is not passed, use formData.role.
   */
  const activeRole =
    role ||
    ({
      Citizen: "citizen",
      University: "university",
      Government: "government",
      Industry: "industry",
      NGO: "ngo",
    }[formData.role] || "citizen");

  /*
   * Backend AI classify response compatible structure.
   *
   * Backend response:
   * {
   *   input_preview,
   *   predicted_category,
   *   urgency_score,
   *   suggested_universities,
   *   ai_engine
   * }
   */
  const saveAIResult = (result) => {
    updateFormData({
      aiResult: result,
      aiPredictedCategory: result?.predicted_category || "",
      aiUrgencyScore:
        typeof result?.urgency_score === "number"
          ? result.urgency_score
          : null,
      aiSuggestedUniversities:
        result?.suggested_universities || [],
      aiEngine: result?.ai_engine || "",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop error
      }
    }
  };

  /*
   * Speech Recognition
   *
   * Browser speech recognition is kept as the frontend fallback.
   * Later backend team can replace this with:
   *
   * POST /api/ai/transcribe/
   *
   * Expected backend response:
   * {
   *   detected_language,
   *   transcribed_text,
   *   confidence,
   *   engine
   * }
   */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;

    /*
     * Indian users may speak Hindi/English.
     * Browser can still use English as fallback.
     * Backend transcription can later detect language.
     */
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let finalAndInterim = "";

      for (let i = 0; i < event.results.length; i++) {
        finalAndInterim += event.results[i][0].transcript;
      }

      const base = baseTextRef.current;

      const newDescription = base
        ? `${base.trim()} ${finalAndInterim.trim()}`
        : finalAndInterim.trim();

      updateFormData({
        description: newDescription,
        voiceTranscript: finalAndInterim.trim(),

        /*
         * Backend-compatible transcription metadata.
         * Actual values can be replaced after API integration.
         */
        transcriptionEngine: "Browser Speech Recognition",
        detectedLanguage: "en-IN",
      });
    };

    recognition.onerror = (err) => {
      console.warn("Speech recognition error:", err);

      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    recognition.onend = () => {
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      try {
        recognition.stop();
      } catch {
        // Ignore cleanup error
      }
    };
  }, [updateFormData]);

  const startRecording = () => {
    baseTextRef.current = formData.description || "";

    setIsRecording(true);
    setRecordingTime(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.log("Speech recognition already started.", err);
      }

      return;
    }

    /*
     * Fallback only for browsers that don't support SpeechRecognition.
     */
    setTimeout(() => {
      const fallbackText =
        "Garbage has been accumulating near the main gate for over 5 days. It smells terrible and attracts pests. Citizens and students face health issues daily.";

      const base = baseTextRef.current;

      const combined = base
        ? `${base.trim()} ${fallbackText}`
        : fallbackText;

      updateFormData({
        description: combined,
        voiceTranscript: fallbackText,
        detectedLanguage: "en",
        transcriptionConfidence: null,
        transcriptionEngine: "Frontend Fallback",
      });

      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 3000);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  /*
   * AI improvement
   *
   * IMPORTANT:
   * This keeps the existing frontend behaviour.
   *
   * Later backend team can connect:
   *
   * POST /api/ai/classify/
   *
   * with:
   * {
   *   text: formData.description
   * }
   */
  const handleImproveWithAI = () => {
    if (
      !formData.description ||
      formData.description.trim().length < 10
    ) {
      alert(`${rt("problemDescription")}: ${rt("beConcise")}`);
      return;
    }

    setIsImprovingAI(true);
    setAiSuccessMsg("");

    setTimeout(() => {
      const currentDesc = formData.description;
      const aiAnalysis = analyzeProblem(formData.title || currentDesc, currentDesc, 200, language);

      const enhancedDesc = `${rt("aiReport")}\n\n${rt("problemDescription")}:\n${currentDesc.trim()}\n\n${rt("estimatedImpact")}: ${aiAnalysis.priority}`;

      const demoAIResult = {
        input_preview: currentDesc.slice(0, 200),
        predicted_category: aiAnalysis.backendCategory,
        urgency_score: aiAnalysis.urgencyScore,
        suggested_universities: [],
        ai_engine: "Bhashini-BERT-v2 / SolveSphere Hybrid Matcher",
      };

      updateFormData({
        description: enhancedDesc,
        category: aiAnalysis.category,
        backendCategory: aiAnalysis.backendCategory,
        priority: aiAnalysis.priority,
        aiResult: demoAIResult,
        aiPredictedCategory: demoAIResult.predicted_category,
        aiUrgencyScore: demoAIResult.urgency_score,
        aiSuggestedUniversities: demoAIResult.suggested_universities,
        aiEngine: demoAIResult.ai_engine,
      });

      saveAIResult(demoAIResult);

      setIsImprovingAI(false);

      setAiSuccessMsg(`${rt("aiReport")} — ${rt("completed")}`);

      setTimeout(() => {
        setAiSuccessMsg("");
      }, 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* --------------------------------
          ROLE SPECIFIC NOTIFICATION
      --------------------------------- */}

      {activeRole === "university" && (
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-blue-200">
          <div className="flex items-center gap-2 font-bold text-blue-400">
            <Building className="h-5 w-5" />

            {rt("universityPortal")}
          </div>

          <p className="mt-1 text-xs text-blue-300/90">
            {rt("universityPortalDesc")}
          </p>
        </div>
      )}

      {activeRole === "government" && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <Landmark className="h-5 w-5" />

            {rt("governmentPortal")}
          </div>

          <p className="mt-1 text-xs text-amber-300/90">
            {rt("governmentPortalDesc")}
          </p>
        </div>
      )}

      {/* --------------------------------
          CITIZEN ANONYMOUS OPTION
      --------------------------------- */}

      {activeRole === "citizen" && (
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <UserX className="h-5 w-5" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">
                {rt("reportAnonymously")}
              </h4>

              <p className="text-xs text-slate-400">
                {rt("hideProfile")}
              </p>
            </div>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={formData.isAnonymous || false}
              onChange={(e) =>
                updateFormData({
                  isAnonymous: e.target.checked,
                })
              }
              className="peer sr-only"
            />

            <div className="peer h-6 w-11 rounded-full bg-slate-800 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
          </label>
        </div>
      )}

      {/* --------------------------------
          UNIVERSITY FIELDS
      --------------------------------- */}

      {activeRole === "university" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-300">
              {rt("institutionName")}{" "}
              <span className="text-red-400">*</span>
            </label>

            <input
              type="text"
              placeholder={rt("institutionPlaceholder")}
              value={formData.institutionName || ""}
              onChange={(e) =>
                updateFormData({
                  institutionName: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-300">
              {rt("department")}{" "}
              <span className="text-red-400">*</span>
            </label>

            <input
              type="text"
              placeholder={rt("departmentPlaceholder")}
              value={formData.department || ""}
              onChange={(e) =>
                updateFormData({
                  department: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-300">
              {rt("campus")}
            </label>

            <input
              type="text"
              placeholder={rt("campusPlaceholder")}
              value={formData.campus || ""}
              onChange={(e) =>
                updateFormData({
                  campus: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* --------------------------------
          GOVERNMENT FIELDS
      --------------------------------- */}

      {activeRole === "government" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-300">
              Government {rt("department")}{" "}
              <span className="text-red-400">*</span>
            </label>

            <input
              type="text"
              placeholder={rt("govDeptPlaceholder")}
              value={formData.govtDept || ""}
              onChange={(e) =>
                updateFormData({
                  govtDept: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-300">
              {rt("districtMunicipality")}{" "}
              <span className="text-red-400">*</span>
            </label>

            <input
              type="text"
              placeholder={rt("districtPlaceholder")}
              value={formData.district || ""}
              onChange={(e) =>
                updateFormData({
                  district: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* --------------------------------
          PROBLEM TITLE
      --------------------------------- */}

      <div>
        <label className="mb-2 block text-sm font-bold text-white">
          {rt("problemTitle")}{" "}
          <span className="text-emerald-400">*</span>
        </label>

        <input
          type="text"
          placeholder={rt("problemPlaceholder")}
          value={formData.title || ""}
          onChange={(e) =>
            updateFormData({
              title: e.target.value,
            })
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-base font-medium text-white placeholder-slate-500 transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none"
        />

        <p className="mt-1.5 text-xs text-slate-400">
          {rt("beConcise")}
        </p>
      </div>

      {/* --------------------------------
          PROBLEM DESCRIPTION
      --------------------------------- */}

      <div>
        <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <label className="block text-sm font-bold text-white">
            {rt("problemDescription")}{" "}
            <span className="text-emerald-400">*</span>
          </label>

          <div className="flex items-center gap-2">
            {/* VOICE */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                isRecording
                  ? "animate-pulse bg-red-500 text-white shadow-lg shadow-red-500/30"
                  : "border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-4 w-4" />

                  {rt("stopRecording")} ({formatTime(recordingTime)})
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />

                  {rt("describeVoice")}
                </>
              )}
            </button>

            {/* AI */}
            <button
              type="button"
              onClick={handleImproveWithAI}
              disabled={isImprovingAI}
              className="inline-flex items-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/20 px-3 py-1.5 text-xs font-bold text-purple-300 transition hover:bg-purple-500/30 disabled:opacity-50"
            >
              {isImprovingAI ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />

                  {rt("improving")}
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />

                  {rt("improveAi")}
                </>
              )}
            </button>
          </div>
        </div>

        {/* RECORDING STATUS */}
        {isRecording && (
          <div className="mb-3 flex animate-fade-in items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 animate-ping rounded-full bg-red-500" />

              Listening... Speak clearly into your microphone.
              Transcript will auto-fill below.
            </span>

            <span className="font-mono font-bold">
              {formatTime(recordingTime)}
            </span>
          </div>
        )}

        {/* AI SUCCESS */}
        {aiSuccessMsg && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />

            {aiSuccessMsg}
          </div>
        )}

        {/* DESCRIPTION */}
        <textarea
          rows={6}
          placeholder={rt("descriptionPlaceholder")}
          value={formData.description || ""}
          onChange={(e) =>
            updateFormData({
              description: e.target.value,
            })
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-relaxed text-white placeholder-slate-500 transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none"
        />

        {/* VOICE TRANSCRIPT */}
        {formData.voiceTranscript && (
          <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/80 p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                <Mic className="h-3.5 w-3.5" /> {rt("evidence")} — {rt("uploadedEvidence")}
              </span>

              <button
                type="button"
                onClick={toggleRecording}
                className="text-[11px] text-slate-400 underline hover:text-white"
              >
                {rt("recordVideo")}
              </button>
            </div>

            <p className="text-xs italic text-slate-300">
              "{formData.voiceTranscript}"
            </p>
          </div>
        )}
      </div>
      <div className="mt-8 flex justify-end"><button type="button" onClick={onNext} className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400">{rt("next")}</button></div>
    </div>
  );
};

export default Step1Problem;