import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { citizenService } from "../services/api";

import ProgressSteps from "../components/report-problem/ProgressSteps";
import Step1Problem from "../components/report-problem/Step1Problem";
import Step2Location from "../components/report-problem/Step2Location";
import Step3Evidence from "../components/report-problem/Step3Evidence";
import Step5Impact from "../components/report-problem/Step5Impact";
import Step6Review from "../components/report-problem/Step6Review";
import SuccessView from "../components/report-problem/SuccessView";
import { clearDraft, getDraft, saveDraft } from "../services/draftManager";
import { enqueueReport, pendingReportCount } from "../services/offlineQueue";
import { subscribeToSyncStatus, syncPendingReports } from "../services/syncManager";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useLanguage } from "../context/LanguageContext";
import { analyzeProblem } from "../utils/aiProblemAnalyzer";

const FRONTEND_TO_BACKEND_ROLE = {
  Citizen: "CITIZEN",
  University: "STUDENT",
  Government: "GOVT_ADMIN",
  NGO: null,
  Industry: "CSR_PARTNER",
};

const FRONTEND_TO_BACKEND_CATEGORY = {
  "Electricity & Lighting": "Clean Energy",
  "Clean Energy": "Clean Energy",
  "Water Management": "Water Management",
  "Water & Sanitation": "Water Management",
  "Waste & Sanitation": "Sanitation & Waste",
  "Waste Management": "Sanitation & Waste",
  "Sanitation & Waste": "Sanitation & Waste",
  "Roads & Infrastructure": "Rural Infrastructure",
  "Rural Infrastructure": "Rural Infrastructure",
  "Infrastructure": "Rural Infrastructure",
  "Health & MedTech": "Health & MedTech",
  "Healthcare": "Health & MedTech",
  "Smart Education": "Smart Education",
  "Education": "Smart Education",
  "Agriculture & FoodTech": "Agriculture & FoodTech",
  "Agriculture": "Agriculture & FoodTech",
  "Public Safety": "Rural Infrastructure",
  "Environment": "Clean Energy",
};

const PRIORITY_TO_URGENCY = {
  Low: 2.5,
  Medium: 5,
  High: 7.5,
  Critical: 10,
};

const createProblemId = () => {
  return `SS-2026-${Math.floor(10000 + Math.random() * 90000)}`;
};

const getUrgencyScore = (priority) => {
  if (typeof priority === "number") {
    return Math.max(0, Math.min(10, priority));
  }

  return PRIORITY_TO_URGENCY[priority] ?? 5;
};

const buildMediaUrls = (photos = [], videos = []) => {
  const media = [];

  photos.forEach((photo) => {
    if (typeof photo === "string") {
      media.push(photo);
    } else if (photo?.url) {
      media.push(photo.url);
    } else if (photo?.preview) {
      media.push(photo.preview);
    }
  });

  videos.forEach((video) => {
    if (typeof video === "string") {
      media.push(video);
    } else if (video?.url) {
      media.push(video.url);
    } else if (video?.preview) {
      media.push(video.preview);
    }
  });

  return media;
};

const createBackendChallengePayload = (problem) => {
  const backendCategory =
    FRONTEND_TO_BACKEND_CATEGORY[problem.category] ||
    problem.backendCategory ||
    "Water Management";

  const urgencyScore = getUrgencyScore(problem.priority);

  const backendRole =
    FRONTEND_TO_BACKEND_ROLE[problem.role] || problem.backendRole || "CITIZEN";

  return {
    title: problem.title || "",
    description: problem.description || "",

    category: backendCategory,

    district: problem.district || "",
    block: problem.block || "",

    latitude:
      problem.latitude !== "" &&
      problem.latitude !== null &&
      problem.latitude !== undefined
        ? Number(problem.latitude)
        : null,

    longitude:
      problem.longitude !== "" &&
      problem.longitude !== null &&
      problem.longitude !== undefined
        ? Number(problem.longitude)
        : null,

    status: "UNDER_REVIEW",

    urgency_score: urgencyScore,

    citizen: problem.citizenId || null,

    citizen_name: problem.isAnonymous
      ? ""
      : problem.name || problem.citizenName || "",

    citizen_phone: problem.phone || "",

    is_anonymous: Boolean(problem.isAnonymous),

    media_urls: buildMediaUrls(
      problem.photos,
      problem.videos
    ),

    assigned_university: problem.assignedUniversity || "",

    backendRole,
    backendCategory,
    backendStatus: "UNDER_REVIEW",
  };
};

export default function ReportProblem() {
  const navigate = useNavigate();
  const { user, addProblem } = useAuth();
  const { isOnline } = useNetworkStatus();
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedProblem, setSubmittedProblem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncState, setSyncState] = useState({ status: "idle", pendingCount: 0, error: null });
  const draftLoaded = useRef(false);

  const [selectedRole, setSelectedRole] = useState("citizen");

  const [formData, setFormData] = useState({
    // -----------------------------
    // ROLE / USER
    // -----------------------------
    role: "Citizen",
    isAnonymous: false,

    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",

    institutionName: "",
    department: "",
    campus: "",

    govtDept: "",

    // -----------------------------
    // LOCATION
    // -----------------------------
    state: "Jharkhand",
    district: "",
    block: "",
    address: "",

    locationMode: "manual",

    latitude: "",
    longitude: "",

    isApproximate: false,

    mapPinX: null,
    mapPinY: null,

    // -----------------------------
    // PROBLEM
    // -----------------------------
    title: "",
    description: "",

    // -----------------------------
    // EVIDENCE
    // -----------------------------
    photos: [],
    videos: [],

    // -----------------------------
    // CATEGORY (Bypassed UI; default provided)
    // -----------------------------
    category: "Water & Sanitation",
    subcategory: "General Issue",
    tags: ["#community_issue"],

    // -----------------------------
    // IMPACT
    // -----------------------------
    affectedGroups: ["Community Residents"],
    estimatedImpact: "",
    priority: "Medium",
    whoCanHelp: ["Government", "Universities"],

    // -----------------------------
    // COLLABORATION
    // -----------------------------
    reqCollab: false,
    reqResources: false,

    // -----------------------------
    // BACKEND COMPATIBILITY
    // -----------------------------
    backendRole: "CITIZEN",
    backendCategory: "Water Management",
    backendStatus: "UNDER_REVIEW",
  });

  // Restore the last complete checkpoint after a refresh/crash. All report draft data
  // lives in IndexedDB, including media references, never in localStorage.
  useEffect(() => {
    let active = true;
    getDraft().then((draft) => {
      if (!active) return;

      const savedVoiceText = sessionStorage.getItem("solvesphere_voice_prefill");
      const isVoiceReport = sessionStorage.getItem("solvesphere_voice_report") === "true";

      if (draft) {
        setFormData((current) => ({
          ...current,
          ...draft.formData,
          ...(isVoiceReport ? {
            title: draft.formData?.title || "Voice Report",
            description: savedVoiceText || draft.formData?.description || "Voice report submitted for review.",
          } : {}),
          ...(savedVoiceText ? { description: savedVoiceText } : {}),
        }));
        setCurrentStep(Math.min(Math.max(draft.currentStep || 1, 1), 5));
        setSelectedRole(draft.selectedRole || "citizen");
      } else if (isVoiceReport || savedVoiceText) {
        setFormData((current) => ({
          ...current,
          ...(isVoiceReport ? { title: "Voice Report", description: savedVoiceText || "Voice report submitted for review." } : {}),
          ...(savedVoiceText ? { description: savedVoiceText } : {}),
        }));
      }

      if (savedVoiceText) {
        sessionStorage.removeItem("solvesphere_voice_prefill");
      }
      sessionStorage.removeItem("solvesphere_voice_language");
    }).catch((error) => console.error("Unable to restore report draft", error))
      .finally(() => { draftLoaded.current = true; });
    return () => { active = false; };
  }, []);

  // Save after every form/step change. A short debounce avoids a transaction per keystroke.
  useEffect(() => {
    if (!draftLoaded.current || showSuccess) return undefined;
    const timer = window.setTimeout(() => {
      saveDraft({ formData, currentStep, selectedRole })
        .catch((error) => console.error("Unable to save report draft", error));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [formData, currentStep, selectedRole, showSuccess]);

  useEffect(() => {
    const unsubscribe = subscribeToSyncStatus(setSyncState);
    pendingReportCount().then((pendingCount) => setSyncState((state) => ({ ...state, pendingCount })));
    return unsubscribe;
  }, []);

  const updateFormData = (updates) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
    if (stepError) {
      setStepError("");
    }
  };

  const handleRoleChange = (role) => {
    const roleMap = {
      citizen: "Citizen",
      university: "University",
      government: "Government",
      ngo: "NGO",
      industry: "Industry",
    };

    const frontendRole = roleMap[role] || "Citizen";
    const backendRole = FRONTEND_TO_BACKEND_ROLE[frontendRole];

    setSelectedRole(role);

    updateFormData({
      role: frontendRole,
      backendRole: backendRole || "",
    });
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.title?.trim() || !formData.description?.trim()) {
        return "Please complete all required problem fields (Title & Description) before continuing.";
      }
      if (formData.role === "University" && (!formData.institutionName?.trim() || !formData.department?.trim())) {
        return "Please enter your Institution Name and Department before continuing.";
      }
      if (formData.role === "Government" && (!formData.govtDept?.trim() || !formData.district?.trim())) {
        return "Please enter your Government Department and District before continuing.";
      }
      return null;
    }

    if (step === 2) {
      if (!formData.address?.trim() || !formData.city?.trim() || !formData.district?.trim()) {
        return "Please provide address, city, and district information before continuing.";
      }
      if (formData.locationMode === "geolocation" && (!formData.latitude || !formData.longitude)) {
        return "Real GPS location coordinates could not be detected. Please click 'Use My Location' and allow GPS access, or select location on map / enter manually.";
      }
      return null;
    }

    if (step === 3) {
      const hasPhoto = Array.isArray(formData.photos) && formData.photos.length > 0;
      const hasVideo = Array.isArray(formData.videos) && formData.videos.length > 0;
      if (!hasPhoto && !hasVideo) {
        return "Please upload or capture at least one photo or video before continuing.";
      }
      return null;
    }

    if (step === 4) {
      if (!formData.estimatedImpact || String(formData.estimatedImpact).trim() === "") {
        return "Please provide the estimated number of affected people before continuing.";
      }
      return null;
    }

    return null;
  };

  const handleNext = () => {
    const errorMsg = validateStep(currentStep);
    if (errorMsg) {
      setStepError(errorMsg);
      return;
    }
    setStepError("");
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStepError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleEditStep = (stepId) => {
    for (let s = 1; s < stepId; s++) {
      const err = validateStep(s);
      if (err) {
        setStepError(err);
        setCurrentStep(s);
        return;
      }
    }
    setStepError("");
    setCurrentStep(stepId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backendPayload = useMemo(() => {
    return createBackendChallengePayload({
      ...formData,
      name: user?.name || formData.name,
      phone: user?.phone || formData.phone,
      citizenId: user?.id || null,
    });
  }, [formData, user]);

  const handleSubmit = async () => {
    const isVoiceReport = sessionStorage.getItem("solvesphere_voice_report") === "true";

    // Voice flow: transcript may legitimately be empty until the backend
    // speech-to-text service is connected. Do not block the frontend demo.
    if (!isVoiceReport) {
      for (let s = 1; s <= 4; s++) {
        const err = validateStep(s);
        if (err) {
          setStepError(err);
          setCurrentStep(s);
          return;
        }
      }
    }

    const problemId = createProblemId();

    const aiAnalysis = analyzeProblem(
      formData.title,
      formData.description,
      formData.estimatedImpact,
      language
    );

    const finalCategory = formData.category && formData.category !== "Water & Sanitation" && formData.category !== "General Issue"
      ? formData.category
      : aiAnalysis.category;

    const finalPriority = formData.priority && formData.priority !== "Medium"
      ? formData.priority
      : aiAnalysis.priority;

    const finalProblem = {
      ...formData,
      ...(isVoiceReport ? {
        title: formData.title || "Voice Report",
        description: formData.description || "Voice report submitted for review.",
      } : {}),

      category: finalCategory,
      priority: finalPriority,

      id: problemId,
      status: "Under AI Analysis",

      backendId: null,
      backendRole:
        FRONTEND_TO_BACKEND_ROLE[formData.role] ||
        formData.backendRole ||
        "CITIZEN",

      backendCategory:
        FRONTEND_TO_BACKEND_CATEGORY[finalCategory] ||
        aiAnalysis.backendCategory ||
        "Clean Energy",

      backendStatus: "UNDER_REVIEW",

      urgency_score: aiAnalysis.urgencyScore || getUrgencyScore(finalPriority),

      media_urls: buildMediaUrls(
        formData.photos,
        formData.videos
      ),

      backendPayload: {
        ...backendPayload,
        category: FRONTEND_TO_BACKEND_CATEGORY[finalCategory] || aiAnalysis.backendCategory || "Clean Energy",
        urgency_score: aiAnalysis.urgencyScore || getUrgencyScore(finalPriority),
      },

      submittedAt: new Date().toISOString(),
      citizenId: user?.id || null,
      citizenName: user?.name || formData.name || "",
    };

    setIsSubmitting(true);
    try {
      let serverResponse = null;

      // 1. Direct real-time submission to backend / MongoDB Atlas
      if (isOnline) {
        try {
          serverResponse = await citizenService.reportProblem({
            title: backendPayload.title,
            description: backendPayload.description,
            category: backendPayload.category,
            district: backendPayload.district,
            block: backendPayload.block,
            village: backendPayload.village,
            pin_code: backendPayload.pin_code,
            latitude: backendPayload.latitude,
            longitude: backendPayload.longitude,
            citizen_name: backendPayload.citizen_name,
          });
        } catch (directErr) {
          console.warn("citizenService.reportProblem fallback to /api/challenges/:", directErr);
          try {
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
              body: JSON.stringify(backendPayload),
            });
            if (res.ok) {
              serverResponse = await res.json();
            }
          } catch (fetchErr) {
            console.warn("Direct POST /api/challenges/ fallback failed:", fetchErr);
          }
        }
      }

      const finalProblemId = serverResponse?.problem_id || serverResponse?.id || problemId;

      // 2. Update local state
      if (typeof addProblem === "function") {
        try {
          await addProblem({
            ...finalProblem,
            id: finalProblemId,
            problem_id: finalProblemId,
          });
        } catch (authErr) {
          console.warn("addProblem error:", authErr);
        }
      }

      // 3. Fallback queue only if offline or server was unreachable
      if (!serverResponse) {
        await enqueueReport(finalProblem);
        setSyncState((state) => ({ ...state, pendingCount: state.pendingCount + 1 }));
      }

      // 4. Clear local drafts and show success screen
      await clearDraft();
      if (isVoiceReport) {
        sessionStorage.removeItem("solvesphere_voice_report");
      }
      setSubmittedProblem({
        ...finalProblem,
        id: finalProblemId,
        problem_id: finalProblemId,
        offlinePending: !serverResponse,
      });
      setShowSuccess(true);
    } catch (error) {
      console.error("Problem submission error:", error);
      setStepError("Your report could not be saved. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8">
        <SuccessView
          problemId={submittedProblem?.id}
          formData={submittedProblem || formData}
          role={selectedRole}
          onReset={() => navigate("/citizen-dashboard")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-xs font-semibold text-slate-300">
          <span>{isOnline ? `🟢 ${t("common.online")}` : `🔴 ${t("common.offline")}`}</span>
          <span>{t("report.pending")}: {syncState.pendingCount}</span>
          {syncState.status === "syncing" && <span className="text-cyan-300">{t("report.syncing")}</span>}
          {syncState.status === "synced" && <span className="text-emerald-300">{t("report.synced")}</span>}
          {syncState.status === "failed" && <span className="text-amber-300">{t("report.retry")}</span>}
        </div>
        {/* PROGRESS */}
        <ProgressSteps
          currentStep={currentStep}
          onStepClick={handleEditStep}
          highestVisitedStep={5}
        />

        {/* STEP ERROR ALERT */}
        {stepError && (
          <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs font-bold text-red-300">
            {stepError}
          </div>
        )}

        {/* STEP 1 — PROBLEM */}
        {currentStep === 1 && (
          <Step1Problem
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        )}

        {/* STEP 2 — LOCATION */}
        {currentStep === 2 && (
          <Step2Location
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {/* STEP 3 — EVIDENCE */}
        {currentStep === 3 && (
          <Step3Evidence
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
            error={stepError}
          />
        )}

        {/* STEP 4 — IMPACT */}
        {currentStep === 4 && (
          <Step5Impact
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
            error={stepError}
          />
        )}

        {/* STEP 5 — REVIEW */}
        {currentStep === 5 && (
          <Step6Review
            formData={formData}
            backendPayload={backendPayload}
            onEditStep={handleEditStep}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
