import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import BeforeAfter from "../components/impact/BeforeAfter";
import FeedbackCard from "../components/impact/FeedbackCard";
import { getImpactProjectById } from "../utils/impactData";
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Users,
  TrendingUp,
  Target,
  Building2,
  Cpu,
  Calendar,
  Layers,
  Award,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  DollarSign,
  Briefcase,
  GraduationCap,
} from "lucide-react";

const ImpactDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = getImpactProjectById(id);

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto text-center py-32 space-y-4 px-6">
          <h2 className="text-2xl font-bold">Impact Details Not Found</h2>
          <p className="text-xs text-slate-400">
            The requested impact project ID "{id}" could not be located.
          </p>
          <Link
            to="/impact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Impact Dashboard
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 space-y-12">
        {/* Header Hero Section */}
        <section className="bg-gradient-to-b from-[#06132d] via-slate-900 to-slate-950 border-b border-slate-800 px-6 py-10">
          <div className="max-w-6xl mx-auto space-y-6">
            <button
              onClick={() => navigate("/impact")}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Impact Dashboard</span>
            </button>

            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                  {project.challengeId || project.id}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {project.implementationStatus}
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                  {project.domain}
                </span>
                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {project.location}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {project.title}
              </h1>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 space-y-12">
          {/* SECTION 1: PROBLEM SECTION */}
          <section className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    PROBLEM STATEMENT
                  </h2>
                  <p className="text-xs text-slate-400">
                    Original challenge reported in {project.district} district
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-rose-500/10 text-rose-400 rounded-lg text-xs font-bold border border-rose-500/20">
                Severity: {project.problemSeverity || "High"}
              </span>
            </div>

            <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-200 text-sm md:text-base leading-relaxed font-normal">
              {project.fullProblem || project.problem}
            </div>

            {/* Problem Details Meta Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Location
                </span>
                <span className="text-white font-bold">{project.location}</span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Domain
                </span>
                <span className="text-indigo-400 font-bold">{project.domain}</span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  People Affected
                </span>
                <span className="text-rose-400 font-bold">
                  {project.peopleAffected?.toLocaleString() || "N/A"}
                </span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Challenge ID
                </span>
                <span className="text-emerald-400 font-mono font-bold">
                  {project.challengeId || project.id}
                </span>
              </div>
            </div>
          </section>

          {/* SECTION 2: SOLUTION SECTION */}
          <section className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  SOLUTION OVERVIEW & TECHNOLOGY
                </h2>
                <p className="text-xs text-slate-400">
                  Developed through University and Industry Collaboration
                </p>
              </div>
            </div>

            <div className="p-5 bg-emerald-950/20 rounded-2xl border border-emerald-900/40 text-emerald-100 text-sm md:text-base leading-relaxed">
              {project.fullSolution || project.solution}
            </div>

            {/* Technologies Chips */}
            {Array.isArray(project.technologies) && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Technologies Used:
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-emerald-300 text-xs font-semibold border border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* SECTION 3: IMPLEMENTATION LIFECYCLE PIPELINE */}
          <section className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    REAL-WORLD IMPLEMENTATION LIFECYCLE
                  </h2>
                  <p className="text-xs text-slate-400">
                    Deployment journey from laboratory prototype to field implementation
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">
                {project.implementationDetails?.stage || "Fully Deployed"}
              </span>
            </div>

            {/* Milestone Steps */}
            {project.implementationDetails?.milestones && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {project.implementationDetails.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2 relative"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">{m.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Field Meta Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Implementation Period
                </span>
                <span className="text-white font-bold text-sm">
                  {project.implementationDetails?.period || "2025 - 2026"}
                </span>
              </div>

              <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Active Users
                </span>
                <span className="text-emerald-400 font-bold text-sm">
                  {project.implementationDetails?.usersCount || "850+ Users"}
                </span>
              </div>

              <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Villages / Panchayats Covered
                </span>
                <span className="text-indigo-400 font-bold text-sm">
                  {project.villagesCovered} Villages
                </span>
              </div>
            </div>
          </section>

          {/* SECTION 4 & 5: IMPACT METRICS & SOLUTION ACCURACY */}
          <section className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 space-y-8 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  MEASURABLE IMPACT METRICS & ACCURACY
                </h2>
                <p className="text-xs text-slate-400">
                  Verified field outcomes and statistical performance
                </p>
              </div>
            </div>

            {/* Metrics Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-center space-y-1">
                <Users className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                <span className="text-2xl font-extrabold text-white block">
                  {project.peopleAffected?.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  People Affected
                </span>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-center space-y-1">
                <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-2xl font-extrabold text-emerald-400 block">
                  {project.peopleBenefited?.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  People Benefited
                </span>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-center space-y-1">
                <TrendingUp className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                <span className="text-2xl font-extrabold text-teal-400 block">
                  {project.growth}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Growth Rate
                </span>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-center space-y-1">
                <Target className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-2xl font-extrabold text-emerald-300 block">
                  {project.problemReduction}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Problem Reduction
                </span>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-2xl font-extrabold text-amber-400 block">
                  {project.solutionAccuracy}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Accuracy
                </span>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-center space-y-1">
                <MapPin className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                <span className="text-2xl font-extrabold text-rose-300 block">
                  {project.villagesCovered}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Villages Covered
                </span>
              </div>
            </div>

            {/* Solution Accuracy Detail Card */}
            <div className="p-6 bg-gradient-to-r from-slate-950 via-emerald-950/30 to-slate-950 rounded-2xl border border-emerald-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">
                  SOLUTION ACCURACY & PERFORMANCE VERIFICATION
                </span>
                <h3 className="text-2xl font-extrabold text-white">
                  {project.solutionAccuracy} Model Diagnostic Accuracy
                </h3>
                <p className="text-xs text-slate-300">
                  Verified field testing score: {project.successfulDetections || "High Accuracy"}
                </p>
              </div>

              {/* Progress Visualizer Bar */}
              <div className="w-full md:w-64 space-y-2 shrink-0">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Accuracy Score</span>
                  <span className="text-emerald-400">{project.solutionAccuracy}</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full transition-all duration-1000"
                    style={{
                      width: project.solutionAccuracy?.includes("%")
                        ? project.solutionAccuracy
                        : "94%",
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: BEFORE VS AFTER SECTION */}
          <section className="bg-white rounded-3xl p-8 shadow-xl text-slate-900">
            <BeforeAfter before={project.before} after={project.after} />
          </section>

          {/* SECTION 7: UNIVERSITY & INDUSTRY CONTRIBUTION */}
          <section className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  COLLABORATION PARTNERS
                </h2>
                <p className="text-xs text-slate-400">
                  Academic institution, industry lead, and development team
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <GraduationCap className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    University Partner
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white">{project.university}</h4>
                <p className="text-xs text-slate-400">Academic R&D & Model Engineering</p>
              </div>

              <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Briefcase className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Industry Partner
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white">{project.industryPartner}</h4>
                <p className="text-xs text-slate-400">Hardware Deployment & Mentorship</p>
              </div>

              <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400">
                  <Award className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Project Team
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{project.team}</h4>
                <p className="text-xs text-slate-400">
                  Mentor: {project.facultyMentor || "Faculty Lead"}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 8: USER FEEDBACK */}
          <section className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 shadow-xl">
            <FeedbackCard feedback={project.feedback} />
          </section>

          {/* SECTION 9: REAL-WORLD RESULT BANNER */}
          <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-8 text-white shadow-2xl space-y-4 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <Sparkles className="w-64 h-64" />
            </div>

            <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>FINAL OUTCOME SUMMARY</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              REAL-WORLD RESULT
            </h2>

            <p className="text-sm md:text-base text-emerald-50 leading-relaxed font-normal max-w-4xl">
              {project.realWorldResult}
            </p>

            <div className="pt-4 flex flex-wrap gap-4 text-xs font-bold">
              <span className="px-4 py-2 bg-slate-950/40 rounded-xl border border-emerald-400/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {project.peopleBenefited?.toLocaleString()} Beneficiaries
              </span>
              <span className="px-4 py-2 bg-slate-950/40 rounded-xl border border-emerald-400/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {project.problemReduction} Problem Reduction
              </span>
              <span className="px-4 py-2 bg-slate-950/40 rounded-xl border border-emerald-400/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {project.solutionAccuracy} Diagnostic Accuracy
              </span>
              <span className="px-4 py-2 bg-slate-950/40 rounded-xl border border-emerald-400/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {project.villagesCovered} Villages Transformed
              </span>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ImpactDetailsPage;
