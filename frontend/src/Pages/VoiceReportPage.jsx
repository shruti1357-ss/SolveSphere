import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mic,
  Square,
  Pencil,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Send,
  MapPin,
  Sparkles,
  RefreshCw,
  FileText,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { citizenText, localizeAddress, localizeCategory, localizePriority } from "../i18n/citizenUi";
import { useAuth } from "../context/AuthContext";
import { citizenService } from "../services/api";
import { analyzeProblem } from "../utils/aiProblemAnalyzer";

const JHARKHAND_DISTRICTS = [
  "Ranchi",
  "Dhanbad",
  "East Singhbhum",
  "Palamu",
  "Bokaro",
  "Deoghar",
  "Hazaribagh",
  "Giridih",
  "Ramgarh",
  "Saraikela Kharsawan",
  "Latehar",
  "Dumka",
  "Godda",
  "Gumla",
  "Jamtara",
  "Khunti",
  "Koderma",
  "Lohardaga",
  "Pakur",
  "Sahebganj",
  "Simdega",
  "West Singhbhum",
  "Chatra",
  "Garhwa",
];

const SPEECH_LOCALES = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
  or: "or-IN",
  sat: "sat-IN",
  ho: "hi-IN",
  nag: "hi-IN",
  kur: "hi-IN",
  kho: "hi-IN",
  mul: "hi-IN",
};

export default function VoiceReportPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, addProblem } = useAuth();
  const rt = (key, values) => citizenText(language, key, values);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState("");
  const [audioReady, setAudioReady] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(
    user?.district || "Ranchi"
  );
  const [showVoiceSuccess, setShowVoiceSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioUrlRef = useRef("");
  const timerRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const stoppingRef = useRef(false);

  const cleanupAudioUrl = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = "";
    }
  }, []);

  const cleanupMedia = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    stoppingRef.current = true;
    setIsRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Recognition may already be stopped.
      }
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Recorder may already be stopped.
      }
    } else {
      cleanupMedia();
    }
  }, [cleanupMedia]);

  useEffect(() => {
    return () => {
      stoppingRef.current = true;
      try {
        recognitionRef.current?.stop();
      } catch {}
      try {
        if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
      } catch {}
      cleanupMedia();
      cleanupAudioUrl();
    };
  }, [cleanupMedia, cleanupAudioUrl]);

  const startRecording = async () => {
    setError("");
    cleanupAudioUrl();
    setAudioUrl("");
    setAudioReady(false);
    setRecordingTime(0);
    audioChunksRef.current = [];
    finalTranscriptRef.current = "";
    setTranscript("");
    stoppingRef.current = false;

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(rt("voiceMicUnsupported"));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data?.size) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
          cleanupAudioUrl();
          const nextAudioUrl = URL.createObjectURL(blob);
          audioUrlRef.current = nextAudioUrl;
          setAudioUrl(nextAudioUrl);
          setAudioReady(true);
        } else {
          setAudioReady(false);
        }
        cleanupMedia();
      };
      recorder.start();

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError(rt("voiceSpeechUnsupported"));
      } else {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = SPEECH_LOCALES[language] || "en-IN";

        recognition.onresult = (event) => {
          let interim = "";
          let finalText = finalTranscriptRef.current;

          for (let i = event.resultIndex; i < event.results.length; i += 1) {
            const piece = event.results[i][0]?.transcript || "";
            if (event.results[i].isFinal) {
              finalText = `${finalText} ${piece}`.trim();
            } else {
              interim += piece;
            }
          }

          finalTranscriptRef.current = finalText;
          setTranscript(`${finalText} ${interim}`.trim());
        };

        recognition.onerror = (event) => {
          if (event.error !== "aborted") {
            setError(rt("voiceRecognitionError"));
          }
        };

        recognition.onend = () => {
          if (!stoppingRef.current && mediaRecorderRef.current?.state === "recording") {
            try {
              recognition.start();
            } catch {
              // Browser may reject a restart while transitioning.
            }
          }
        };

        recognitionRef.current = recognition;
        try {
          recognition.start();
        } catch {
          // Ignore duplicate-start race.
        }
      }

      setIsRecording(true);
      timerRef.current = setInterval(() => setRecordingTime((value) => value + 1), 1000);
    } catch (micError) {
      console.error("Voice recording error", micError);
      cleanupMedia();
      setError(rt("voicePermissionError"));
    }
  };

  const handleReset = () => {
    cleanupMedia();
    cleanupAudioUrl();
    setTranscript("");
    finalTranscriptRef.current = "";
    setAudioUrl("");
    setAudioReady(false);
    setRecordingTime(0);
    setError("");
    setShowVoiceSuccess(false);
    setSubmittedData(null);
  };

  const handleSubmitVoiceReport = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const voiceText =
        transcript.trim() || "Voice report recorded by citizen";

      const title =
        voiceText.length > 60
          ? voiceText.slice(0, 60) + "..."
          : voiceText;

      const aiResult = analyzeProblem(title, voiceText, 250, language);

      const problemData = {
        title,
        description: voiceText,
        category: aiResult.category,
        backendCategory: aiResult.backendCategory,
        district: selectedDistrict || user?.district || "Ranchi",
        block: "",
        village: "",
        latitude: 23.3441,
        longitude: 85.3096,
        citizen_name:
          user?.name || user?.first_name || "Citizen Reporter",
        citizen_phone: user?.phone || "",
        status: "OPEN",
        priority: aiResult.priority,
        urgency_score: aiResult.urgencyScore,
      };

      let serverResponse = null;

      // 1. Post directly to MongoDB Atlas via citizenService
      try {
        serverResponse = await citizenService.reportProblem(problemData);
      } catch (err) {
        console.warn("citizenService fallback to /api/challenges/:", err);
        const token =
          localStorage.getItem("solvesphere_access_token") ||
          localStorage.getItem("solvesphere_auth_token") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("token");

        const res = await fetch("/api/challenges/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(problemData),
        });
        if (res.ok) {
          serverResponse = await res.json();
        }
      }

      // 2. Update AuthContext state
      if (typeof addProblem === "function") {
        try {
          await addProblem({
            ...problemData,
            problem_id:
              serverResponse?.problem_id || serverResponse?.id,
          });
        } catch (_) {}
      }

      const finalCat = serverResponse?.ai_analysis?.category ||
        serverResponse?.problem?.category ||
        aiResult.category;

      const finalPri = serverResponse?.ai_analysis?.priority ||
        serverResponse?.problem?.priority ||
        aiResult.priority;

      setSubmittedData({
        problem_id:
          serverResponse?.problem_id ||
          serverResponse?.problem?.problem_id ||
          `CHL-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        title: problemData.title,
        description: problemData.description,
        district: selectedDistrict,
        category: localizeCategory(finalCat, language),
        priority: localizePriority(finalPri, language),
        urgency_score:
          serverResponse?.ai_analysis?.urgency_score ||
          serverResponse?.problem?.urgency_score ||
          aiResult.urgencyScore,
      });

      setShowVoiceSuccess(true);
    } catch (e) {
      console.error("Voice report submission error:", e);
      setError(
        "Unable to submit voice report. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (showVoiceSuccess) {
    return (
      <div className="min-h-screen bg-[#06132d] flex items-center justify-center px-4 py-24 relative">
        <div className="w-full max-w-xl rounded-2xl border border-slate-700/40 bg-slate-900/90 backdrop-blur-md p-8 text-center shadow-2xl text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <CheckCircle2 size={36} />
          </div>

          <span className="mt-4 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {rt("storedInMongo") || "Stored in Database"}
          </span>

          <h1 className="mt-3 text-2xl font-bold text-white">
            {rt("voiceReportSubmittedSuccess") || rt("thankYou") || "Voice Report Submitted Successfully!"}
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            {rt("voiceReportSubmittedDesc") || rt("reportSuccessMessage")}
          </p>

          {submittedData && (
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">{rt("problemId") || "Problem ID"}:</span>
                <span className="font-mono font-bold text-cyan-400">
                  {submittedData.problem_id}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">{rt("district") || "District"}:</span>
                <span className="font-semibold text-slate-200">
                  {localizeAddress(submittedData.district, language)}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">{rt("category") || "Category"}:</span>
                <span className="font-semibold text-indigo-300">
                  {submittedData.category}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{rt("priority") || "Priority"}:</span>
                <span className="px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {submittedData.priority} (Urgency: {submittedData.urgency_score}/10)
                </span>
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate("/citizen-dashboard")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
            >
              <FileText size={16} /> {rt("trackOnDashboard") || "Track on Dashboard"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 px-5 py-3 text-sm font-medium text-slate-300 transition"
            >
              <RefreshCw size={15} /> {rt("reportAnotherIssue") || rt("reportAnother") || "Report Another Issue"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasVoiceContent = Boolean(transcript.trim() || audioReady);

  return (
    <div className="min-h-screen bg-[#06132d] flex items-center justify-center px-4 py-24 relative">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700/40 bg-white p-6 sm:p-8 shadow-2xl">
        <button
          type="button"
          onClick={() => navigate("/report")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft size={17} /> {rt("back")}
        </button>

        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {rt("reportByVoice")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {rt("voiceDescription")}
          </p>

          <div
            className={`mx-auto my-8 flex h-28 w-28 items-center justify-center rounded-full border ${
              isRecording
                ? "border-red-300 bg-red-50 text-red-600 animate-pulse"
                : "border-emerald-200 bg-emerald-50 text-emerald-600 shadow-inner"
            }`}
          >
            <Mic size={42} />
          </div>

          {isRecording && (
            <div className="mb-4 text-sm font-semibold text-red-600">
              Recording: {formatTime(recordingTime)}
            </div>
          )}

          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-emerald-700 transition"
            >
              <span className="inline-flex items-center gap-2">
                <Mic size={18} /> {hasVoiceContent ? "Record Again" : rt("startSpeaking")}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-red-700 transition"
            >
              <span className="inline-flex items-center gap-2">
                <Square size={16} /> {rt("stopRecording")}
              </span>
            </button>
          )}

          <p className="mt-3 text-xs text-slate-500">
            {isRecording
              ? rt("voiceRecordingNow")
              : rt("startSpeakingHint")}
          </p>
        </div>

        {error && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {audioReady && !isRecording && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 size={18} /> {rt("voiceSaved")}
          </div>
        )}

        {/* Live Statement / Transcript Card */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-slate-900">
              {rt("yourStatement")}
            </h2>
            {transcript.trim() && (
              <button
                type="button"
                onClick={() => setIsEditingTranscript((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:text-cyan-900"
              >
                <Pencil size={13} /> {isEditingTranscript ? "Save Edit" : rt("editTranscript")}
              </button>
            )}
          </div>

          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-700">
            {isEditingTranscript ? (
              <textarea
                value={transcript}
                onChange={(event) => {
                  setTranscript(event.target.value);
                  finalTranscriptRef.current = event.target.value;
                }}
                className="min-h-24 w-full resize-y border-0 bg-transparent p-0 text-sm text-slate-700 outline-none"
                placeholder="Type or edit your problem description here..."
                autoFocus
              />
            ) : (
              <div className="min-h-20 whitespace-pre-wrap">
                {transcript || (
                  <span className="text-slate-400">
                    {rt("voiceStatementPlaceholder")}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Audio Player */}
          {audioReady && audioUrl && !isRecording && (
            <div className="mt-3">
              <audio controls src={audioUrl} className="w-full" />
            </div>
          )}

          {/* District Selection */}
          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <label className="text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-500" /> {rt("selectDistrict") || `${rt("district")}:`}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full sm:w-64 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm focus:border-cyan-500 focus:outline-none"
            >
              {JHARKHAND_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {localizeAddress(dist, language)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap justify-between items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasVoiceContent || isSubmitting}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <RefreshCw size={14} /> {rt("clearRerecord") || "Clear & Re-record"}
          </button>

          <button
            type="button"
            onClick={handleSubmitVoiceReport}
            disabled={isSubmitting || !hasVoiceContent}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={15} className="animate-spin" /> {rt("submittingReport") || rt("uploading") || "Submitting..."}
              </>
            ) : (
              <>
                <Send size={15} /> {rt("submitReport") || rt("confirmSubmit") || "Submit Report"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
