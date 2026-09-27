import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Activity,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  MapPin,
  Navigation,
  Radio,
  Search,
  Building2,
  Calendar,
  AlertTriangle,
  Layers,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  RotateCcw,
  Edit3,
  X,
  Send,
} from "lucide-react";

import { useAdmin } from "../../context/AdminContext";
import StatusBadge from "../../components/admin/common/StatusBadge";
import ProgressBar from "../../components/admin/common/ProgressBar";
import EmptyState from "../../components/admin/common/EmptyState";

const PHASES = ["Research", "Prototype", "Testing", "Deployment", "Impact"];

const DISTRICT_SEEDS = [
  { district: "Ranchi", latitude: 23.3441, longitude: 85.3096, challenges: 18, urgency: 8.4 },
  { district: "East Singhbhum", latitude: 22.8046, longitude: 86.2029, challenges: 16, urgency: 7.8 },
  { district: "Dhanbad", latitude: 23.7957, longitude: 86.4304, challenges: 15, urgency: 8.1 },
  { district: "Bokaro", latitude: 23.6693, longitude: 86.1511, challenges: 13, urgency: 7.4 },
  { district: "Hazaribagh", latitude: 23.992, longitude: 85.3637, challenges: 12, urgency: 6.9 },
  { district: "Deoghar", latitude: 24.4855, longitude: 86.6948, challenges: 11, urgency: 7.1 },
  { district: "Giridih", latitude: 24.186, longitude: 86.3003, challenges: 10, urgency: 6.7 },
  { district: "Ramgarh", latitude: 23.6303, longitude: 85.5149, challenges: 9, urgency: 6.5 },
  { district: "West Singhbhum", latitude: 22.57, longitude: 85.36, challenges: 8, urgency: 5.8 },
  { district: "Saraikela-Kharsawan", latitude: 22.7, longitude: 85.93, challenges: 8, urgency: 6.1 },
  { district: "Palamu", latitude: 24.03, longitude: 84.07, challenges: 8, urgency: 6.3 },
  { district: "Garhwa", latitude: 24.16, longitude: 83.8, challenges: 7, urgency: 6.2 },
  { district: "Chatra", latitude: 24.21, longitude: 84.87, challenges: 7, urgency: 5.9 },
  { district: "Latehar", latitude: 23.74, longitude: 84.5, challenges: 6, urgency: 5.7 },
  { district: "Gumla", latitude: 23.04, longitude: 84.54, challenges: 6, urgency: 5.6 },
  { district: "Lohardaga", latitude: 23.43, longitude: 84.68, challenges: 5, urgency: 5.2 },
  { district: "Simdega", latitude: 22.62, longitude: 84.52, challenges: 5, urgency: 5.1 },
  { district: "Khunti", latitude: 22.86, longitude: 85.28, challenges: 5, urgency: 5.4 },
  { district: "Jamtara", latitude: 23.96, longitude: 86.8, challenges: 5, urgency: 5.8 },
  { district: "Dumka", latitude: 24.27, longitude: 87.25, challenges: 5, urgency: 5.5 },
  { district: "Godda", latitude: 24.83, longitude: 87.22, challenges: 4, urgency: 5.1 },
  { district: "Sahibganj", latitude: 25.24, longitude: 87.64, challenges: 4, urgency: 4.8 },
  { district: "Pakur", latitude: 24.64, longitude: 87.85, challenges: 3, urgency: 4.7 },
  { district: "Koderma", latitude: 24.47, longitude: 85.59, challenges: 3, urgency: 4.6 },
];

const CATEGORIES = [
  "Water Management",
  "Sanitation & Waste",
  "Health & MedTech",
  "Rural Infrastructure",
  "Smart Education",
  "Clean Energy",
  "Agriculture & FoodTech",
];

const STATUSES = [
  "OPEN",
  "UNDER_REVIEW",
  "ASSIGNED_TO_HEI",
  "IN_PROGRESS",
  "RESOLVED",
];

function createMockBackendResponse() {
  const features = [];

  DISTRICT_SEEDS.forEach((district, districtIndex) => {
    for (let i = 0; i < district.challenges; i += 1) {
      const longitudeOffset = ((i % 5) - 2) * 0.025;
      const latitudeOffset =
        (Math.floor(i / 5) - Math.floor(district.challenges / 10)) * 0.018;

      const urgencyVariation = ((i * 7 + districtIndex * 3) % 18) / 10;
      const urgencyScore = Math.min(
        10,
        Math.max(0, Number((district.urgency + urgencyVariation - 0.9).toFixed(1)))
      );

      const status = STATUSES[(i + districtIndex) % STATUSES.length];

      features.push({
        id: `HM-${districtIndex + 1}-${i + 1}`,
        title: `${district.district} Community Challenge ${i + 1}`,
        category: CATEGORIES[(i + districtIndex) % CATEGORIES.length],
        district: district.district,
        status,
        urgency_score: urgencyScore,
        upvotes: 3 + ((i * 7 + districtIndex) % 38),
        coordinates: [
          Number((district.longitude + longitudeOffset).toFixed(6)),
          Number((district.latitude + latitudeOffset).toFixed(6)),
        ],
        assigned_university:
          status === "ASSIGNED_TO_HEI" ||
          status === "IN_PROGRESS" ||
          status === "RESOLVED"
            ? "Jharkhand Partner University"
            : null,
      });
    }
  });

  return {
    type: "FeatureCollection",
    count: features.length,
    features,
  };
}

const MOCK_HEATMAP_RESPONSE = createMockBackendResponse();

function normalizeHeatmapResponse(response) {
  if (!response || response.type !== "FeatureCollection" || !Array.isArray(response.features)) {
    return [];
  }

  const districtMap = new Map();

  response.features.forEach((feature) => {
    if (!feature?.district) return;

    const coordinates = Array.isArray(feature.coordinates) ? feature.coordinates : [];
    const longitude = Number(coordinates[0]);
    const latitude = Number(coordinates[1]);

    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
      return;
    }

    if (!districtMap.has(feature.district)) {
      districtMap.set(feature.district, {
        name: feature.district,
        challenges: 0,
        active: 0,
        totalUrgency: 0,
        longitudeTotal: 0,
        latitudeTotal: 0,
        categories: {},
        features: [],
      });
    }

    const district = districtMap.get(feature.district);
    district.challenges += 1;
    district.totalUrgency += Number(feature.urgency_score || 0);
    district.longitudeTotal += longitude;
    district.latitudeTotal += latitude;
    district.features.push(feature);

    if (feature.category) {
      district.categories[feature.category] = (district.categories[feature.category] || 0) + 1;
    }

    if (feature.status === "ASSIGNED_TO_HEI" || feature.status === "IN_PROGRESS") {
      district.active += 1;
    }
  });

  return Array.from(districtMap.values()).map((district) => ({
    ...district,
    longitude: district.longitudeTotal / district.challenges,
    latitude: district.latitudeTotal / district.challenges,
    averageUrgency: district.challenges > 0 ? district.totalUrgency / district.challenges : 0,
  }));
}

const MAP_BOUNDS = {
  minLongitude: 83.45,
  maxLongitude: 88.0,
  minLatitude: 22.0,
  maxLatitude: 25.45,
};

function projectCoordinates(longitude, latitude) {
  const x =
    ((longitude - MAP_BOUNDS.minLongitude) / (MAP_BOUNDS.maxLongitude - MAP_BOUNDS.minLongitude)) *
    100;

  const y =
    ((MAP_BOUNDS.maxLatitude - latitude) / (MAP_BOUNDS.maxLatitude - MAP_BOUNDS.minLatitude)) *
    100;

  return {
    x: Math.max(6, Math.min(94, x)),
    y: Math.max(8, Math.min(92, y)),
  };
}

function getLevel(count) {
  if (count >= 13) return "High";
  if (count >= 6) return "Medium";
  return "Low";
}

const LEVELS = {
  High: {
    dot: "bg-red-500",
    glow: "bg-red-500/25",
    text: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  Medium: {
    dot: "bg-amber-500",
    glow: "bg-amber-400/25",
    text: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  Low: {
    dot: "bg-emerald-500",
    glow: "bg-emerald-400/25",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
};

export default function LiveTrackingPage() {
  const { searchQuery: globalSearchQuery = "" } = useOutletContext() || {};
  const { data, updateTrackingProject } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [healthFilter, setHealthFilter] = useState("All");
  const [phaseFilter, setPhaseFilter] = useState("All");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Modals
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const heatmapResponse = MOCK_HEATMAP_RESPONSE;
  const districts = useMemo(() => normalizeHeatmapResponse(heatmapResponse), [heatmapResponse]);

  const projects = data?.trackingProjects || [];
  const effectiveSearch = searchQuery || globalSearchQuery;

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const text = effectiveSearch.toLowerCase();
      const matchesSearch =
        !text ||
        project.name?.toLowerCase().includes(text) ||
        project.challenge?.toLowerCase().includes(text) ||
        project.organization?.toLowerCase().includes(text) ||
        project.university?.toLowerCase().includes(text) ||
        project.department?.toLowerCase().includes(text) ||
        project.district?.toLowerCase().includes(text);

      const matchesHealth = healthFilter === "All" || project.health === healthFilter;
      const matchesPhase =
        phaseFilter === "All" || (project.currentPhase || project.phase) === phaseFilter;
      const matchesDistrict =
        !selectedDistrict ||
        (project.district &&
          project.district.toLowerCase() === selectedDistrict.name.toLowerCase());

      return matchesSearch && matchesHealth && matchesPhase && matchesDistrict;
    });
  }, [projects, effectiveSearch, healthFilter, phaseFilter, selectedDistrict]);

  const filteredDistricts = useMemo(() => {
    return districts.filter((district) => {
      const matchesDistrict = districtFilter === "All" || district.name === districtFilter;
      const matchesLevel = levelFilter === "All" || getLevel(district.challenges) === levelFilter;
      return matchesDistrict && matchesLevel;
    });
  }, [districts, districtFilter, levelFilter]);

  const totalChallenges = heatmapResponse.count || heatmapResponse.features.length;
  const totalActive = projects.length || districts.reduce((sum, d) => sum + d.active, 0);
  const districtCoverage = districts.length;
  const onTrackCount = projects.filter(
    (p) => p.health === "On Track" || p.health === "Healthy"
  ).length;
  const onTrackRate =
    projects.length > 0 ? Math.round((onTrackCount / projects.length) * 100) : 100;

  const handleUpdateMilestone = (project, milestoneIndex, newStatus) => {
    if (!project || !updateTrackingProject) return;
    const updatedMilestones = [...(project.milestones || [])];
    if (updatedMilestones[milestoneIndex]) {
      updatedMilestones[milestoneIndex] = {
        ...updatedMilestones[milestoneIndex],
        status: newStatus,
      };
    }
    const completedCount = updatedMilestones.filter((m) => m.status === "Completed").length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);

    const updates = {
      milestones: updatedMilestones,
      progress,
    };

    updateTrackingProject(project.id, updates);
    if (editingProject && editingProject.id === project.id) {
      setEditingProject({ ...editingProject, ...updates });
    }
    if (selectedProject && selectedProject.id === project.id) {
      setSelectedProject({ ...selectedProject, ...updates });
    }
  };

  const handleUpdateProjectDetails = (e) => {
    e.preventDefault();
    if (!editingProject || !updateTrackingProject) return;

    updateTrackingProject(editingProject.id, {
      health: editingProject.health,
      currentPhase: editingProject.currentPhase,
      progress: Number(editingProject.progress) || 0,
      recentUpdate: editingProject.recentUpdate,
      deadline: editingProject.deadline,
    });

    setEditingProject(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-emerald-600 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">
              Government Monitoring
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Live Project Monitoring & Solution Tracking
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time geospatial tracking, project execution milestones, and HEI partner velocity across Jharkhand
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 shadow-xs">
            <span className="h-2 w-2 animate-ping rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700">Telemetry Active</span>
          </div>
        </div>
      </div>

      {/* 2. TOP KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reported Challenges</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{totalChallenges}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 border border-emerald-100">
              <MapPin size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">GeoJSON telemetry dataset</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Deployments</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{totalActive}</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 border border-blue-100">
              <Activity size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">Assigned HEI & partner projects</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">On-Track Velocity</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{onTrackRate}%</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 border border-emerald-100">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">{onTrackCount} projects healthy / on schedule</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">District Coverage</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{districtCoverage} / 24</p>
            </div>
            <div className="rounded-xl bg-violet-50 p-3 text-violet-600 border border-violet-100">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">100% Jharkhand districts mapped</p>
        </div>
      </div>

      {/* 3. HEATMAP & INTERACTIVE JHARKHAND MAP */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">District Challenge Heatmap</h2>
              <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 border border-emerald-200">
                Jharkhand State
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Live challenge density & HEI assignment distribution generated from GeoJSON telemetry
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={districtFilter}
              onChange={(e) => {
                const value = e.target.value;
                setDistrictFilter(value);
                const found = districts.find((item) => item.name === value);
                setSelectedDistrict(value === "All" ? null : found || null);
              }}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="All">All Districts ({districts.length})</option>
              {districts
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((district) => (
                  <option key={district.name} value={district.name}>
                    {district.name} ({district.challenges})
                  </option>
                ))}
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="All">All Challenge Levels</option>
              <option value="High">High Density (13+)</option>
              <option value="Medium">Medium Density (6-12)</option>
              <option value="Low">Low Density (&lt;6)</option>
            </select>

            {selectedDistrict && (
              <button
                onClick={() => {
                  setSelectedDistrict(null);
                  setDistrictFilter("All");
                }}
                className="flex items-center gap-1 h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                <RotateCcw size={12} />
                Reset View
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* MAP CANVAS */}
          <div className="relative h-[540px] overflow-hidden bg-[#030a16]">
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(148,163,184,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.15) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Ambient glow */}
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

            {/* Location Badge */}
            <div className="absolute left-5 top-5 z-20 rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-emerald-500/20 p-1.5 text-emerald-400">
                  <Navigation size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">Jharkhand State Map</p>
                  <p className="mt-1 text-[10px] text-slate-400">24 Districts • Geospatial Node Grid</p>
                </div>
              </div>
            </div>

            {/* MAP STAGE */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative h-[460px] w-[540px] max-w-[95%]">
                <svg
                  viewBox="0 0 560 500"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="jharkhandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="50%" stopColor="#0f172a" />
                      <stop offset="100%" stopColor="#090d16" />
                    </linearGradient>

                    <filter id="mapGlow">
                      <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000" floodOpacity=".5" />
                    </filter>

                    <clipPath id="jharkhandClip">
                      <path d="M164 48 L265 22 L351 72 L443 67 L493 117 L522 177 L488 218 L518 274 L470 322 L438 400 L346 454 L274 421 L201 451 L135 393 L104 322 L76 261 L94 198 L69 139 L114 98 Z" />
                    </clipPath>
                  </defs>

                  {/* Jharkhand Outline */}
                  <path
                    d="M164 48 L265 22 L351 72 L443 67 L493 117 L522 177 L488 218 L518 274 L470 322 L438 400 L346 454 L274 421 L201 451 L135 393 L104 322 L76 261 L94 198 L69 139 L114 98 Z"
                    fill="url(#jharkhandGrad)"
                    stroke="#334155"
                    strokeWidth="2"
                    filter="url(#mapGlow)"
                  />

                  {/* Internal District Boundaries */}
                  <g clipPath="url(#jharkhandClip)" fill="none" stroke="#475569" strokeOpacity=".35" strokeWidth="1">
                    <path d="M190 20 L166 145 L215 250 L190 470" />
                    <path d="M275 15 L250 115 L292 220 L260 460" />
                    <path d="M355 30 L335 130 L355 240 L340 470" />
                    <path d="M440 45 L415 150 L450 250 L420 440" />
                    <path d="M60 170 L190 185 L335 165 L525 190" />
                    <path d="M65 265 L185 250 L320 275 L515 255" />
                    <path d="M105 350 L215 330 L350 350 L475 335" />
                  </g>

                  {/* Soft State Center Radial */}
                  <ellipse cx="300" cy="250" rx="160" ry="140" fill="#10b981" opacity=".03" />
                </svg>

                {/* DISTRICT MARKERS */}
                {filteredDistricts.map((district) => {
                  const level = getLevel(district.challenges);
                  const style = LEVELS[level];
                  const position = projectCoordinates(district.longitude, district.latitude);
                  const isSelected = selectedDistrict?.name === district.name;

                  return (
                    <button
                      key={district.name}
                      onClick={() => {
                        setSelectedDistrict(district);
                        setDistrictFilter(district.name);
                      }}
                      className="group absolute z-30 -translate-x-1/2 -translate-y-1/2 outline-none cursor-pointer"
                      style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                      }}
                      title={`${district.name}: ${district.challenges} challenges`}
                    >
                      {/* Pulse Glow */}
                      <span
                        className={`absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full ${style.glow} blur-xs transition-all duration-300 group-hover:h-12 group-hover:w-12`}
                      />

                      {/* Main Node */}
                      <span
                        className={`relative flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white shadow-md transition-all duration-200 group-hover:scale-150 ${
                          style.dot
                        } ${isSelected ? "scale-150 ring-4 ring-white/40 shadow-emerald-500/50" : ""}`}
                      />

                      {/* Tooltip Card on Hover */}
                      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-50 hidden min-w-[160px] rounded-xl border border-slate-700 bg-slate-900/95 p-2.5 text-left shadow-2xl backdrop-blur-md group-hover:block whitespace-nowrap">
                        <p className="text-xs font-bold text-white">{district.name}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-300">
                          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                          <span>{district.challenges} Challenges</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {district.active} Active HEI Deployments
                        </p>
                        <p className="text-[10px] text-amber-400 mt-0.5 font-medium">
                          Urgency Score: {district.averageUrgency.toFixed(1)}/10
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MAP LEGEND */}
            <div className="absolute bottom-5 left-5 z-20 rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2.5 shadow-xl backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Challenge Density
              </p>
              <div className="flex items-center gap-3.5">
                {["High", "Medium", "Low"].map((level) => (
                  <div key={level} className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${LEVELS[level].dot}`} />
                    <span className="text-[11px] font-medium text-slate-300">{level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MONITORING STATUS BADGE */}
            <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 shadow-xl backdrop-blur-md">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
              <span className="text-[11px] font-semibold text-emerald-300">Live Grid Online</span>
            </div>
          </div>

          {/* DISTRICT INSPECTION SIDEBAR */}
          <div className="border-t border-slate-200 bg-slate-50/50 p-5 lg:border-l lg:border-t-0 flex flex-col justify-between">
            {selectedDistrict ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      District Inspector
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{selectedDistrict.name}</h3>
                    <p className="text-xs text-slate-500">Jharkhand State Jurisdiction</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDistrict(null);
                      setDistrictFilter("All");
                    }}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                    title="Clear selection"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                    <p className="text-xs text-slate-500 font-medium">Reported Challenges</p>
                    <p className="text-xl font-bold text-slate-900 mt-0.5">
                      {selectedDistrict.challenges}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                    <p className="text-xs text-slate-500 font-medium">Active Solution Projects</p>
                    <p className="text-xl font-bold text-emerald-700 mt-0.5">
                      {selectedDistrict.active}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                    <p className="text-xs text-slate-500 font-medium">Average Urgency Score</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xl font-bold text-amber-600">
                        {selectedDistrict.averageUrgency.toFixed(1)}
                      </p>
                      <span className="text-xs text-slate-400 font-medium">/ 10</span>
                    </div>
                  </div>

                  <div
                    className={`rounded-xl border p-3 ${
                      LEVELS[getLevel(selectedDistrict.challenges)].border
                    } ${LEVELS[getLevel(selectedDistrict.challenges)].bg}`}
                  >
                    <p
                      className={`text-xs font-bold ${
                        LEVELS[getLevel(selectedDistrict.challenges)].text
                      }`}
                    >
                      {getLevel(selectedDistrict.challenges)} Challenge Density
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                      {getLevel(selectedDistrict.challenges) === "High"
                        ? "High concentration of community problems. Recommended for immediate university hackathon assignment."
                        : getLevel(selectedDistrict.challenges) === "Medium"
                        ? "Moderate volume of civic submissions. Steady allocation to partner HEIs."
                        : "Low reported issues. Continuous background sensor & citizen monitoring."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById("active-projects-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
                >
                  <Search size={13} />
                  Filter Projects for {selectedDistrict.name}
                </button>
              </div>
            ) : (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center p-4">
                <div className="rounded-2xl bg-white border border-slate-200 p-4 text-slate-400 shadow-2xs">
                  <MapPin size={28} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-800">Select a District</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-[220px]">
                  Click any district node on the Jharkhand map or choose from the dropdown to inspect local telemetry and active deployments.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. ACTIVE PROJECT TRACKING */}
      <section id="active-projects-section" className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Active Project Tracking</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {filteredProjects.length} Projects
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Live lifecycle monitoring, phase transitions, and execution progress across assigned initiatives
            </p>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, HEIs, challenges..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-64"
              />
            </div>

            {/* Health Filter Chips */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
              <Filter size={13} className="ml-1.5 mr-0.5 text-slate-400" />
              {["All", "On Track", "At Risk", "Delayed", "Healthy"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setHealthFilter(filter)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                    healthFilter === filter
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Phase Filter Dropdown */}
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="All">All Phases</option>
              {PHASES.map((ph) => (
                <option key={ph} value={ph}>
                  Phase: {ph}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PROJECT CARDS GRID */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            title="No matching projects found"
            description="Adjust your search query or reset health/district filters to view active solution projects."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredProjects.map((project) => {
              const currentPhase = project.currentPhase || project.phase || "Research";
              const phaseIndex = Math.max(
                0,
                PHASES.findIndex((p) => p.toLowerCase() === currentPhase.toLowerCase())
              );
              const progressVal = Number(project.progress) || 0;

              return (
                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between"
                >
                  {/* Top Meta Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                            <Building2 size={11} className="text-slate-500" />
                            {project.organization || project.university || "HEI Partner"}
                          </span>
                          {project.district && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                              <MapPin size={10} />
                              {project.district}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-900 pt-1">
                          {project.name || project.challenge}
                        </h3>

                        {project.challenge && project.name !== project.challenge && (
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {project.challenge}
                          </p>
                        )}
                      </div>

                      <StatusBadge status={project.health || "On Track"} />
                    </div>

                    {/* Progress Bar with clean header */}
                    <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-100">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600">
                          Execution Progress
                        </span>
                        <span className="text-xs font-bold text-slate-900">{progressVal}%</span>
                      </div>
                      <ProgressBar progress={progressVal} showPercent={false} />
                    </div>

                    {/* 5-Step Pipeline Stepper */}
                    <div className="mt-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Lifecycle Pipeline
                      </p>
                      <div className="grid grid-cols-5 gap-1.5">
                        {PHASES.map((phaseName, idx) => {
                          const isCompleted = idx < phaseIndex;
                          const isCurrent = idx === phaseIndex;
                          return (
                            <div key={phaseName} className="text-center">
                              <div
                                className={`mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                                  isCompleted
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : isCurrent
                                    ? "bg-slate-900 text-white ring-2 ring-slate-400 ring-offset-1"
                                    : "bg-slate-100 text-slate-400"
                                }`}
                              >
                                {isCompleted ? "✓" : idx + 1}
                              </div>
                              <p
                                className={`text-[10px] font-medium truncate ${
                                  isCurrent
                                    ? "text-slate-900 font-bold"
                                    : isCompleted
                                    ? "text-emerald-700"
                                    : "text-slate-400"
                                }`}
                              >
                                {phaseName}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer Info & Actions */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-3">
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock size={13} className="text-slate-400 shrink-0" />
                        <span>Updated: {project.lastUpdate || "Recently"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        <span>Deadline: {project.deadline || "TBD"}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs"
                      >
                        <Eye size={13} />
                        View Details
                      </button>

                      <button
                        onClick={() => setEditingProject({ ...project })}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-xs"
                      >
                        <Edit3 size={13} />
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. VIEW PROJECT DETAILS MODAL */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {selectedProject.id}
                  </span>
                  <StatusBadge status={selectedProject.health || "On Track"} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedProject.name || selectedProject.challenge}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-600 flex-1">
              {/* Project Meta 4-Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">HEI / Organization</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    {selectedProject.organization || selectedProject.university || "Partner"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Department</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    {selectedProject.department || "Innovation Board"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">District</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    {selectedProject.district || "Jharkhand"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Current Phase</p>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5 truncate">
                    {selectedProject.currentPhase || "Research"}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">Project Completion</span>
                  <span className="text-sm font-bold text-slate-900">
                    {selectedProject.progress || 0}%
                  </span>
                </div>
                <ProgressBar progress={selectedProject.progress || 0} showPercent={false} />
              </div>

              {/* Milestone Tracker Checklist */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                  Milestones & Deliverables
                </h4>
                <div className="space-y-2">
                  {(selectedProject.milestones || []).map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            m.status === "Completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : m.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {m.status === "Completed" ? "✓" : mIdx + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">{m.name}</span>
                      </div>
                      <StatusBadge status={m.status} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Field Update */}
              {selectedProject.recentUpdate && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <p className="text-xs font-bold text-emerald-900 mb-1">Latest Operational Update</p>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {selectedProject.recentUpdate}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <span className="text-xs text-slate-400">
                Last Synchronized: {selectedProject.lastUpdate || "Today"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const toEdit = { ...selectedProject };
                    setSelectedProject(null);
                    setEditingProject(toEdit);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                >
                  <Edit3 size={13} />
                  Update Project
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. EDIT PROJECT STATUS & MILESTONES MODAL */}
      {editingProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setEditingProject(null)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Update Project Tracking
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5 truncate max-w-md">
                  {editingProject.name || editingProject.challenge}
                </h3>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleUpdateProjectDetails} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Phase</label>
                  <select
                    value={editingProject.currentPhase || "Research"}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, currentPhase: e.target.value })
                    }
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    {PHASES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Health Status</label>
                  <select
                    value={editingProject.health || "On Track"}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, health: e.target.value })
                    }
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="On Track">On Track</option>
                    <option value="Healthy">Healthy</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Progress Percentage ({editingProject.progress || 0}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editingProject.progress || 0}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, progress: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* Milestones toggler */}
              {editingProject.milestones && editingProject.milestones.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Milestone Progress Status
                  </label>
                  <div className="space-y-2">
                    {editingProject.milestones.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs"
                      >
                        <span className="font-semibold text-slate-800 truncate mr-2">{m.name}</span>
                        <select
                          value={m.status}
                          onChange={(e) => handleUpdateMilestone(editingProject, idx, e.target.value)}
                          className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-700 outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Latest Status & Field Update
                </label>
                <textarea
                  rows={3}
                  value={editingProject.recentUpdate || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, recentUpdate: e.target.value })
                  }
                  placeholder="Summarize recent deployment test findings, telemetry notes, or next steps..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                >
                  <Send size={13} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}