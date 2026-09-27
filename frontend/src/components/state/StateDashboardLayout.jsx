import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StateHeader from "./StateHeader";
import StateSidebar from "./StateSidebar";

const StateDashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans antialiased text-slate-800 flex flex-col">
      {/* State Top Header */}
      <StateHeader onMobileMenuClick={() => setIsMobileOpen(true)} />

      {/* Body Grid: Sidebar + Main Content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <StateSidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto p-4 lg:ml-64 lg:p-6 bg-[#f4f7fb]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StateDashboardLayout;
