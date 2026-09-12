"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, MapPin } from "lucide-react";
import { COLLEGES, getCollegeByCode } from "@/lib/data/colleges";
import { getCutoff } from "@/lib/data/cutoffs";
import { formatCount, formatRank } from "@/lib/format";
import type { Branch, Category, College } from "@/types";
import { cn } from "@/lib/utils";

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
  { label: "RVCE, BMSCE, MSRIT", ids: byCode("E005", "E048", "E006") },
  { label: "PESU, UVCE, SJCE", ids: byCode("E009", "E001", "E021") },
  { label: "DSCE, BMSIT, NIE", ids: byCode("E007", "E126", "E022") },
];

const COMPARED_BRANCHES: { branch: Branch; label: string }[] = [
  { branch: "CSE", label: "Computer Science" },
  { branch: "ISE", label: "Information Science" },
  { branch: "ECE", label: "Electronics & Comm." },
];

function Row({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="text-[13px] text-[#6B6B6B]">{label}</dt>
      <dd className={cn("text-[14px] font-medium text-[#1A1A1A]", mono && "font-mono")}>
        {value}
      </dd>
    </div>
  );
}

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

  const activePreset = PRESETS.find(
    (preset) => preset.ids.join() === selectedIds.join()
  )?.label;

  return (
    <section className="mx-auto max-w-[1120px] px-6 py-[64px] sm:px-8 md:py-[96px]">
      <div className="mb-10 flex flex-col gap-6">
        <div className="max-w-[720px]">
          <h1 className="type-h1">Compare colleges</h1>
          <p className="type-body-lg mt-4">
            Three colleges side by side: round 2 closing ranks for{" "}
            <span className="font-mono text-[#1A1A1A]">{category}</span>, packages,
            fees and intake.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {PRESETS.filter((preset) => preset.ids.length === 3).map((preset) => (
            <button
              key={preset.label}
              type="button"
              data-active={activePreset === preset.label}
              aria-pressed={activePreset === preset.label}
              onClick={() => setSelectedIds(preset.ids)}
              className="pill h-8 px-3 text-[12px]"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[0, 1, 2].map((slotIdx) => {
          const col = colleges[slotIdx];

          return (
            <div key={slotIdx} className="card flex flex-col">
              <div className="relative">
                <label htmlFor={`compare-slot-${slotIdx}`} className="sr-only">
                  College {slotIdx + 1}
                </label>
                <select
                  id={`compare-slot-${slotIdx}`}
                  value={col?.id || ""}
                  onChange={(e) => handleSelectCollege(slotIdx, e.target.value)}
                  className="field cursor-pointer appearance-none pr-10 text-[13px]"
                >
                  {COLLEGES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.kea_code} {c.name} ({c.city})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9B9B9B]"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>

              {col && (
                <>
                  <div className="mt-6 border-b border-[#F0EDE8] pb-6">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md border border-[#E5E0D8] bg-[#F7F4F0] px-1.5 py-0.5 font-mono text-[11px] font-medium text-[#1A1A1A]">
                        {col.kea_code}
                      </span>
                      <span className="rounded-md border border-[#E5E0D8] bg-[#F7F4F0] px-1.5 py-0.5 text-[11px] font-medium text-[#6B6B6B]">
                        {col.affiliation}
                      </span>
                      {col.nirfRank !== null && (
                        <span className="rounded-md border border-[#E5E0D8] bg-[#F7F4F0] px-1.5 py-0.5 text-[11px] font-medium text-[#6B6B6B]">
                          NIRF <span className="font-mono text-[#1A1A1A]">{col.nirfRank}</span>
                        </span>
                      )}
                    </div>
                    <h2 className="type-h3 mt-3 text-balance">{col.name}</h2>
                    <p className="mt-1.5 flex items-center gap-1 text-[12px] text-[#9B9B9B]">
                      <MapPin className="size-3" strokeWidth={1.5} aria-hidden />
                      {col.city}, {col.district}
                      <span className="ml-1.5">
                        Est. <span className="font-mono">{col.established}</span>
                      </span>
                    </p>
                  </div>

                  <div className="border-b border-[#F0EDE8] py-4">
                    <p className="type-caption mb-1">
                      Round 2 closing rank, {category}
                    </p>
                    <dl>
                      {COMPARED_BRANCHES.map(({ branch, label }) => {
                        const rank = getCutoff(col.id, branch, category, "R2")?.closingRank;
                        return (
                          <Row
                            key={branch}
                            label={label}
                            value={rank !== undefined ? formatRank(rank) : "—"}
                          />
                        );
                      })}
                    </dl>
                  </div>

                  <dl className="border-b border-[#F0EDE8] py-4">
                    <Row label="Average package" value={`₹${col.avgPackage} LPA`} />
                    <Row label="Highest package" value={`₹${col.highestPackage} LPA`} />
                    <Row label="Annual fee" value={`₹${formatCount(col.annualFee)}`} />
                    <Row label="Intake" value={`${formatCount(col.totalSeats)} seats`} />
                  </dl>

                  <div className="flex-1 pt-4">
                    <p className="type-caption mb-2.5">Recruiters</p>
                    <div className="flex flex-wrap gap-1.5">
                      {col.topRecruiters.slice(0, 5).map((rec) => (
                        <span
                          key={rec}
                          className="rounded-md bg-[#F7F4F0] px-2 py-1 text-[12px] text-[#3D3D3D]"
                        >
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/college/${col.id}?category=${category}`}
                    className="group mt-6 inline-flex items-center gap-1 text-[13px] font-medium text-[#1A1A1A] transition-colors hover:text-[#6B6B6B]"
                  >
                    Full analysis
                    <ArrowRight
                      className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </Link>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
