import React from "react";
import Navbar from "../components/landing/Navbar";
import ReportProblemSection from "./ReportProblem";
import { useAuth } from "../context/AuthContext";
// import Footer from "../components/landing/Footer";

const ReportProblemPage = () => {
  const { user } = useAuth();
  const role = String(user?.backendRole || user?.backend_role || user?.role || "").toUpperCase();
  const isCitizen = role === "CITIZEN" || user?.role === "Citizen";

  return (
    <div className="min-h-screen bg-[#06132d] flex flex-col justify-between">
      <Navbar />
      <main className="pt-20 flex-grow">
        <ReportProblemSection />
      </main>

    </div>
  );
};

export default ReportProblemPage;
