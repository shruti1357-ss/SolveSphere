import { FiFileText, FiAward, FiUsers, FiBriefcase, FiCheckCircle } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";

const getStats = (t) => [
  {
    icon: FiFileText,
    number: "124+",
    label: t("landing.stats.problems"),
    color: "text-cyan-500",
    bg: "bg-cyan-50",
  },
  {
    icon: FiAward,
    number: "38+",
    label: t("landing.stats.challenges"),
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: FiUsers,
    number: "72+",
    label: t("landing.stats.teams"),
    color: "text-teal-500",
    bg: "bg-teal-50",
  },
  {
    icon: FiBriefcase,
    number: "24+",
    label: t("landing.stats.mentors"),
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: FiCheckCircle,
    number: "15+",
    label: t("landing.stats.solutions"),
    color: "text-green-500",
    bg: "bg-green-50",
  },
];

const Stats = () => {
  const { t } = useLanguage();
  const stats = getStats(t);
  return (
    <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-4">
      <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 md:grid-cols-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`flex items-center gap-3 px-5 py-5 ${
                index !== stats.length - 1
                  ? "border-b border-slate-100 md:border-b-0 md:border-r"
                  : ""
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${stat.bg} ${stat.color} text-lg`}
              >
                <Icon size={20} />
              </div>

              <div>
                <div className="text-xl font-extrabold text-slate-800">
                  {stat.number}
                </div>

                <div className="text-[9px] font-medium text-slate-500">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Stats;
