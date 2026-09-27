import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Users,
  Lightbulb,
  MapPin,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

import Sidebar from "../components/citizen-dashboard/Sidebar";
import Topbar from "../components/citizen-dashboard/Topbar";
import { useAuth } from "../context/AuthContext";

import {
  FaWater,
  FaRecycle,
  FaGraduationCap,
  FaRoad,
  FaHeartbeat,
  FaBolt,
  FaSeedling,
  FaBuilding,
} from "react-icons/fa";

/*
 * Backend-compatible demo challenges.
 * No API connection yet.
 *
 * Backend challenge fields used:
 * id
 * title
 * description
 * category
 * district
 * block
 * latitude
 * longitude
 * status
 * urgency_score
 * upvotes
 * assigned_university
 * citizen_name
 * citizen_phone
 * is_anonymous
 * media_urls
 */

const SAMPLE_CHALLENGES = {
  "CHL-1001": {
    id: "CHL-1001",
    category: "Water Management",
    title: "Clean Drinking Water in Rural Communities",
    description:
      "Find practical and sustainable solutions to improve access to safe drinking water in rural communities.",
    district: "Ranchi",
    block: "Kanke",
    latitude: 23.3707,
    longitude: 85.325,
    status: "OPEN",
    urgency_score: 8.7,
    upvotes: 126,
    assigned_university: null,
    citizen_name: "Community Member",
    citizen_phone: "",
    is_anonymous: true,
    media_urls: [],
    icon: <FaWater className="h-5 w-5 text-emerald-600" />,
  },

  "CHL-1002": {
    id: "CHL-1002",
    category: "Sanitation & Waste",
    title: "Smart Waste Collection for Urban Areas",
    description:
      "Develop better ways to identify, collect and manage waste across local communities.",
    district: "East Singhbhum",
    block: "Golmuri",
    latitude: 22.8046,
    longitude: 86.2029,
    status: "OPEN",
    urgency_score: 8.2,
    upvotes: 94,
    assigned_university: null,
    citizen_name: "Community Member",
    citizen_phone: "",
    is_anonymous: true,
    media_urls: [],
    icon: <FaRecycle className="h-5 w-5 text-emerald-600" />,
  },

  "CHL-1003": {
    id: "CHL-1003",
    category: "Smart Education",
    title: "Improving Rural Education Access",
    description:
      "Explore innovative approaches to improve learning opportunities for students in rural areas.",
    district: "Dumka",
    block: "Jama",
    latitude: 24.2676,
    longitude: 87.2497,
    status: "OPEN",
    urgency_score: 7.9,
    upvotes: 81,
    assigned_university: null,
    citizen_name: "Community Member",
    citizen_phone: "",
    is_anonymous: true,
    media_urls: [],
    icon: <FaGraduationCap className="h-5 w-5 text-emerald-600" />,
  },

  "CHL-1004": {
    id: "CHL-1004",
    category: "Rural Infrastructure",
    title: "Safer Roads for Rural Communities",
    description:
      "Develop practical solutions for improving road safety and infrastructure in rural communities.",
    district: "Hazaribagh",
    block: "Barkagaon",
    latitude: 23.9966,
    longitude: 85.3637,
    status: "OPEN",
    urgency_score: 9.1,
    upvotes: 143,
    assigned_university: null,
    citizen_name: "Community Member",
    citizen_phone: "",
    is_anonymous: true,
    media_urls: [],
    icon: <FaRoad className="h-5 w-5 text-emerald-600" />,
  },

  "CHL-1005": {
    id: "CHL-1005",
    category: "Health & MedTech",
    title: "Better Access to Basic Healthcare",
    description:
      "Find ways to make essential healthcare services more accessible to underserved communities.",
    district: "Palamu",
    block: "Daltonganj",
    latitude: 24.0129,
    longitude: 84.073,
    status: "OPEN",
    urgency_score: 9.3,
    upvotes: 167,
    assigned_university: null,
    citizen_name: "Community Member",
    citizen_phone: "",
    is_anonymous: true,
    media_urls: [],
    icon: <FaHeartbeat className="h-5 w-5 text-emerald-600" />,
  },

  "CHL-1006": {
    id: "CHL-1006",
    category: "Clean Energy",
    title: "Clean Energy for Remote Communities",
    description:
      "Design affordable and sustainable clean-energy solutions for underserved communities.",
    district: "West Singhbhum",
    block: "Chaibasa",
    latitude: 22.5524,
    longitude: 85.8025,
    status: "OPEN",
    urgency_score: 7.6,
    upvotes: 72,
    assigned_university: null,
    citizen_name: "Community Member",
    citizen_phone: "",
    is_anonymous: true,
    media_urls: [],
    icon: <FaBolt className="h-5 w-5 text-emerald-600" />,
  },

  "CHL-1007": {
    id: "CHL-1007",
    category: "Agriculture & FoodTech",
    title: "Improving Agricultural Productivity",
    description:
      "Create practical technology-driven solutions to improve agricultural productivity and reduce losses.",
    district: "Deoghar",
    block: "Madhupur",
    latitude: 24.2741,
    longitude: 86.6393,
    status: "OPEN",
    urgency_score: 8.4,
    upvotes: 103,
    assigned_university: null,
    citizen_name: "Community Member",
    citizen_phone: "",
    is_anonymous: true,
    media_urls: [],
    icon: <FaSeedling className="h-5 w-5 text-emerald-600" />,
  },
};

/*
 * Backend exact statuses:
 *
 * OPEN
 * UNDER_REVIEW
 * ASSIGNED_TO_HEI
 * IN_PROGRESS
 * RESOLVED
 *
 * Old frontend values are converted only for compatibility.
 */
const normalizeStatus = (status) => {
  const value = String(status || "")
    .trim()
    .toUpperCase();

  if (
    value === "ACTIVE" ||
    value === "APPROVED" ||
    value === "APPROVED AS ACTIVE CHALLENGE"
  ) {
    return "OPEN";
  }

  if (
    value === "ASSIGNED" ||
    value === "ASSIGNED TO UNIVERSITY"
  ) {
    return "ASSIGNED_TO_HEI";
  }

  if (
    value === "IN PROGRESS" ||
    value === "IN_PROGRESS"
  ) {
    return "IN_PROGRESS";
  }

  if (
    value === "COMPLETED" ||
    value === "RESOLVED"
  ) {
    return "RESOLVED";
  }

  if (
    value === "UNDER REVIEW" ||
    value === "UNDER_REVIEW"
  ) {
    return "UNDER_REVIEW";
  }

  return value || "OPEN";
};

const getCategoryIcon = (category = "") => {
  const value = category.toLowerCase();

  if (value.includes("water")) return <FaWater className="h-5 w-5 text-emerald-600" />;

  if (
    value.includes("sanitation") ||
    value.includes("waste")
  ) {
    return <FaRecycle className="h-5 w-5 text-emerald-600" />;
  }

  if (value.includes("education")) return <FaGraduationCap className="h-5 w-5 text-emerald-600" />;

  if (value.includes("health")) return <FaHeartbeat className="h-5 w-5 text-emerald-600" />;

  if (
    value.includes("infrastructure") ||
    value.includes("road")
  ) {
    return <FaRoad className="h-5 w-5 text-emerald-600" />;
  }

  if (value.includes("energy")) return <FaBolt className="h-5 w-5 text-emerald-600" />;

  if (
    value.includes("agriculture") ||
    value.includes("foodtech")
  ) {
    return <FaSeedling className="h-5 w-5 text-emerald-600" />;
  }

  return <FaBuilding className="h-5 w-5 text-emerald-600" />;
};

const getPriority = (urgencyScore) => {
  const score = Number(urgencyScore || 0);

  if (score >= 8) return "High";
  if (score >= 5) return "Medium";

  return "Low";
};

/*
 * Converts backend-shaped challenge data into the shape
 * expected by this existing UI.
 */
const normalizeChallenge = (challenge) => {
  if (!challenge) return null;

  const category =
    challenge.category || "Rural Infrastructure";

  const urgencyScore = Number(
    challenge.urgency_score ??
      challenge.urgencyScore ??
      challenge.severity_score ??
      0
  );

  const district =
    challenge.district ||
    "";

  const block =
    challenge.block ||
    "";

  const challengeId =
    challenge.id ??
    challenge.challengeId ??
    null;

  return {
    ...challenge,

    id: challengeId,

    /*
     * If backend sends numeric ID, keep it available separately.
     * Existing frontend routes can still use `id`.
     */
    backendId:
      typeof challengeId === "number"
        ? challengeId
        : challenge.backendId ?? null,

    title:
      challenge.title ||
      "Community Challenge",

    description:
      challenge.description ||
      "",

    category,

    district,

    block,

    latitude:
      challenge.latitude ?? null,

    longitude:
      challenge.longitude ?? null,

    status: normalizeStatus(
      challenge.status
    ),

    urgency_score: urgencyScore,

    upvotes: Number(
      challenge.upvotes ??
        challenge.participants ??
        0
    ),

    assigned_university:
      challenge.assigned_university ??
      challenge.assignedUniversity ??
      null,

    icon:
      challenge.icon ||
      getCategoryIcon(category),

    priority:
      getPriority(urgencyScore),

    location:
      [district, block]
        .filter(Boolean)
        .join(", ") ||
      "Location not specified",

    /*
     * This page represents the official Challenge Pool.
     * Government validation itself is not a separate backend
     * field, so this is only a UI-level flag.
     */
    isGovernmentApproved:
      challenge.isGovernmentApproved ??
      true,
  };
};

const ChallengeJoined = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const {
    user,
    userProblems = [],
  } = useAuth();

  /*
   * Resolve challenge from:
   * 1. AuthContext citizen challenges
   * 2. Demo backend-shaped challenges
   *
   * No API call yet.
   */
  const challenge = useMemo(() => {
    if (
      Array.isArray(userProblems)
    ) {
      const problem =
        userProblems.find(
          (item) =>
            String(item?.id) ===
            String(id)
        );

      if (problem) {
        return normalizeChallenge({
          ...problem,
          status:
            problem.status ||
            "OPEN",
        });
      }
    }

    if (SAMPLE_CHALLENGES[id]) {
      return normalizeChallenge(
        SAMPLE_CHALLENGES[id]
      );
    }

    return null;
  }, [id, userProblems]);

  /*
   * Frontend University role maps to backend STUDENT.
   * FACULTY also belongs to the university side,
   * but the current frontend only exposes University
   * as the joining role.
   */
  const isUniversity =
    user?.role === "University" ||
    user?.role === "University Student" ||
    user?.role === "Student" ||
    user?.role === "STUDENT" ||
    user?.backendRole === "STUDENT" ||
    user?.backend_role === "STUDENT";

  const isOpen =
    challenge?.status === "OPEN";

  const alreadyAssigned =
    Boolean(
      challenge?.assigned_university
    );

  /*
   * JOIN CHALLENGE
   *
   * Current frontend behavior:
   * OPEN challenge -> TeamSetup
   *
   * Backend later:
   * POST /api/challenges/{id}/assign/
   *
   * No API call is made here yet.
   */
  const handleJoinChallenge = () => {
    if (!challenge) return;

    /*
     * Do NOT create a separate fake workspace here.
     *
     * Existing TeamSetup handles:
     * - Create Team
     * - Join Existing Team
     *
     * and then opens Team Workspace.
     */
    navigate(
      `/challenges/${challenge.id}/team`
    );
  };

  if (!challenge) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <div className="ml-0 lg:ml-64">
          <Topbar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={
              setIsSidebarOpen
            }
          />

          <main className="flex min-h-[calc(100vh-70px)] items-center justify-center px-4 py-8">
            <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                <ShieldCheck className="h-8 w-8 text-slate-400" />
              </div>

              <h1 className="mt-5 text-xl font-bold text-slate-800">
                Challenge Not Found
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                This challenge is not available
                in the Challenge Pool.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/challenges"
                  )
                }
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-white transition hover:bg-emerald-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Challenge Pool
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="ml-0 lg:ml-64">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={
            setIsSidebarOpen
          }
        />

        <main className="flex min-h-[calc(100vh-70px)] items-center justify-center px-4 py-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.35,
            }}
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40"
          >
            {/* Header */}
            <div className="border-b border-slate-100 bg-slate-50/70 px-8 py-7 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <ShieldCheck className="h-8 w-8 text-emerald-500" />
              </div>

              <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                Government Approved Challenge
              </p>

              <h1 className="mt-2 text-2xl font-bold text-slate-800">
                {isUniversity
                  ? "Join Challenge"
                  : "Challenge Available"}
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                {isUniversity
                  ? "Join this government-approved challenge and continue to team formation."
                  : "This challenge is available in the official Challenge Pool."}
              </p>
            </div>

            {/* Challenge Info */}
            <div className="px-8 pt-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                    {challenge.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-emerald-600">
                        {challenge.id}
                      </span>

                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700">
                        {challenge.status}
                      </span>
                    </div>

                    <h2 className="mt-1 text-sm font-bold text-slate-800">
                      {challenge.title}
                    </h2>

                    <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="h-3 w-3" />
                      {challenge.location}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <InfoBox
                    label="Category"
                    value={
                      challenge.category
                    }
                  />

                  <InfoBox
                    label="Urgency"
                    value={`${challenge.urgency_score.toFixed(
                      1
                    )} / 10`}
                  />

                  <InfoBox
                    label="Upvotes"
                    value={
                      challenge.upvotes
                    }
                  />

                  <InfoBox
                    label="Priority"
                    value={
                      challenge.priority
                    }
                  />
                </div>

                {challenge.assigned_university && (
                  <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-wide text-blue-500">
                      Assigned University
                    </p>

                    <p className="mt-1 text-xs font-bold text-blue-800">
                      {
                        challenge.assigned_university
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* What happens next */}
            <div className="px-8 py-6">
              <p className="mb-3 text-xs font-bold text-slate-700">
                What happens next?
              </p>

              <div className="space-y-2">
                <Step
                  icon={
                    <CheckCircle2 className="h-4 w-4" />
                  }
                  title="Join Challenge"
                  description="University joins the government-approved OPEN challenge."
                  active={
                    isOpen &&
                    isUniversity
                  }
                />

                <Step
                  icon={
                    <Users className="h-4 w-4" />
                  }
                  title="Create Team / Join Existing Team"
                  description="Create a new university team or join an existing team working on this challenge."
                />

                <Step
                  icon={
                    <Users className="h-4 w-4" />
                  }
                  title="Team + Mentor"
                  description="Build the team and add a faculty mentor."
                />

                <Step
                  icon={
                    <Lightbulb className="h-4 w-4" />
                  }
                  title="Solution & Proposal"
                  description="Develop the solution and submit a proposal for review."
                />

                <Step
                  icon={
                    <Sparkles className="h-4 w-4" />
                  }
                  title="Industry Collaboration"
                  description="Suitable solutions can move toward industry, startup, MSME or CSR collaboration."
                />
              </div>

              {/* JOIN BUTTON */}
              {isUniversity &&
              isOpen &&
              !alreadyAssigned ? (
                <button
                  onClick={
                    handleJoinChallenge
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
                >
                  Join Challenge
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : alreadyAssigned ? (
                <button
                  onClick={() =>
                    navigate(
                      `/challenges/${challenge.id}/team`
                    )
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-xs font-bold text-white transition hover:bg-blue-700"
                >
                  Continue to Team
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() =>
                    navigate(
                      "/challenges"
                    )
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-700 py-3.5 text-xs font-bold text-white transition hover:bg-slate-800"
                >
                  Back to Challenge Pool
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={() =>
                  navigate(
                    `/challenges/${challenge.id}`
                  )
                }
                className="mt-3 w-full rounded-xl border border-slate-200 py-3 text-xs font-semibold text-slate-500 transition hover:border-emerald-200 hover:text-emerald-600"
              >
                Back to Challenge Details
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

const InfoBox = ({
  label,
  value,
}) => (
  <div className="rounded-xl bg-slate-50 p-3">
    <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <p className="mt-1 text-xs font-bold text-slate-700">
      {value}
    </p>
  </div>
);

const Step = ({
  icon,
  title,
  description,
  active = false,
}) => (
  <div
    className={`flex items-start gap-3 rounded-xl border p-3 ${
      active
        ? "border-emerald-100 bg-emerald-50/60"
        : "border-slate-100 bg-slate-50/50"
    }`}
  >
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
        active
          ? "bg-emerald-100 text-emerald-600"
          : "bg-slate-100 text-slate-400"
      }`}
    >
      {icon}
    </div>

    <div>
      <p className="text-xs font-bold text-slate-700">
        {title}
      </p>

      <p className="mt-0.5 text-[10px] leading-4 text-slate-400">
        {description}
      </p>
    </div>
  </div>
);

export default ChallengeJoined;