import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  saveSolutionSubmission,
  getSolutionByChallengeId,
} from "../../utils/solutionStorage";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
} from "lucide-react";
import { FiCheck } from "react-icons/fi";

const SOLUTIONS_STORAGE_KEY = "solvesphere_solutions";

const DEMO_FACULTY_MENTORS = [
  {
    name: "Dr. Ananya Sharma",
    email: "ananya.sharma@university.edu",
    department: "Computer Science & Engineering",
  },
  {
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@university.edu",
    department: "Information Technology",
  },
  {
    name: "Dr. Priya Singh",
    email: "priya.singh@university.edu",
    department: "Electronics & Communication",
  },
];

const DEMO_CSR_PARTNERS = [
  {
    name: "Tata Steel CSR",
    type: "Corporate CSR",
    focus: "Community Development & Infrastructure",
  },
  {
    name: "Aditya Birla Group CSR",
    type: "Corporate CSR",
    focus: "Education, Health & Rural Development",
  },
  {
    name: "JSW Foundation",
    type: "CSR Foundation",
    focus: "Rural Development & Sustainability",
  },
  {
    name: "Reliance Foundation",
    type: "CSR Foundation",
    focus: "Health, Education & Livelihood",
  },
  {
    name: "Local Industry / MSME Partner",
    type: "Industry / MSME",
    focus: "Technology & Local Innovation",
  },
];

const SOLUTION_STATUSES = {
  PROPOSED: "PROPOSED",
  UNDER_REVIEW: "UNDER_REVIEW",
  APPROVED: "APPROVED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
};

const getStoredTeam = (teamId) => {
  if (!teamId) {
    return null;
  }

  try {
    const savedTeam = localStorage.getItem(`team-${teamId}`);

    if (!savedTeam) {
      return null;
    }

    return JSON.parse(savedTeam);
  } catch (error) {
    console.error("Failed to load team:", error);
    return null;
  }
};

const getStoredSolutions = () => {
  try {
    const saved = localStorage.getItem(SOLUTIONS_STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load solutions:", error);
    return [];
  }
};

/*
  Backend Solution.challenge is an integer ForeignKey.

  Frontend challenge references can look like:
  - 12
  - "12"
  - { id: 12 }
  - { backendId: 12 }
  - { challenge_id: 12 }

  But display IDs such as "CHL-1002" are NOT valid backend FK values.
*/
const getBackendChallengeId = (...sources) => {
  for (const source of sources) {
    if (source === null || source === undefined) {
      continue;
    }

    if (typeof source === "object") {
      const nestedCandidates = [
        source.backendId,
        source.backend_id,
        source.challenge_id,
        source.challengeId,
        source.id,
      ];

      for (const candidate of nestedCandidates) {
        const parsed = getBackendChallengeId(candidate);

        if (parsed !== null) {
          return parsed;
        }
      }

      continue;
    }

    if (typeof source === "number" && Number.isInteger(source)) {
      return source;
    }

    if (typeof source === "string") {
      const trimmed = source.trim();

      if (/^\d+$/.test(trimmed)) {
        const parsed = Number(trimmed);

        if (Number.isInteger(parsed)) {
          return parsed;
        }
      }
    }
  }

  return null;
};

const getChallengeDisplayId = (...sources) => {
  for (const source of sources) {
    if (source === null || source === undefined) {
      continue;
    }

    if (typeof source === "object") {
      const nestedCandidates = [
        source.displayId,
        source.display_id,
        source.challengeDisplayId,
        source.challenge_display_id,
        source.challengeId,
        source.challenge_id,
        source.id,
      ];

      for (const candidate of nestedCandidates) {
        const value = getChallengeDisplayId(candidate);

        if (value) {
          return value;
        }
      }

      continue;
    }

    const value = String(source).trim();

    if (value) {
      return value;
    }
  }

  return "";
};

const normalizeMilestones = (milestones) => {
  if (!Array.isArray(milestones) || milestones.length === 0) {
    return [
      {
        title: "Research & Planning",
        description:
          "Research the problem and finalize the solution approach.",
        status: "Pending",
      },
      {
        title: "Prototype Development",
        description:
          "Build and test the initial solution prototype.",
        status: "Pending",
      },
      {
        title: "Pilot & Validation",
        description:
          "Validate the solution with the target community.",
        status: "Pending",
      },
    ];
  }

  return milestones.map((milestone) => ({
    title: milestone?.title || "",
    description: milestone?.description || "",
    status: milestone?.status || "Pending",
  }));
};

const getStoredCustomValue = (
  value,
  predefinedList
) => {
  if (!value) {
    return "";
  }

  const exists = predefinedList.some(
    (item) => item.name === value
  );

  return exists ? "" : value;
};

const SolutionEditor = () => {
  const { teamId } = useParams();
  const { user, showToast } = useAuth();

  const [team, setTeam] = useState(null);
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [customMentor, setCustomMentor] = useState("");
  const [customCsrPartner, setCustomCsrPartner] = useState("");

  // Solution Submission & PDF Upload State
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [pdfDataUri, setPdfDataUri] = useState("");
  const [pdfValidationMsg, setPdfValidationMsg] = useState("");
  const [isSubmittingPdf, setIsSubmittingPdf] = useState(false);
  const [pdfSubmission, setPdfSubmission] = useState(null);

  const [solution, setSolution] = useState({
    id: "",
    title: "",
    challenge: null,
    challenge_reference: "",
    team_name: "",
    university_name: "",
    department: "",
    faculty_mentor: "",
    student_leader: "",
    proposal_summary: "",
    milestones: [
      {
        title: "Research & Planning",
        description:
          "Research the problem and finalize the solution approach.",
        status: "Pending",
      },
      {
        title: "Prototype Development",
        description:
          "Build and test the initial solution prototype.",
        status: "Pending",
      },
      {
        title: "Pilot & Validation",
        description:
          "Validate the solution with the target community.",
        status: "Pending",
      },
    ],
    csr_partner: "",
    csr_grant_amount: "",
    status: SOLUTION_STATUSES.PROPOSED,
  });

  useEffect(() => {
    const storedTeam = getStoredTeam(teamId);

    if (!storedTeam) {
      setTeam(null);
      return;
    }

    setTeam(storedTeam);

    const solutions = getStoredSolutions();

    const existingSolution = solutions.find(
      (item) =>
        String(item?.team_id || item?.teamId || "") ===
        String(teamId)
    );

    if (existingSolution) {
      const backendChallengeId = getBackendChallengeId(
        existingSolution.challenge,
        existingSolution.challenge_backend_id,
        existingSolution.challenge_id
      );

      const displayChallengeId =
        getChallengeDisplayId(
          existingSolution.challenge_reference,
          existingSolution.challengeDisplayId,
          existingSolution.challengeId,
          existingSolution.challenge
        );

      const normalizedSolution = {
        ...existingSolution,

        id:
          existingSolution.id ||
          `SOL-${Date.now()}`,

        challenge:
          backendChallengeId,

        challenge_backend_id:
          backendChallengeId,

        challenge_reference:
          displayChallengeId,

        team_id:
          existingSolution.team_id ||
          existingSolution.teamId ||
          teamId,

        team_name:
          existingSolution.team_name ||
          storedTeam.name ||
          "",

        university_name:
          existingSolution.university_name ||
          storedTeam.university ||
          storedTeam.university_name ||
          "",

        department:
          existingSolution.department ||
          storedTeam.department ||
          "",

        faculty_mentor:
          existingSolution.faculty_mentor ||
          storedTeam.faculty_mentor ||
          "",

        student_leader:
          existingSolution.student_leader ||
          storedTeam.leader?.name ||
          "",

        proposal_summary:
          existingSolution.proposal_summary ||
          "",

        milestones:
          normalizeMilestones(
            existingSolution.milestones
          ),

        csr_partner:
          existingSolution.csr_partner ||
          storedTeam.csr_partner ||
          "",

        csr_grant_amount:
          Number(
            existingSolution.csr_grant_amount ||
              storedTeam.csr_grant_amount ||
              0
          ),

        status:
          existingSolution.status ||
          SOLUTION_STATUSES.PROPOSED,
      };

      setSolution(normalizedSolution);

      const mentor =
        getStoredCustomValue(
          normalizedSolution.faculty_mentor,
          DEMO_FACULTY_MENTORS
        );

      const csrPartner =
        getStoredCustomValue(
          normalizedSolution.csr_partner,
          DEMO_CSR_PARTNERS
        );

      setCustomMentor(mentor);
      setCustomCsrPartner(csrPartner);

      return;
    }

    const teamChallengeBackendId =
      getBackendChallengeId(
        storedTeam.challenge_backend_id,
        storedTeam.challenge_id,
        storedTeam.challengeId,
        storedTeam.challenge
      );

    const teamChallengeDisplayId =
      getChallengeDisplayId(
        storedTeam.challengeDisplayId,
        storedTeam.challenge_display_id,
        storedTeam.challengeId,
        storedTeam.challenge_id,
        storedTeam.challenge
      );

    const existingMentor =
      storedTeam.faculty_mentor || "";

    const existingCsrPartner =
      storedTeam.csr_partner || "";

    setSolution((prev) => ({
      ...prev,

      id: `SOL-${Date.now()}`,

      challenge:
        teamChallengeBackendId,

      challenge_backend_id:
        teamChallengeBackendId,

      challenge_reference:
        teamChallengeDisplayId,

      team_id:
        teamId,

      team_name:
        storedTeam.name ||
        storedTeam.team_name ||
        "",

      university_name:
        storedTeam.university ||
        storedTeam.university_name ||
        storedTeam.organization ||
        "",

      department:
        storedTeam.department ||
        "",

      faculty_mentor:
        existingMentor,

      student_leader:
        storedTeam.leader?.name ||
        storedTeam.student_leader ||
        "",

      csr_partner:
        existingCsrPartner,

      csr_grant_amount:
        Number(
          storedTeam.csr_grant_amount || 0
        ),

      status:
        SOLUTION_STATUSES.PROPOSED,
    }));

    setCustomMentor(
      getStoredCustomValue(
        existingMentor,
        DEMO_FACULTY_MENTORS
      )
    );

    setCustomCsrPartner(
      getStoredCustomValue(
        existingCsrPartner,
        DEMO_CSR_PARTNERS
      )
    );

    const targetChallengeId =
      teamChallengeDisplayId ||
      storedTeam.challengeId ||
      storedTeam.challenge_id ||
      "CH-1024";

    const existingPdfSub = getSolutionByChallengeId(targetChallengeId);
    if (existingPdfSub) {
      setPdfSubmission(existingPdfSub);
    }
  }, [teamId]);

  const handlePdfFileChange = (e) => {
    const file = e.target.files?.[0];
    setPdfValidationMsg("");

    if (!file) {
      setSelectedPdfFile(null);
      setPdfDataUri("");
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setPdfValidationMsg("Only PDF files are accepted. Please select a valid .pdf file.");
      setSelectedPdfFile(null);
      setPdfDataUri("");
      return;
    }

    setSelectedPdfFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      setPdfDataUri(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenPdfConfirmation = () => {
    if (!selectedPdfFile) {
      setPdfValidationMsg("Please select a PDF file before submitting.");
      return;
    }
    setPdfValidationMsg("");
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmitSolutionPdf = () => {
    setIsSubmittingPdf(true);

    const challengeId =
      solution.challenge_reference ||
      team?.challengeId ||
      team?.challenge_id ||
      "CH-1024";

    const challengeTitle =
      team?.challengeName ||
      team?.challengeTitle ||
      solution.title ||
      "Crop Disease Detection System";

    const universityName =
      solution.university_name ||
      team?.university ||
      user?.organization ||
      "XYZ University";

    const teamName =
      solution.team_name ||
      team?.name ||
      "University Team";

    setTimeout(() => {
      const savedSubmission = saveSolutionSubmission({
        challengeId,
        challengeTitle,
        problemStatement:
          solution.proposal_summary ||
          "Farmers are facing difficulty identifying crop diseases at an early stage.",
        category: "Agriculture",
        domain: "Agriculture",
        district: "Dumka",
        location: "Dumka, Jharkhand",
        priority: "HIGH",
        requiredExpertise: ["AI/ML", "Computer Vision", "Agriculture Technology"],
        university: universityName,
        team: teamName,
        facultyMentor: solution.faculty_mentor || "Dr. Rajesh Kumar Sharma",
        pdfFileName: selectedPdfFile?.name || "solution-crop-disease-detection.pdf",
        pdfFileData: pdfDataUri,
      });

      setPdfSubmission(savedSubmission);
      setIsSubmittingPdf(false);
      setShowConfirmationModal(false);
      setShowSubmissionForm(false);
      if (showToast) showToast("Solution submitted successfully", "success");
    }, 500);
  };

  const update = (field, value) => {
    setSolution((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSaved(false);
    setSubmitted(false);
  };

  const handleMentorChange = (value) => {
    if (value === "__custom__") {
      setSolution((prev) => ({
        ...prev,
        faculty_mentor: customMentor,
      }));
    } else {
      setSolution((prev) => ({
        ...prev,
        faculty_mentor: value,
      }));
    }

    setSaved(false);
    setSubmitted(false);
  };

  const handleCustomMentorChange = (value) => {
    setCustomMentor(value);
    update("faculty_mentor", value);
  };

  const handleCsrPartnerChange = (value) => {
    if (value === "__custom__") {
      setSolution((prev) => ({
        ...prev,
        csr_partner: customCsrPartner,
      }));
    } else {
      setSolution((prev) => ({
        ...prev,
        csr_partner: value,
      }));
    }

    setSaved(false);
    setSubmitted(false);
  };

  const handleCustomCsrPartnerChange = (value) => {
    setCustomCsrPartner(value);
    update("csr_partner", value);
  };

  const updateMilestone = (
    index,
    field,
    value
  ) => {
    setSolution((prev) => ({
      ...prev,

      milestones: prev.milestones.map(
        (milestone, milestoneIndex) =>
          milestoneIndex === index
            ? {
                ...milestone,
                [field]: value,
              }
            : milestone
      ),
    }));

    setSaved(false);
    setSubmitted(false);
  };

  const addMilestone = () => {
    setSolution((prev) => ({
      ...prev,

      milestones: [
        ...prev.milestones,
        {
          title: "",
          description: "",
          status: "Pending",
        },
      ],
    }));

    setSaved(false);
    setSubmitted(false);
  };

  const removeMilestone = (index) => {
    setSolution((prev) => ({
      ...prev,

      milestones:
        prev.milestones.filter(
          (_, milestoneIndex) =>
            milestoneIndex !== index
        ),
    }));

    setSaved(false);
    setSubmitted(false);
  };

  const saveMentorToTeam = (mentorName) => {
    if (!teamId || !mentorName) {
      return;
    }

    try {
      const savedTeam = getStoredTeam(teamId);

      if (!savedTeam) {
        return;
      }

      const updatedAt =
        new Date().toISOString();

      const updatedTeam = {
        ...savedTeam,

        faculty_mentor:
          mentorName,

        faculty_mentor_role:
          "FACULTY",

        updated_at:
          updatedAt,
      };

      localStorage.setItem(
        `team-${teamId}`,
        JSON.stringify(updatedTeam)
      );

      let allTeams = [];

      try {
        const parsedTeams = JSON.parse(
          localStorage.getItem("myTeams") ||
            "[]"
        );

        allTeams = Array.isArray(parsedTeams)
          ? parsedTeams
          : [];
      } catch {
        allTeams = [];
      }

      const updatedTeams =
        allTeams.map((item) =>
          String(item?.id || "") ===
          String(teamId)
            ? {
                ...item,
                faculty_mentor:
                  mentorName,
                faculty_mentor_role:
                  "FACULTY",
                updated_at:
                  updatedAt,
              }
            : item
        );

      localStorage.setItem(
        "myTeams",
        JSON.stringify(updatedTeams)
      );

      setTeam(updatedTeam);
    } catch (error) {
      console.error(
        "Failed to save faculty mentor:",
        error
      );
    }
  };

  const saveCsrToTeam = (
    partnerName,
    grantAmount
  ) => {
    if (!teamId) {
      return;
    }

    try {
      const savedTeam = getStoredTeam(teamId);

      if (!savedTeam) {
        return;
      }

      const numericGrant =
        Number(grantAmount || 0);

      const updatedAt =
        new Date().toISOString();

      const updatedTeam = {
        ...savedTeam,

        csr_partner:
          partnerName || "",

        csr_grant_amount:
          Number.isFinite(numericGrant)
            ? numericGrant
            : 0,

        updated_at:
          updatedAt,
      };

      localStorage.setItem(
        `team-${teamId}`,
        JSON.stringify(updatedTeam)
      );

      let allTeams = [];

      try {
        const parsedTeams = JSON.parse(
          localStorage.getItem("myTeams") ||
            "[]"
        );

        allTeams = Array.isArray(parsedTeams)
          ? parsedTeams
          : [];
      } catch {
        allTeams = [];
      }

      const updatedTeams =
        allTeams.map((item) =>
          String(item?.id || "") ===
          String(teamId)
            ? {
                ...item,

                csr_partner:
                  partnerName || "",

                csr_grant_amount:
                  Number.isFinite(numericGrant)
                    ? numericGrant
                    : 0,

                updated_at:
                  updatedAt,
              }
            : item
        );

      localStorage.setItem(
        "myTeams",
        JSON.stringify(updatedTeams)
      );

      setTeam(updatedTeam);
    } catch (error) {
      console.error(
        "Failed to save CSR collaboration:",
        error
      );
    }
  };

  const saveSolution = (
    status = SOLUTION_STATUSES.PROPOSED
  ) => {
    const finalMentor =
      solution.faculty_mentor ||
      customMentor ||
      team?.faculty_mentor ||
      "";

    const finalCsrPartner =
      solution.csr_partner ||
      customCsrPartner ||
      team?.csr_partner ||
      "";

    const rawGrantAmount =
      Number(
        solution.csr_grant_amount || 0
      );

    const finalGrantAmount =
      Number.isFinite(rawGrantAmount) &&
      rawGrantAmount >= 0
        ? rawGrantAmount
        : 0;

    const backendChallengeId =
      getBackendChallengeId(
        solution.challenge,
        solution.challenge_backend_id,
        team?.challenge_backend_id,
        team?.challenge_id,
        team?.challengeId,
        team?.challenge
      );

    const displayChallengeId =
      getChallengeDisplayId(
        solution.challenge_reference,
        solution.challengeDisplayId,
        team?.challengeDisplayId,
        team?.challengeId,
        team?.challenge_id,
        team?.challenge
      );

    /*
      Backend-compatible fields are kept exactly according
      to the Solution model.

      Extra frontend-only fields are retained separately
      for local UI functionality.
    */
    const finalSolution = {
      ...solution,

      id:
        solution.id ||
        `SOL-${Date.now()}`,

      // Backend FK field
      challenge:
        backendChallengeId,

      // Frontend display/reference field
      challenge_backend_id:
        backendChallengeId,

      challenge_reference:
        displayChallengeId,

      team_name:
        solution.team_name ||
        team?.name ||
        team?.team_name ||
        "",

      university_name:
        solution.university_name ||
        team?.university ||
        team?.university_name ||
        team?.organization ||
        "",

      department:
        solution.department ||
        team?.department ||
        "",

      faculty_mentor:
        finalMentor,

      student_leader:
        solution.student_leader ||
        team?.leader?.name ||
        team?.student_leader ||
        "",

      proposal_summary:
        solution.proposal_summary ||
        "",

      milestones:
        normalizeMilestones(
          solution.milestones
        ),

      csr_partner:
        finalCsrPartner,

      csr_grant_amount:
        finalGrantAmount,

      status:
        status,

      // Frontend-only relationship
      team_id:
        teamId,

      teamId:
        teamId,

      // Frontend-only display title
      challengeId:
        displayChallengeId,

      challengeTitle:
        team?.challengeName ||
        team?.challengeTitle ||
        "",

      created_at:
        solution.created_at ||
        new Date().toISOString(),

      updated_at:
        new Date().toISOString(),
    };

    const solutions =
      getStoredSolutions();

    const existingIndex =
      solutions.findIndex(
        (item) =>
          String(
            item?.id || ""
          ) ===
          String(
            finalSolution.id
          )
      );

    let updatedSolutions;

    if (existingIndex >= 0) {
      updatedSolutions =
        solutions.map(
          (item, index) =>
            index === existingIndex
              ? finalSolution
              : item
        );
    } else {
      updatedSolutions = [
        ...solutions,
        finalSolution,
      ];
    }

    localStorage.setItem(
      SOLUTIONS_STORAGE_KEY,
      JSON.stringify(
        updatedSolutions
      )
    );

    if (finalMentor) {
      saveMentorToTeam(
        finalMentor
      );
    }

    if (
      finalCsrPartner ||
      finalGrantAmount > 0
    ) {
      saveCsrToTeam(
        finalCsrPartner,
        finalGrantAmount
      );
    }

    setSolution(
      finalSolution
    );

    return finalSolution;
  };

  const handleSaveDraft = () => {
    saveSolution(
      SOLUTION_STATUSES.PROPOSED
    );

    setSaved(true);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    saveSolution(
      SOLUTION_STATUSES.UNDER_REVIEW
    );

    setSubmitted(true);
    setSaved(false);
  };

  const selectedDemoMentor =
    DEMO_FACULTY_MENTORS.some(
      (mentor) =>
        mentor.name ===
        solution.faculty_mentor
    )
      ? solution.faculty_mentor
      : solution.faculty_mentor
        ? "__custom__"
        : "";

  const selectedCsrPartner =
    DEMO_CSR_PARTNERS.some(
      (partner) =>
        partner.name ===
        solution.csr_partner
    )
      ? solution.csr_partner
      : solution.csr_partner
        ? "__custom__"
        : "";

  const hasCsrSupport =
    Boolean(
      solution.csr_partner
    ) ||
    Number(
      solution.csr_grant_amount || 0
    ) > 0;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
          Solution & Proposal
        </span>

        <h2 className="mt-1 text-xl font-bold text-slate-800">
          Build Your Solution
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Prepare your team's solution proposal for
          Government review.
        </p>
      </div>

      {/* Challenge / Team Summary */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Target Challenge
            </p>

            <h3 className="mt-1 text-sm font-bold text-slate-800">
              {team?.challengeName ||
                team?.challengeTitle ||
                "Community Challenge"}
            </h3>

            <p className="mt-1 font-mono text-[10px] text-emerald-600">
              {solution.challenge_reference ||
                team?.challengeId ||
                "Challenge ID"}
            </p>
          </div>

          <div className="rounded-xl bg-amber-50 px-3 py-2">
            <p className="text-[9px] font-bold uppercase tracking-wide text-amber-500">
              Proposal Status
            </p>

            <p className="mt-1 text-[10px] font-extrabold text-amber-700">
              {solution.status}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        {/* Basic Solution */}
        <section>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              Solution Overview
            </h3>

            <p className="mt-1 text-[10px] text-slate-400">
              Explain the proposed solution clearly.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600">
              Solution Title
            </label>

            <input
              value={
                solution.title || ""
              }
              onChange={(e) =>
                update(
                  "title",
                  e.target.value
                )
              }
              placeholder="e.g. Affordable Solar Water Purification"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
            />
          </div>

          <div className="mt-5">
            <label className="text-[11px] font-bold text-slate-600">
              Proposal Summary
            </label>

            <textarea
              rows={6}
              value={
                solution.proposal_summary ||
                ""
              }
              onChange={(e) =>
                update(
                  "proposal_summary",
                  e.target.value
                )
              }
              placeholder="Describe the problem, proposed approach, technology, implementation plan and expected impact..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-xs leading-6 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
            />
          </div>
        </section>

        {/* Team Details */}
        <section className="border-t border-slate-100 pt-6">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              Team & University
            </h3>

            <p className="mt-1 text-[10px] text-slate-400">
              These fields map directly to the Solution
              record.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Team Name"
              value={
                solution.team_name
              }
              onChange={(value) =>
                update(
                  "team_name",
                  value
                )
              }
              placeholder="Team name"
            />

            <Field
              label="University"
              value={
                solution.university_name
              }
              onChange={(value) =>
                update(
                  "university_name",
                  value
                )
              }
              placeholder="University name"
            />

            <Field
              label="Department"
              value={
                solution.department
              }
              onChange={(value) =>
                update(
                  "department",
                  value
                )
              }
              placeholder="e.g. Computer Science & Engineering"
            />

            <Field
              label="Student Leader"
              value={
                solution.student_leader
              }
              onChange={(value) =>
                update(
                  "student_leader",
                  value
                )
              }
              placeholder="Student leader name"
            />

            {/* Faculty Mentor */}
            <div className="sm:col-span-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <label className="text-[11px] font-bold text-slate-600">
                    Faculty Mentor
                  </label>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Assign a faculty member to guide and
                    review this solution.
                  </p>
                </div>

                {solution.faculty_mentor && (
                  <span className="flex items-center gap-1 w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-600">
                    <FiCheck className="h-3 w-3" /> Mentor Assigned
                  </span>
                )}
              </div>

              <select
                value={selectedDemoMentor}
                onChange={(e) => handleMentorChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-400"
              >
                <option value="">Select Faculty Mentor</option>
                {DEMO_FACULTY_MENTORS.map((mentor) => (
                  <option key={mentor.email} value={mentor.name}>
                    {mentor.name} — {mentor.department}
                  </option>
                ))}
                <option value="__custom__">Other Faculty Mentor</option>
              </select>

              {selectedDemoMentor ===
                "__custom__" && (
                <div className="mt-3">
                  <input
                    value={
                      customMentor
                    }
                    onChange={(e) =>
                      handleCustomMentorChange(
                        e.target.value
                      )
                    }
                    placeholder="Enter faculty mentor name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                  />
                </div>
              )}

              {solution.faculty_mentor && (
                <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-600">
                    Assigned Mentor
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {
                      solution.faculty_mentor
                    }
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Faculty mentor • Stored as{" "}
                    <span className="font-mono">
                      faculty_mentor
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="border-t border-slate-100 pt-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Project Milestones
              </h3>

              <p className="mt-1 text-[10px] text-slate-400">
                Define the major stages of your solution.
              </p>
            </div>

            <button
              type="button"
              onClick={addMilestone}
              className="rounded-xl border border-emerald-200 px-4 py-2 text-[10px] font-bold text-emerald-600 transition hover:bg-emerald-50"
            >
              + Add Milestone
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {solution.milestones.map(
              (milestone, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-600">
                      Milestone{" "}
                      {index + 1}
                    </span>

                    {solution.milestones
                      .length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeMilestone(
                            index
                          )
                        }
                        className="text-[9px] font-bold text-red-400 hover:text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    value={
                      milestone.title
                    }
                    onChange={(e) =>
                      updateMilestone(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="Milestone title"
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                  />

                  <textarea
                    rows={2}
                    value={
                      milestone.description
                    }
                    onChange={(e) =>
                      updateMilestone(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Describe this milestone..."
                    className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs leading-5 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                  />

                  <select
                    value={
                      milestone.status ||
                      "Pending"
                    }
                    onChange={(e) =>
                      updateMilestone(
                        index,
                        "status",
                        e.target.value
                      )
                    }
                    className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-600 outline-none focus:border-emerald-400"
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>
              )
            )}
          </div>
        </section>

        {/* Industry / CSR */}
        <section className="border-t border-slate-100 pt-6">
          <div className="mb-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Industry / CSR Collaboration
                </h3>

                <p className="mt-1 text-[10px] text-slate-400">
                  Connect an industry, startup, MSME or CSR
                  partner for funding and implementation support.
                </p>
              </div>

              {hasCsrSupport && (
                <span className="flex items-center gap-1 w-fit rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold text-blue-600">
                  <FiCheck className="h-3 w-3" /> Collaboration Added
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-600">
                CSR / Industry Partner
              </label>

              <select
                value={
                  selectedCsrPartner
                }
                onChange={(e) =>
                  handleCsrPartnerChange(
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
              >
                <option value="">
                  No external partner
                </option>

                {DEMO_CSR_PARTNERS.map(
                  (partner) => (
                    <option
                      key={
                        partner.name
                      }
                      value={
                        partner.name
                      }
                    >
                      {partner.name} —{" "}
                      {partner.type}
                    </option>
                  )
                )}

                <option value="__custom__">
                  Other Industry / CSR Partner
                </option>
              </select>

              {selectedCsrPartner ===
                "__custom__" && (
                <input
                  value={
                    customCsrPartner
                  }
                  onChange={(e) =>
                    handleCustomCsrPartnerChange(
                      e.target.value
                    )
                  }
                  placeholder="Enter industry / startup / MSME / CSR partner name"
                  className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                />
              )}

              {solution.csr_partner && (
                <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-blue-600">
                    Selected Partner
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {
                      solution.csr_partner
                    }
                  </p>

                  {DEMO_CSR_PARTNERS.some(
                    (partner) =>
                      partner.name ===
                      solution.csr_partner
                  ) && (
                    <p className="mt-1 text-[10px] text-slate-400">
                      {
                        DEMO_CSR_PARTNERS.find(
                          (partner) =>
                            partner.name ===
                            solution.csr_partner
                        )?.focus
                      }
                    </p>
                  )}

                  <p className="mt-2 text-[10px] text-slate-400">
                    Stored as{" "}
                    <span className="font-mono">
                      csr_partner
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600">
                CSR Grant Amount (INR)
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={
                  solution.csr_grant_amount
                }
                onChange={(e) =>
                  update(
                    "csr_grant_amount",
                    e.target.value
                  )
                }
                placeholder="0"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
              />

              <p className="mt-2 text-[9px] text-slate-400">
                Amount is stored as{" "}
                <span className="font-mono">
                  csr_grant_amount
                </span>{" "}
                in INR.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Collaboration Summary
              </p>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-500">
                    Partner
                  </span>

                  <span className="max-w-[60%] truncate text-right text-[10px] font-bold text-slate-700">
                    {solution.csr_partner ||
                      "Not selected"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-500">
                    Grant
                  </span>

                  <span className="text-[10px] font-bold text-slate-700">
                    ₹
                    {Number(
                      solution.csr_grant_amount ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-[10px] font-bold text-amber-700">
              Collaboration is optional
            </p>

            <p className="mt-1 text-[9px] leading-5 text-amber-600">
              Teams can submit a proposal without a CSR partner.
              If external support is required, select a partner
              and enter the proposed CSR grant amount.
            </p>
          </div>
        </section>

        {/* ============================================================
            FINAL SOLUTION SUBMISSION FOR GOVERNMENT REVIEW
        ============================================================ */}
        <section className="border-t border-slate-200 pt-8 mt-8">
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">
                  Government Solution Submission
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Solution Submission
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Submit the final solution for this challenge to Government.
                </p>
              </div>

              {!pdfSubmission && !showSubmissionForm && (
                <button
                  type="button"
                  onClick={() => setShowSubmissionForm(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
                >
                  <Send size={15} />
                  SUBMIT SOLUTION
                </button>
              )}
            </div>

            {/* Post-submission Status Card */}
            {pdfSubmission && (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-white p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <CheckCircle2 size={18} />
                    Solution Status: <span className="underline font-black">SUBMITTED</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    Submitted: {pdfSubmission.submissionDate}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <FileText size={16} className="text-emerald-600 shrink-0" />
                  <span>File: {pdfSubmission.pdfFileName}</span>
                </div>
              </div>
            )}

            {/* Submission Form UI */}
            {showSubmissionForm && !pdfSubmission && (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-white p-6 space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Upload size={16} className="text-emerald-600" />
                    Final Solution Upload Form
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowSubmissionForm(false)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>

                {/* Info summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Challenge Title</span>
                    <span className="font-bold text-slate-800">
                      {team?.challengeName || team?.challengeTitle || solution.title || "Crop Disease Detection System"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Challenge ID</span>
                    <span className="font-mono font-bold text-emerald-600">
                      {solution.challenge_reference || team?.challengeId || "CH-1024"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">University</span>
                    <span className="font-semibold text-slate-800">
                      {solution.university_name || team?.university || user?.organization || "XYZ University"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Team</span>
                    <span className="font-semibold text-slate-800">
                      {solution.team_name || team?.name || "University Team"}
                    </span>
                  </div>
                </div>

                {/* PDF File Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Solution File (PDF Only) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfFileChange}
                      className="hidden"
                      id="solution-pdf-input"
                    />
                    <label
                      htmlFor="solution-pdf-input"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50/50 hover:bg-slate-100/60 cursor-pointer transition text-center"
                    >
                      <Upload size={24} className="text-emerald-600 mb-2" />
                      <span className="text-xs font-bold text-slate-700">
                        {selectedPdfFile ? "Change Selected PDF File" : "CHOOSE PDF FILE"}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1">
                        Only PDF documents are accepted
                      </span>
                    </label>
                  </div>

                  {/* Selected filename display */}
                  {selectedPdfFile && (
                    <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs text-emerald-800 font-semibold">
                      <div className="flex items-center gap-2 truncate">
                        <FileText size={16} className="text-emerald-600 shrink-0" />
                        <span className="truncate">{selectedPdfFile.name}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold shrink-0">Ready</span>
                    </div>
                  )}

                  {/* Validation Error Message */}
                  {pdfValidationMsg && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{pdfValidationMsg}</span>
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleOpenPdfConfirmation}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
                  >
                    <Send size={15} />
                    SUBMIT SOLUTION FOR THIS CHALLENGE
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Actions */}
        <div className="border-t border-slate-100 pt-6">
          {saved && (
            <p className="mb-3 flex items-center justify-end gap-1 text-[10px] font-semibold text-emerald-600">
              <FiCheck className="h-3 w-3" /> Draft saved locally
            </p>
          )}

          {submitted && (
            <p className="mb-3 flex items-center justify-end gap-1 text-[10px] font-semibold text-blue-600">
              <FiCheck className="h-3 w-3" /> Proposal submitted for Government review
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                handleSaveDraft
              }
              className="rounded-xl border border-slate-200 px-5 py-3 text-[10px] font-bold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={
                handleSubmit
              }
              className="rounded-xl bg-emerald-500 px-5 py-3 text-[10px] font-bold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-600"
            >
              Submit Proposal →
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertCircle size={24} />
              <h4 className="text-base font-bold text-slate-900">Confirm Solution Submission</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Do you really want to submit this solution to Government?
            </p>

            {selectedPdfFile && (
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-700 font-semibold truncate">
                File: {selectedPdfFile.name}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmationModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                CANCEL
              </button>

              <button
                type="button"
                disabled={isSubmittingPdf}
                onClick={handleConfirmSubmitSolutionPdf}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs disabled:opacity-60"
              >
                {isSubmittingPdf ? "Submitting..." : "YES, SUBMIT"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>
      <label className="text-[11px] font-bold text-slate-600">
        {label}
      </label>

      <input
        value={value || ""}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={
          placeholder
        }
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
      />
    </div>
  );
};

export default SolutionEditor;