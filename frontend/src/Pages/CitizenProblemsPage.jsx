import { useState } from "react";
import { motion } from "motion/react";
import Sidebar from "../components/citizen-dashboard/Sidebar";
import Topbar from "../components/citizen-dashboard/Topbar";
import ProblemTable from "../components/citizen-dashboard/ProblemTable";
import { useLanguage } from "../context/LanguageContext";
import { citizenText } from "../i18n/citizenUi";

const CitizenProblemsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { language } = useLanguage();
  const t = (key, values) => citizenText(language, key, values);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="ml-0 lg:ml-64">
        <Topbar isSidebarOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <main className="w-full px-4 py-6 sm:px-6 lg:p-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              {t("citizen.myReportedProblems")}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {t("citizen.myReportedProblemsDesc")}
            </p>
          </motion.div>

          <ProblemTable localized />
        </main>
      </div>
    </div>
  );
};

export default CitizenProblemsPage;
