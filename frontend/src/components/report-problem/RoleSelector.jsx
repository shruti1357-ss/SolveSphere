import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { citizenText } from "../../i18n/citizenUi";
import { User, GraduationCap, Landmark, ShieldCheck } from "lucide-react";

const roles = [
  {
    id: "citizen",
    name: "Citizen",
    icon: User,
    desc: "Report local & community problems",
    badge: "Public Reporting",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400",
  },
  {
    id: "university",
    name: "University",
    icon: GraduationCap,
    desc: "Campus, student & academic research issues",
    badge: "Campus & R&D",
    color: "from-blue-500/20 to-indigo-500/10 border-blue-500/40 text-blue-400",
  },
  {
    id: "government",
    name: "Government",
    icon: Landmark,
    desc: "Civic infrastructure, municipal & policy issues",
    badge: "Official Civic",
    color: "from-amber-500/20 to-purple-500/10 border-amber-500/40 text-amber-400",
  },
];

const RoleSelector = ({ selectedRole, onChangeRole }) => {
  const { language } = useLanguage();
  const rt = (key, values) => citizenText(language, key, values);
  const localizedRoles = roles.map((role) => ({
    ...role,
    name: rt(role.id),
    desc: role.id === "citizen" ? rt("publicReporting") : role.id === "university" ? rt("campusResearch") : rt("officialCivic"),
    badge: role.id === "citizen" ? rt("publicReporting") : role.id === "university" ? rt("campusResearch") : rt("officialCivic"),
  }));
  return (
    <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" /> ROLE-BASED REPORTING
          </span>
          <h3 className="mt-2 text-lg font-bold text-white">{rt("selectWho")}</h3>
        </div>
        <p className="text-xs text-slate-400">
          {rt("roleReporting")}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {localizedRoles.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedRole === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onChangeRole(r.id)}
              className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 ${
                isSelected
                  ? `bg-gradient-to-br ${r.color} shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/50`
                  : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    isSelected ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isSelected ? "bg-emerald-400/20 text-emerald-300" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {r.badge}
                </span>
              </div>

              <div className="mt-3">
                <h4 className="text-base font-bold text-white">{r.name}</h4>
                <p className="mt-1 text-xs text-slate-400">{r.desc}</p>
              </div>

              {isSelected && (
                <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
