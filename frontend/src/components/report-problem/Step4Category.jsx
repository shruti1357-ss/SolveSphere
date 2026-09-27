import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { citizenText } from "../../i18n/citizenUi";
import {
  Sparkles,
  Check,
  Plus,
  X,
  RefreshCw,
} from "lucide-react";

import {
  FaGraduationCap,
  FaHospital,
  FaLeaf,
  FaTrash,
  FaWater,
  FaBolt,
  FaBus,
  FaRoad,
  FaShieldAlt,
  FaUniversalAccess,
  FaSeedling,
  FaBriefcase,
  FaLaptop,
  FaChild,
  FaFolder,
} from "react-icons/fa";

/*
  Backend has exactly 7 categories:

  1. Water Management
  2. Agriculture & FoodTech
  3. Health & MedTech
  4. Sanitation & Waste
  5. Rural Infrastructure
  6. Smart Education
  7. Clean Energy

  We keep the existing frontend labels for UI,
  but store backendCategory alongside the visible category.
*/

const categories = [
  {
    id: "Education",
    backendCategory: "Smart Education",
    icon: FaGraduationCap,
  },
  {
    id: "Healthcare",
    backendCategory: "Health & MedTech",
    icon: FaHospital,
  },
  {
    id: "Environment",
    backendCategory: "Clean Energy",
    icon: FaLeaf,
  },
  {
    id: "Waste Management",
    backendCategory: "Sanitation & Waste",
    icon: FaTrash,
  },
  {
    id: "Water",
    backendCategory: "Water Management",
    icon: FaWater,
  },
  {
    id: "Electricity",
    backendCategory: "Clean Energy",
    icon: FaBolt,
  },
  {
    id: "Transportation",
    backendCategory: "Rural Infrastructure",
    icon: FaBus,
  },
  {
    id: "Roads & Infrastructure",
    backendCategory: "Rural Infrastructure",
    icon: FaRoad,
  },
  {
    id: "Public Safety",
    backendCategory: "Rural Infrastructure",
    icon: FaShieldAlt,
  },
  {
    id: "Accessibility",
    backendCategory: "Rural Infrastructure",
    icon: FaUniversalAccess,
  },
  {
    id: "Agriculture",
    backendCategory: "Agriculture & FoodTech",
    icon: FaSeedling,
  },
  {
    id: "Employment",
    backendCategory: "Rural Infrastructure",
    icon: FaBriefcase,
  },
  {
    id: "Digital Services",
    backendCategory: "Smart Education",
    icon: FaLaptop,
  },
  {
    id: "Women & Child Safety",
    backendCategory: "Rural Infrastructure",
    icon: FaChild,
  },
  {
    id: "Other",
    backendCategory: "Rural Infrastructure",
    icon: FaFolder,
  },
];

const BACKEND_CATEGORIES = [
  "Water Management",
  "Agriculture & FoodTech",
  "Health & MedTech",
  "Sanitation & Waste",
  "Rural Infrastructure",
  "Smart Education",
  "Clean Energy",
];

const Step4Category = ({ formData, updateFormData, onNext, onBack }) => {
  const { language } = useLanguage();
  const rt = (key, values) => citizenText(language, key, values);
  const [tagInput, setTagInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const tags =
    formData.tags || [
      "#garbage",
      "#sanitation",
      "#college",
      "#environment",
    ];

  const handleAddTag = (tagToAdd) => {
    const trimmed = tagToAdd.trim();

    if (!trimmed) return;

    const cleanTag = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;

    if (cleanTag.length > 1 && !tags.includes(cleanTag)) {
      const updated = [...tags, cleanTag];

      updateFormData({
        tags: updated,
      });

      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updated = tags.filter((t) => t !== tagToRemove);

    updateFormData({
      tags: updated,
    });
  };

  const getBackendCategory = (frontendCategory) => {
    const selected = categories.find(
      (category) => category.id === frontendCategory
    );

    return selected?.backendCategory || "";
  };

  const handleCategorySelect = (category) => {
    updateFormData({
      category: category.id,
      backendCategory: category.backendCategory,
    });
  };

  const handleAnalyzeWithAI = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const titleLower = (formData.title || "").toLowerCase();
      const descLower = (formData.description || "").toLowerCase();

      let frontendCategory = "Waste Management";
      let backendCategory = "Sanitation & Waste";
      let subcat = "Sanitation & Refuse Collection";
      let priority = "High";

      let suggestedTags = [
        "#garbage",
        "#sanitation",
        "#college",
        "#public_health",
      ];

      if (
        titleLower.includes("water") ||
        descLower.includes("water") ||
        descLower.includes("drinking")
      ) {
        frontendCategory = "Water";
        backendCategory = "Water Management";
        subcat = "Supply & Quality";
        priority = "High";

        suggestedTags = [
          "#water_supply",
          "#clean_water",
          "#utility",
        ];
      } else if (
        titleLower.includes("road") ||
        descLower.includes("road") ||
        descLower.includes("pothole")
      ) {
        frontendCategory = "Roads & Infrastructure";
        backendCategory = "Rural Infrastructure";
        subcat = "Street Maintenance";
        priority = "Medium";

        suggestedTags = [
          "#roads",
          "#potholes",
          "#infrastructure",
        ];
      } else if (
        titleLower.includes("education") ||
        descLower.includes("school") ||
        descLower.includes("college") ||
        descLower.includes("student")
      ) {
        frontendCategory = "Education";
        backendCategory = "Smart Education";
        subcat = "Educational Infrastructure";
        priority = "Medium";

        suggestedTags = [
          "#education",
          "#students",
          "#school",
        ];
      } else if (
        titleLower.includes("health") ||
        descLower.includes("hospital") ||
        descLower.includes("medical") ||
        descLower.includes("health")
      ) {
        frontendCategory = "Healthcare";
        backendCategory = "Health & MedTech";
        subcat = "Healthcare Services";
        priority = "High";

        suggestedTags = [
          "#healthcare",
          "#medical",
          "#public_health",
        ];
      } else if (
        titleLower.includes("farm") ||
        descLower.includes("farmer") ||
        descLower.includes("agriculture") ||
        descLower.includes("crop")
      ) {
        frontendCategory = "Agriculture";
        backendCategory = "Agriculture & FoodTech";
        subcat = "Agricultural Support";
        priority = "Medium";

        suggestedTags = [
          "#agriculture",
          "#farmers",
          "#foodtech",
        ];
      } else if (
        titleLower.includes("electric") ||
        descLower.includes("electricity") ||
        descLower.includes("power") ||
        descLower.includes("solar")
      ) {
        frontendCategory = "Electricity";
        backendCategory = "Clean Energy";
        subcat = "Power & Energy";
        priority = "High";

        suggestedTags = [
          "#electricity",
          "#energy",
          "#power",
        ];
      }

      const summary = `AI classified this problem under ${backendCategory}. Priority assessed as ${priority}.`;

      setAiSuggestions({
        category: frontendCategory,
        backendCategory,
        subcategory: subcat,
        priority,
        summary,
        tags: suggestedTags,
      });

      setIsAnalyzing(false);
    }, 1400);
  };

  const applyAISuggestions = () => {
    if (!aiSuggestions) return;

    updateFormData({
      category: aiSuggestions.category,
      backendCategory: aiSuggestions.backendCategory,
      subcategory: aiSuggestions.subcategory,
      priority: aiSuggestions.priority,
      summary: aiSuggestions.summary,
      tags: Array.from(
        new Set([...tags, ...aiSuggestions.tags])
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Category & Tag Analysis Button */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 to-slate-950 p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-500/30 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              SOLVESPHERE AI CLASSIFIER
            </div>

            <h3 className="text-base font-bold text-white">
              Auto-Categorize & Tag with AI
            </h3>

            <p className="text-xs text-slate-400">
              AI analyzes your title, description and location to suggest
              category, tags and priority
            </p>
          </div>

          <button
            type="button"
            onClick={handleAnalyzeWithAI}
            disabled={isAnalyzing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-purple-500/25 hover:from-purple-400 hover:to-indigo-400 transition disabled:opacity-50 shrink-0"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-purple-200" />
                Analyze with AI
              </>
            )}
          </button>
        </div>

        {/* AI Recommendations Display Card */}
        {aiSuggestions && (
          <div className="mt-4 rounded-xl border border-purple-500/40 bg-purple-950/60 p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-400" />
                AI Classification Suggestions
              </span>

              <button
                type="button"
                onClick={applyAISuggestions}
                className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
              >
                Apply AI Suggestions
              </button>
            </div>

            <div className="grid gap-2 text-xs sm:grid-cols-4 text-slate-200">
              <div>
                <span className="text-slate-400">
                  Category:
                </span>{" "}
                <strong className="text-emerald-400">
                  {aiSuggestions.category}
                </strong>
              </div>

              <div>
                <span className="text-slate-400">
                  Backend Category:
                </span>{" "}
                <strong className="text-cyan-400">
                  {aiSuggestions.backendCategory}
                </strong>
              </div>

              <div>
                <span className="text-slate-400">
                  Priority:
                </span>{" "}
                <strong className="text-amber-400">
                  {aiSuggestions.priority}
                </strong>
              </div>

              <div>
                <span className="text-slate-400">
                  Suggested Tags:
                </span>{" "}
                <span>{aiSuggestions.tags.join(", ")}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Category Selection */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Select Primary Category{" "}
          <span className="text-emerald-400">*</span>
        </label>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((c) => {
            const isSelected = formData.category === c.id;
            const Icon = c.icon;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCategorySelect(c)}
                className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/10 text-white shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/50"
                    : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50"
                }`}
              >
                <span className="mb-2">
                  <Icon className="h-7 w-7" />
                </span>

                <span className="text-xs font-bold leading-tight">
                  {c.id}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Backend Category Preview */}
      {formData.category && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">
              Backend category:
            </span>

            <span className="font-bold text-cyan-400">
              {formData.backendCategory ||
                getBackendCategory(formData.category)}
            </span>
          </div>
        </div>
      )}

      {/* Subcategory */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1.5">
          {rt("subcategory")}
        </label>

        <input
          type="text"
          placeholder={rt("categoryPlaceholder")}
          value={formData.subcategory || ""}
          onChange={(e) =>
            updateFormData({
              subcategory: e.target.value,
            })
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none text-sm"
        />
      </div>

      {/* Tags Section */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          {rt("problemTags")}{" "}
          <span className="text-emerald-400">*</span>
        </label>

        <div className="mb-3 flex gap-2">
          <input
            type="text"
            placeholder={rt("tagPlaceholder")}
            value={tagInput}
            onChange={(e) =>
              setTagInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag(tagInput);
              }
            }}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none text-sm"
          />

          <button
            type="button"
            onClick={() => handleAddTag(tagInput)}
            className="inline-flex items-center gap-1 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Tag
          </button>
        </div>

        {/* Selected Tags Pills */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300"
            >
              {tag}

              <button
                type="button"
                onClick={() =>
                  handleRemoveTag(tag)
                }
                className="hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
      <div className="mt-8 flex justify-between"><button type="button" onClick={onBack} className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">{rt("previous")}</button><button type="button" onClick={onNext} className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400">{rt("next")}</button></div>
    </div>
  );
};

export default Step4Category;