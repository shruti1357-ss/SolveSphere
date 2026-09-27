import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import IndustrySidebar from "./IndustrySidebar";
import IndustryTopbar from "./IndustryTopbar";

const IndustryModuleLayout = ({ title, subtitle, icon, children }) => {
  const ModuleIcon = icon;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f9fd] text-slate-800">
      <IndustrySidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="ml-0 lg:ml-64">
        <IndustryTopbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="w-full px-4 py-6 sm:px-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Link to="/industry-dashboard" className="hover:text-blue-600 transition">Industry Dashboard</Link>
                <ChevronRight size={14} />
                <span className="text-[#164579] font-bold">{title}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
                  <ModuleIcon size={21} />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-[#0d3971] sm:text-3xl">{title}</h1>
                  <p className="mt-0.5 text-xs sm:text-sm text-[#275587] font-medium">{subtitle}</p>
                </div>
              </div>
            </div>
            <Link
              to="/industry-dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-xs font-bold text-[#0d3971] shadow-xs hover:bg-blue-50 hover:border-blue-300 transition"
            >
              Back to Dashboard <ArrowRight size={14} />
            </Link>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default IndustryModuleLayout;
