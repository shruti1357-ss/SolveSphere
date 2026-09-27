import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  GraduationCap,
  MapPin,
  Sparkles,
  Handshake,
  UserCheck,
  Users,
  Target,
  CheckCircle,
  Clock,
} from "lucide-react";

import IndustrySidebar from "../../components/industry/IndustrySidebar";
import IndustryTopbar from "../../components/industry/IndustryTopbar";
import CollaborationModal from "../../components/industry/CollaborationModal";

import { useAuth } from "../../context/AuthContext";
import {
  getCompanyProfile,
  MOCK_PROJECTS,
  calculateProjectMatch,
} from "../../utils/industryMockData";

const IndustryProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();

  const companyProfile = useMemo(() => {
    return getCompanyProfile(user);
  }, [user]);

  // Find project by ID
  const project = useMemo(() => {
    const found = MOCK_PROJECTS.find((p) => p.id === id);
    if (!found) {
      return MOCK_PROJECTS[0];
    }
    return found;
  }, [id]);

  const matchPercentage = useMemo(() => {
    if (!project) return 80;
    return calculateProjectMatch(project, companyProfile);
  }, [project, companyProfile]);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-800">Project Not Found</h2>
          <button
            onClick={() => navigate("/industry-dashboard/recommended")}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
          >
            Back to Recommended Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <IndustrySidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="ml-0 lg:ml-64">
        <IndustryTopbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="w-full px-4 py-6 sm:px-6 lg:p-8 max-w-6xl">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </button>

          {/* Top Banner Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-emerald-100 bg-white p-6 sm:p-8 shadow-xs mb-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  {project.domain}
                </span>

                <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-100">
                  {project.currentStage}
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1 text-xs font-bold text-emerald-700">
                <Sparkles size={14} />
                {matchPercentage}% Match
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 sm:text-3xl leading-tight">
              {project.title}
            </h1>

            {/* University & Location Metadata */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-emerald-600 shrink-0" />
                <span>{project.university}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-slate-400 shrink-0" />
                <span>{project.location || project.district}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-500 uppercase tracking-wider text-[11px]">
                  Project Progress
                </span>
                <span className="text-emerald-700">{project.progressPercentage}% Completed</span>
              </div>

              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
                  style={{ width: `${project.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex items-center justify-end border-t border-slate-100 pt-5">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
              >
                <Handshake size={16} />
                Collaborate on this Project
              </button>
            </div>
          </motion.div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Main Info) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Problem Statement */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Problem Statement
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {project.problemStatement}
                </p>
              </div>

              {/* Current Requirements */}
              <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-6 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-2">
                  <Clock size={16} className="text-amber-600" />
                  Current Requirements / Support Needed
                </h3>
                <p className="text-sm text-amber-900 leading-relaxed">
                  {project.currentRequirements}
                </p>
              </div>

              {/* Expected Outcome */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  Expected Outcome
                </h3>
                <p className="text-sm text-emerald-900 leading-relaxed">
                  {project.expectedOutcome}
                </p>
              </div>
            </div>

            {/* Right Column (Team & Required Tech) */}
            <div className="space-y-6">
              {/* Faculty & Student Team */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  R&D Execution Team
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                      <UserCheck size={15} className="text-emerald-600" />
                      Faculty Mentor
                    </span>
                    <p className="text-slate-600 pl-5">{project.facultyMentor}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                      <Users size={15} className="text-emerald-600" />
                      Student Team
                    </span>
                    <p className="text-slate-600 pl-5">{project.studentTeam}</p>
                  </div>
                </div>
              </div>

              {/* Required Expertise */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Target size={15} className="text-emerald-600" />
                  Required Technical Expertise
                </h3>

                <div className="flex flex-wrap gap-2">
                  {Array.isArray(project.requiredExpertise) &&
                    project.requiredExpertise.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200"
                      >
                        {tech}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Collaboration Modal */}
      <CollaborationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={project}
      />
    </div>
  );
};

export default IndustryProjectDetailsPage;
