import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ToastContainer from "./common/ToastContainer";

const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#f4f8fc] font-sans text-slate-800 antialiased">
      <Header
        onOpenMobile={() => setIsMobileOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex min-h-[calc(100vh-72px)]">
        <Sidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        <div className="flex-1 min-w-0">
          <main className="p-4 md:p-6 lg:p-7">
            <Outlet context={{ searchQuery }} />
          </main>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;
