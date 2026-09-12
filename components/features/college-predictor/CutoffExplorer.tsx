"use client";

import React, { useState, useMemo } from "react";
import { BarChart3, Search, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { AVAILABLE_CITIES, COLLEGES } from "@/lib/data/colleges";
import { getCutoff } from "@/lib/data/cutoffs";
import { CATEGORY_OPTIONS } from "@/lib/data/categories";
import { BRANCHES } from "@/types";
import type { Category } from "@/types";

interface CutoffExplorerProps {
  initialCategory?: Category;
}

export default function CutoffExplorer({ initialCategory = "GM" }: CutoffExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<Category>(initialCategory);
  const [expandedCollegeId, setExpandedCollegeId] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState("ALL");

  const filteredColleges = useMemo(() => {
    return COLLEGES.filter((col) => {
      const matchesSearch =
        col.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.kea_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCity = cityFilter === "ALL" || col.city === cityFilter;

      return matchesSearch && matchesCity;
    });
  }, [searchTerm, cityFilter]);

  const toggleExpand = (id: string) => {
    setExpandedCollegeId(expandedCollegeId === id ? null : id);
  };

  return (
    <section id="cutoff-explorer" className="py-16 md:py-24 max-w-[1200px] mx-auto px-6 sm:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#CC3D2E] mb-2">
            <BarChart3 className="w-4 h-4" />
            <span>Official KEA Archives</span>
          </div>
          <h2 className="text-3xl font-light tracking-tight text-[#1A1A1A]">
            KCET Cutoff Explorer & Archive
          </h2>
          <p className="text-sm text-[#6B6B6B] mt-1 font-normal max-w-2xl">
            Browse verified closing ranks across all branches, categories, and rounds for top engineering institutions in Karnataka.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B6B6B]">Active Category:</span>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="bg-white border border-[#E5E0D8] focus:border-[#CC3D2E] rounded-lg h-9 text-xs px-3 pr-8 text-[#CC3D2E] font-semibold outline-none appearance-none cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-white text-[#1A1A1A]">
                  {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#CC3D2E] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-[#E5E0D8] rounded-xl p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-[#9B9B9B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by college name, code, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#E5E0D8] focus:border-[#CC3D2E] focus:ring-1 focus:ring-[#CC3D2E]/20 rounded-lg h-11 text-sm pl-10 pr-4 text-[#1A1A1A] placeholder-[#9B9B9B] outline-none"
            />
          </div>

          <div className="md:col-span-4 relative">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-white border border-[#E5E0D8] focus:border-[#CC3D2E] focus:ring-1 focus:ring-[#CC3D2E]/20 rounded-lg h-11 text-sm px-3 text-[#1A1A1A] outline-none appearance-none cursor-pointer"
            >
              <option value="ALL" className="bg-white text-[#1A1A1A]">All Cities</option>
              {AVAILABLE_CITIES.map((city) => (
                <option key={city} value={city} className="bg-white text-[#1A1A1A]">
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#9B9B9B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* College List with Expandable Branch Cutoffs */}
      <div className="space-y-4">
        {filteredColleges.map((col) => {
          const isExpanded = expandedCollegeId === col.id;

          return (
            <div
              key={col.id}
              className="bg-white border border-[#E5E0D8] hover:border-[#C9C4BC] rounded-xl transition-all overflow-hidden"
            >
              {/* College Summary Row */}
              <div
                onClick={() => toggleExpand(col.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#FAFAF8] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-[#F0EDE8] border border-[#E5E0D8] text-[#1A1A1A] flex-shrink-0">
                    {col.kea_code}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-base text-[#1A1A1A] tracking-tight truncate">
                        {col.name}
                      </h3>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F5E8E6] text-[#CC3D2E] border border-[#E8C4BF]">
                        {col.affiliation}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#9B9B9B]" />
                        {col.city}
                      </span>
                      <span className="text-[#9B9B9B]">•</span>
                      <span>{col.type}</span>
                      <span className="text-[#9B9B9B]">•</span>
                      <span className="font-mono text-[#1F7A4A] font-semibold">
                        Average CTC: ₹{col.avgPackage} LPA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs text-[#9B9B9B] hidden sm:inline">
                    {col.availableBranches.length} Branches
                  </span>
                  <div className="p-1 rounded bg-[#F0EDE8] text-[#6B6B6B]">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expandable Branch Cutoff Table */}
              {isExpanded && (
                <div className="border-t border-[#E5E0D8] p-5 bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-[#9B9B9B] border-b border-[#E5E0D8] pb-2">
                          <th className="pb-3 font-semibold">BRANCH NAME</th>
                          <th className="pb-3 font-semibold font-mono">ROUND 1 CUTOFF ({category})</th>
                          <th className="pb-3 font-semibold font-mono text-[#CC3D2E]">ROUND 2 CUTOFF ({category})</th>
                          <th className="pb-3 font-semibold font-mono">ROUND 3 CUTOFF ({category})</th>
                          <th className="pb-3 font-semibold font-mono">AVG CTC</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E0D8]">
                        {col.availableBranches.map((branch) => {
                          const r1 = getCutoff(col.id, branch, category, "R1");
                          const r2 = getCutoff(col.id, branch, category, "R2");
                          const r3 = getCutoff(col.id, branch, category, "R3");
                          const rank = (n?: number) =>
                            n === undefined ? "—" : `#${n.toLocaleString("en-IN")}`;

                          return (
                            <tr key={branch} className="hover:bg-[#FAFAF8] transition-colors">
                              <td className="py-3 font-medium text-[#1A1A1A]">
                                {BRANCHES[branch]}{" "}
                                <span className="text-[#9B9B9B] font-mono">({branch})</span>
                              </td>
                              <td className="py-3 font-mono font-semibold text-[#1A1A1A]">
                                {rank(r1?.closingRank)}
                              </td>
                              <td className="py-3 font-mono font-bold text-[#CC3D2E]">
                                {rank(r2?.closingRank)}
                              </td>
                              <td className="py-3 font-mono text-[#6B6B6B]">
                                {rank(r3?.closingRank)}
                              </td>
                              <td className="py-3 font-mono font-semibold text-[#1F7A4A]">
                                ₹{col.avgPackage} LPA
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
