import React from "react";
import Navbar from "./Navbar";
import ReportProblemSection from "../components/landing/ReportProblem";
import Footer from "./Footer";

const ReportProblemPage = () => {
  return (
    <div className="min-h-screen bg-[#06132d] flex flex-col justify-between">
      <Navbar />
      <main className="pt-20 flex-grow">
        <ReportProblemSection />
      </main>
      <Footer />
    </div>
  );
};

export default ReportProblemPage;
