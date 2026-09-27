import React, { useState } from "react";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  MessageSquare,
  BookOpen,
  Mail,
  Phone,
  ShieldCheck,
  Headphones,
  FileQuestion,
  LifeBuoy,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

const FAQS = [
  {
    category: "Challenge Scrutiny",
    question: "How does the Challenge Scrutiny workflow function?",
    answer:
      "When a civic or municipal department submits a new challenge, it lands in 'Pending Scrutiny'. Government Administrators evaluate the proposal for budget viability, impact metrics, and alignment. Approving it promotes the item to 'Active Challenges', making it visible for university and startup solution bidding.",
  },
  {
    category: "Solution Tracking",
    question: "What happens when a proposal is approved and assigned?",
    answer:
      "Approving a proposal confirms technical viability. Clicking 'Assign Project' launches a Live Tracking project with a designated overseer department, target deadline, and multi-phase milestones (Research → Planning → Prototyping → Testing → Deployment → Impact Measurement).",
  },
  {
    category: "Partner Verification",
    question: "How is Partner Verification processed?",
    answer:
      "Institutions (Universities, Industries, NGOs, Startups) register via the portal. Administrators review NAAC/NIRF accreditation, ISO certifications, or DPIIT recognition before clicking 'Verify'. Verified status grants priority access to public challenge RFPs.",
  },
  {
    category: "Reports & Analytics",
    question: "Can I export data for off-line reporting?",
    answer:
      "Yes! Navigate to 'Reports & Analytics' to export clean CSV datasets, download district-wise PDF dossiers, or use the 'Print Report' action for formatted physical reports.",
  },
  {
    category: "Early Warnings",
    question: "How are Early Warning Alerts triggered on the dashboard?",
    answer:
      "The AI engine continuously monitors citizen problem report density, keyword clustering (e.g. pipeline leakages, fever spikes, pothole hazards), and automated buoy telemetry. When signals cross the threshold, an early warning alert is generated for rapid departmental dispatch.",
  },
];

const HelpSupportPage = () => {
  const { showToast } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState(0);

  // Form State
  const [category, setCategory] = useState("Technical Inquiry");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showToast("Please fill out all required fields.", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      showToast("Support ticket dispatched successfully! Ticket ID: #TK-84920", "success");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 400);
  };

  const categories = ["All", "Challenge Scrutiny", "Solution Tracking", "Partner Verification", "Reports & Analytics", "Early Warnings"];

  const filteredFaqs = FAQS.filter((f) => {
    const matchesCategory = selectedCategory === "All" || f.category === selectedCategory;
    const matchesSearch =
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
            <LifeBuoy className="w-3.5 h-3.5" /> Technical Secretariat &amp; Assistance Desk
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
            Government Help &amp; Support Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search knowledgebase articles, review workflows, or dispatch urgent support tickets to the technical secretariat.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> 24/7 District Technical Cell
          </span>
        </div>
      </div>

      {/* Quick Contact Helpline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Headphones className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Technical Helpdesk</span>
            <p className="text-xs font-extrabold text-slate-800 truncate">+91 1800 345 6789</p>
            <span className="text-[10px] text-emerald-600 font-semibold">Toll-Free • 24/7 Available</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Secretariat Email</span>
            <p className="text-xs font-extrabold text-slate-800 truncate">gov.admin@jharkhand.gov.in</p>
            <span className="text-[10px] text-slate-500 font-medium">Avg. response &lt; 2 hrs</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Emergency Incident Desk</span>
            <p className="text-xs font-extrabold text-slate-800 truncate">disaster.cell@jharkhand.gov.in</p>
            <span className="text-[10px] text-red-600 font-semibold">Priority Escalation Cell</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FAQs Section (Left Column) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-blue-600" />
                  Knowledgebase &amp; FAQs
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Frequently asked questions about government review and verification procedures.
                </p>
              </div>
              <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
                {filteredFaqs.length} Articles
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search knowledgebase, workflows, or questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? "bg-[#1769c2] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Accordion FAQ Items */}
            <div className="space-y-2.5 pt-2">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;

                return (
                  <div
                    key={idx}
                    className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40 transition hover:border-blue-200"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-3.5 text-left font-bold text-xs text-slate-800 flex items-center justify-between hover:bg-slate-100/60 transition gap-2"
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-4 pt-2 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No help articles match your search criteria.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dispatch Support Ticket Form (Right Column) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Dispatch Support Ticket
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Send an official administrative inquiry to the Jharkhand technical secretariat.
              </p>
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Inquiry Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                >
                  <option value="Technical Inquiry">Technical Inquiry / System Access</option>
                  <option value="Scrutiny Escalation">Challenge Scrutiny Escalation</option>
                  <option value="Partner Accreditation">Partner Accreditation &amp; KYC</option>
                  <option value="System Bug Report">Portal Bug or Feature Request</option>
                  <option value="Other">Other Administrative Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                >
                  <option value="Low">Low Priority (Routine questions)</option>
                  <option value="Medium">Medium Priority (Standard inquiry)</option>
                  <option value="High">High Priority (Work blockage)</option>
                  <option value="Critical">Critical (Immediate dispatch needed)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subject Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary of issue or request..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Detailed Description
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the issue, challenge ID, or error message in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-[#1769c2] hover:bg-[#125aa8] text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Dispatching Ticket..." : "Submit Support Ticket"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
