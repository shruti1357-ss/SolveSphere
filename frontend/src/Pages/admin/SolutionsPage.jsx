import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Download,
  Search,
  Eye,
  X,
  CheckCircle2,
  Building2,
  Users,
  MapPin,
  Tag,
  Calendar,
  Sparkles,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Layers,
  Award,
  Check,
} from "lucide-react";
import {
  getSubmittedSolutions,
  downloadSolutionPdf,
} from "../../utils/solutionStorage";

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("ALL");
  const [selectedSolution, setSelectedSolution] = useState(null);

  useEffect(() => {
    const loaded = getSubmittedSolutions();
    setSolutions(loaded);
  }, []);

  // Compute unique domains
  const domains = useMemo(() => {
    return [
      "ALL",
      ...Array.from(new Set(solutions.map((s) => s.domain || s.category || "General"))),
    ];
  }, [solutions]);

  const filteredSolutions = useMemo(() => {
    return solutions.filter((sol) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        sol.challengeTitle?.toLowerCase().includes(q) ||
        sol.university?.toLowerCase().includes(q) ||
        sol.challengeId?.toLowerCase().includes(q) ||
        sol.district?.toLowerCase().includes(q) ||
        sol.team?.toLowerCase().includes(q) ||
        sol.problemStatement?.toLowerCase().includes(q);

      const matchesDomain =
        selectedDomain === "ALL" ||
        (sol.domain || sol.category) === selectedDomain;

      return matchesSearch && matchesDomain;
    });
  }, [solutions, searchQuery, selectedDomain]);

  const summary = useMemo(() => {
    const uniqueUnis = new Set(solutions.map((s) => s.university)).size;
    const uniqueDistricts = new Set(solutions.map((s) => s.district)).size;
    const highPriorityCount = solutions.filter(
      (s) => (s.priority || "").toUpperCase() === "HIGH"
    ).length;

    return {
      total: solutions.length,
      universities: uniqueUnis || 4,
      districts: uniqueDistricts || 4,
      highPriority: highPriorityCount || 3,
    };
  }, [solutions]);

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">
              Citizen & HEI Submissions
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Submitted Solutions & Documentation
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review technical blueprints, implementation files, and verified PDF documentation submitted by partner universities across Jharkhand
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 shadow-xs">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">
              {solutions.length} Verified Solutions Received
            </span>
          </div>
        </div>
      </div>

      {/* 2. TOP KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Submitted Solutions
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.total}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 border border-emerald-100">
              <FileText size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Archived PDF blueprints & code
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Participating HEIs
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.universities}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 border border-blue-100">
              <GraduationCap size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            State universities & research labs
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Districts Covered
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.districts}
              </p>
            </div>
            <div className="rounded-xl bg-violet-50 p-3 text-violet-600 border border-violet-100">
              <MapPin size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Jharkhand target jurisdictions
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                High Priority Solved
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                {summary.highPriority}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 border border-amber-100">
              <Award size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Critical civic problems addressed
          </p>
        </div>
      </div>

      {/* 3. TABS & SEARCH BAR */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 pb-3">
        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {domains.map((domain) => {
            const isActive = selectedDomain === domain;
            const count =
              domain === "ALL"
                ? solutions.length
                : solutions.filter((s) => (s.domain || s.category) === domain).length;

            return (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{domain === "ALL" ? "All Domains" : domain}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by title, challenge ID, university, district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-72"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 4. SOLUTIONS CARDS GRID */}
      {filteredSolutions.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Solutions Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedDomain !== "ALL"
              ? "Try adjusting your search criteria or switching domain filters."
              : "No university has submitted solutions for challenges yet."}
          </p>
          {(searchQuery || selectedDomain !== "ALL") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDomain("ALL");
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSolutions.map((sol) => (
            <div
              key={sol.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group shadow-2xs"
            >
              {/* Card Header & Content */}
              <div className="p-5 space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
                        {sol.challengeId || sol.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200 uppercase">
                        Priority: {sol.priority || "HIGH"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                        <Check size={11} className="text-emerald-700" />
                        SUBMITTED
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 pt-0.5">
                      {sol.challengeTitle}
                    </h3>
                  </div>
                </div>

                {/* Problem Statement Snippet */}
                <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed italic">
                  "{sol.problemStatement}"
                </p>

                {/* Metadata 4-Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate font-semibold">{sol.university}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate font-medium">{sol.team}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate font-semibold">{sol.district || sol.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate font-medium">{sol.submissionDate}</span>
                  </div>
                </div>

                {/* Required Expertise Tags */}
                {Array.isArray(sol.requiredExpertise) && sol.requiredExpertise.length > 0 && (
                  <div className="pt-1 border-t border-slate-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <Tag size={11} />
                      Required Expertise:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {sol.requiredExpertise.map((exp, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedSolution(sol)}
                  className="px-3.5 py-2 bg-white text-slate-700 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Eye size={14} />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => downloadSolutionPdf(sol)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                >
                  <Download size={14} />
                  <span>Download Solution</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. SOLUTION DETAILS MODAL */}
      {selectedSolution && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedSolution(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
                    {selectedSolution.challengeId || selectedSolution.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold uppercase">
                    Priority: {selectedSolution.priority || "HIGH"}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <Check size={12} className="text-emerald-700" />
                    SUBMITTED
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedSolution.challengeTitle}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSolution(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-xs flex-1">
              {/* Problem Statement */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Problem Statement & Context
                </h4>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-800">
                  {selectedSolution.problemStatement}
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Domain / Category
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {selectedSolution.domain || selectedSolution.category || "General"}
                  </p>
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">
                    District / Location
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {selectedSolution.district || selectedSolution.location || "Jharkhand"}
                  </p>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                    Submission Date
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {selectedSolution.submissionDate}
                  </p>
                </div>
              </div>

              {/* Submitting HEI Team */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 size={13} className="text-emerald-600" />
                  Submitting Research Institution & Team
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      University
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {selectedSolution.university}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Team
                    </span>
                    <span className="text-xs font-bold text-indigo-700">
                      {selectedSolution.team}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Faculty Mentor
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {selectedSolution.facultyMentor || "Dr. Coordinator"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Required Expertise */}
              {Array.isArray(selectedSolution.requiredExpertise) &&
                selectedSolution.requiredExpertise.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Required Core Expertise
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSolution.requiredExpertise.map((exp, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Download Official PDF Box */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-lg shadow-2xs">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-emerald-950">
                      {selectedSolution.pdfFileName || "solution-document.pdf"}
                    </h5>
                    <p className="text-[10px] text-emerald-700">
                      Official Government of Jharkhand Certified Blueprint
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => downloadSolutionPdf(selectedSolution)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition shrink-0"
                >
                  <Download size={13} />
                  <span>Download PDF Document</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedSolution(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
