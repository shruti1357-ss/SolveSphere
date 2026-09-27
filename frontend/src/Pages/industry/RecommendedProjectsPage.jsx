import { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Search, Filter, RefreshCw, Layers } from "lucide-react";

import IndustrySidebar from "../../components/industry/IndustrySidebar";
import IndustryTopbar from "../../components/industry/IndustryTopbar";
import ProjectCard from "../../components/industry/ProjectCard";
import CollaborationModal from "../../components/industry/CollaborationModal";

import { useAuth } from "../../context/AuthContext";
import {
  getCompanyProfile,
  MOCK_PROJECTS,
  calculateProjectMatch,
  AREAS_OF_INTEREST_OPTIONS,
} from "../../utils/industryMockData";

const RecommendedProjectsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProjectForModal, setSelectedProjectForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [version, setVersion] = useState(0);

  const { user } = useAuth();

  // Real-time synchronization listeners for collaborations
  useEffect(() => {
    const handleUpdate = () => setVersion((v) => v + 1);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("solvesphere_collaborations_updated", handleUpdate);
    window.addEventListener("solvesphere_university_updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("solvesphere_collaborations_updated", handleUpdate);
      window.removeEventListener("solvesphere_university_updated", handleUpdate);
    };
  }, []);

  const companyProfile = useMemo(() => {
    return getCompanyProfile(user);
  }, [user, version]);

  const userKey = String(
    user?.email || user?.organization || user?.name || "industry"
  ).toLowerCase().trim();

  // Real-time map of projectId / project title -> collaboration request status
  const requestedProjectsMap = useMemo(() => {
    const map = {};
    try {
      const saved =
        localStorage.getItem(`solvesphere_collaborations_${userKey}`) ||
        localStorage.getItem("solvesphere_collaboration_requests") ||
        localStorage.getItem("solvesphere_collaborations");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((req) => {
            if (req.projectId) {
              map[String(req.projectId).trim()] = req.status || "PENDING";
            }
            if (req.projectName) {
              map[req.projectName.toLowerCase().trim()] = req.status || "PENDING";
            }
          });
        }
      }
    } catch {}
    return map;
  }, [userKey, version]);

  // Extract registered expertise & interests
  const registeredTech = useMemo(() => {
    return Array.isArray(companyProfile?.technicalExpertise)
      ? companyProfile.technicalExpertise
      : [];
  }, [companyProfile]);

  const registeredAreas = useMemo(() => {
    return Array.isArray(companyProfile?.areasOfInterest)
      ? companyProfile.areasOfInterest
      : [];
  }, [companyProfile]);

  // Compute matched and filtered projects matching the industry's registered profile
  const allMatchedProjects = useMemo(() => {
    const scored = MOCK_PROJECTS.map((proj) => {
      const matchScore = calculateProjectMatch(proj, companyProfile);

      // Check domain match
      const domainMatches = registeredAreas.some(
        (a) =>
          a.toLowerCase().includes((proj.domain || "").toLowerCase()) ||
          (proj.domain || "").toLowerCase().includes(a.toLowerCase())
      );

      // Check required tech overlap
      const techMatches = (proj.requiredExpertise || []).some((req) =>
        registeredTech.some(
          (t) =>
            t.toLowerCase().includes(req.toLowerCase()) ||
            req.toLowerCase().includes(t.toLowerCase())
        )
      );

      const industryDomainMatches =
        companyProfile?.industryDomain &&
        (proj.domain || "").toLowerCase().includes(companyProfile.industryDomain.toLowerCase());

      const isExpertiseMatch = domainMatches || techMatches || industryDomainMatches;

      return {
        ...proj,
        matchPercentage: matchScore,
        isExpertiseMatch,
      };
    });

    // Strictly filter to those matching registered expertise
    const matching = scored.filter((p) => p.isExpertiseMatch);
    const finalPool = matching.length > 0 ? matching : scored;

    return finalPool.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [companyProfile, registeredAreas, registeredTech]);

  // Filter projects by domain & search query
  const filteredProjects = useMemo(() => {
    return allMatchedProjects.filter((proj) => {
      const matchesDomain =
        selectedDomain === "All" ||
        proj.domain.toLowerCase() === selectedDomain.toLowerCase();

      const matchesSearch =
        searchQuery.trim() === "" ||
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proj.location || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proj.requiredExpertise || []).some((e) =>
          e.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesDomain && matchesSearch;
    });
  }, [allMatchedProjects, selectedDomain, searchQuery]);

  const handleOpenCollaborateModal = (project) => {
    setSelectedProjectForModal(project);
    setIsModalOpen(true);
  };

  const handleCollaborationSuccess = () => {
    setVersion((v) => v + 1);
  };

  return (
    <div className="min-h-screen bg-[#f5f9fd]">
      <IndustrySidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="ml-0 lg:ml-64">
        <IndustryTopbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="w-full px-4 py-6 sm:px-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#0d3971] sm:text-3xl flex items-center gap-2.5">
                  <Sparkles className="text-blue-600" />
                  Recommended Projects
                </h1>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Academic R&D projects dynamically matched by AI to your Technical Expertise & Areas of Interest.
                </p>
              </div>

              {/* Registered expertise indicators */}
              <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-blue-100 bg-white p-2.5 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active Filter:
                </span>
                {registeredAreas.slice(0, 3).map((area) => (
                  <span
                    key={area}
                    className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Search & Domain Filter Bar */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by project title, university, location, or expertise..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-400"
              />
            </div>

            {/* Filter Pill Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <Filter size={15} className="text-slate-400 shrink-0" />
              <button
                onClick={() => setSelectedDomain("All")}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition shrink-0 ${
                  selectedDomain === "All"
                    ? "bg-[#0d3971] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                All Domains ({allMatchedProjects.length})
              </button>

              {AREAS_OF_INTEREST_OPTIONS.slice(0, 5).map((domain) => {
                const count = allMatchedProjects.filter(
                  (p) => (p.domain || "").toLowerCase() === domain.toLowerCase()
                ).length;

                return (
                  <button
                    key={domain}
                    onClick={() => setSelectedDomain(domain)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition shrink-0 ${
                      selectedDomain === domain
                        ? "bg-[#0d3971] text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {domain} {count > 0 && `(${count})`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-blue-100 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3">
                <RefreshCw size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0d3971]">No Matching Projects Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No projects match your current search query or filter selection under your expertise domains.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDomain("All");
                }}
                className="mt-4 inline-flex items-center rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const status =
                  requestedProjectsMap[String(project.id).trim()] ||
                  requestedProjectsMap[project.title?.toLowerCase().trim()];

                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    matchPercentage={project.matchPercentage}
                    requestStatus={status}
                    onCollaborateClick={handleOpenCollaborateModal}
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Collaboration Modal */}
      <CollaborationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProjectForModal}
        onSuccess={handleCollaborationSuccess}
      />
    </div>
  );
};

export default RecommendedProjectsPage;
