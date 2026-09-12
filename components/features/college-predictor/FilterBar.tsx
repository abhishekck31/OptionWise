"use client";

import { ChevronDown, Search } from "lucide-react";
import { BRANCH_OPTIONS } from "@/lib/data/branches";
import { AVAILABLE_CITIES } from "@/lib/data/colleges";

export type SortKey = "chance" | "cutoff" | "ctc" | "rating";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "chance", label: "Sort by: Highest chance" },
  { value: "cutoff", label: "Sort by: Competitive cutoff" },
  { value: "ctc", label: "Sort by: Average package" },
  { value: "rating", label: "Sort by: NIRF rank" },
];

const FIELD =
  "w-full bg-[#F0EDE8] border border-[#E5E0D8] focus:border-[#E8C4BF] focus:ring-1 focus:ring-[#CC3D2E]/20 rounded-lg h-11 text-sm px-3 text-[#1A1A1A] outline-none appearance-none cursor-pointer";

export interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  branchFilter: string;
  onBranchChange: (value: string) => void;
  locationFilter: string;
  onLocationChange: (value: string) => void;
  sortBy: SortKey;
  onSortChange: (value: SortKey) => void;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  branchFilter,
  onBranchChange,
  locationFilter,
  onLocationChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="bg-white border border-[#E5E0D8] rounded-xl p-4 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-4 relative">
          <label htmlFor="college-search" className="sr-only">
            Search colleges
          </label>
          <Search
            className="w-4 h-4 text-[#9B9B9B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden
          />
          <input
            id="college-search"
            type="text"
            placeholder="Search college, branch, or code (e.g. RVCE, CSE, E001)..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#F0EDE8] border border-[#E5E0D8] focus:border-[#E8C4BF] focus:ring-1 focus:ring-[#CC3D2E]/20 rounded-lg h-11 text-sm pl-10 pr-4 text-[#1A1A1A] placeholder-[#9B9B9B] outline-none transition-colors"
          />
        </div>

        <div className="lg:col-span-3 relative">
          <label htmlFor="branch-filter" className="sr-only">
            Branch
          </label>
          <select
            id="branch-filter"
            value={branchFilter}
            onChange={(e) => onBranchChange(e.target.value)}
            className={FIELD}
          >
            {BRANCH_OPTIONS.map((b) => (
              <option key={b.id} value={b.id} className="bg-white text-[#1A1A1A]">
                {b.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="w-4 h-4 text-[#6B6B6B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden
          />
        </div>

        <div className="lg:col-span-2 relative">
          <label htmlFor="district-filter" className="sr-only">
            District
          </label>
          <select
            id="district-filter"
            value={locationFilter}
            onChange={(e) => onLocationChange(e.target.value)}
            className={FIELD}
          >
            <option value="ALL" className="bg-white text-[#1A1A1A]">
              All districts
            </option>
            {AVAILABLE_CITIES.map((city) => (
              <option key={city} value={city} className="bg-white text-[#1A1A1A]">
                {city}
              </option>
            ))}
          </select>
          <ChevronDown
            className="w-4 h-4 text-[#6B6B6B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden
          />
        </div>

        <div className="lg:col-span-3 relative">
          <label htmlFor="sort-by" className="sr-only">
            Sort results
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className={FIELD}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-white text-[#1A1A1A]">
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="w-4 h-4 text-[#6B6B6B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
