"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LinkedInSearch from "@/components/LinkedInSearch";
import CollegeCutoffs from "@/components/kea/CollegeCutoffs";
import { useSlotMachine } from "@/hooks/useSlotMachine";
import { courseGroup, titleCase } from "@/lib/kea/courses";
import { collegeShortName, LATEST_YEAR } from "@/lib/kea/meta";
import type { KeaCollegeFile } from "@/lib/kea/types";
import { formatCount, formatFee, formatRank } from "@/lib/format";
import { EASE_OUT } from "@/lib/motion";
import { BRANCHES } from "@/types";
import type { College } from "@/types";
import { cn } from "@/lib/utils";

function DarkBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center rounded-full border border-white/20 bg-white/10 px-3 text-[12px] font-medium text-white/70">
      {children}
    </span>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-8 items-center rounded-full border border-[#E5E0D8] bg-white px-3 text-[13px] text-[#3D3D3D]">
      {children}
    </span>
  );
}

/** The header's key number, spun in on arrival. */
function KeyNumber({ value }: { value: number }) {
  const text = useSlotMachine(formatRank(value), { delay: 300 });
  return <span className="tabular-nums">{text}</span>;
}

export interface CollegeDetailProps {
  history: KeaCollegeFile;
  /** The app's profile of the college, when it has one; older KEA-only colleges do not. */
  college: College | null;
  initialCategory: string;
  initialBranch?: string;
}

export function CollegeDetail({ history, college, initialCategory, initialBranch }: CollegeDetailProps) {
  const reduceMotion = useReducedMotion();
  const latest = history.years[0];
  const name = college?.name ?? latest?.name ?? history.code;

  /* The number the page leads with: GM in the final general round of the
   * latest year, for computer science when the college offers it. */
  const headline = useMemo(() => {
    if (!latest) return null;
    const report = latest.reports.filter((r) => r.pool === "GEN").at(-1);
    const gm = latest.categories.indexOf("GM");
    if (!report || gm < 0) return null;
    const courses = latest.courses.filter((c) => (c.ranks[report.id]?.[gm] ?? 0) > 0);
    const cse = courses.find((c) => courseGroup(c.name, c.courseCode).branch === "CSE");
    const course = cse ?? courses[0];
    if (!course) return null;
    const branch = courseGroup(course.name, course.courseCode).branch;
    return {
      rank: course.ranks[report.id][gm],
      label: branch ? branch : titleCase(course.name),
      year: latest.year,
      report,
    };
  }, [latest]);

  const courseNames = useMemo(() => {
    const seen = new Set<string>();
    return (latest?.courses ?? [])
      .map((c) => {
        const g = courseGroup(c.name, c.courseCode);
        return g.branch ? BRANCHES[g.branch] : titleCase(c.name);
      })
      .filter((n) => (seen.has(n) ? false : (seen.add(n), true)));
  }, [latest]);

  const facts = college
    ? [
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
      ]
    : [];

  const enter = (delay: number) => ({
    initial: reduceMotion ? false : ({ opacity: 0, y: 24 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE_OUT, delay },
  });

  const years = history.years.map((y) => y.year);
  const tabs = [
    { value: "cutoffs", label: "Year-wise cut-offs" },
    ...(college ? [{ value: "about", label: "About" }] : []),
    { value: "alumni", label: "Alumni" },
  ];

  return (
    <>
      {/* ── Header: the page's one dark moment ── */}
      <header className={cn("bg-[#1A1A1A] pt-20", facts.length ? "pb-32" : "pb-16")}>
        <div className="wrap">
          <div className="grid-editorial items-end gap-y-12">
            <motion.div {...enter(0)} className="col-span-4 min-w-0 md:col-span-5 xl:col-span-7">
              <nav aria-label="Breadcrumb" className="text-[13px] text-white/30">
                <ol className="flex flex-wrap items-center gap-2">
                  <li>
                    <Link href="/cutoffs" className="transition-colors hover:text-white/70">
                      Cut-offs
                    </Link>
                  </li>
                  {college && (
                    <>
                      <li aria-hidden className="text-white/20">/</li>
                      <li>{college.city}</li>
                    </>
                  )}
                  <li aria-hidden className="text-white/20">/</li>
                  <li aria-current="page" className="text-white/50">
                    {collegeShortName(history.code, latest?.name)}
                  </li>
                </ol>
              </nav>

              <h1 className="mt-6 text-balance text-[clamp(2.25rem,4vw,3.75rem)] font-light leading-[1.05] tracking-[-0.03em] text-white">
                {name}
              </h1>

              <div className="mt-8 flex flex-wrap items-center gap-2">
                {college && <DarkBadge>{college.type}</DarkBadge>}
                {college?.naacGrade && <DarkBadge>NAAC {college.naacGrade}</DarkBadge>}
                {college && <DarkBadge>{college.city}</DarkBadge>}
                <DarkBadge>
                  KEA data <span className="ml-1 font-mono">{years.at(-1)}–{years[0]}</span>
                </DarkBadge>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                {college?.website && (
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-[#CC3D2E] transition-colors hover:text-[#E0594A]"
                  >
                    Visit Website
                    <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden />
                  </a>
                )}
                <span className="text-white/30">
                  KEA Code: <span className="font-mono">{history.code}</span>
                </span>
                {!college && latest && latest.year < LATEST_YEAR && (
                  <span className="text-white/30">Last listed by KEA in {latest.year}</span>
                )}
              </div>
            </motion.div>

            {headline && (
              <motion.div {...enter(0.15)} className="col-span-4 md:col-span-3 md:text-right xl:col-span-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/40">
                  {headline.label} GM closing rank
                </p>
                <p className="mt-3 font-mono text-[clamp(3.5rem,7vw,7rem)] font-medium leading-[0.9] tracking-[-0.04em] text-white">
                  <KeyNumber value={headline.rank} />
                </p>
                <p className="mt-4 text-[13px] text-white/30">
                  {headline.year} · {headline.report.label}
                  {headline.report.mock && " (mock)"}
                  {headline.report.provisional && " (provisional)"} · Official KEA data
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* ── Stats band: breaks out of the header and over the page ── */}
      {facts.length > 0 && (
        <div className="wrap relative z-10 -mt-10">
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {facts.map((fact, i) => (
              <motion.div key={fact.label} {...enter(0.25 + i * 0.06)} className="rounded-2xl border border-[#E5E0D8] bg-white p-5 md:p-6">
                <dd className={cn("text-[clamp(1rem,1.8vw,1.375rem)] font-medium text-[#1A1A1A]", fact.text ? "tracking-[-0.01em]" : "font-mono tracking-[-0.02em]")}>
                  {fact.value}
                </dd>
                <dt className="type-caption mt-2">{fact.label}</dt>
              </motion.div>
            ))}
          </dl>
          <p className="mt-4 text-[12px] text-[#9B9B9B]">
            Fees, packages and hostels are indicative. KEA publishes cut-off ranks only, so confirm these with the college.
          </p>
        </div>
      )}

      {/* ── Body ── */}
      <Tabs defaultValue="cutoffs" className="mt-12 min-h-screen gap-0">
        <div className="sticky top-[52px] z-40 border-b border-[#E5E0D8] bg-white">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <TabsList
              variant="line"
              // `!` throughout: this primitive joins classes without deduping,
              // so its own height and underline offset would otherwise win.
              className="h-14! w-full justify-start gap-8 rounded-none border-0 p-0"
            >
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="h-14! flex-none rounded-none border-0! px-0! text-[14px] font-medium text-[#6B6B6B] after:bottom-0! after:bg-[#1A1A1A]! hover:text-[#1A1A1A] data-[state=active]:bg-transparent! data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-none"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
          <TabsContent value="cutoffs">
            <CollegeCutoffs file={history} initialCategory={initialCategory} initialBranch={initialBranch} />
          </TabsContent>

          {college && (
            <TabsContent value="about" className="space-y-12">
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["College type", college.type, false],
                  ["Affiliation", college.affiliation, false],
                  ["Established", String(college.established), true],
                  ["Sanctioned seats", formatCount(college.totalSeats), true],
                  ["District", college.district, false],
                  ["Region", college.region, false],
                ].map(([label, value, mono]) => (
                  <div key={String(label)} className="rounded-2xl border border-[#E5E0D8] bg-white p-5">
                    <dd className={cn("text-[15px] font-medium text-[#1A1A1A]", mono && "font-mono")}>{value}</dd>
                    <dt className="type-caption mt-1.5">{label}</dt>
                  </div>
                ))}
              </dl>

              <section>
                <h2 className="text-[24px] font-light tracking-[-0.02em] text-[#1A1A1A]">
                  Courses in KEA&rsquo;s {latest?.year} reports
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {courseNames.map((n) => (
                    <Pill key={n}>{n}</Pill>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-[24px] font-light tracking-[-0.02em] text-[#1A1A1A]">Recruiters</h2>
                <p className="mt-1 text-[12px] text-[#9B9B9B]">Indicative, not published by KEA</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {college.topRecruiters.map((r) => (
                    <Pill key={r}>{r}</Pill>
                  ))}
                </div>
              </section>
            </TabsContent>
          )}

          <TabsContent value="alumni" className="space-y-2">
            <LinkedInSearch collegeName={name} collegeShortName={college?.shortName ?? collegeShortName(history.code, name)} />
            {courseNames.slice(0, 8).map((course) => (
              <LinkedInSearch
                key={course}
                collegeName={name}
                collegeShortName={college?.shortName ?? collegeShortName(history.code, name)}
                branch={course}
              />
            ))}
            <p className="type-body-sm pt-4 text-[#9B9B9B]">
              These links only build a LinkedIn search. We hold no alumni data; what comes back is whatever LinkedIn
              shows for that query.
            </p>
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}

export default CollegeDetail;
