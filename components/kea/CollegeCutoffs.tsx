"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorySelect, PoolToggle, RoundTabs } from "@/components/kea/ControlSelect";
import { SourceNote } from "@/components/kea/SourceNote";
import { courseGroup, separateRankList, titleCase } from "@/lib/kea/courses";
import { categoryName, ROUND_SHORT } from "@/lib/kea/meta";
import type { KeaCollegeFile, KeaPool } from "@/lib/kea/types";
import { formatRank } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TrendPoint } from "@/components/kea/CutoffTrendChart";

// recharts is the heaviest thing on the page; it loads with the chart.
const CutoffTrendChart = dynamic(() => import("@/components/kea/CutoffTrendChart"), {
  ssr: false,
  loading: () => <div className="blur-load h-[280px] rounded-2xl bg-[#F7F4F0]" data-loading="true" />,
});

const ROUND_ORDER = ["MOCK", "R1", "R2", "R3", "R4"];

export interface CollegeCutoffsProps {
  file: KeaCollegeFile;
  initialCategory?: string;
  /** A branch key to open the trend on, e.g. "CSE". */
  initialBranch?: string;
}

export function CollegeCutoffs({ file, initialCategory = "GM", initialBranch }: CollegeCutoffsProps) {
  const [pool, setPool] = useState<KeaPool>("GEN");

  /* ── Course groups across every year ── */
  const groups = useMemo(() => {
    const map = new Map<string, { key: string; label: string; years: Set<number> }>();
    for (const y of file.years) {
      for (const course of y.courses) {
        const g = courseGroup(course.name, course.courseCode);
        const entry = map.get(g.key) ?? { key: g.key, label: g.label, years: new Set<number>() };
        entry.years.add(y.year);
        map.set(g.key, entry);
      }
    }
    // Longest-running courses first: the ones with the most history to show.
    return [...map.values()].sort((a, b) => b.years.size - a.years.size || a.label.localeCompare(b.label));
  }, [file]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    file.years.forEach((y) => y.categories.forEach((c) => set.add(c)));
    const order = file.years[0]?.categories ?? [];
    return [...set].sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib) || a.localeCompare(b);
    });
  }, [file]);

  const [groupKey, setGroupKey] = useState(
    () => groups.find((g) => g.key === `branch:${initialBranch}`)?.key ?? groups[0]?.key ?? ""
  );
  const [category, setCategory] = useState(allCategories.includes(initialCategory) ? initialCategory : "GM");

  /* ── Year × round table for the chosen course, category and pool ── */
  const trend = useMemo(() => {
    const rows: { year: number; course: string; ranks: Partial<Record<string, number>>; flags: Record<string, string> }[] = [];
    for (const y of file.years) {
      const ci = y.categories.indexOf(category);
      const courses = y.courses.filter((c) => courseGroup(c.name, c.courseCode).key === groupKey);
      for (const course of courses) {
        const ranks: Partial<Record<string, number>> = {};
        const flags: Record<string, string> = {};
        for (const report of y.reports.filter((r) => r.pool === pool)) {
          const value = ci >= 0 ? course.ranks[report.id]?.[ci] : 0;
          if (value && value > 0) {
            ranks[report.round] = value;
            if (report.mock) flags[report.round] = "mock";
            else if (report.provisional) flags[report.round] = "provisional";
          }
        }
        if (Object.keys(ranks).length) rows.push({ year: y.year, course: course.name, ranks, flags });
      }
    }
    const rounds = ROUND_ORDER.filter((r) => rows.some((row) => row.ranks[r] !== undefined));

    // The chart takes the first course of the group each year.
    const byYear = new Map<number, TrendPoint>();
    for (const row of rows) {
      if (byYear.has(row.year)) continue;
      byYear.set(row.year, { year: row.year, R1: row.ranks.R1, R2: row.ranks.R2, R3: row.ranks.R3 });
    }
    const chart = [...byYear.values()].sort((a, b) => a.year - b.year);
    return { rows, rounds, chart };
  }, [file, groupKey, category, pool]);

  /* ── KEA report view ── */
  const [reportYear, setReportYear] = useState(file.years[0]?.year);
  const yearData = file.years.find((y) => y.year === reportYear) ?? file.years[0];
  const poolReports = yearData?.reports.filter((r) => r.pool === pool) ?? [];
  const [reportRound, setReportRound] = useState<string | null>(null);
  const report = poolReports.find((r) => r.round === reportRound) ?? poolReports.at(-1);

  const group = groups.find((g) => g.key === groupKey);

  return (
    <div className="space-y-14">
      {/* ── Trend ── */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">
              <span className="font-light">Year by year, </span>
              <span className="font-bold">round by round.</span>
            </h2>
            <p className="mt-2 text-[14px] text-[#9B9B9B]">
              {categoryName(category)} closing ranks for one course, every year KEA published.
            </p>
          </div>
          <PoolToggle value={pool} onChange={setPool} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-[#E5E0D8] bg-white p-1.5">
          <Select value={groupKey} onValueChange={setGroupKey}>
            <SelectTrigger aria-label="Course" className="h-10! min-w-[240px] rounded-xl! border-0! bg-transparent! px-3! text-[14px]! font-medium! shadow-none! hover:bg-[#F7F4F0]!">
              <span className="mr-1 text-[12px] font-normal text-[#9B9B9B]">Course</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[360px]">
              {groups.map((g) => (
                <SelectItem key={g.key} value={g.key}>
                  {g.label}
                  <span className="ml-2 font-mono text-[11px] text-[#9B9B9B]">{g.years.size} yr</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span aria-hidden className="hidden h-6 w-px bg-[#E5E0D8] sm:block" />
          <CategorySelect categories={allCategories} value={category} onChange={setCategory} />
        </div>

        {trend.rows.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-[#E5E0D8] px-6 py-12 text-center text-[14px] text-[#9B9B9B]">
            KEA published no {category} closing rank for {group?.label ?? "this course"} in the{" "}
            {pool === "HK" ? "371(j)" : "general"} reports.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="rounded-3xl border border-[#E5E0D8] bg-white p-5">
              {trend.chart.length > 1 ? (
                <CutoffTrendChart data={trend.chart} />
              ) : (
                <p className="flex h-[280px] items-center justify-center text-center text-[14px] text-[#9B9B9B]">
                  Only one year published — a trend needs two.
                </p>
              )}
            </div>

            <div className="overflow-x-auto rounded-3xl border border-[#E5E0D8] bg-white">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#E5E0D8]">
                    <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.06em] text-[#9B9B9B]">Year</th>
                    {trend.rounds.map((r) => (
                      <th key={r} className="px-3 py-3 text-right text-[11px] font-medium uppercase tracking-[0.06em] text-[#9B9B9B]">
                        {ROUND_SHORT[r]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trend.rows.map((row, i) => {
                    const multi = trend.rows.filter((r) => r.year === row.year).length > 1;
                    return (
                      <tr key={`${row.year}-${i}`} className="border-b border-[#F0EDE8] last:border-b-0">
                        <td className="px-4 py-2.5">
                          <span className="font-mono text-[#1A1A1A]">{row.year}</span>
                          {multi && <span className="block max-w-[180px] truncate text-[11px] text-[#9B9B9B]">{titleCase(row.course)}</span>}
                        </td>
                        {trend.rounds.map((r) => (
                          <td key={r} className="px-3 py-2.5 text-right font-mono">
                            {row.ranks[r] !== undefined ? (
                              <span className={r === "R3" ? "font-medium text-[#1A1A1A]" : "text-[#6B6B6B]"}>
                                {formatRank(row.ranks[r] as number)}
                                {row.flags[r] && (
                                  <span className="ml-1 align-super font-sans text-[9px] uppercase text-[#B45309]">
                                    {row.flags[r] === "mock" ? "mock" : "prov"}
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="text-[#D9D4CC]">--</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ── KEA report view ── */}
      <section>
        <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">
          <span className="font-light">As KEA </span>
          <span className="font-bold">printed it.</span>
        </h2>
        <p className="mt-2 text-[14px] text-[#9B9B9B]">Every course and category for one year and round.</p>

        <div role="group" aria-label="Year" className="scrollbar-none -mx-5 mt-6 flex gap-1.5 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
          {file.years.map((y) => (
            <button
              key={y.year}
              type="button"
              aria-pressed={y.year === yearData?.year}
              onClick={() => {
                setReportYear(y.year);
                setReportRound(null);
              }}
              className={cn(
                "h-9 shrink-0 rounded-full border px-4 font-mono text-[13px] transition-colors",
                y.year === yearData?.year ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-[#E5E0D8] bg-white text-[#6B6B6B] hover:border-[#C9C4BC] hover:text-[#1A1A1A]"
              )}
            >
              {y.year}
            </button>
          ))}
        </div>

        {poolReports.length === 0 || !report || !yearData ? (
          <p className="mt-6 text-[14px] text-[#9B9B9B]">
            No {pool === "HK" ? "371(j)" : "general"} report lists this college in {yearData?.year}.
          </p>
        ) : (
          <>
            <div className="mt-4">
              <RoundTabs
                rounds={poolReports.map((r) => ({ round: r.round, label: r.label, mock: r.mock, provisional: r.provisional }))}
                value={report.round}
                onChange={setReportRound}
              />
            </div>

            <div className="mt-4 overflow-x-auto rounded-3xl border border-[#E5E0D8] bg-white">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="border-b border-[#E5E0D8] bg-[#FAFAF8]">
                    <th className="sticky left-0 z-10 min-w-[200px] bg-[#FAFAF8] px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-[#9B9B9B]">
                      Course
                    </th>
                    {yearData.categories.map((code) => (
                      <th
                        key={code}
                        className={cn("px-2.5 py-2.5 text-right font-mono text-[11px] font-medium", code === category ? "bg-[#F5E8E6] text-[#CC3D2E]" : "text-[#6B6B6B]")}
                      >
                        {code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {yearData.courses
                    .filter((c) => c.ranks[report.id])
                    .map((course, i) => (
                      <tr key={`${course.name}-${i}`} className="border-b border-[#F0EDE8] last:border-b-0 hover:bg-[#FAFAF8]">
                        <td className="sticky left-0 z-10 max-w-[260px] bg-white px-4 py-2.5 text-[13px] text-[#1A1A1A]">
                          {course.courseCode && <span className="mr-1.5 font-mono text-[10px] text-[#B0AAA2]">{course.courseCode}</span>}
                          {titleCase(course.name)}
                          {separateRankList(course.name) && (
                            <span className="ml-2 rounded-full bg-[#FEF3E2] px-1.5 py-px text-[10px] font-medium text-[#B45309]">
                              {separateRankList(course.name)}
                            </span>
                          )}
                        </td>
                        {yearData.categories.map((code, ci) => {
                          const value = course.ranks[report.id][ci];
                          return (
                            <td
                              key={code}
                              className={cn("whitespace-nowrap px-2.5 py-2.5 text-right font-mono", code === category ? "bg-[#FDF6F5] font-medium text-[#1A1A1A]" : "text-[#6B6B6B]")}
                            >
                              {value > 0 ? formatRank(value) : <span className="text-[#D9D4CC]">--</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <SourceNote report={report} year={yearData.year} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default CollegeCutoffs;
