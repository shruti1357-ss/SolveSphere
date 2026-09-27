import React from "react";
import { Star, Quote, MapPin, UserCheck } from "lucide-react";

const FeedbackCard = ({ feedback = [] }) => {
  if (!feedback || feedback.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Quote className="w-5 h-5 text-indigo-500" />
          <span>Beneficiary & Community Feedback</span>
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          Verified Field Testimonials
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {feedback.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Rating Stars */}
              <div className="flex items-center gap-1">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xs text-slate-700 italic leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-medium">
                "{item.quote}"
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs border border-emerald-200 shrink-0">
                {item.name ? item.name.charAt(0) : "U"}
              </div>
              <div className="overflow-hidden">
                <h5 className="text-xs font-bold text-slate-800 truncate">
                  {item.name}
                </h5>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="font-medium text-emerald-700">{item.role}</span>
                  <span>•</span>
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackCard;
