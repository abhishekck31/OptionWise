"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, MapPin, Search } from "lucide-react";
import { AVAILABLE_CITIES, COLLEGES } from "@/lib/data/colleges";
import { getCutoff } from "@/lib/data/cutoffs";
import { CATEGORY_OPTIONS } from "@/lib/data/categories";
import { formatRank } from "@/lib/format";
import { EASE_OUT } from "@/lib/motion";
import { BRANCHES } from "@/types";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CutoffExplorerProps {
  initialCategory?: Category;
}

export default function CutoffExplorer({ initialCategory = "GM" }: CutoffExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<Category>(initialCategory);
  const [expandedCollegeId, setExpandedCollegeId] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState("ALL");

  const filteredColleges = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return COLLEGES.filter((col) => {
      const matchesSearch =
        col.name.toLowerCase().includes(term) ||
        col.shortName.toLowerCase().includes(term) ||
        col.kea_code.toLowerCase().includes(term) ||
        col.city.toLowerCase().includes(term);

      const matchesCity = cityFilter === "ALL" || col.city === cityFilter;

      return matchesSearch && matchesCity;
    });
  }, [searchTerm, cityFilter]);

  const toggleExpand = (id: string) => {
    setExpandedCollegeId(expandedCollegeId === id ? null : id);
  };

  return (
    <section id="cutoff-explorer" className="mx-auto max-w-[1120px] px-6 py-[64px] sm:px-8 md:py-[96px]">
      <div className="mb-10 max-w-[720px]">
        <h2 className="type-h1">Cutoff archive</h2>
        <p className="type-body-lg mt-4">
          Closing ranks for every branch, by round, from KEA&rsquo;s published
          allotment reports. Open a college to see its branches.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_200px_200px]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#B0AAA2]"
            strokeWidth={1.5}
            aria-hidden
          />
          <input
            type="text"
            aria-label="Filter colleges"
            placeholder="College name, KEA code or city"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="field pl-11"
          />
        </div>

        <div className="relative">
          <select
            aria-label="City"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="field cursor-pointer appearance-none pr-10"
          >
            <option value="ALL">All cities</option>
            {AVAILABLE_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9B9B9B]"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>

        <div className="relative">
          <select
            aria-label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="field cursor-pointer appearance-none pr-10"
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9B9B9B]"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
      </div>

      <p className="mb-4 text-[13px] text-[#9B9B9B]">
        <span className="font-mono text-[#1A1A1A]">{filteredColleges.length}</span>{" "}
        {filteredColleges.length === 1 ? "college" : "colleges"}
      </p>

      <ul className="space-y-2">
        {filteredColleges.map((col) => {
          const isExpanded = expandedCollegeId === col.id;

          return (
            <li
              key={col.id}
              className={cn(
                "overflow-hidden rounded-2xl border bg-white transition-colors duration-150",
                isExpanded ? "border-[#C9C4BC]" : "border-[#E5E0D8] hover:border-[#C9C4BC]"
              )}
            >
              <button
                type="button"
                onClick={() => toggleExpand(col.id)}
                aria-expanded={isExpanded}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="flex min-w-0 items-center gap-4">
                  <span className="w-12 shrink-0 font-mono text-[13px] text-[#9B9B9B]">
                    {col.kea_code}
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-medium tracking-[-0.01em] text-[#1A1A1A]">
                      {col.name}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-[#9B9B9B]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3" strokeWidth={1.5} aria-hidden />
                        {col.city}
                      </span>
                      <span>{col.type}</span>
                      <span>{col.affiliation}</span>
                    </span>
                  </span>
                </span>

                <span className="flex shrink-0 items-center gap-4">
                  <span className="hidden text-[12px] text-[#9B9B9B] sm:inline">
                    <span className="font-mono text-[#1A1A1A]">{col.availableBranches.length}</span>{" "}
                    branches
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 text-[#9B9B9B] transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[#F0EDE8] px-5 pb-5 pt-2">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px] text-left text-[13px]">
                          <thead>
                            <tr className="border-b border-[#F0EDE8]">
                              <th className="type-caption py-3 pr-4 font-medium">Branch</th>
                              <th className="type-caption py-3 pr-4 text-right font-medium">Round 1</th>
                              <th className="type-caption py-3 pr-4 text-right font-medium">Round 2</th>
                              <th className="type-caption py-3 text-right font-medium">Round 3</th>
                            </tr>
                          </thead>
                          <tbody>
                            {col.availableBranches.map((branch) => {
                              const r1 = getCutoff(col.id, branch, category, "R1");
                              const r2 = getCutoff(col.id, branch, category, "R2");
                              const r3 = getCutoff(col.id, branch, category, "R3");
                              const rank = (n?: number) =>
                                n === undefined ? "—" : formatRank(n);

                              return (
                                <tr key={branch} className="border-b border-[#F0EDE8] last:border-b-0">
                                  <td className="py-2.5 pr-4 text-[#1A1A1A]">
                                    {BRANCHES[branch]}
                                    <span className="ml-2 font-mono text-[11px] text-[#B0AAA2]">
                                      {branch}
                                    </span>
                                  </td>
                                  <td className="py-2.5 pr-4 text-right font-mono text-[#6B6B6B]">
                                    {rank(r1?.closingRank)}
                                  </td>
                                  <td className="py-2.5 pr-4 text-right font-mono text-[#6B6B6B]">
                                    {rank(r2?.closingRank)}
                                  </td>
                                  <td className="py-2.5 text-right font-mono font-medium text-[#1A1A1A]">
                                    {rank(r3?.closingRank)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <Link
                        href={`/college/${col.id}?category=${category}`}
                        className="group mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-[#1A1A1A] transition-colors hover:text-[#6B6B6B]"
                      >
                        Full analysis
                        <ArrowRight
                          className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
