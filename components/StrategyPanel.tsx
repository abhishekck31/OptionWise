"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ChevronDown, Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { generateOptionEntryStrategy } from "@/lib/predict";
import { useKCETHydration, useOptionList } from "@/hooks/useKCETStore";
import { EASE_OUT } from "@/lib/motion";
import type { OptionEntry, Tier } from "@/types";
import { cn } from "@/lib/utils";

const TIER_COLOR: Record<Tier, string> = {
  Aspirational: "#CC3D2E",
  Moderate: "#F59E0B",
  Safe: "#10B981",
};

const TIPS = [
  {
    id: "order",
    title: "How to order your options",
    body: "KEA walks your list from the top and gives you the first seat you qualify for, so order it by what you actually want, not by what you think you will get. Reaches go first — an unreachable option costs you nothing but the line it sits on. Put the safe seats last, and make sure there are enough of them that the list cannot run out.",
  },
  {
    id: "chance",
    title: "Understanding chance %",
    body: "The percentage compares your rank with last year's closing rank for that seat. Comfortably inside it reads as high; sitting right on the line reads as a coin toss. It is a read on one published number, not a probability — a seat matrix change or a heavier year moves the real cutoff.",
  },
  {
    id: "counselling",
    title: "What happens during counselling",
    body: "KEA runs three rounds. After each one you choose to keep the seat, upgrade in the next round, or exit. A seat you accept and hold blocks you from the rounds after it, so read the round rules on the KEA site before you confirm anything.",
  },
];

const average = (entries: OptionEntry[]) =>
  entries.length
    ? entries.reduce((sum, e) => sum + e.prediction.avgPackage, 0) / entries.length
    : 0;

/* ─── Donut ───────────────────────────────────────────────────────────────── */

function Donut({ segments }: { segments: { tier: Tier; count: number }[] }) {
  const size = 120;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((n, s) => n + s.count, 0);
  const largest = segments.reduce((a, b) => (b.count > a.count ? b : a), segments[0]);
  const gap = total > 0 && segments.filter((s) => s.count > 0).length > 1 ? 4 : 0;

  let offset = 0;
  return (
    <div className="relative mx-auto size-[120px]">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        {total > 0 &&
          segments.map((segment) => {
            const length = (segment.count / total) * circumference;
            const dash = Math.max(0, length - gap);
            const circle = (
              <motion.circle
                key={segment.tier}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={TIER_COLOR[segment.tier]}
                strokeWidth={stroke}
                initial={false}
                animate={{ strokeDasharray: `${dash} ${circumference}`, strokeDashoffset: -offset }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
              />
            );
            offset += length;
            return circle;
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[24px] font-medium leading-none text-white">
          {total > 0 ? largest.count : 0}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.1em] text-white/40">
          {total > 0 ? (largest.tier === "Aspirational" ? "reach" : largest.tier) : "empty"}
        </span>
      </div>
    </div>
  );
}

/* ─── The dashboard ───────────────────────────────────────────────────────── */

export function StrategyPanel() {
  const hydrated = useKCETHydration();
  const optionList = useOptionList();
  const [open, setOpen] = useState(false);

  const list = useMemo(() => (hydrated ? optionList : []), [hydrated, optionList]);
  const strategy = useMemo(() => generateOptionEntryStrategy(list), [list]);

  const tiers: { tier: Tier; entries: OptionEntry[] }[] = [
    { tier: "Aspirational", entries: strategy.aspirational },
    { tier: "Moderate", entries: strategy.moderate },
    { tier: "Safe", entries: strategy.safe },
  ];

  const packages = list.slice(0, 5).map((entry) => ({
    id: entry.id,
    name: entry.prediction.college.shortName,
    value: entry.prediction.avgPackage,
  }));
  const maxPackage = Math.max(1, ...packages.map((p) => p.value));

  const AdviceIcon =
    list.length === 0 ? Info : strategy.isBalanced ? CheckCircle2 : AlertTriangle;
  const adviceTone =
    list.length === 0 ? "text-white/50" : strategy.isBalanced ? "text-[#10B981]" : "text-[#F59E0B]";

  return (
    <aside className="h-fit rounded-3xl bg-[#1A1A1A] text-white lg:sticky lg:top-24">
      <div className="flex items-center justify-between px-8 pt-8">
        <h2 className="text-3xl font-light tracking-[-0.02em] text-white">Strategy</h2>
        {/* On a phone the dashboard folds away under its title. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="strategy-body"
          className="inline-flex size-9 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
        >
          <span className="sr-only">{open ? "Hide strategy" : "Show strategy"}</span>
          <ChevronDown
            className={cn("size-4 transition-transform duration-200", open && "rotate-180")}
            strokeWidth={1.5}
            aria-hidden
          />
        </button>
      </div>

      <div id="strategy-body" className={cn("px-8 pb-8", open ? "block" : "hidden", "lg:block")}>
        <div className="mt-8">
          <Donut segments={tiers.map((t) => ({ tier: t.tier, count: t.entries.length }))} />
        </div>

        <dl className="mt-8 space-y-1">
          {tiers.map(({ tier, entries }) => (
            <div
              key={tier}
              className="flex items-center gap-3 rounded-lg py-1.5 text-[13px] text-white/60 transition-colors duration-150 hover:text-white"
            >
              <span aria-hidden className="size-1.5 rounded-full" style={{ background: TIER_COLOR[tier] }} />
              <dt className="flex-1">{tier}</dt>
              <dd className="font-mono text-white">{entries.length}</dd>
              <dd className="w-24 text-right font-mono text-[12px]">
                {entries.length ? `avg ₹${average(entries).toFixed(1)} LPA` : "—"}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-start gap-3">
            <AdviceIcon className={cn("mt-0.5 size-4 shrink-0", adviceTone)} strokeWidth={1.5} aria-hidden />
            <p className="text-[14px] leading-[1.6] text-white/80">{strategy.advice}</p>
          </div>
        </div>

        {packages.length > 0 && (
          <div className="mt-8">
            <p className="text-[11px] uppercase tracking-[0.1em] text-white/40">
              Average package · top {packages.length}
            </p>
            <ul className="mt-4 space-y-3">
              {packages.map((p) => (
                <li key={p.id}>
                  <div className="flex items-baseline gap-3">
                    <span className="truncate text-[12px] text-white/60">{p.name}</span>
                    <span className="ml-auto font-mono text-[13px] text-white">₹{p.value}L</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-[#CC3D2E]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(p.value / maxPackage) * 100}%` }}
                      transition={{ duration: 0.6, ease: EASE_OUT }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] text-white/30">Indicative — not published by KEA</p>
          </div>
        )}
      </div>
    </aside>
  );
}

/** The three things every student asks before counselling, kept on the light side of the page. */
export function CounsellingNotes() {
  return (
    <div className="rounded-3xl border border-[#E5E0D8] bg-white px-6">
      <Accordion type="single" collapsible defaultValue="order">
        {TIPS.map((tip) => (
          <AccordionItem key={tip.id} value={tip.id}>
            <AccordionTrigger>{tip.title}</AccordionTrigger>
            <AccordionContent>{tip.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default StrategyPanel;
