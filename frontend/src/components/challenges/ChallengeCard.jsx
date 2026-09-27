import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiUsers } from "react-icons/fi";

const ChallengeCard = ({
  id,
  category,
  title,
  description,
  location,
  participants,
  status,
  icon,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/50"
    >
      <div className="p-5">
    
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-600">
            ● {status}
          </span>
        </div>

        {/* Category */}
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-500">
          {category}
        </p>

        {/* Title */}
        <h3 className="mt-1.5 text-base font-bold leading-6 text-slate-800">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
          {description}
        </p>

        {/* Meta */}
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
              Location
            </p>
            <p className="mt-1 truncate text-[11px] font-medium text-slate-600 flex items-center gap-1">
              <FiMapPin size={12} className="text-emerald-500 shrink-0" /> {location}
            </p>
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
              Participants
            </p>
            <p className="mt-1 text-[11px] font-medium text-slate-600 flex items-center gap-1">
              <FiUsers size={12} className="text-emerald-500 shrink-0" /> {participants} joined
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate(`/challenges/${id}`)}
            className="rounded-xl border border-slate-200 bg-white py-2.5 text-[11px] font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600"
          >
            View Challenge
          </button>

          <button
            onClick={() => navigate(`/challenges/${id}/joined`)}
            className="rounded-xl bg-emerald-500 py-2.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-500/20"
          >
            Join Challenge
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChallengeCard;