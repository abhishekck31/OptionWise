"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { ArrowDownUp, Search } from "lucide-react";
import LoadingDots from "@/components/motion/LoadingDots";
import Reveal from "@/components/motion/Reveal";
import { CategorySelect, PoolToggle, RoundTabs, YearSelect } from "@/components/kea/ControlSelect";
import { SourceNote } from "@/components/kea/SourceNote";
import { useKeaYear } from "@/hooks/useKeaYear";
import { collegeHref, collegeShortName, KEA_META, KEA_YEARS, LATEST_YEAR, reportsFor, yearMeta } from "@/lib/kea/meta";
import { separateRankList, titleCase } from "@/lib/kea/courses";
import { formatCount, formatRank } from "@/lib/format";
import { cn } from "@/lib/utils";

const PAGE = 100;

type Row = { code: string; college: string; course: string; ranks: number[] };

/**
 * Every college's cut-offs for a year, the way KEA's reports print them — but
 * searchable, sortable, and one click from any year or round.
 */
export function CutoffBrowser() {
  const [query, setQuery] = useQueryStates({
    year: parseAsInteger.withDefault(LATEST_YEAR),
    round: parseAsString,
    pool: parseAsStringLiteral(["GEN", "HK"] as const).withDefault("GEN"),
    category: parseAsString.withDefault("GM"),
    view: parseAsStringLiteral(["category", "report"] as const).withDefault("category"),
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"rank" | "college">("rank");
  const [shown, setShown] = useState(PAGE);

  const year = KEA_YEARS.includes(query.year) ? query.year : LATEST_YEAR;
  const reports = reportsFor(year, query.pool);
  const report = reports.find((r) => r.round === query.round) ?? reports.at(-1) ?? null;
  const { data, loading, error } = useKeaYear(year);

  const categories = useMemo(
    () => data?.categories ?? yearMeta(year)?.categories ?? [],
    [data, year]
  );
  const category = categories.includes(query.category) ? query.category : "GM";
  const catIndex = categories.indexOf(category);

  const rows = useMemo<Row[]>(() => {
    if (!data || !report) return [];
    const out: Row[] = [];
    for (const college of data.colleges) {
      for (const course of college.courses) {
        const ranks = course.ranks[report.id];
        if (ranks) out.push({ code: college.code, college: college.name, course: course.name, ranks });
      }
    }
    return out;
  }, [data, report]);

  const visible = useMemo(() => {
    const needle = search.trim().toUpperCase();
    let list = needle
      ? rows.filter((r) => r.college.toUpperCase().includes(needle) || r.course.toUpperCase().includes(needle) || r.code === needle)
      : rows;
    if (query.view === "category") {
      list = list.filter((r) => r.ranks[catIndex] > 0);
      list = [...list].sort((a, b) =>
        sort === "rank" ? a.ranks[catIndex] - b.ranks[catIndex] : a.code.localeCompare(b.code)
      );
    }
    return list;
  }, [rows, search, query.view, catIndex, sort]);

  useEffect(() => setShown(PAGE), [year, report?.id, category, query.view, search, sort]);

  // Report view: only columns this round actually filled.
  const reportColumns = useMemo(
    () => categories.map((code, i) => ({ code, i })).filter(({ i }) => rows.some((r) => r.ranks[i] > 0)),
    [categories, rows]
  );

  return (
    <>
      <section className="relative isolate overflow-hidden pb-10 pt-16 md:pt-24">
        <p aria-hidden className="watermark -right-[0.06em] top-4 -z-10 text-[clamp(8rem,24vw,22rem)] text-black/[0.03]">
          {year}
        </p>
        <div className="wrap">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9B9B9B]">
              Year-wise cut-offs · {KEA_META.years.length} years of KEA reports
            </p>
            <h1 className="mt-4 text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] tracking-[-0.04em] text-[#1A1A1A]">
              <span className="block font-light">Every college.</span>
              <span className="block font-bold">Every round.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.7] text-[#6B6B6B]">
              KEA&rsquo;s engineering cut-off reports from {KEA_YEARS.at(-1)} to {LATEST_YEAR}, all in one place.
              Pick a year and round to see every closing rank exactly as KEA printed it.
              {KEA_META.missingYears.length > 0 &&
                ` KEA no longer hosts the ${KEA_META.missingYears.join(", ")} reports, so ${KEA_META.missingYears.length === 1 ? "that year is" : "those years are"} not here.`}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="wrap pb-20">
        {/* ── Controls ── */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-2xl border border-[#E5E0D8] bg-white p-1">
            <YearSelect years={KEA_YEARS} value={year} onChange={(y) => void setQuery({ year: y, round: null })} />
            <span aria-hidden className="h-6 w-px bg-[#E5E0D8]" />
            <CategorySelect categories={categories} value={category} onChange={(c) => void setQuery({ category: c })} />
          </div>
          <PoolToggle value={query.pool} onChange={(pool) => void setQuery({ pool })} />
          <div role="group" aria-label="View" className="inline-flex rounded-full bg-[#F0EDE8] p-0.5">
            {(
              [
                ["category", "One category"],
                ["report", "Full report"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={query.view === value}
                onClick={() => void setQuery({ view: value })}
                className={cn(
                  "h-8 rounded-full px-3.5 text-[13px] font-medium transition-colors",
                  query.view === value ? "bg-white text-[#1A1A1A] shadow-[0_1px_2px_rgba(26,26,26,0.06)]" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {reports.length > 0 ? (
          <div className="mt-5">
            <RoundTabs
              rounds={reports.map((r) => ({ round: r.round, label: r.label, mock: r.mock, provisional: r.provisional }))}
              value={report?.round ?? ""}
              onChange={(round) => void setQuery({ round })}
            />
          </div>
        ) : (
          <p className="mt-6 text-[14px] text-[#9B9B9B]">
            KEA did not publish a {query.pool === "HK" ? "371(j)" : "general"} report for {year}.
          </p>
        )}

        {error ? (
          <p className="py-20 text-center text-[15px] text-[#B45309]">{error}</p>
        ) : loading ? (
          <LoadingDots label={`Loading KEA's ${year} cut-offs…`} />
        ) : report ? (
          <div className="mt-6 rounded-3xl border border-[#E5E0D8] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0EDE8] px-4 py-4 md:px-6">
              <p className="text-[14px] text-[#6B6B6B]">
                <span className="font-mono text-[20px] font-medium text-[#1A1A1A]">{formatCount(visible.length)}</span>{" "}
                {query.view === "category" ? (
                  <>
                    courses with a <span className="font-mono text-[#1A1A1A]">{category}</span> closing rank
                  </>
                ) : (
                  "courses"
                )}
              </p>
              <div className="flex w-full items-center gap-2 md:w-auto">
                <div className="relative flex-1 md:w-72 md:flex-none">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#B0AAA2]" strokeWidth={1.5} aria-hidden />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="College, course or code"
                    aria-label="Search college, course or code"
                    className="h-9 w-full rounded-full border border-[#E5E0D8] bg-[#F7F4F0] pl-9 pr-3 text-[13px] focus:border-[#C9C4BC] focus:bg-white focus-visible:shadow-none focus-visible:outline-none"
                  />
                </div>
                {query.view === "category" && (
                  <button
                    type="button"
                    onClick={() => setSort((s) => (s === "rank" ? "college" : "rank"))}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#E5E0D8] px-3 text-[12px] font-medium text-[#6B6B6B] hover:text-[#1A1A1A]"
                  >
                    <ArrowDownUp className="size-3.5" strokeWidth={1.5} aria-hidden />
                    {sort === "rank" ? "By rank" : "By college code"}
                  </button>
                )}
              </div>
            </div>

            {query.view === "category" ? (
              <ol>
                {visible.slice(0, shown).map((row, i) => (
                  <li key={`${row.code}-${row.course}-${i}`}>
                    <Link
                      href={collegeHref(row.code)}
                      className="group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-4 border-b border-[#F0EDE8] px-4 py-3.5 hover:bg-[#FAFAF8] md:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)_8rem] md:px-6"
                    >
                      <span className="font-mono text-[12px] text-[#B0AAA2]">{i + 1}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-medium text-[#1A1A1A] group-hover:text-[#CC3D2E]">
                          {collegeShortName(row.code, row.college)}
                          <span className="ml-2 font-mono text-[11px] font-normal text-[#B0AAA2]">{row.code}</span>
                        </span>
                        <span className="block truncate text-[12px] text-[#9B9B9B] md:hidden">{titleCase(row.course)}</span>
                      </span>
                      <span className="hidden truncate text-[13px] text-[#6B6B6B] md:block">
                        {titleCase(row.course)}
                        {separateRankList(row.course) && (
                          <span className="ml-2 rounded-full bg-[#FEF3E2] px-1.5 py-px text-[10px] font-medium text-[#B45309]">
                            {separateRankList(row.course)}
                          </span>
                        )}
                      </span>
                      <span className="text-right font-mono text-[15px] font-medium text-[#1A1A1A]">
                        {formatRank(row.ranks[catIndex])}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[12px]">
                  <thead>
                    <tr className="border-b border-[#E5E0D8] bg-[#FAFAF8]">
                      <th className="sticky left-0 z-10 min-w-[220px] bg-[#FAFAF8] px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-[#9B9B9B]">
                        College · course
                      </th>
                      {reportColumns.map(({ code }) => (
                        <th
                          key={code}
                          className={cn(
                            "px-2.5 py-2.5 text-right font-mono text-[11px] font-medium",
                            code === category ? "bg-[#F5E8E6] text-[#CC3D2E]" : "text-[#6B6B6B]"
                          )}
                        >
                          {code}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.slice(0, shown).map((row, i) => (
                      <tr key={`${row.code}-${row.course}-${i}`} className="border-b border-[#F0EDE8] hover:bg-[#FAFAF8]">
                        <td className="sticky left-0 z-10 max-w-[260px] bg-white px-4 py-2.5">
                          <Link href={collegeHref(row.code)} className="block truncate font-medium text-[#1A1A1A] hover:text-[#CC3D2E]">
                            <span className="mr-1.5 font-mono text-[10px] text-[#B0AAA2]">{row.code}</span>
                            {collegeShortName(row.code, row.college)}
                          </Link>
                          <span className="block truncate text-[11px] text-[#9B9B9B]">{titleCase(row.course)}</span>
                        </td>
                        {reportColumns.map(({ code, i: ci }) => (
                          <td
                            key={code}
                            className={cn(
                              "whitespace-nowrap px-2.5 py-2.5 text-right font-mono",
                              code === category ? "bg-[#FDF6F5] font-medium text-[#1A1A1A]" : "text-[#6B6B6B]"
                            )}
                          >
                            {row.ranks[ci] > 0 ? formatRank(row.ranks[ci]) : <span className="text-[#D9D4CC]">--</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {visible.length > shown && (
              <div className="px-6 py-4 text-center">
                <button
                  type="button"
                  onClick={() => setShown((n) => n + PAGE)}
                  className="rounded-full border border-[#E5E0D8] px-5 py-2 text-[13px] font-medium text-[#1A1A1A] hover:border-[#C9C4BC]"
                >
                  Show {Math.min(PAGE, visible.length - shown)} more of {formatCount(visible.length - shown)}
                </button>
              </div>
            )}
          </div>
        ) : null}

        {report && (
          <div className="mt-6">
            <SourceNote report={report} year={year} />
          </div>
        )}
      </section>
    </>
  );
}

export default CutoffBrowser;
