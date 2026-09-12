"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LinkedInSearch from "@/components/LinkedInSearch";
import Disclaimer from "@/components/shared/Disclaimer";
import { CATEGORY_GROUPS } from "@/components/shared/CategoryPicker";
import { getBranchesWithCutoffs, getCutoff, VERIFIED_YEAR } from "@/lib/data/cutoffs";
import { AVAILABLE_YEARS } from "@/lib/data/cutoffs";
import { useKCETHydration, useRank } from "@/hooks/useKCETStore";
import { formatCount, formatFee, formatRank } from "@/lib/format";
import { BRANCHES, CATEGORIES } from "@/types";
import type { Branch, Category, College } from "@/types";
import { cn } from "@/lib/utils";

// recharts is the heaviest thing on the page and only the first tab needs it.
const RankTrendChart = dynamic(() => import("@/components/RankTrendChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[340px] animate-shimmer rounded-2xl border border-[#E5E0D8]" />
  ),
});

const TAB_ITEMS = [
  { value: "cutoffs", label: "Cutoffs" },
  { value: "about", label: "About" },
  { value: "alumni", label: "Alumni" },
] as const;

/** Shared trigger styling; `!` because this Select merges classes without deduping. */
const SELECT_TRIGGER =
  "h-10! rounded-xl! border-[#E0DCD4]! bg-white! px-4! text-[14px]!";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center rounded-lg border border-[#E5E0D8] bg-[#F7F4F0] px-2.5 text-[12px] font-medium text-[#6B6B6B]">
      {children}
    </span>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center rounded-lg border border-[#E5E0D8] bg-white px-2.5 text-[13px] text-[#3D3D3D]">
      {children}
    </span>
  );
}

export interface CollegeDetailProps {
  college: College;
  initialBranch: Branch;
  initialCategory: Category;
}

export function CollegeDetail({
  college,
  initialBranch,
  initialCategory,
}: CollegeDetailProps) {
  const hydrated = useKCETHydration();
  const studentRank = useRank();

  const branches = useMemo(
    () => getBranchesWithCutoffs(college.id),
    [college.id]
  );

  const [branch, setBranch] = useState<Branch>(
    branches.includes(initialBranch) ? initialBranch : (branches[0] ?? "CSE")
  );
  const [category, setCategory] = useState<Category>(initialCategory);

  /* The one number the page leads with: CSE general merit, or the first
   * branch with a published figure when the college has no CSE seat. */
  const headline = useMemo(() => {
    const order: Branch[] = branches.includes("CSE")
      ? ["CSE", ...branches.filter((b) => b !== "CSE")]
      : branches;
    for (const b of order) {
      const row = getCutoff(college.id, b, "GM", "R3");
      if (row) return { branch: b, rank: row.closingRank };
    }
    return null;
  }, [college.id, branches]);

  const years = useMemo(
    () =>
      [...AVAILABLE_YEARS].sort((a, b) => b - a).map((year) => ({
        year,
        r1: getCutoff(college.id, branch, category, "R1", year)?.closingRank,
        r2: getCutoff(college.id, branch, category, "R2", year)?.closingRank,
        r3: getCutoff(college.id, branch, category, "R3", year)?.closingRank,
      })),
    [college.id, branch, category]
  );

  const facts = [
    { label: "Average package", value: `₹${college.avgPackage} LPA` },
    { label: "Highest package", value: `₹${college.highestPackage} LPA` },
    { label: "Annual fee", value: formatFee(college.annualFee) },
    {
      label: "Hostel",
      value:
        college.hasHostel && college.hostelType !== "None"
          ? college.hostelType === "Both"
            ? "Boys and girls"
            : college.hostelType
          : "Not recorded",
      text: true,
    },
  ];

  return (
    <>
      {/* ── Header ── */}
      <header className="border-b border-[#E5E0D8] bg-white">
        <div className="mx-auto max-w-[1120px] px-6 pb-10 pt-8 sm:px-8">
          <Link
            href="/predict/college"
            className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6B6B6B] transition-colors hover:text-[#1A1A1A]"
          >
            <ArrowLeft
              className="size-3.5 transition-transform duration-150 group-hover:-translate-x-0.5"
              strokeWidth={1.5}
              aria-hidden
            />
            College Finder
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
            <div className="min-w-0">
              <p className="type-caption">
                KEA code <span className="font-mono normal-case tracking-normal text-[#6B6B6B]">{college.kea_code}</span>
              </p>
              <h1 className="type-h1 mt-3 max-w-[720px] text-balance">{college.name}</h1>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Chip>{college.city}</Chip>
                <Chip>{college.type}</Chip>
                <Chip>{college.affiliation}</Chip>
                {college.nirfRank !== null && (
                  <Chip>
                    NIRF <span className="ml-1 font-mono text-[#1A1A1A]">{college.nirfRank}</span>
                  </Chip>
                )}
                {college.naacGrade && (
                  <Chip>
                    NAAC <span className="ml-1 text-[#1A1A1A]">{college.naacGrade}</span>
                  </Chip>
                )}
                <Chip>
                  Est. <span className="ml-1 font-mono text-[#1A1A1A]">{college.established}</span>
                </Chip>
                {college.website && (
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 inline-flex items-center gap-1 text-[13px] font-medium text-[#6B6B6B] transition-colors hover:text-[#1A1A1A]"
                  >
                    Website
                    <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden />
                  </a>
                )}
              </div>
            </div>

            {headline && (
              <div className="lg:text-right">
                <p className="font-mono text-[64px] font-medium leading-none tracking-[-0.03em] text-[#CC3D2E]">
                  {formatRank(headline.rank)}
                </p>
                <p className="type-caption mt-3">
                  {headline.branch} GM closing rank {VERIFIED_YEAR}
                </p>
              </div>
            )}
          </div>

          <dl className="scrollbar-none -mx-6 mt-10 flex snap-x gap-3 overflow-x-auto px-6 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="min-w-[160px] shrink-0 snap-start rounded-xl bg-[#F7F4F0] p-4 lg:min-w-0"
              >
                <dd
                  className={cn(
                    "text-[17px] font-medium text-[#1A1A1A]",
                    fact.text ? "tracking-[-0.01em]" : "font-mono"
                  )}
                >
                  {fact.value}
                </dd>
                <dt className="type-caption mt-1.5">{fact.label}</dt>
              </div>
            ))}
          </dl>

          <p className="type-body-sm mt-4 text-[#9B9B9B]">
            Fees, packages and hostels are indicative. KEA publishes cutoff ranks
            only, so confirm these with the college.
          </p>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="mx-auto max-w-[1120px] px-6 pt-10 sm:px-8">
        <Tabs defaultValue="cutoffs">
          <TabsList
            variant="line"
            className="h-auto w-full justify-start gap-8 rounded-none border-b border-[#E5E0D8] p-0"
          >
            {TAB_ITEMS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="h-auto flex-none rounded-none border-0 border-b-2 border-transparent px-0 pb-3 text-[14px] font-medium text-[#6B6B6B] after:hidden hover:text-[#1A1A1A] data-[state=active]:border-[#1A1A1A] data-[state=active]:bg-transparent data-[state=active]:text-[#1A1A1A]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Cutoffs ── */}
          <TabsContent value="cutoffs" className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              {branches.length <= 6 ? (
                <div role="group" aria-label="Branch" className="flex flex-wrap gap-1.5">
                  {branches.map((b) => (
                    <button
                      key={b}
                      type="button"
                      aria-pressed={branch === b}
                      title={BRANCHES[b]}
                      onClick={() => setBranch(b)}
                      className={cn(
                        "h-9 rounded-[10px] border px-3.5 font-mono text-[13px] font-medium transition-colors duration-150 active:scale-[0.97]",
                        branch === b
                          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                          : "border-[#E5E0D8] bg-white text-[#6B6B6B] hover:border-[#C9C4BC] hover:text-[#1A1A1A]"
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              ) : (
                <Select value={branch} onValueChange={(next) => setBranch(next as Branch)}>
                  <SelectTrigger aria-label="Branch" className={cn(SELECT_TRIGGER, "w-[280px]!")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b} value={b}>
                        {BRANCHES[b]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={category} onValueChange={(next) => setCategory(next as Category)}>
                <SelectTrigger aria-label="Category" className={cn(SELECT_TRIGGER, "w-[220px]!")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_GROUPS.map((group) => (
                    <SelectGroup key={group.label}>
                      <SelectLabel className="type-caption">{group.label}</SelectLabel>
                      {group.keys.map((key) => (
                        <SelectItem key={key} value={key}>
                          {CATEGORIES[key]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <RankTrendChart
              collegeId={college.id}
              branch={branch}
              category={category}
              studentRank={hydrated ? studentRank : undefined}
            />

            <div className="overflow-x-auto rounded-2xl border border-[#E5E0D8] bg-white">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-[#E5E0D8]">
                    {["Year", "Round 1", "Round 2", "Round 3", "Source"].map((h, i) => (
                      <th
                        key={h}
                        className={cn(
                          "type-caption px-5 py-3.5 font-medium",
                          i > 0 && i < 4 && "text-right"
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {years.map((row) => {
                    const published = row.year === VERIFIED_YEAR;
                    const cell = (n?: number) => (n !== undefined ? formatRank(n) : "—");
                    return (
                      <tr
                        key={row.year}
                        className={cn(
                          "border-b border-[#F0EDE8] last:border-b-0",
                          published && "bg-[#FAF8F5]"
                        )}
                      >
                        <td className="px-5 py-3 font-mono text-[#1A1A1A]">{row.year}</td>
                        <td className="px-5 py-3 text-right font-mono text-[#6B6B6B]">{cell(row.r1)}</td>
                        <td className="px-5 py-3 text-right font-mono text-[#6B6B6B]">{cell(row.r2)}</td>
                        <td className="px-5 py-3 text-right font-mono font-medium text-[#1A1A1A]">{cell(row.r3)}</td>
                        <td className="px-5 py-3 text-[12px]">
                          {published ? (
                            <span className="inline-flex items-center gap-1.5 font-medium text-[#1F7A4A]">
                              <span aria-hidden className="size-1.5 rounded-full bg-current" />
                              Published
                            </span>
                          ) : (
                            <span className="text-[#9B9B9B]">Projected</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Disclaimer />
          </TabsContent>

          {/* ── About ── */}
          <TabsContent value="about" className="mt-8 space-y-10">
            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["College type", college.type, false],
                ["Affiliation", college.affiliation, false],
                ["Established", String(college.established), true],
                ["Sanctioned seats", formatCount(college.totalSeats), true],
                ["District", college.district, false],
                ["Region", college.region, false],
              ].map(([label, value, mono]) => (
                <div key={String(label)} className="rounded-xl border border-[#E5E0D8] bg-white p-5">
                  <dd className={cn("text-[15px] font-medium text-[#1A1A1A]", mono && "font-mono")}>
                    {value}
                  </dd>
                  <dt className="type-caption mt-1.5">{label}</dt>
                </div>
              ))}
            </dl>

            <section>
              <h2 className="type-label">Branches with published cutoffs</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {branches.map((b) => (
                  <Pill key={b}>{BRANCHES[b]}</Pill>
                ))}
              </div>
            </section>

            <section>
              <h2 className="type-label">Recruiters</h2>
              <p className="mt-1 text-[12px] text-[#9B9B9B]">Indicative, not published by KEA</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {college.topRecruiters.map((r) => (
                  <Pill key={r}>{r}</Pill>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* ── Alumni ── */}
          <TabsContent value="alumni" className="mt-8 space-y-2">
            <LinkedInSearch
              collegeName={college.name}
              collegeShortName={college.shortName}
            />
            {branches.map((b) => (
              <LinkedInSearch
                key={b}
                collegeName={college.name}
                collegeShortName={college.shortName}
                branch={BRANCHES[b]}
              />
            ))}
            <p className="type-body-sm pt-4 text-[#9B9B9B]">
              These links only build a LinkedIn search. We hold no alumni data;
              what comes back is whatever LinkedIn shows for that query.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default CollegeDetail;
