"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, GripVertical, ListOrdered, Search, Table2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import CountUp from "@/components/motion/CountUp";
import SpringNumber from "@/components/motion/SpringNumber";
import Reveal, { VIEWPORT, revealCard, revealGroup } from "@/components/motion/Reveal";
import { formatCount, formatRank } from "@/lib/format";
import { EASE_OUT } from "@/lib/motion";
import {
  COLLEGE_COUNT,
  FIRST_YEAR,
  LATEST_YEAR,
  reachable,
  SHOWCASE,
  TOP_CSE,
  TOTAL_RANKS,
} from "@/lib/showcase";
import { cn } from "@/lib/utils";

/* ─── Cell A: the college finder, shrunk into the card ────────────────────── */

function RoundPreview() {
  const reduceMotion = useReducedMotion();
  const stops = SHOWCASE.rankStops;
  const [index, setIndex] = useState(stops.indexOf(5000) >= 0 ? stops.indexOf(5000) : 0);
  const rank = stops[index];
  const rows = reachable(rank);
  const max = Math.max(1, ...SHOWCASE.rounds.map((r) => SHOWCASE.reachableAtStops[r.round]?.[stops.length - 1] ?? 0));

  // The panel leans a few pixels with the mouse while the cell is hovered.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 20 });
  const y = useSpring(rawY, { stiffness: 150, damping: 20 });

  return (
    <div
      className="relative mt-10 flex flex-1 items-end"
      onPointerMove={(e) => {
        if (reduceMotion || e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * -10);
        rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * -8);
      }}
      onPointerLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
    >
      <motion.div
        style={{ x, y }}
        // Hangs past the card's right and bottom padding: the one piece of
        // the bento that breaks its own frame.
        className="-mb-8 -mr-8 w-[calc(100%+2rem)] rounded-tl-2xl border-l border-t border-[#E5E0D8] bg-[#F7F4F0] p-6 sm:p-7"
      >
        <div className="flex items-baseline justify-between gap-4">
          <span className="type-caption">Your rank · GM</span>
          <span className="font-mono text-[15px] font-medium text-[#1A1A1A]">{formatRank(rank)}</span>
        </div>
        <Slider
          value={[index]}
          min={0}
          max={stops.length - 1}
          step={1}
          onValueChange={([next]) => setIndex(next)}
          aria-label="Sample rank"
          aria-valuetext={`Rank ${formatRank(rank)}`}
          className="mt-3"
          style={{ ["--slider-fill" as string]: "#1A1A1A" }}
        />

        <div className="mt-6 space-y-2.5">
          {rows.map(({ round, count }) => (
            <div key={round.round} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3">
              <span className="text-[12px] text-[#6B6B6B]">
                {round.label}
                {(round.mock || round.provisional) && <span className="text-[#B0AAA2]">*</span>}
              </span>
              <span className="h-1.5 overflow-hidden rounded-full bg-[#E5E0D8]">
                <motion.span
                  className={cn("block h-full rounded-full", round.round === "R3" ? "bg-[#1A1A1A]" : "bg-[#9B9B9B]")}
                  initial={false}
                  animate={{ width: `${(count / max) * 100}%` }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                />
              </span>
              <span className="text-right font-mono text-[12px] text-[#1A1A1A]">{formatCount(count)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-[#E5E0D8] pt-5">
          <div>
            <p className="type-caption">Courses in the final round</p>
            <p className="mt-2 font-mono text-[clamp(2rem,3.4vw,2.75rem)] font-medium leading-none tracking-[-0.03em] text-[#1A1A1A]">
              <SpringNumber value={rows.at(-1)?.count ?? 0} />
            </p>
          </div>
          <p className="pb-1 text-right font-mono text-[11px] leading-relaxed text-[#9B9B9B]">
            KEA {LATEST_YEAR}
            <br />
            {SHOWCASE.rounds.some((r) => r.mock || r.provisional) ? "* mock / provisional list" : "all rounds final"}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Cell shells ─────────────────────────────────────────────────────────── */

function LinkArrow() {
  return <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={1.5} aria-hidden />;
}

function LinkedInGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.5 9.75h4.96V21H2.5V9.75ZM9.5 9.75h4.75v1.54h.07c.66-1.19 2.27-2.44 4.68-2.44 5 0 5.92 3.13 5.92 7.2V21h-4.96v-4.9c0-1.17-.02-2.67-1.7-2.67-1.7 0-1.96 1.27-1.96 2.58V21H11.4V9.75H9.5Z" />
    </svg>
  );
}

const CELL = "bento-cell group relative overflow-hidden";

/* ─── Section ─────────────────────────────────────────────────────────────── */

export function Bento() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-32">
      <div className="wrap">
        <div className="grid-editorial items-end gap-y-6">
          <Reveal className="col-span-4 md:col-span-5 xl:col-span-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9B9B9B]">The toolkit</p>
            <h2 className="mt-4 text-[clamp(2.75rem,5vw,4.75rem)] leading-[0.95] tracking-[-0.04em] text-[#1A1A1A]">
              <span className="block font-light">Every report.</span>
              <span className="block font-bold">One place.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="col-span-4 md:col-span-3 md:pb-2 xl:col-span-4 xl:col-start-9">
            <p className="text-[15px] leading-[1.7] text-[#6B6B6B]">
              KEA publishes its cut-offs as a separate PDF for every round and seat pool, every year. Here they are
              searchable, side by side, and matched to your rank.
            </p>
          </Reveal>
        </div>

        <motion.div
          variants={revealGroup(0.07)}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={VIEWPORT}
          className="bento grid-editorial mt-16 gap-y-3 md:gap-y-4 xl:gap-y-5"
        >
          {/* A — College Finder */}
          <motion.div variants={revealCard} className="col-span-4 md:col-span-8 xl:col-span-7 xl:row-span-2">
            <div className={cn(CELL, "flex h-full flex-col rounded-3xl border border-[#E5E0D8] bg-white p-8 hover:border-[#C9C4BC]")}>
              <Search className="size-8 text-[#1A1A1A]" strokeWidth={1.25} aria-hidden />
              <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h3 className="text-[24px] font-medium tracking-[-0.02em] text-[#1A1A1A]">College Finder</h3>
                  <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-[#6B6B6B]">
                    Your rank against every round of the year. Drag the rank and watch each round open up.
                  </p>
                </div>
                <Link href="/predict/college" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1A1A1A]">
                  Use your rank
                  <LinkArrow />
                </Link>
              </div>
              <RoundPreview />
            </div>
          </motion.div>

          {/* B — Colleges */}
          <motion.div variants={revealCard} className="col-span-4 md:col-span-4 xl:col-span-5">
            <Link href="/cutoffs" className={cn(CELL, "flex h-full min-h-[200px] flex-col rounded-3xl bg-[#CC3D2E] p-6 text-white")}>
              <CountUp value={COLLEGE_COUNT} className="font-mono text-[52px] font-medium leading-none tracking-[-0.04em]" />
              <p className="mt-2 text-[14px] text-white/70">Colleges in KEA&rsquo;s {LATEST_YEAR} reports</p>
              <ArrowUpRight
                className="absolute bottom-6 right-6 size-5 text-white/80 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
                aria-hidden
              />
            </Link>
          </motion.div>

          {/* C — The archive */}
          <motion.div variants={revealCard} className="col-span-4 md:col-span-4 xl:col-span-5">
            <div className={cn(CELL, "flex h-full min-h-[200px] flex-col rounded-3xl bg-[#1A1A1A] p-6")}>
              <span aria-hidden className="scanline" />
              <p className="flex items-center gap-2.5 font-medium text-white">
                <span aria-hidden className="pulse-dot size-2 rounded-full bg-[#10B981]" />
                {FIRST_YEAR}–{LATEST_YEAR} KEA data
              </p>
              <p className="mt-2 text-[13px] text-white/40">
                {SHOWCASE.reports} official allotment reports, read rank by rank
                {SHOWCASE.missingYears.length > 0 && ` · ${SHOWCASE.missingYears.join(", ")} not hosted by KEA`}
              </p>
              <p className="mt-auto pt-6 font-mono text-[13px] text-white/60">
                <CountUp value={TOTAL_RANKS} className="text-white" /> published closing ranks
              </p>
            </div>
          </motion.div>

          {/* D — Year-wise cut-offs */}
          <motion.div variants={revealCard} className="col-span-4 md:col-span-4 xl:col-span-4">
            <Link href="/cutoffs" className={cn(CELL, "flex h-full min-h-[220px] flex-col rounded-3xl bg-[#F0EDE8] p-6")}>
              <Table2 className="size-6 text-[#1A1A1A]" strokeWidth={1.25} aria-hidden />
              <h3 className="mt-auto text-[18px] font-medium tracking-[-0.01em] text-[#1A1A1A]">Year-wise cut-offs</h3>
              <p className="mt-1 flex items-center justify-between gap-3 text-[14px] text-[#6B6B6B]">
                Every college, round and category
                <LinkArrow />
              </p>
            </Link>
          </motion.div>

          {/* E — Option Builder */}
          <motion.div variants={revealCard} className="col-span-4 md:col-span-4 xl:col-span-4">
            <Link href="/options" className={cn(CELL, "flex h-full min-h-[220px] flex-col rounded-3xl border border-[#E5E0D8] bg-white p-6 hover:border-[#C9C4BC]")}>
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-medium tracking-[-0.01em] text-[#1A1A1A]">Option Builder</h3>
                <ListOrdered className="size-5 text-[#9B9B9B]" strokeWidth={1.25} aria-hidden />
              </div>
              <ul aria-hidden className="mt-5 space-y-1.5">
                {TOP_CSE.slice(0, 3).map((seat, i) => (
                  <li
                    key={seat.code}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border border-[#F0EDE8] bg-[#FAFAF8] px-2.5 py-2 transition-transform duration-300",
                      i === 1 && "group-hover:translate-x-1.5 group-hover:rotate-1 group-hover:bg-white group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                    )}
                  >
                    <GripVertical className="size-3.5 text-[#C9C4BC]" strokeWidth={1.5} />
                    <span className="font-mono text-[11px] text-[#B0AAA2]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="truncate text-[13px] font-medium text-[#1A1A1A]">{seat.shortName}</span>
                    <span className="ml-auto font-mono text-[11px] text-[#9B9B9B]">{formatRank(seat.closingRank)}</span>
                  </li>
                ))}
              </ul>
            </Link>
          </motion.div>

          {/* F — Alumni */}
          <motion.div variants={revealCard} className="col-span-4 md:col-span-8 xl:col-span-4">
            <Link href="/cutoffs" className={cn(CELL, "flex h-full min-h-[220px] flex-col rounded-3xl bg-[#F5E8E6] p-6")}>
              <LinkedInGlyph className="size-6 text-[#CC3D2E]" />
              <p className="mt-auto text-[18px] font-medium leading-snug tracking-[-0.01em] text-[#1A1A1A]">
                Find alumni from your college
              </p>
              <p className="mt-1 flex items-center justify-between gap-3 text-[14px] text-[#6B6B6B]">
                A LinkedIn search on every college page
                <LinkArrow />
              </p>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Bento;
