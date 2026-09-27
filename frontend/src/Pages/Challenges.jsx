import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  FaWater,
  FaRecycle,
  FaGraduationCap,
  FaRoad,
  FaHeartbeat,
  FaBolt,
  FaSeedling,
  FaSearch,
} from "react-icons/fa";

// import Sidebar from "../components/citizen-dashboard/Sidebar";
import Topbar from "../components/citizen-dashboard/Topbar";
import ChallengeCard from "../components/challenges/ChallengeCard";
import { useAuth } from "../context/AuthContext";

const BACKEND_CATEGORIES = [
  "Water Management",
  "Agriculture & FoodTech",
  "Health & MedTech",
  "Sanitation & Waste",
  "Rural Infrastructure",
  "Smart Education",
  "Clean Energy",
];

const demoChallenges = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

const CATEGORY_ICONS = {
  "Water Management": FaWater,
  "Agriculture & FoodTech": FaSeedling,
  "Health & MedTech": FaHeartbeat,
  "Sanitation & Waste": FaRecycle,
  "Rural Infrastructure": FaRoad,
  "Smart Education": FaGraduationCap,
  "Clean Energy": FaBolt,
};

const normalizeStatus = (status) => {
  const value = String(status || "")
    .trim()
    .toUpperCase();

  if (value === "ACTIVE") {
    return "OPEN";
  }

  if (
    value === "APPROVED" ||
    value === "APPROVED AS ACTIVE CHALLENGE"
  ) {
    return "OPEN";
  }

  if (value === "IN PROGRESS") {
    return "IN_PROGRESS";
  }

  return value || "OPEN";
};

const getCategoryIcon = (category = "") => {
  return CATEGORY_ICONS[category] || FaRoad;
};

/*
 * IMPORTANT:
 *
 * Joined count = number of TEAMS created for that challenge.
 *
 * We do NOT count:
 * - team members
 * - upvotes
 * - join requests
 *
 * Example:
 *
 * myTeams:
 * [
 *   { challengeId: "123", ... },
 *   { challengeId: "456", ... },
 *   { challengeId: "123", ... }
 * ]
 *
 * Result:
 * 123 -> 2 teams
 * 456 -> 1 team
 */
const getTeamParticipantCounts = () => {
  try {
    const teams = JSON.parse(
      localStorage.getItem("myTeams") || "[]"
    );

    if (!Array.isArray(teams)) {
      return {};
    }

    const counts = {};

    teams.forEach((team) => {
      const challengeId = String(
        team?.challengeId ?? ""
      );

      if (!challengeId) {
        return;
      }

      counts[challengeId] =
        (counts[challengeId] || 0) + 1;
    });

    return counts;
  } catch (error) {
    console.error(
      "Failed to read teams:",
      error
    );

    return {};
  }
};

const normalizeChallenge = (challenge, index = 0) => {
  const category =
    challenge?.category || "Rural Infrastructure";

  const status = normalizeStatus(
    challenge?.status
  );

  const urgencyScore = Number(
    challenge?.urgency_score ??
      challenge?.urgencyScore ??
      challenge?.severity_score ??
      0
  );

  const upvotes = Number(
    challenge?.upvotes ?? 0
  );

  const district =
    challenge?.district ||
    challenge?.location ||
    "Not specified";

  const block =
    challenge?.block || "";

  const latitude =
    challenge?.latitude ?? null;

  const longitude =
    challenge?.longitude ?? null;

  const assignedUniversity =
    challenge?.assigned_university ??
    challenge?.assignedUniversity ??
    null;

  const Icon = getCategoryIcon(category);

  return {
    ...challenge,

    id:
      challenge?.id ??
      challenge?.challengeId ??
      `CHL-${String(index + 1).padStart(4, "0")}`,

    title:
      challenge?.title ||
      "Community Challenge",

    description:
      challenge?.description || "",

    category,

    district,

    block,

    latitude,

    longitude,

    status,

    urgency_score: urgencyScore,

    upvotes,

    assigned_university:
      assignedUniversity,

    location: [
      district,
      block,
    ]
      .filter(Boolean)
      .join(", ") || "Not specified",

    displayStatus:
      status === "OPEN"
        ? "Open"
        : status === "UNDER_REVIEW"
        ? "Under Review"
        : status === "ASSIGNED_TO_HEI"
        ? "Assigned to University"
        : status === "IN_PROGRESS"
        ? "In Progress"
        : status === "RESOLVED"
        ? "Resolved"
        : status,

    backendStatus: status,

    /*
     * This is only a fallback.
     * The actual displayed value is replaced
     * from myTeams below.
     */
    participants: Number(
      challenge?.participants ?? 0
    ),

    Icon,
  };
};

const Challenges = () => {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("All");

  /*
   * Stores:
   *
   * {
   *   "challenge-id-1": 1,
   *   "challenge-id-2": 2
   * }
   *
   * Value = number of teams for that challenge.
   */
  const [
    teamParticipantCounts,
    setTeamParticipantCounts,
  ] = useState(() =>
    getTeamParticipantCounts()
  );

  const { userProblems = [] } =
    useAuth();

  /*
   * Refresh team count when user comes back
   * to the Challenges page/window.
   */
  useEffect(() => {
    const refreshTeamCounts = () => {
      setTeamParticipantCounts(
        getTeamParticipantCounts()
      );
    };

    window.addEventListener(
      "focus",
      refreshTeamCounts
    );

    return () => {
      window.removeEventListener(
        "focus",
        refreshTeamCounts
      );
    };
  }, []);

  /*
   * Citizen problems that have been approved/open
   * are converted into Challenge Pool entries.
   */
  const approvedChallenges = useMemo(() => {
    if (!Array.isArray(userProblems)) {
      return [];
    }

    return userProblems
      .filter((problem) => {
        const status = String(
          problem?.status || ""
        )
          .trim()
          .toLowerCase();

        return (
          status ===
            "approved as active challenge" ||
          status === "approved" ||
          status === "open"
        );
      })
      .map((problem, index) =>
        normalizeChallenge(
          {
            ...problem,

            id:
              problem?.id ??
              problem?.challengeId,

            category:
              problem?.backendCategory ||
              problem?.category ||
              "Rural Infrastructure",

            title:
              problem?.title ||
              "Community Challenge",

            description:
              problem?.description || "",

            district:
              problem?.district ||
              problem?.location ||
              "Not specified",

            block:
              problem?.block || "",

            latitude:
              problem?.latitude ?? null,

            longitude:
              problem?.longitude ?? null,

            status: "OPEN",

            urgency_score:
              problem?.urgency_score ??
              problem?.urgencyScore ??
              problem?.severity_score ??
              0,

            upvotes:
              problem?.upvotes ?? 0,

            assigned_university:
              problem?.assigned_university ??
              null,
          },
          index
        )
      );
  }, [userProblems]);

  /*
   * Demo + locally approved challenges.
   *
   * Then attach TEAM COUNT to every challenge.
   */
  const allChallenges = useMemo(() => {
    return [
      ...demoChallenges,
      ...approvedChallenges,
    ]
      .map(normalizeChallenge)
      .map((challenge) => {
        const challengeId = String(
          challenge?.id ?? ""
        );

        /*
         * ONLY number of teams.
         *
         * If no team exists:
         * 0
         *
         * If one team exists:
         * 1
         *
         * If two teams exist:
         * 2
         */
        const joinedCount =
          teamParticipantCounts[
            challengeId
          ] ?? 0;

        return {
          ...challenge,
          participants: joinedCount,
        };
      });
  }, [
    approvedChallenges,
    teamParticipantCounts,
  ]);

  const categories = [
    "All",
    ...BACKEND_CATEGORIES,
  ];

  const filteredChallenges = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return allChallenges.filter(
      (challenge) => {
        const searchableText = [
          challenge.id,
          challenge.title,
          challenge.description,
          challenge.category,
          challenge.district,
          challenge.block,
          challenge.assigned_university,
          challenge.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !searchText ||
          searchableText.includes(
            searchText
          );

        const matchesCategory =
          activeCategory === "All" ||
          challenge.category ===
            activeCategory;

        /*
         * University Challenge Pool only shows
         * OPEN challenges.
         */
        const isAvailable =
          challenge.backendStatus === "OPEN";

        return (
          matchesSearch &&
          matchesCategory &&
          isAvailable
        );
      }
    );
  }, [
    allChallenges,
    search,
    activeCategory,
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="ml-0 lg:ml-64">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="w-full px-4 py-6 sm:px-6 lg:p-8">
          {/* Hero */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-7"
          >
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Government Challenge Pool
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                  Explore Challenges
                </h1>

                <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-400">
                  Discover government-approved community
                  challenges and explore opportunities to
                  build practical solutions.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-72">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  type="text"
                  placeholder="Search challenges..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                />
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-[11px] font-semibold transition ${
                  activeCategory === category
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:text-emerald-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Count */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Available Challenges
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Government-approved challenges open for
                university participation
              </p>
            </div>

            <p className="text-[11px] text-slate-400">
              {filteredChallenges.length} challenges found
            </p>
          </div>

          {/* Cards */}
          {filteredChallenges.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredChallenges.map(
                (challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.06,
                      duration: 0.35,
                    }}
                  >
                    <ChallengeCard
                      {...challenge}
                      status={
                        challenge.displayStatus
                      }
                      location={
                        challenge.location
                      }
                      participants={
                        challenge.participants
                      }
                      icon={
                        challenge.Icon
                      }
                      upvotes={
                        challenge.upvotes
                      }
                      urgency_score={
                        challenge.urgency_score
                      }
                    />
                  </motion.div>
                )
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
              <div className="flex justify-center text-3xl text-slate-300">
                <FaSearch />
              </div>

              <h3 className="mt-3 text-sm font-bold text-slate-700">
                No challenges found
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Try another search or category.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Challenges;