import React, { useMemo, useState } from "react";
import {
  FileSpreadsheet,
  Download,
  FileText,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Filter,
  MapPin,
  Layers,
  Sparkles,
  Search,
  Printer,
  X,
  FileDown,
  ChevronDown,
} from "lucide-react";
import { jsPDF } from "jspdf";

const JHARKHAND_DISTRICTS = [
  "All Districts",
  "Ranchi",
  "Dhanbad",
  "East Singhbhum",
  "West Singhbhum",
  "Bokaro",
  "Khunti",
  "Giridih",
  "Garhwa",
  "Palamu",
  "Hazaribagh",
  "Deoghar",
  "Dumka",
  "Ramgarh",
  "Jamtara",
  "Latehar",
  "Lohardaga",
  "Simdega",
  "Gumla",
  "Koderma",
  "Chatra",
  "Godda",
  "Sahibganj",
  "Pakur",
  "Saraikela Kharsawan",
];

const CATEGORY_OPTIONS = [
  "All Categories",
  "Water Management & Sanitation",
  "Rural & Urban Infrastructure",
  "Healthcare & MedTech",
  "Smart Education & Schools",
  "Environment & Clean Energy",
  "Agriculture & Rural Economy",
  "Public Policy & Governance",
];

const mockStateReports = [
  {
    id: "REP-001",
    title: "Jharkhand Monthly Civic Performance Scorecard (Aug 2026)",
    category: "Public Policy & Governance",
    district: "All Districts",
    type: "Executive PDF",
    size: "4.2 MB",
    date: "01 Sep 2026",
    description: "Statewide consolidated civic grievance resolution rates, SLA adherence, and department benchmark index.",
  },
  {
    id: "REP-002",
    title: "Statewide Water & Sanitation Infrastructure Audit",
    category: "Water Management & Sanitation",
    district: "All Districts",
    type: "Executive PDF",
    size: "12.8 MB",
    date: "28 Aug 2026",
    description: "Deep audit of rural drinking water pipelines, borewell sensors, fluoride filtration, and water ingress projects.",
  },
  {
    id: "REP-003",
    title: "District-wise Problem Resolution & HEI Assignment Summary",
    category: "All Categories",
    district: "Ranchi",
    type: "Executive PDF",
    size: "2.1 MB",
    date: "25 Aug 2026",
    description: "Comprehensive breakdown of university R&D solutions assigned across Jharkhand districts with lead PIs.",
  },
  {
    id: "REP-004",
    title: "Early Warning Signals & Environmental Risk Assessment Q2",
    category: "Environment & Clean Energy",
    district: "Dhanbad",
    type: "Executive PDF",
    size: "6.5 MB",
    date: "15 Aug 2026",
    description: "Mining corridor particulate air telemetry, river pollution alerts, and seasonal flash flood risks.",
  },
  {
    id: "REP-005",
    title: "CSR Capital Deployment & Industry Mentorship Audit",
    category: "Rural & Urban Infrastructure",
    district: "East Singhbhum",
    type: "Executive PDF",
    size: "3.4 MB",
    date: "10 Aug 2026",
    description: "Financial disbursement report of ₹77.2 Cr CSR capital across industry partners and student teams.",
  },
  {
    id: "REP-006",
    title: "Primary Health & Anganwadi Diagnostic Network Review",
    category: "Healthcare & MedTech",
    district: "Palamu",
    type: "Executive PDF",
    size: "2.8 MB",
    date: "05 Aug 2026",
    description: "ASHA kit rollouts, maternal anemia mapping, and telemedicine kiosks telemetry analysis.",
  },
  {
    id: "REP-007",
    title: "Smart Classroom & Solar Mesh Connectivity Report",
    category: "Smart Education & Schools",
    district: "Bokaro",
    type: "Executive PDF",
    size: "3.1 MB",
    date: "01 Aug 2026",
    description: "Tribal language audio kiosks, solar mesh WiFi coverage in remote schools, and digital attendance metrics.",
  },
];

const StateReportsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportConfig, setExportConfig] = useState({
    district: "All Districts",
    category: "All Categories",
    timeframe: "FY 2026–27",
    includeHEIs: true,
    includeCSR: true,
    includeCitizenStats: true,
  });
  const [isDownloading, setIsDownloading] = useState(false);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return mockStateReports.filter((rep) => {
      const matchSearch =
        rep.title.toLowerCase().includes(search.toLowerCase()) ||
        rep.description.toLowerCase().includes(search.toLowerCase());
      const matchDistrict =
        selectedDistrict === "All Districts" ||
        rep.district === "All Districts" ||
        rep.district.toLowerCase() === selectedDistrict.toLowerCase();
      const matchCategory =
        selectedCategory === "All Categories" ||
        rep.category === "All Categories" ||
        rep.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchDistrict && matchCategory;
    });
  }, [search, selectedDistrict, selectedCategory]);

  // Generate Official PDF Report using jsPDF
  const generatePdf = (title, district, category, timeframe = "FY 2026–27") => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let y = 14;

      // Top Primary Header Banner
      doc.setFillColor(13, 57, 113); // State Navy #0d3971
      doc.rect(0, 0, pageWidth, 28, "F");

      doc.setFillColor(37, 99, 235); // Blue Accent stripe
      doc.rect(0, 28, pageWidth, 2.5, "F");

      // Brand Title & State Emblem text
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text("Government of Jharkhand", margin, 11);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(
        "SolveSphere State Administration & Civic Governance Portal • Official Audit Report",
        margin,
        17
      );

      const dateStr = new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.setFontSize(8);
      doc.text(`Generated: ${dateStr}`, pageWidth - margin, 17, { align: "right" });

      y = 40;

      // Report Header Section
      doc.setTextColor(15, 23, 42); // Slate-900
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(title, margin, y);

      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Target Scope: District: ${district}  |  Category: ${category}  |  Period: ${timeframe}`,
        margin,
        y
      );

      y += 10;

      // Summary Metric Cards Container
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 24, 3, 3, "FD");

      // Metrics in 4 columns
      const colW = (pageWidth - margin * 2) / 4;
      const kpis = [
        { label: "Total Reports", value: district === "All Districts" ? "2,845" : "342" },
        { label: "Verified & Resolved", value: district === "All Districts" ? "2,139" : "289" },
        { label: "Active HEI Projects", value: district === "All Districts" ? "22" : "4" },
        { label: "CSR Fund Allocated", value: district === "All Districts" ? "₹77.2 Cr" : "₹18.5 Cr" },
      ];

      kpis.forEach((kpi, i) => {
        const xPos = margin + i * colW + 4;
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.setFont("helvetica", "bold");
        doc.text(kpi.label.toUpperCase(), xPos, y + 8);

        doc.setFontSize(11);
        doc.setTextColor(13, 57, 113);
        doc.text(kpi.value, xPos, y + 16);
      });

      y += 34;

      // Section 1: District Status Breakdown Table
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(13, 57, 113);
      doc.text("1. District Governance & Civic Resolution Status", margin, y);

      y += 6;

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, pageWidth - margin * 2, 7, "F");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "bold");
      doc.text("District / Area", margin + 3, y + 5);
      doc.text("Total Issues", margin + 45, y + 5);
      doc.text("Verified", margin + 75, y + 5);
      doc.text("Pending", margin + 105, y + 5);
      doc.text("Resolution Rate", margin + 135, y + 5);
      doc.text("SLA Target", margin + 165, y + 5);

      y += 7;

      const sampleRows = [
        { dist: district === "All Districts" ? "Ranchi" : district, total: "412", ver: "289", pend: "78", rate: "84.2%", sla: "≤ 12.4 Days" },
        { dist: district === "All Districts" ? "Dhanbad" : "Jharia / Sindri", total: "198", ver: "142", pend: "38", rate: "81.0%", sla: "≤ 14.2 Days" },
        { dist: district === "All Districts" ? "East Singhbhum" : "Mango / Sakchi", total: "189", ver: "134", pend: "36", rate: "79.8%", sla: "≤ 13.8 Days" },
        { dist: district === "All Districts" ? "Bokaro" : "Chas / Bermo", total: "134", ver: "102", pend: "24", rate: "82.5%", sla: "≤ 16.5 Days" },
        { dist: district === "All Districts" ? "Hazaribagh" : "Barkagaon / Chouparan", total: "95", ver: "68", pend: "18", rate: "77.9%", sla: "≤ 17.1 Days" },
        { dist: district === "All Districts" ? "Palamu" : "Medininagar / Patan", total: "112", ver: "79", pend: "22", rate: "76.4%", sla: "≤ 19.4 Days" },
      ];

      sampleRows.forEach((row, idx) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);

        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y, pageWidth - margin * 2, 6.5, "F");
        }

        doc.text(row.dist, margin + 3, y + 4.5);
        doc.text(row.total, margin + 45, y + 4.5);
        doc.text(row.ver, margin + 75, y + 4.5);
        doc.text(row.pend, margin + 105, y + 4.5);
        doc.text(row.rate, margin + 135, y + 4.5);
        doc.setTextColor(5, 150, 105);
        doc.setFont("helvetica", "bold");
        doc.text(row.sla, margin + 165, y + 4.5);

        y += 6.5;
      });

      y += 8;

      // Section 2: Assigned Higher Education Institution (HEI) & CSR Solutions
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(13, 57, 113);
      doc.text("2. Key Assigned Solutions & Corporate CSR Partnerships", margin, y);

      y += 6;

      const projectSamples = [
        {
          title: "Low-Cost Soil Moisture & NPK Micro-Sensor Node",
          lead: "Birsa Agricultural University",
          mentor: "Tata Steel Foundation",
          budget: "₹25 Lakhs",
          status: "Field Trials in Ormanjhi",
        },
        {
          title: "Real-time Particulate (PM2.5) Air Monitoring Array",
          lead: "IIT (ISM) Dhanbad",
          mentor: "Coal India Limited (CIL)",
          budget: "₹35 Lakhs",
          status: "Telemetry Deployed",
        },
        {
          title: "Industrial Effluent Real-Time Spectral Analyzer",
          lead: "NIT Jamshedpur",
          mentor: "Tata Steel CSR",
          budget: "₹55 Lakhs",
          status: "Field Trials on Subarnarekha",
        },
        {
          title: "Village Decentralized Biomass-Solar Hybrid Microgrid",
          lead: "Central University of Jharkhand",
          mentor: "NTPC CSR",
          budget: "₹48 Lakhs",
          status: "Turbine Installation",
        },
      ];

      projectSamples.forEach((p) => {
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, y, pageWidth - margin * 2, 12, 1.5, 1.5, "FD");

        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(p.title, margin + 3, y + 4.5);

        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(
          `HEI: ${p.lead}  |  CSR Partner: ${p.mentor}  |  Grant: ${p.budget}  |  Status: ${p.status}`,
          margin + 3,
          y + 9
        );

        y += 14;
      });

      // Official Footer Sign-off
      doc.setFillColor(241, 245, 249);
      doc.rect(0, 280, pageWidth, 17, "F");
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("GOVERNMENT OF JHARKHAND • CONFIDENTIAL STATE GOVERNANCE AUDIT", margin, 287);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Certified by SolveSphere Data & Analytics Command Center • For Internal Administration Use",
        margin,
        292
      );

      // Save Document
      const cleanFileName = `Jharkhand_State_Report_${district.replace(/\s+/g, "_")}_${category.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}.pdf`;
      doc.save(cleanFileName);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
            <FileSpreadsheet size={13} /> Official Governance Records
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">State Reports &amp; PDF Exports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Download official state governance scorecards, district audit summaries, and category impact assessments in PDF format.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2.5 shadow-sm transition cursor-pointer"
        >
          <FileDown size={15} /> Generate Custom PDF Export
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* District Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
            <MapPin size={13} className="text-blue-600" />
            <span className="text-slate-400 font-normal">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer"
            >
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
            <Layers size={13} className="text-purple-600" />
            <span className="text-slate-400 font-normal">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search report title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:bg-white focus:border-blue-400"
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Available Official State Reports</h2>
            <p className="text-[11px] text-slate-500">
              Showing {filteredReports.length} reports filtered by district &amp; category
            </p>
          </div>
          <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold">
            Live PDF Exporter
          </span>
        </div>

        <div className="space-y-3">
          {filteredReports.map((rep) => (
            <div
              key={rep.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-blue-50/20 hover:border-blue-200 hover:shadow-xs transition"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-100 mt-0.5">
                  <FileText size={20} />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs font-extrabold text-slate-900">{rep.title}</h3>
                    <span className="rounded-md bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-[9px] font-extrabold">
                      {rep.category}
                    </span>
                    <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[9px] font-extrabold flex items-center gap-1">
                      <MapPin size={9} /> {rep.district}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{rep.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                    <span className="font-mono text-slate-500">{rep.id}</span>
                    <span>•</span>
                    <span>{rep.type}</span>
                    <span>•</span>
                    <span>{rep.size}</span>
                    <span>•</span>
                    <span>{rep.date}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => generatePdf(rep.title, rep.district, rep.category)}
                disabled={isDownloading}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d3971] text-white hover:bg-blue-800 px-3.5 py-2 text-xs font-extrabold shadow-xs transition shrink-0 cursor-pointer self-start sm:self-center"
              >
                <Download size={13} />
                <span>Download PDF</span>
              </button>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs">
              No official reports match the selected district or category filter.
            </div>
          )}
        </div>
      </div>

      {/* Custom PDF Export Generator Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-700 border border-blue-200 mb-1">
                  <FileSpreadsheet size={12} />
                  Custom PDF Report Builder
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Generate District &amp; Category Report
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize the data parameters for your official state government PDF export.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Controls Form */}
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                  Target District
                </label>
                <select
                  value={exportConfig.district}
                  onChange={(e) => setExportConfig({ ...exportConfig, district: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-400"
                >
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                  Focus Problem Category
                </label>
                <select
                  value={exportConfig.category}
                  onChange={(e) => setExportConfig({ ...exportConfig, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-400"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                  Audit Timeframe
                </label>
                <select
                  value={exportConfig.timeframe}
                  onChange={(e) => setExportConfig({ ...exportConfig, timeframe: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-400"
                >
                  <option value="FY 2026–27">FY 2026–27 (Current)</option>
                  <option value="FY 2025–26">FY 2025–26</option>
                  <option value="Last 12 Months">Last 12 Months</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="block text-[10.5px] font-bold text-slate-500 uppercase">
                  Include Sections in PDF
                </span>
                <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeCitizenStats}
                    onChange={(e) =>
                      setExportConfig({ ...exportConfig, includeCitizenStats: e.target.checked })
                    }
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>District Civic Resolution Rates &amp; SLA Performance</span>
                </label>
                <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeHEIs}
                    onChange={(e) =>
                      setExportConfig({ ...exportConfig, includeHEIs: e.target.checked })
                    }
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>University Assigned R&amp;D Solutions &amp; PI Teams</span>
                </label>
                <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeCSR}
                    onChange={(e) =>
                      setExportConfig({ ...exportConfig, includeCSR: e.target.checked })
                    }
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>CSR Capital Deployment &amp; Industry Advisory Roster</span>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsExportModalOpen(false);
                  generatePdf(
                    `Jharkhand Custom Governance Audit (${exportConfig.district})`,
                    exportConfig.district,
                    exportConfig.category,
                    exportConfig.timeframe
                  );
                }}
                disabled={isDownloading}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-extrabold text-white hover:bg-blue-700 shadow-sm transition"
              >
                <Download size={13} />
                <span>Generate &amp; Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateReportsPage;

