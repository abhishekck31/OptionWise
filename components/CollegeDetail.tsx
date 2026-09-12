"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, ExternalLink } from "lucide-react";
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
import { getBranchesWithCutoffs, getCutoff, VERIFIED_YEAR } from "@/lib/data/cutoffs";
import { AVAILABLE_YEARS } from "@/lib/data/cutoffs";
import { useKCETHydration, useRank } from "@/hooks/useKCETStore";
import { BRANCHES, CATEGORIES } from "@/types";
import type { Branch, Category, College } from "@/types";
import { cn } from "@/lib/utils";

// recharts is the heaviest thing on the page and only the first tab needs it.
const RankTrendChart = dynamic(() => import("@/components/RankTrendChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] animate-shimmer rounded-xl border border-[#E5E0D8]" />
  ),
});

const inr = (n: number) => n.toLocaleString("en-IN");
const rupees = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${inr(n)}`;

const CATEGORY_GROUPS: { label: string; keys: Category[] }[] = [
  { label: "General", keys: ["GM", "GMK", "GMR"] },
  { label: "Category 1", keys: ["1G"] },
  { label: "OBC", keys: ["2AG", "2AR", "2BG", "3AG", "3BG"] },
  { label: "SC", keys: ["S1G", "S2G", "S3G", "S4R"] },
  { label: "ST", keys: ["STG", "STK", "STR"] },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[#E5E0D8] bg-white px-2.5 py-1 text-xs text-[#6B6B6B]">
      {children}
    </span>
  );
}

const TAB_ITEMS = [
  { value: "cutoffs", label: "Cutoff Analysis" },
  { value: "about", label: "About" },
  { value: "alumni", label: "Alumni" },
] as const;

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[#E5E0D8] bg-[#F0EDE8] px-2.5 py-1 text-xs text-[#6B6B6B]">
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
    {
      label: "Average package",
      value: `₹${college.avgPackage} LPA`,
      tone: "text-[#1F7A4A]",
    },
    { label: "Highest package", value: `₹${college.highestPackage} LPA` },
    { label: "Annual fee", value: rupees(college.annualFee) },
    {
      label: "Hostel",
      value:
        college.hasHostel && college.hostelType !== "None"
          ? `Usually ${college.hostelType.toLowerCase()}`
          : "Not recorded",
    },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
      <Link
        href="/predict/college"
        className="inline-flex items-center gap-1.5 text-sm text-[#CC3D2E] transition-colors hover:text-[#B5351F]"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Back
      </Link>

      <h1 className="mt-5 text-2xl font-normal tracking-tight text-[#1A1A1A] sm:text-3xl">
        {college.name}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge>{college.city}</Badge>
        <Badge>{college.type}</Badge>
        <Badge>{college.affiliation}</Badge>
        {college.nirfRank !== null && <Badge>NIRF #{college.nirfRank}</Badge>}
        {college.naacGrade && <Badge>NAAC {college.naacGrade}</Badge>}
        <Badge>Est. {college.established}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-lg border border-[#E8C4BF] bg-[#F5E8E6] px-2.5 py-1 font-mono text-xs text-[#CC3D2E]">
          KEA {college.kea_code}
        </span>
        {college.website && (
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-transparent px-2.5 py-1 text-xs text-[#6B6B6B] transition-colors hover:bg-[#F0EDE8] hover:text-[#1A1A1A]"
          >
            Website
            <ExternalLink className="size-3" aria-hidden />
          </a>
        )}
      </div>

      <dl className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-xl border border-[#E5E0D8] bg-white p-4"
          >
            <dt className="text-xs text-[#9B9B9B]">{fact.label}</dt>
            <dd
              className={cn(
                "mt-1 font-mono text-lg font-semibold",
                fact.tone ?? "text-[#1A1A1A]"
              )}
            >
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-[#9B9B9B]">
        Fee, packages and hostel are indicative. KEA publishes cutoff ranks only,
        so check these four against the college itself.
      </p>

      <Tabs defaultValue="cutoffs" className="mt-9">
        {/* Claude's tabs are underlined, not a pill bar: the rule runs the
            full width and the active tab sits on a 2px accent edge. */}
        <TabsList
          variant="line"
          className="h-auto w-full justify-start gap-6 rounded-none border-b border-[#E5E0D8] p-0"
        >
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-auto rounded-none border-0 border-b-2 border-transparent px-0 pb-3 text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] data-[state=active]:border-[#CC3D2E] data-[state=active]:bg-transparent data-[state=active]:text-[#CC3D2E]"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Cutoffs ── */}
        <TabsContent value="cutoffs" className="mt-6 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            {branches.length <= 5 ? (
              <div className="flex flex-wrap gap-1.5">
                {branches.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBranch(b)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs transition-colors active:scale-[0.97]",
                      branch === b
                        ? "border-[#E8C4BF] bg-[#F5E8E6] text-[#CC3D2E]"
                        : "border-[#E5E0D8] bg-white text-[#6B6B6B] hover:bg-[#F0EDE8]"
                    )}
                  >
                    {b}
                  </button>
                ))}
              </div>
            ) : (
              <Select
                value={branch}
                onValueChange={(next) => setBranch(next as Branch)}
              >
                <SelectTrigger className="h-11 w-[260px] rounded-lg border-[#E5E0D8] bg-[#F0EDE8]">
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

            <Select
              value={category}
              onValueChange={(next) => setCategory(next as Category)}
            >
              <SelectTrigger className="h-11 w-[200px] rounded-lg border-[#E5E0D8] bg-[#F0EDE8]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_GROUPS.map((group) => (
                  <SelectGroup key={group.label}>
                    <SelectLabel className="text-[#9B9B9B]">
                      {group.label}
                    </SelectLabel>
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

          <div className="overflow-x-auto rounded-xl border border-[#E5E0D8] bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E5E0D8] text-xs text-[#9B9B9B]">
                  <th className="px-4 py-3 font-medium">Year</th>
                  <th className="px-4 py-3 font-medium">Round 1</th>
                  <th className="px-4 py-3 font-medium">Round 2</th>
                  <th className="px-4 py-3 font-medium">Round 3</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {years.map((row, i) => (
                  <tr
                    key={row.year}
                    className={cn(
                      "border-b border-[#E5E0D8] last:border-b-0",
                      i % 2 === 1 && "bg-[#FAFAF8]"
                    )}
                  >
                    <td className="px-4 py-2.5 font-mono text-[#1A1A1A]">
                      {row.year}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[#6B6B6B]">
                      {row.r1 !== undefined ? inr(row.r1) : "—"}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[#6B6B6B]">
                      {row.r2 !== undefined ? inr(row.r2) : "—"}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[#1A1A1A]">
                      {row.r3 !== undefined ? inr(row.r3) : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      {row.year === VERIFIED_YEAR ? (
                        <span className="text-green-600">published</span>
                      ) : (
                        <span className="text-[#9B9B9B]">projected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Disclaimer />
        </TabsContent>

        {/* ── About ── */}
        <TabsContent value="about" className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["College type", college.type],
              ["Affiliation", college.affiliation],
              ["Established", String(college.established)],
              ["Sanctioned seats", inr(college.totalSeats)],
              ["District", college.district],
              ["Region", college.region],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-[#E5E0D8] bg-white p-4"
              >
                <p className="text-xs text-[#9B9B9B]">{label}</p>
                <p className="mt-1 text-sm text-[#1A1A1A]">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs text-[#9B9B9B]">Branches with published cutoffs</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {branches.map((b) => (
                <Pill key={b}>{BRANCHES[b]}</Pill>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-[#9B9B9B]">
              Recruiters — indicative, not published by KEA
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {college.topRecruiters.map((r) => (
                <Pill key={r}>{r}</Pill>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ── Alumni ── */}
        <TabsContent value="alumni" className="mt-6 space-y-3">
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
          <p className="pt-2 text-xs leading-relaxed text-[#9B9B9B]">
            These links only build a LinkedIn search query. We hold no alumni
            data, and what comes back is whatever LinkedIn decides to show.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CollegeDetail;
