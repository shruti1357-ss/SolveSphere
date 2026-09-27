import React, { useState } from "react";
import { Search, MapPin, TrendingUp, AlertTriangle, CheckCircle2, Award, ChevronRight, BarChart2, Filter } from "lucide-react";
import JharkhandDistrictMap from "../../components/admin/JharkhandDistrictMap";

const districtsData = [
  { district: "Ranchi", category: "Capital Region", totalReports: 412, verified: 289, pending: 78, rejected: 45, resolutionRate: 70, activeChallenges: 34, topIssue: "Roads & Traffic" },
  { district: "Dhanbad", category: "Mining Belt", totalReports: 198, verified: 142, pending: 38, rejected: 18, resolutionRate: 72, activeChallenges: 19, topIssue: "Air Quality & Dust" },
  { district: "East Singhbhum", category: "Industrial Hub", totalReports: 189, verified: 134, pending: 36, rejected: 19, resolutionRate: 71, activeChallenges: 22, topIssue: "Water Contamination" },
  { district: "West Singhbhum", category: "Tribal Sector", totalReports: 156, verified: 118, pending: 28, rejected: 10, resolutionRate: 76, activeChallenges: 15, topIssue: "Drinking Water" },
  { district: "Bokaro", category: "Steel & Power", totalReports: 134, verified: 102, pending: 24, rejected: 8, resolutionRate: 76, activeChallenges: 12, topIssue: "Waste Management" },
  { district: "Khunti", category: "Rural & Forest", totalReports: 124, verified: 89, pending: 23, rejected: 12, resolutionRate: 72, activeChallenges: 14, topIssue: "Irrigation Supply" },
  { district: "Giridih", category: "Central Plateau", totalReports: 96, verified: 71, pending: 17, rejected: 8, resolutionRate: 74, activeChallenges: 9, topIssue: "Power Outages" },
  { district: "Garhwa", category: "Western Border", totalReports: 98, verified: 64, pending: 20, rejected: 14, resolutionRate: 65, activeChallenges: 8, topIssue: "Heat Wave Relief" },
  { district: "Palamu", category: "North West Zone", totalReports: 112, verified: 78, pending: 22, rejected: 12, resolutionRate: 70, activeChallenges: 11, topIssue: "Drought Monitoring" },
  { district: "Deoghar", category: "Cultural & Tourism", totalReports: 72, verified: 52, pending: 12, rejected: 8, resolutionRate: 72, activeChallenges: 7, topIssue: "Sanitation Infrastructure" },
  { district: "Hazaribagh", category: "North Plateau", totalReports: 88, verified: 62, pending: 18, rejected: 8, resolutionRate: 70, activeChallenges: 9, topIssue: "Healthcare Access" },
  { district: "Dumka", category: "Santhal Pargana", totalReports: 82, verified: 58, pending: 16, rejected: 8, resolutionRate: 71, activeChallenges: 8, topIssue: "Rural Connectivity" },
];

const StateAllDistrictsPage = ({ tab = "all" }) => {
  const [search, setSearch] = useState("");
  const [selectedSort, setSelectedSort] = useState("total"); // "total" | "rate" | "name"

  const filteredDistricts = districtsData
    .filter(
      (d) =>
        d.district.toLowerCase().includes(search.toLowerCase()) ||
        d.topIssue.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (selectedSort === "total") return b.totalReports - a.totalReports;
      if (selectedSort === "rate") return b.resolutionRate - a.resolutionRate;
      return a.district.localeCompare(b.district);
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            {tab === "departments" ? "Department Workload" : "State Administration"}
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
            {tab === "departments" ? "State Departments Overview" : "All Districts Performance"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare performance metrics, resolution rates, and active challenges across all 24 districts of Jharkhand.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search district or issue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:bg-white focus:border-blue-400"
            />
          </div>

          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="total">Sort by Total Reports</option>
            <option value="rate">Sort by Resolution Rate</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Map + Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-blue-600" /> Jharkhand Geographic Performance Heatmap
          </h2>
          <JharkhandDistrictMap
            districts={districtsData.map((d) => ({ district: d.district, count: d.totalReports }))}
          />
        </div>

        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 mb-1">Statewide District Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-100 bg-blue-50/50 p-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Districts Tracked</span>
              <p className="text-xl font-black text-blue-900 mt-1">24</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-emerald-50/50 p-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Avg Resolution</span>
              <p className="text-xl font-black text-emerald-900 mt-1">71 font-%</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-purple-50/50 p-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Active Challenges</span>
              <p className="text-xl font-black text-purple-900 mt-1">218</p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-900">
            <p className="font-bold flex items-center gap-1.5 text-amber-800">
              <AlertTriangle size={15} /> Early Action Required: Garhwa &amp; Palamu
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-800/90">
              High volume of drought/water shortage alerts detected in northwestern districts. Recommended state intervention.
            </p>
          </div>
        </div>
      </div>

      {/* District Table Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="py-3 px-3">District</th>
                <th className="py-3 px-3">Zone / Category</th>
                <th className="py-3 px-3 text-right">Total Reports</th>
                <th className="py-3 px-3 text-right text-emerald-700">Verified</th>
                <th className="py-3 px-3 text-right text-amber-700">Pending</th>
                <th className="py-3 px-3 text-right">Active Challenges</th>
                <th className="py-3 px-3 text-center">Resolution Rate</th>
                <th className="py-3 px-3">Top Issue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDistricts.map((d) => (
                <tr key={d.district} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3 font-extrabold text-slate-900">{d.district}</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{d.category}</td>
                  <td className="py-3 px-3 text-right font-black text-slate-800">{d.totalReports}</td>
                  <td className="py-3 px-3 text-right font-semibold text-emerald-600">{d.verified}</td>
                  <td className="py-3 px-3 text-right font-semibold text-amber-600">{d.pending}</td>
                  <td className="py-3 px-3 text-right font-bold text-purple-600">{d.activeChallenges}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
                      {d.resolutionRate}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{d.topIssue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StateAllDistrictsPage;
