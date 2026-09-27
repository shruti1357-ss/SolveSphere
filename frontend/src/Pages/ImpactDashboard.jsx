import React, { useState } from "react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import ImpactCard from "../components/impact/ImpactCard";
import ImpactSearch from "../components/impact/ImpactSearch";
import {
  getAllImpactProjects,
  searchImpactProjects,
} from "../utils/impactData";
import {
  Sparkles,
  Users,
  Award,
  CheckCircle2,
  TrendingUp,
  MapPin,
  AlertCircle,
  BarChart3,
} from "lucide-react";

const ImpactDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("ALL");

  const allProjects = getAllImpactProjects();

  const filteredProjects = searchImpactProjects(searchQuery, selectedDomain);

  const domains = [
    "ALL",
    ...Array.from(new Set(allProjects.map((p) => p.domain))),
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 space-y-12">
        {/* Hero Banner Header */}
        <section className="relative overflow-hidden px-6 pt-12 pb-16 text-center bg-gradient-to-b from-[#06132d] via-slate-900 to-slate-950">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Public Impact Showcase</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Real-World Solutions & <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Measurable District Impact
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Explore successfully deployed university and industry collaborative solutions addressing real community challenges across districts in Jharkhand.
            </p>

            {/* Global Stats Overview Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-3xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1 backdrop-blur-xs">
                <span className="text-2xl font-black text-emerald-400 block">
                  12,400+
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  People Benefited
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1 backdrop-blur-xs">
                <span className="text-2xl font-black text-teal-300 block">
                  48+
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Deployed Solutions
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1 backdrop-blur-xs">
                <span className="text-2xl font-black text-cyan-400 block">
                  68%
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Avg Problem Reduction
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1 backdrop-blur-xs">
                <span className="text-2xl font-black text-amber-400 block">
                  94.8%
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Solution Accuracy
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Location Search Bar Section */}
        <section className="px-6 relative z-20 -mt-8">
          <ImpactSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDomain={selectedDomain}
            setSelectedDomain={setSelectedDomain}
            domains={domains}
          />
        </section>

        {/* Solved Problems Cards Grid */}
        <section className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span>Implemented & Solved Challenges</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Showing {filteredProjects.length} verified deployed projects
                {searchQuery ? ` matching "${searchQuery}"` : ""}
              </p>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="bg-slate-900/60 p-12 text-center rounded-3xl border border-slate-800 space-y-3 max-w-xl mx-auto">
              <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Solved Projects Found</h3>
              <p className="text-xs text-slate-400">
                No implemented projects found matching location "{searchQuery}". Try searching for Dumka, Ranchi, Dhanbad, Jamshedpur, or Hazaribagh.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDomain("ALL");
                }}
                className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ImpactCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ImpactDashboard;
