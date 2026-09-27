import React from "react";
import { Search, MapPin, X, Filter } from "lucide-react";

const ImpactSearch = ({
  searchQuery,
  setSearchQuery,
  selectedDomain,
  setSelectedDomain,
  domains = [],
  quickLocations = ["Dumka", "Ranchi", "Dhanbad", "Jamshedpur", "Hazaribagh"],
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200 shadow-lg space-y-4 max-w-4xl mx-auto">
      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-emerald-100 text-emerald-600 rounded-xl">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search district / city / location..."
          className="w-full pl-16 pr-12 py-4 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Location Shortcuts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-rose-500" />
          Quick Locations:
        </span>
        {quickLocations.map((loc) => (
          <button
            key={loc}
            onClick={() => setSearchQuery(searchQuery === loc ? "" : loc)}
            className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
              searchQuery.toLowerCase() === loc.toLowerCase()
                ? "bg-rose-500 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Domain Category Filter */}
      {domains.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 text-xs scrollbar-none">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3 text-emerald-500" />
            Domain:
          </span>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
                selectedDomain === dom
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImpactSearch;
