import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  GraduationCap,
  Building2,
  CheckCircle2,
  Clock,
  MessageSquare,
  CheckSquare,
  FileText,
  Users,
  Send,
  Sparkles,
  Download,
  Layers,
  CheckCircle,
} from "lucide-react";

import { FiCheck } from "react-icons/fi";

import IndustrySidebar from "../../components/industry/IndustrySidebar";
import IndustryTopbar from "../../components/industry/IndustryTopbar";
import Sidebar from "../../components/citizen-dashboard/Sidebar";
import Topbar from "../../components/citizen-dashboard/Topbar";

import { useAuth } from "../../context/AuthContext";
import {
  getCollaborationById,
  getWorkspaceMessages,
  addWorkspaceMessage,
  getWorkspaceTasks,
  toggleWorkspaceTask,
  updateCollaborationStatus,
} from "../../utils/industryMockData";

const CollaborationWorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("discussion");

  const { user, showToast } = useAuth();
  const isUniversityRole =
    user?.role === "University" ||
    user?.role === "University Student" ||
    user?.role === "Student";

  // Load collaboration details
  const collaboration = useMemo(() => {
    return getCollaborationById(id);
  }, [id]);

  // Live messages & tasks state
  const [messages, setMessages] = useState(() => getWorkspaceMessages(id));
  const [tasks, setTasks] = useState(() => getWorkspaceTasks(id));
  const [newMessageText, setNewMessageText] = useState("");
  const [status, setStatus] = useState(collaboration.status || "ACTIVE");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const senderName = user?.name || (isUniversityRole ? "University Team" : "Industry Partner");
    const roleLabel = isUniversityRole ? "University" : "Industry Partner";

    const updated = addWorkspaceMessage(id, senderName, newMessageText.trim(), roleLabel);
    setMessages(updated);
    setNewMessageText("");
  };

  const handleToggleTask = (taskId) => {
    const updated = toggleWorkspaceTask(id, taskId);
    setTasks(updated);
  };

  const handleMarkCompleted = () => {
    updateCollaborationStatus(id, "COMPLETED");
    setStatus("COMPLETED");
    showToast("Collaboration marked as COMPLETED!", "success");
  };

  const completedTasksCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Sidebar based on user role */}
      {isUniversityRole ? (
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      ) : (
        <IndustrySidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      )}

      <div className="ml-0 lg:ml-64">
        {isUniversityRole ? (
          <Topbar isSidebarOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        ) : (
          <IndustryTopbar isSidebarOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        )}

        <main className="w-full space-y-6 px-4 py-6 sm:px-6 lg:p-8">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          {/* WORKSPACE HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-100 flex items-center gap-1.5">
                  <Layers size={14} />
                  Shared Collaboration Workspace
                </span>

                <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  {collaboration.domain || "Technology"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {status === "COMPLETED" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                    <CheckCircle2 size={14} />
                    COMPLETED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                    <Sparkles size={14} />
                    ACTIVE COLLABORATION
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
              {collaboration.projectName}
            </h1>

            {/* University & Industry Partners */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <GraduationCap size={18} className="text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">University Team</span>
                  <span className="font-bold text-slate-800">{collaboration.university}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Building2 size={18} className="text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Industry Partner</span>
                  <span className="font-bold text-slate-800">{collaboration.companyName}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar & Mark Complete action */}
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500">Tasks Progress</span>
                  <span className="text-emerald-700">
                    {completedTasksCount} / {tasks.length} Completed
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                    style={{ width: `${(completedTasksCount / tasks.length) * 100}%` }}
                  />
                </div>
              </div>

              {status !== "COMPLETED" && (
                <button
                  onClick={handleMarkCompleted}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 shrink-0"
                >
                  <CheckCircle size={15} />
                  Mark Collaboration as Completed
                </button>
              )}
            </div>
          </motion.div>

          {/* WORKSPACE NAVIGATION TABS */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
            {[
              { id: "discussion", label: "Discussion", icon: MessageSquare },
              { id: "tasks", label: "Tasks Board", icon: CheckSquare },
              { id: "overview", label: "Overview", icon: Layers },
              { id: "resources", label: "Resources", icon: FileText },
              { id: "members", label: "Members", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shrink-0 ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT */}
          <div>
            {/* 1. DISCUSSION TAB */}
            {activeTab === "discussion" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Project Discussion</h3>
                  <p className="text-xs text-slate-500">
                    Real-time collaboration channel between {collaboration.university} and {collaboration.companyName}.
                  </p>
                </div>

                {/* Message list */}
                <div className="space-y-4 max-h-96 overflow-y-auto p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  {messages.map((msg) => {
                    const isSelf =
                      (isUniversityRole && msg.role === "University") ||
                      (!isUniversityRole && msg.role === "Industry Partner");

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold text-slate-700">{msg.sender}</span>
                          <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                        </div>

                        <div
                          className={`max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                            isSelf
                              ? "bg-emerald-600 text-white rounded-br-none"
                              : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type a message or project update..."
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs"
                  >
                    <Send size={15} />
                    Send
                  </button>
                </form>
              </div>
            )}

            {/* 2. TASKS TAB */}
            {activeTab === "tasks" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs max-w-3xl space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Collaboration Tasks & Milestones</h3>
                  <p className="text-xs text-slate-500">
                    Track key deliverables for prototype development and field testing.
                  </p>
                </div>

                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                        task.completed
                          ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                          : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <div
                          className={`h-5 w-5 rounded-md flex items-center justify-center border transition ${
                            task.completed
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {task.completed && <FiCheck className="h-3 w-3" />}
                        </div>
                        <span className={task.completed ? "line-through text-slate-500" : ""}>
                          {task.title}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          task.completed
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {task.completed ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6 max-w-4xl">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Collaboration Summary</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This active R&D partnership brings together research talent from{" "}
                    <span className="font-bold text-emerald-700">{collaboration.university}</span> and industry expertise from{" "}
                    <span className="font-bold text-emerald-700">{collaboration.companyName}</span> to solve key technological challenges in {collaboration.domain}.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Support Offered</span>
                      <p className="font-bold text-slate-800 mt-1">{collaboration.collaborationType}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Proposal Message</span>
                      <p className="font-medium text-slate-700 mt-1 italic">"{collaboration.message}"</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. RESOURCES TAB */}
            {activeTab === "resources" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs max-w-4xl space-y-4">
                <h3 className="text-base font-bold text-slate-900">Shared Project Resources</h3>
                <div className="space-y-3">
                  {[
                    "Project Proposal & R&D Roadmap.pdf",
                    "AI Model Architecture & Calibration Report.pdf",
                    "Testing & Field Trial Guidelines.pdf",
                    "Multispectral Dataset Samples.zip",
                  ].map((res) => (
                    <div
                      key={res}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-emerald-600" />
                        <span>{res}</span>
                      </div>
                      <button className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold">
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. MEMBERS TAB */}
            {activeTab === "members" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                {/* University Team */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <GraduationCap className="text-emerald-600" size={18} />
                    University R&D Team
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <span className="font-bold text-emerald-900 block">Faculty Lead / Mentor</span>
                      <p className="text-slate-700 mt-0.5">Dr. Rajesh Kumar Sharma (Dept. of Agronomy)</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-800 block">Student Innovators</span>
                      <p className="text-slate-600 mt-0.5">AgriTech Squad (4 Lead Researchers)</p>
                    </div>
                  </div>
                </div>

                {/* Industry Team */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Building2 className="text-emerald-600" size={18} />
                    Industry Partner Team
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <span className="font-bold text-emerald-900 block">Industry Contact Person</span>
                      <p className="text-slate-700 mt-0.5">{collaboration.contactPerson || "Rahul Kumar"} ({collaboration.companyName})</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-800 block">Technical Mentor</span>
                      <p className="text-slate-600 mt-0.5">Senior Computer Vision Lead (ABC Tech R&D Unit)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CollaborationWorkspacePage;
