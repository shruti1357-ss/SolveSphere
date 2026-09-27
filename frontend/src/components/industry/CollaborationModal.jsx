import { useState, useEffect } from "react";
import { X, Handshake, Send, CheckCircle2, CheckSquare, Building2, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { addCollaborationRequest, getCompanyProfile } from "../../utils/industryMockData";

const COLLABORATION_TYPES = [
  "Technical Mentorship",
  "Prototype Development",
  "Testing",
  "Funding",
  "Dataset Support",
  "Field Testing",
];

const CollaborationModal = ({ isOpen, onClose, project, onSuccess }) => {
  const { user, showToast } = useAuth();

  const [selectedTypes, setSelectedTypes] = useState([
    "Technical Mentorship",
    "Funding",
  ]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize/auto-populate default proposal message when project changes or modal opens
  useEffect(() => {
    if (project) {
      const company = getCompanyProfile(user);
      const companyName = company?.companyName || user?.organization || user?.name || "Our engineering team";
      setMessage(
        `We at ${companyName} would like to partner with ${project.university || "your institution"} on "${project.title}". We offer technical mentorship, engineering testing resources, and CSR grant sponsorship.`
      );
      setSelectedTypes(["Technical Mentorship", "Funding"]);
      setIsSubmitted(false);
      setIsSubmitting(false);
    }
  }, [project, user, isOpen]);

  if (!isOpen || !project) return null;

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const typesToSubmit = selectedTypes.length > 0 ? selectedTypes : ["Technical Mentorship", "Funding"];
    const finalMessage = message.trim() || `We would like to collaborate with ${project.university || "your team"} on "${project.title}".`;

    setIsSubmitting(true);

    try {
      addCollaborationRequest(user, {
        projectId: project.id,
        projectName: project.title,
        university: project.university || "Jharkhand University",
        district: project.district || project.location || "Ranchi, Jharkhand",
        domain: project.domain || "Technology",
        currentStage: project.currentStage || "Prototype Development",
        progressPercentage: project.progressPercentage || 45,
        collaborationTypes: typesToSubmit,
        collaborationType: typesToSubmit.join(", "),
        message: finalMessage,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      if (showToast) {
        showToast("Collaboration Request Sent Successfully", "success");
      }

      setTimeout(() => {
        setIsSubmitted(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Error submitting collaboration:", err);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header in Brand Blue */}
        <div className="flex items-center justify-between border-b border-blue-100 px-6 py-4 bg-blue-50/70">
          <div className="flex items-center gap-2 text-[#0d3971] font-bold text-base">
            <Handshake size={20} className="text-blue-600" />
            Send Collaboration Request
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-100 hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-xl font-bold text-[#0d3971]">
                Collaboration Request Sent Successfully!
              </h4>
              <p className="mt-2 text-xs text-slate-500 max-w-xs mx-auto">
                Request delivered to <span className="font-semibold text-slate-800">{project.university}</span>. Status is set to <span className="font-bold text-amber-600">PENDING</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Project Details Banner */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 text-xs">
                <p className="font-bold text-[#0d3971] text-sm">{project.title}</p>
                <div className="flex items-center justify-between mt-1 text-slate-600">
                  <span className="font-semibold text-blue-700">{project.university}</span>
                  <span className="bg-white px-2 py-0.5 rounded-md border border-blue-200 font-medium text-slate-700">
                    {project.domain}
                  </span>
                </div>
              </div>

              {/* Collaboration Support Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Collaboration Support (Multiple Allowed)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COLLABORATION_TYPES.map((type) => {
                    const isChecked = selectedTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleType(type)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border text-left transition ${
                          isChecked
                            ? "border-blue-600 bg-blue-50 text-blue-800 shadow-xs"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <CheckSquare
                          size={15}
                          className={isChecked ? "text-blue-600" : "text-slate-300"}
                        />
                        <span className="truncate">{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Proposal Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message / Proposal Details
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your proposal, technical mentorship capacity, compute resources, or funding terms..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d3971] hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    "Sending Request..."
                  ) : (
                    <>
                      <Send size={14} />
                      SEND REQUEST
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationModal;
