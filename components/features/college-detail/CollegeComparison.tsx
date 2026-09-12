"use client";

import React, { useState } from "react";
import { GitCompare, MapPin, ChevronDown } from "lucide-react";
import { COLLEGES, getCollegeByCode } from "@/lib/data/colleges";
import { getCutoff } from "@/lib/data/cutoffs";
import type { Category, College } from "@/types";

interface CollegeComparisonProps {
  category: Category;
}

/**
 * Presets are keyed by KEA code, not by slug.
 *
 * The slug is derived from the official name, so it moves whenever the name
 * does; the code is the stable identity and is what a candidate types during
 * option entry anyway. An unknown code drops out rather than rendering blank.
 */
const byCode = (...codes: string[]): string[] =>
  codes
    .map((code) => getCollegeByCode(code)?.id)
    .filter((id): id is string => Boolean(id));

const PRESETS = [
  { label: "Big 3 (RVCE / BMSCE / MSRIT)", ids: byCode("E005", "E048", "E006") },
  { label: "PESU / UVCE / SJCE", ids: byCode("E009", "E001", "E021") },
  { label: "DSCE / BMSIT / NIE", ids: byCode("E007", "E126", "E022") },
];

export default function CollegeComparison({ category }: CollegeComparisonProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(PRESETS[0].ids);

  const colleges = selectedIds
    .map((id) => COLLEGES.find((c) => c.id === id))
    .filter(Boolean) as College[];

  const handleSelectCollege = (index: number, newId: string) => {
    const updated = [...selectedIds];
    updated[index] = newId;
    setSelectedIds(updated);
  };

  return (
    <section id="compare-colleges" className="py-16 md:py-24 max-w-[1200px] mx-auto px-6 sm:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#CC3D2E] mb-2">
            <GitCompare className="w-4 h-4" />
            <span>Head-to-Head Benchmark</span>
          </div>
          <h2 className="text-3xl font-light tracking-tight text-[#1A1A1A]">
            Compare Top Karnataka Engineering Colleges
          </h2>
          <p className="text-sm text-[#6B6B6B] mt-1 font-normal max-w-2xl">
            Side-by-side analysis of cutoffs, median placements, NIRF rank, faculty excellence, and annual tuition fees.
          </p>
        </div>

        {/* Quick Comparison Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#9B9B9B]">Popular:</span>
          {PRESETS.filter((preset) => preset.ids.length === 3).map((preset) => (
            <button
              key={preset.label}
              onClick={() => setSelectedIds(preset.ids)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white hover:bg-[#F0EDE8] border border-[#E5E0D8] text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((slotIdx) => {
          const col = colleges[slotIdx];
          const cseCutoff = col
            ? getCutoff(col.id, "CSE", category, "R2")?.closingRank
            : undefined;
          const iseCutoff = col
            ? getCutoff(col.id, "ISE", category, "R2")?.closingRank
            : undefined;
          const eceCutoff = col
            ? getCutoff(col.id, "ECE", category, "R2")?.closingRank
            : undefined;

          return (
            <div
              key={slotIdx}
              className="bg-white border border-[#E5E0D8] rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                {/* College Selector Dropdown */}
                <div className="mb-6 relative">
                  <label className="block text-[11px] font-semibold text-[#9B9B9B] mb-1.5 uppercase tracking-wider">
                    College Slot #{slotIdx + 1}
                  </label>
                  <select
                    value={col?.id || ""}
                    onChange={(e) => handleSelectCollege(slotIdx, e.target.value)}
                    className="w-full bg-white border border-[#E5E0D8] focus:border-[#CC3D2E] focus:ring-1 focus:ring-[#CC3D2E]/20 rounded-lg h-11 text-xs px-3 text-[#1A1A1A] outline-none appearance-none cursor-pointer"
                  >
                    {COLLEGES.map((c) => (
                      <option key={c.id} value={c.id} className="bg-white text-[#1A1A1A]">
                        [{c.kea_code}] {c.name} ({c.city})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#9B9B9B] absolute right-3 bottom-3.5 pointer-events-none" />
                </div>

                {col && (
                  <>
                    {/* Header Info */}
                    <div className="mb-6 pb-6 border-b border-[#E5E0D8]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#F0EDE8] border border-[#E5E0D8] text-[#1A1A1A]">
                          {col.kea_code}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[rgba(139,92,246,0.08)] text-[#CC3D2E] border border-[rgba(139,92,246,0.20)]">
                          {col.affiliation}
                        </span>
                        {col.nirfRank !== null && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F0EDE8] text-[#6B6B6B]">
                            NIRF #{col.nirfRank}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-[#1A1A1A] tracking-tight">
                        {col.name}
                      </h3>
                      <p className="text-xs text-[#9B9B9B] mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#9B9B9B]" />
                        <span>{col.city}, {col.district}</span>
                        <span className="text-[#9B9B9B]">•</span>
                        <span>Est. {col.established}</span>
                      </p>
                    </div>

                    {/* Key Placements */}
                    <div className="space-y-3 mb-6 pb-6 border-b border-[#E5E0D8] text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[#6B6B6B]">Median Package (CTC):</span>
                        <span className="font-mono font-semibold text-[#1F7A4A] text-sm">
                          ₹{col.avgPackage} LPA
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#6B6B6B]">Highest Domestic CTC:</span>
                        <span className="font-mono font-semibold text-[#1A1A1A]">
                          ₹{col.highestPackage} LPA
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#6B6B6B]">KEA Yearly Tuition:</span>
                        <span className="font-mono text-[#1A1A1A]">
                          ₹{col.annualFee.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#6B6B6B]">Campus Intake:</span>
                        <span className="font-mono text-[#1A1A1A]">
                          {col.totalSeats} seats
                        </span>
                      </div>
                    </div>

                    {/* Cutoff Comparison for Category */}
                    <div className="space-y-3 mb-6 pb-6 border-b border-[#E5E0D8]">
                      <span className="text-xs font-semibold text-[#1A1A1A] block mb-2">
                        Round 2 Cutoffs ({category})
                      </span>

                      {cseCutoff !== undefined && (
                        <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-[#E5E0D8]">
                          <span className="text-[#6B6B6B]">Computer Science (CSE):</span>
                          <span className="font-mono font-semibold text-[#CC3D2E]">
                            #{cseCutoff.toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}

                      {iseCutoff !== undefined && (
                        <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-[#E5E0D8]">
                          <span className="text-[#6B6B6B]">Information Science (ISE):</span>
                          <span className="font-mono font-semibold text-[#CC3D2E]">
                            #{iseCutoff.toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}

                      {eceCutoff !== undefined && (
                        <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-[#E5E0D8]">
                          <span className="text-[#6B6B6B]">Electronics & Comm (ECE):</span>
                          <span className="font-mono font-semibold text-[#CC3D2E]">
                            #{eceCutoff.toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Top Recruiters */}
                    <div className="text-xs text-[#6B6B6B]">
                      <span className="block text-[#9B9B9B] mb-1 font-medium">Top Tech Recruiters:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {col.topRecruiters.slice(0, 5).map((rec) => (
                          <span
                            key={rec}
                            className="px-2 py-0.5 rounded bg-[#F0EDE8] border border-[#E5E0D8] text-[11px] font-medium text-[#1A1A1A]"
                          >
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
