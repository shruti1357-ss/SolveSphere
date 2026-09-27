import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Users,
  ShieldCheck,
  Building2,
  Sparkles,
  ThumbsUp,
  MapPinned,
} from "lucide-react";

import {
  FaWater,
  FaRecycle,
  FaGraduationCap,
  FaRoad,
  FaHeartbeat,
  FaBolt,
  FaSeedling,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

import Sidebar from "../components/citizen-dashboard/Sidebar";
import Topbar from "../components/citizen-dashboard/Topbar";
import { useAuth } from "../context/AuthContext";

const sampleChallenges = {
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
  },
};

const CATEGORY_ICONS = {
  "Water Management": FaWater,
  "Sanitation & Waste": FaRecycle,
  "Smart Education": FaGraduationCap,
  "Rural Infrastructure": FaRoad,
  "Health & MedTech": FaHeartbeat,
  "Clean Energy": FaBolt,
  "Agriculture & FoodTech": FaSeedling,
};

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
  return CATEGORY_ICONS[category] || FaRoad;
};

const getPriorityFromUrgency = (urgencyScore) => {
  const score = Number(urgencyScore || 0);

  if (score >= 8) return "High";
  if (score >= 5) return "Medium";

  return "Low";
};

const getCoordinatesFromBackend = (challenge) => {
  const coordinates =
    challenge?.location?.coordinates;

  if (
    Array.isArray(coordinates) &&
    coordinates.length >= 2
  ) {
    return {
      longitude: Number(coordinates[0]),
      latitude: Number(coordinates[1]),
    };
  }

  return {
    latitude:
      challenge?.latitude ?? null,

    longitude:
      challenge?.longitude ?? null,
  };
};

const normalizeChallenge = (
  challenge,
  index = 0
) => {
  if (!challenge) return null;

  const category =
    challenge?.category ||
    "Rural Infrastructure";

  const status = normalizeStatus(
    challenge?.status
  );

  const district =
    challenge?.district ||
    "Not specified";

  const block =
    challenge?.block || "";

  const coordinates =
    getCoordinatesFromBackend(challenge);

  const urgencyScore = Number(
    challenge?.urgency_score ??
      challenge?.urgencyScore ??
      challenge?.severity_score ??
      0
  );

  const upvotes = Number(
    challenge?.upvotes ?? 0
  );

  const assignedUniversity =
    challenge?.assigned_university ??
    challenge?.assignedUniversity ??
    null;

  const mediaUrls = Array.isArray(
    challenge?.media_urls
  )
    ? challenge.media_urls
    : Array.isArray(challenge?.mediaUrls)
    ? challenge.mediaUrls
    : [];

  const Icon = getCategoryIcon(category);

  const isAnonymous =
    challenge?.is_anonymous ??
    challenge?.isAnonymous ??
    true;

  return {
    ...challenge,

    id:
      challenge?.id ??
      challenge?.challengeId ??
      `CHL-${String(index + 1).padStart(
        4,
        "0"
      )}`,

    title:
      challenge?.title ||
      "Community Challenge",

    description:
      challenge?.description || "",

    category,

    district,

    block,

    latitude:
      coordinates.latitude,

    longitude:
      coordinates.longitude,

    status,

    backendStatus: status,

    urgency_score:
      urgencyScore,

    upvotes,

    assigned_university:
      assignedUniversity,

    citizen_name:
      challenge?.citizen_name ||
      challenge?.citizenName ||
      "Community Member",

    citizen_phone:
      challenge?.citizen_phone ||
      challenge?.citizenPhone ||
      "",

    is_anonymous:
      Boolean(isAnonymous),

    media_urls:
      mediaUrls,

    Icon,

    location:
      [district, block]
        .filter(Boolean)
        .join(", ") ||
      "Not specified",

    priority:
      getPriorityFromUrgency(
        urgencyScore
      ),

    /*
     * Backend citizen_name is used when
     * the submission is not anonymous.
     * Otherwise show Government / Admin.
     */
    submittedBy:
      challenge?.submittedBy ||
      (
        challenge?.citizen_name &&
        !isAnonymous
          ? challenge.citizen_name
          : "Government / Admin"
      ),

    /*
     * This is a frontend presentation flag.
     * Backend itself does not have
     * governmentApproved.
     */
    isGovernmentApproved:
      status === "OPEN" ||
      status === "ASSIGNED_TO_HEI" ||
      status === "IN_PROGRESS" ||
      status === "RESOLVED",
  };
};

const formatStatus = (status) => {
  switch (status) {
    case "OPEN":
      return "Open";

    case "UNDER_REVIEW":
      return "Under Review";

    case "ASSIGNED_TO_HEI":
      return "Assigned to University";

    case "IN_PROGRESS":
      return "In Progress";

    case "RESOLVED":
      return "Resolved";

    default:
      return status || "Unknown";
  }
};

const ChallengeDetails = () => {
  const { id } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const {
    userProblems = [],
    user,
  } = useAuth();

  /*
   * Search all challenge sources:
   * 1. userProblems (citizen reported issues)
   * 2. solvesphere_university_assignments (government assigned challenges)
   * 3. solvesphere_challenges (admin / government challenges)
   * 4. sampleChallenges (predefined challenges)
   * 5. Dynamic fallback for any valid challenge ID
   */
  const challenge = useMemo(() => {
    if (!id) return null;
    const cleanId = String(id).trim();
    const lowerId = cleanId.toLowerCase();

    // 1. Check userProblems
    if (Array.isArray(userProblems)) {
      const citizenChallenge = userProblems.find(
        (problem) =>
          String(problem?.id).toLowerCase() === lowerId ||
          String(problem?.challengeId).toLowerCase() === lowerId
      );

      if (citizenChallenge) {
        return normalizeChallenge(citizenChallenge);
      }
    }

    // 2. Check solvesphere_university_assignments
    try {
      const assignments = JSON.parse(localStorage.getItem("solvesphere_university_assignments") || "[]");
      if (Array.isArray(assignments)) {
        const match = assignments.find(
          (item) =>
            String(item?.challengeId).toLowerCase() === lowerId ||
            String(item?.challenge?.id).toLowerCase() === lowerId ||
            String(item?.id).toLowerCase() === lowerId
        );

        if (match) {
          const ch = match.challenge || {};
          const status = match.status === "ACCEPTED" ? "IN_PROGRESS" : match.status === "COMPLETED" ? "RESOLVED" : "OPEN";
          const rawChallenge = {
            id: match.challengeId || ch.id || cleanId,
            title: ch.title || "Government Assigned Challenge",
            description: ch.description || "Government-assigned civic challenge for research and implementation.",
            category: ch.category || "Water Management",
            district: ch.district || "Jharkhand",
            location: ch.location || ch.district || "Jharkhand",
            priority: ch.priority || "High",
            status,
            urgency_score: ch.priority === "Critical" ? 9.5 : ch.priority === "High" ? 8.5 : 7.0,
            upvotes: 68,
            assigned_university: match.assignedUniversity || user?.organization || user?.name || "University",
            progress: ch.progress || 50,
            team: ch.team || 5,
          };
          return normalizeChallenge(rawChallenge);
        }
      }
    } catch {}

    // 3. Check solvesphere_challenges
    try {
      const allChallenges = JSON.parse(localStorage.getItem("solvesphere_challenges") || "[]");
      if (Array.isArray(allChallenges)) {
        const match = allChallenges.find(
          (item) =>
            String(item?.id).toLowerCase() === lowerId ||
            String(item?.challengeId).toLowerCase() === lowerId
        );
        if (match) return normalizeChallenge(match);
      }
    } catch {}

    // 4. Check sampleChallenges
    const demoChallenge =
      sampleChallenges[cleanId] ||
      Object.values(sampleChallenges).find(
        (c) => String(c.id).toLowerCase() === lowerId
      );

    if (demoChallenge) {
      return normalizeChallenge(demoChallenge);
    }

    // 5. Dynamic fallback for government/demo challenge IDs
    if (/^(DEMO|GOV|CHL|PROJ|CH|HF)/i.test(cleanId)) {
      const fallbackChallenge = {
        id: cleanId,
        title: cleanId.includes("001") || /water/i.test(cleanId)
          ? "Clean Drinking Water in Rural Area"
          : cleanId.includes("002") || /waste/i.test(cleanId)
          ? "Smart Waste Collection for Urban Areas"
          : "Government Civic Challenge",
        description:
          "Government-assigned civic problem to improve public infrastructure, sustainability, and service delivery through collaborative research and deployment.",
        category: /water/i.test(cleanId)
          ? "Water Management"
          : /waste/i.test(cleanId)
          ? "Sanitation & Waste"
          : "Rural Infrastructure",
        district: user?.district || "Ranchi",
        block: "District Center",
        status: "IN_PROGRESS",
        urgency_score: 8.8,
        upvotes: 95,
        assigned_university: user?.organization || user?.name || "University",
        priority: "High",
      };
      return normalizeChallenge(fallbackChallenge);
    }

    return null;
  }, [id, userProblems, user]);

  const isUniversity =
    user?.role === "University" ||
    user?.role === "University Student" ||
    user?.role === "Student" ||
    user?.role === "STUDENT" ||
    user?.backendRole === "STUDENT";

  const canAccept =
    isUniversity &&
    challenge?.status === "OPEN" &&
    !challenge?.assigned_university;

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

          <main className="px-4 py-10 sm:px-6 lg:p-8">
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xs">
              <div className="flex justify-center text-4xl text-slate-400">
                <FiSearch size={40} />
              </div>

              <h1 className="mt-4 text-xl font-bold text-slate-800">
                Challenge Not Found
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                This challenge may no longer be available
                in the Challenge Pool.
              </p>

              <Link
                to="/challenges"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Challenges
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const locationText = [
    challenge.district,
    challenge.block,
  ]
    .filter(Boolean)
    .join(", ");

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

        <main className="px-4 py-6 sm:px-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Link
              to="/challenges"
              className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-emerald-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Challenge Pool
            </Link>

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
            >
              <div className="border-b border-slate-100 bg-slate-50/60 p-6 sm:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <challenge.Icon className="h-7 w-7" />
                    </div>

                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-600">
                          {challenge.id}
                        </span>

                        <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-emerald-800">
                          {formatStatus(
                            challenge.status
                          )}
                        </span>

                        {challenge.isGovernmentApproved && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold text-blue-700">
                            <ShieldCheck className="h-3 w-3" />
                            Government Approved
                          </span>
                        )}
                      </div>

                      <h1 className="max-w-3xl text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                        {challenge.title}
                      </h1>

                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                        {challenge.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">
                      {challenge.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
                <InfoItem
                  icon={
                    <MapPin className="h-4 w-4" />
                  }
                  label="Location"
                  value={
                    locationText ||
                    "Not specified"
                  }
                />

                <InfoItem
                  icon={
                    <Users className="h-4 w-4" />
                  }
                  label="Upvotes"
                  value={`${challenge.upvotes} Upvotes`}
                />

                <InfoItem
                  icon={
                    <Sparkles className="h-4 w-4" />
                  }
                  label="Urgency Score"
                  value={`${challenge.urgency_score.toFixed(
                    1
                  )} / 10`}
                />

                <InfoItem
                  icon={
                    <MapPinned className="h-4 w-4" />
                  }
                  label="Priority"
                  value={challenge.priority}
                />
              </div>
            </motion.div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.1,
                }}
                className="space-y-6 lg:col-span-2"
              >
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h2 className="text-base font-bold text-slate-800">
                    Challenge Overview
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    This is a government-approved civic
                    challenge published in the Challenge
                    Pool for collaborative problem solving.
                    Universities can explore the problem,
                    accept it, form a team with a faculty
                    mentor, and develop a solution proposal.
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <OverviewPoint
                      title="Government Validated"
                      description="The original community problem has passed government scrutiny before becoming an open challenge."
                    />

                    <OverviewPoint
                      title="University Opportunity"
                      description="University students and faculty can explore the challenge and work on a practical solution."
                    />

                    <OverviewPoint
                      title="Industry Collaboration"
                      description="Suitable solutions can later move toward industry, startup, MSME or CSR collaboration."
                    />

                    <OverviewPoint
                      title="Impact Tracking"
                      description="Once accepted, implementation milestones and project outcomes can be tracked through completion."
                    />
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h2 className="text-base font-bold text-slate-800">
                    Challenge Location
                  </h2>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <DataBox
                      label="District"
                      value={
                        challenge.district ||
                        "Not specified"
                      }
                    />

                    <DataBox
                      label="Block"
                      value={
                        challenge.block ||
                        "Not specified"
                      }
                    />

                    <DataBox
                      label="Coordinates"
                      value={
                        challenge.latitude !==
                          null &&
                        challenge.latitude !==
                          undefined &&
                        challenge.longitude !==
                          null &&
                        challenge.longitude !==
                          undefined
                          ? `${Number(
                              challenge.latitude
                            ).toFixed(
                              4
                            )}, ${Number(
                              challenge.longitude
                            ).toFixed(
                              4
                            )}`
                          : "Not available"
                      }
                    />
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h2 className="text-base font-bold text-slate-800">
                    Challenge Lifecycle
                  </h2>

                  <div className="mt-5 space-y-3">
                    <WorkflowStep
                      number="01"
                      title="Government Validation"
                      description="The submitted civic problem is reviewed and validated by the government."
                      completed
                    />

                    <WorkflowStep
                      number="02"
                      title="Challenge Pool"
                      description="The approved problem becomes an OPEN challenge for universities."
                      completed
                    />

                    <WorkflowStep
                      number="03"
                      title="University Acceptance"
                      description="A university accepts the challenge and proceeds toward team formation."
                      active={
                        challenge.status ===
                        "OPEN"
                      }
                    />

                    <WorkflowStep
                      number="04"
                      title="Team + Mentor"
                      description="Students form a team and work with a faculty mentor."
                      active={
                        challenge.status ===
                        "ASSIGNED_TO_HEI"
                      }
                    />

                    <WorkflowStep
                      number="05"
                      title="Solution & Proposal"
                      description="The university team prepares and submits its solution proposal."
                      active={
                        challenge.status ===
                        "IN_PROGRESS"
                      }
                    />

                    <WorkflowStep
                      number="06"
                      title="Industry Collaboration"
                      description="Industry, startups, MSMEs or CSR partners can support implementation."
                    />

                    <WorkflowStep
                      number="07"
                      title="Project & Impact"
                      description="Implementation milestones and final impact are tracked until resolution."
                      completed={
                        challenge.status ===
                        "RESOLVED"
                      }
                    />
                  </div>
                </section>
              </motion.div>

              <motion.aside
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.15,
                }}
                className="space-y-6"
              >
                <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xs">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Building2 className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Challenge Status
                      </p>

                      <p className="text-[11px] text-slate-400">
                        {challenge.status ===
                        "OPEN"
                          ? "Open for university participation"
                          : formatStatus(
                              challenge.status
                            )}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                      <div>
                        <p className="text-xs font-bold text-emerald-800">
                          {challenge.status ===
                          "OPEN"
                            ? "Open for University"
                            : formatStatus(
                                challenge.status
                              )}
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-emerald-700">
                          {challenge.status ===
                          "OPEN"
                            ? "This challenge is available for university exploration and acceptance."
                            : challenge.assigned_university
                            ? `Assigned to ${challenge.assigned_university}.`
                            : "This challenge is currently progressing through the solution lifecycle."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {challenge.assigned_university && (
                    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-blue-500">
                        Assigned University
                      </p>

                      <p className="mt-1 text-xs font-bold text-blue-800">
                        {
                          challenge.assigned_university
                        }
                      </p>
                    </div>
                  )}

                  <Link
                    to={`/challenges/${challenge.id}/joined`}
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-white shadow-sm transition ${
                      canAccept
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "bg-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    {canAccept
                      ? "Accept Challenge"
                      : "View Participation"}

                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <p className="mt-3 text-center text-[10px] leading-4 text-slate-400">
                    {canAccept
                      ? "Accepting the challenge continues to team formation and solution development."
                      : "View the current participation and project progress for this challenge."}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-800">
                    Submitted & Validated By
                  </h3>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <ShieldCheck className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        {challenge.submittedBy}
                      </p>

                      <p className="text-[11px] text-slate-400">
                        Official Challenge Review
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <ThumbsUp className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Community Support
                      </p>

                      <p className="text-[11px] text-slate-400">
                        {challenge.upvotes} upvotes
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            8,
                            challenge.upvotes /
                              2
                          )
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-3 px-6 py-4">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
      {icon}
    </div>

    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 text-xs font-bold text-slate-700">
        {value}
      </p>
    </div>
  </div>
);

const DataBox = ({
  label,
  value,
}) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <p className="mt-1 text-xs font-bold text-slate-700">
      {value}
    </p>
  </div>
);

const OverviewPoint = ({
  title,
  description,
}) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
    <div className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

      <div>
        <p className="text-xs font-bold text-slate-700">
          {title}
        </p>

        <p className="mt-1 text-[11px] leading-5 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const WorkflowStep = ({
  number,
  title,
  description,
  completed = false,
  active = false,
}) => (
  <div
    className={`flex gap-4 rounded-xl border p-4 ${
      active
        ? "border-emerald-200 bg-emerald-50/50"
        : "border-slate-100 bg-slate-50/40"
    }`}
  >
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold ${
        completed
          ? "bg-emerald-100 text-emerald-700"
          : active
          ? "bg-emerald-500 text-white"
          : "bg-slate-100 text-slate-400"
      }`}
    >
      {completed ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        number
      )}
    </div>

    <div>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-xs font-bold text-slate-700">
          {title}
        </h3>

        {active && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700">
            CURRENT
          </span>
        )}
      </div>

      <p className="mt-1 text-[11px] leading-5 text-slate-400">
        {description}
      </p>
    </div>
  </div>
);

export default ChallengeDetails;