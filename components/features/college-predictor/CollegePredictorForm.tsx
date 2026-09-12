"use client";

import { useMemo, useState } from "react";
import { Compass } from "lucide-react";
import { predictColleges } from "@/lib/predict";
import { CATEGORIES } from "@/types";
import FilterBar, { type SortKey } from "./FilterBar";
import CollegeGrid from "./CollegeGrid";
import type { Branch, Category, PredictionResult, Tier } from "@/types";

type TierFilter = "ALL" | Tier;

const PILLS: {
  value: TierFilter;
  label: string;
  active: string;
  idle: string;
  dot?: string;
}[] = [
  {
    value: "ALL",
    label: "All choices",
    active: "bg-[#F0EDE8] text-[#1A1A1A] border-[#C9C4BC]",
    idle: "bg-transparent text-[#6B6B6B] border-[#E5E0D8] hover:bg-[#F0EDE8]",
  },
  {
    value: "Safe",
    label: "Safe",
    active: "bg-[#E8F5EE] text-[#1F7A4A] border-[#B8DFC9]",
    idle: "bg-white text-[#1F7A4A] border-[#E5E0D8] hover:bg-[#E8F5EE]",
    dot: "bg-[#1F7A4A]",
  },
  {
    value: "Moderate",
    label: "Moderate",
    active: "bg-[#FEF3E2] text-[#B45309] border-[#F5D9A0]",
    idle: "bg-white text-[#B45309] border-[#E5E0D8] hover:bg-[#FEF3E2]",
    dot: "bg-[#B45309]",
  },
  {
    value: "Aspirational",
    label: "Aspirational",
    active: "bg-[#F5E8E6] text-[#CC3D2E] border-[#E8C4BF]",
    idle: "bg-white text-[#CC3D2E] border-[#E5E0D8] hover:bg-[#F5E8E6]",
    dot: "bg-[#CC3D2E]",
  },
];

export interface CollegePredictorFormProps {
  rank: number;
  category: Category;
  savedKeys: Set<string>;
  onSave: (prediction: PredictionResult) => void;
}

export function CollegePredictorForm({
  rank,
  category,
  savedKeys,
  onSave,
}: CollegePredictorFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState<TierFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortKey>("chance");

  const allPredictions = useMemo(
    () =>
      predictColleges({
        rank,
        category,
        gender: "M",
        isHKRegion: false,
        preferredCities: locationFilter === "ALL" ? [] : [locationFilter],
        preferredBranches:
          branchFilter === "ALL" ? [] : [branchFilter as Branch],
        willingToHostel: true,
        maxFee: null,
        collegeType: [],
      }),
    [rank, category, branchFilter, locationFilter]
  );

  const counts = useMemo(
    () => ({
      ALL: allPredictions.length,
      Safe: allPredictions.filter((p) => p.tier === "Safe").length,
      Moderate: allPredictions.filter((p) => p.tier === "Moderate").length,
      Aspirational: allPredictions.filter((p) => p.tier === "Aspirational").length,
    }),
    [allPredictions]
  );

  const visible = useMemo(() => {
    let result = allPredictions;

    if (tierFilter !== "ALL") {
      result = result.filter((p) => p.tier === tierFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.college.name.toLowerCase().includes(term) ||
          p.college.shortName.toLowerCase().includes(term) ||
          p.college.kea_code.toLowerCase().includes(term) ||
          p.branchName.toLowerCase().includes(term) ||
          p.branch.toLowerCase().includes(term) ||
          p.college.city.toLowerCase().includes(term)
      );
    }

    return [...result].sort((a, b) => {
      if (sortBy === "chance") return b.chancePercent - a.chancePercent;
      if (sortBy === "cutoff") return a.closingRank - b.closingRank;
      if (sortBy === "ctc") return b.avgPackage - a.avgPackage;
      if (sortBy === "rating") {
        // Unranked colleges sort last rather than ahead of rank 1.
        return (
          (a.college.nirfRank ?? Number.MAX_SAFE_INTEGER) -
          (b.college.nirfRank ?? Number.MAX_SAFE_INTEGER)
        );
      }
      return 0;
    });
  }, [allPredictions, tierFilter, searchTerm, sortBy]);

  const resetFilters = () => {
    setSearchTerm("");
    setBranchFilter("ALL");
    setLocationFilter("ALL");
    setTierFilter("ALL");
  };

  return (
    <section
      id="college-predictor"
      className="py-16 md:py-24 max-w-[1200px] mx-auto px-6 sm:px-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#CC3D2E] mb-2">
            <Compass className="w-4 h-4" aria-hidden />
            <span>Seats within reach</span>
          </div>
          <h2 className="text-3xl font-light tracking-tight text-[#1A1A1A]">
            Colleges for rank{" "}
            <span className="font-mono font-bold text-[#CC3D2E]">
              #{rank.toLocaleString("en-IN")}
            </span>
          </h2>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Measured against published closing ranks for {CATEGORIES[category]}.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {PILLS.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setTierFilter(pill.value)}
              aria-pressed={tierFilter === pill.value}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors border flex items-center gap-1.5 ${
                tierFilter === pill.value ? pill.active : pill.idle
              }`}
            >
              {pill.dot && <span className={`w-1.5 h-1.5 rounded-full ${pill.dot}`} />}
              <span>
                {pill.label} ({counts[pill.value]})
              </span>
            </button>
          ))}
        </div>
      </div>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        branchFilter={branchFilter}
        onBranchChange={setBranchFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <CollegeGrid
        predictions={visible}
        savedKeys={savedKeys}
        onSave={onSave}
        onResetFilters={resetFilters}
      />
    </section>
  );
}

export default CollegePredictorForm;
