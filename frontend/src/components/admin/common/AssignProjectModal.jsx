import React, { useState } from "react";
import { X, Rocket } from "lucide-react";

const AssignProjectModal = ({ isOpen, onClose, onAssign, proposal }) => {
  const [department, setDepartment] = useState("Urban Innovation Task Force");
  const [deadline, setDeadline] = useState("2027-02-28");

  if (!isOpen || !proposal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(proposal.id, { department, deadline });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2 text-emerald-600 font-bold">
            <Rocket className="w-5 h-5" />
            <h3 className="text-base text-slate-800">Assign to Live Tracking</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm text-slate-600">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Proposal Details
            </label>
            <p className="font-semibold text-slate-800 text-base">{proposal.challengeTitle || proposal.organization}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Organization: <span className="font-medium text-slate-700">{proposal.organization}</span> (Budget: {proposal.estimatedCost})
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assign Overseeing Department
            </label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Completion Deadline
            </label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
            >
              Assign & Create Live Tracking Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignProjectModal;
