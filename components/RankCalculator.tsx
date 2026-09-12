"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Info, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  BOARD_MAX,
  KCET_MAX,
  estimateRank,
} from "@/lib/kcet-formula";
import { predictColleges } from "@/lib/predict";
import {
  useKCETHydration,
  useRankEstimate,
  useSetPreferences,
  useSetRankEstimate,
  useSetStudentInput,
  useStudentInput,
} from "@/hooks/useKCETStore";
import { CATEGORIES } from "@/types";
import type { Category, Gender, RankEstimate, StudentInput } from "@/types";
import { cn } from "@/lib/utils";

/* ─── Category groups, in KEA's own order ─────────────────────────────── */

const CATEGORY_GROUPS: { label: string; keys: Category[] }[] = [
  { label: "General", keys: ["GM", "GMK", "GMR"] },
  { label: "Category 1", keys: ["1G"] },
  { label: "OBC", keys: ["2AG", "2AR", "2BG", "3AG", "3BG"] },
  { label: "SC", keys: ["S1G", "S2G", "S3G", "S4R"] },
  { label: "ST", keys: ["STG", "STK", "STR"] },
];

const DEFAULTS: StudentInput = {
  physicsMarks: 85,
  chemistryMarks: 85,
  mathsMarks: 85,
  kcetScore: 120,
  category: "GM",
  gender: "M",
  isHKRegion: false,
};

/** Red below 40%, amber to 70%, green above — the fill follows the mark. */
function fillFor(value: number, max: number): string {
  const pct = (value / max) * 100;
  if (pct < 40) return "#CC3D2E";
  if (pct < 70) return "#B45309";
  return "#1F7A4A";
}

const inr = (n: number) => n.toLocaleString("en-IN");

/* ─── One marks row: label, slider, number field ──────────────────────── */

function MarksRow({
  label,
  value,
  max,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (next: number) => void;
  hint?: string;
}) {
  const fill = fillFor(value, max);

  const commit = (raw: string) => {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    onChange(Math.min(max, Math.max(0, Math.round(parsed))));
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={`marks-${label}`}
          className="text-sm text-[#6B6B6B]"
        >
          {label}
        </label>
        <span className="font-mono text-sm text-[#1A1A1A]">
          {value} <span className="text-[#9B9B9B]">/ {max}</span>
        </span>
      </div>

      <div
        className="mt-2.5"
        style={{ "--slider-fill": fill } as React.CSSProperties}
      >
        <Slider
          value={[value]}
          min={0}
          max={max}
          step={1}
          onValueChange={([next]) => onChange(next)}
          aria-label={label}
        />
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <input
          id={`marks-${label}`}
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          value={value}
          onChange={(e) => commit(e.target.value)}
          className="h-9 w-20 rounded-lg border border-[#E5E0D8] bg-[#F0EDE8] px-2.5 font-mono text-sm text-[#1A1A1A] transition-colors focus:border-[#E8C4BF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CC3D2E]/40"
        />
        {hint && <span className="text-xs text-[#9B9B9B]">{hint}</span>}
      </div>
    </div>
  );
}

/* ─── The empty right-hand column ─────────────────────────────────────── */

function EmptyResult() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5E0D8] bg-white px-6 py-20 text-center">
      <svg
        viewBox="0 0 64 64"
        className="size-16 text-[#E5E0D8]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <circle cx="32" cy="38" r="16" />
        <circle cx="32" cy="38" r="9" strokeDasharray="3 3" />
        <path d="M22 22 16 6h12l5 10M42 22l6-16H36l-5 10" strokeLinejoin="round" />
      </svg>
      <p className="mt-5 text-sm text-[#6B6B6B]">Enter your marks above</p>
      <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-[#9B9B9B]">
        Your board percentage and KCET score are weighed equally, and the result
        lands here as a rank band.
      </p>
    </div>
  );
}

/* ─── Score breakdown ─────────────────────────────────────────────────── */

function Meter({
  label,
  percent,
  tone,
}: {
  label: string;
  percent: number;
  tone: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-[#6B6B6B]">{label}</span>
        <span className="font-mono text-xs text-[#1A1A1A]">
          {percent.toFixed(1)}%
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F0EDE8]">
        <motion.div
          className={cn("h-full rounded-full", tone)}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, percent)}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

const CONFIDENCE_TONE: Record<string, string> = {
  High: "border-[#B8DFC9] bg-[#E8F5EE] text-[#1F7A4A]",
  Medium: "border-[#F5D9A0] bg-[#FEF3E2] text-[#B45309]",
  Low: "border-[#F5C4BF] bg-[#FEE8E6] text-[#CC3D2E]",
};

function ResultCard({
  estimate,
  category,
}: {
  estimate: RankEstimate;
  category: Category;
}) {
  // Three names the student will recognise, to make the number concrete.
  const preview = useMemo(
    () =>
      predictColleges({
        rank: estimate.estimatedRank,
        category,
        gender: "M",
        isHKRegion: false,
        preferredCities: [],
        preferredBranches: [],
        willingToHostel: true,
        maxFee: null,
        collegeType: [],
      }).slice(0, 3),
    [estimate.estimatedRank, category]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-4"
    >
      <div className="rounded-xl border border-[#E5E0D8] bg-white p-6 text-center">
        <p className="text-sm text-[#6B6B6B]">Your Estimated Rank</p>
        <p className="mt-3 font-mono text-4xl font-semibold text-[#1A1A1A] sm:text-5xl">
          {inr(estimate.minRank)} &ndash; {inr(estimate.maxRank)}
        </p>
        <p className="mt-3 text-sm text-[#9B9B9B]">
          Most likely around{" "}
          <span className="font-mono text-[#1A1A1A]">
            {inr(estimate.estimatedRank)}
          </span>
        </p>
        <span
          className={cn(
            "mt-4 inline-flex rounded-full border px-2.5 py-1 text-xs",
            CONFIDENCE_TONE[estimate.confidence] ?? CONFIDENCE_TONE.Medium
          )}
        >
          {estimate.confidence} confidence
        </span>
      </div>

      <div className="space-y-4 rounded-xl border border-[#E5E0D8] bg-[#F7F4F0] p-4">
        <Meter
          label="Board Marks"
          percent={estimate.boardPercent}
          tone="bg-[#CC3D2E]"
        />
        <Meter
          label="KCET Score"
          percent={estimate.kcetPercent}
          tone="bg-[#6B6B6B]"
        />
        <div className="border-t border-[#E5E0D8] pt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-[#1A1A1A]">
              Combined Score
            </span>
            <span className="font-mono text-sm font-semibold text-[#1A1A1A]">
              {estimate.finalScore.toFixed(1)}%
            </span>
          </div>
          <p className="mt-2 font-mono text-[11px] text-[#9B9B9B]">
            ({estimate.boardPercent.toFixed(1)}% × 0.5) + (
            {estimate.kcetPercent.toFixed(1)}% × 0.5) ={" "}
            {estimate.finalScore.toFixed(1)}%
          </p>
        </div>
      </div>

      {preview.length > 0 && (
        <div className="rounded-xl border border-[#E5E0D8] bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-[#9B9B9B]">
            Colleges in range
          </p>
          <ul className="mt-3 space-y-2">
            {preview.map((p) => (
              <li
                key={`${p.college.id}-${p.branch}`}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="truncate text-[#1A1A1A]">
                  {p.college.shortName}
                  <span className="text-[#9B9B9B]"> · {p.branch}</span>
                </span>
                <span className="shrink-0 font-mono text-xs text-[#6B6B6B]">
                  #{inr(p.closingRank)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href={`/predict/college?rank=${estimate.estimatedRank}&category=${category}`}
        className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#CC3D2E] text-sm font-medium text-white transition-colors hover:bg-[#B5351F] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CC3D2E]/40"
      >
        See all colleges
        <ArrowRight
          className="size-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </motion.div>
  );
}

/* ─── The page body ───────────────────────────────────────────────────── */

export function RankCalculator() {
  const hydrated = useKCETHydration();
  const storedInput = useStudentInput();
  const storedEstimate = useRankEstimate();
  const setStudentInput = useSetStudentInput();
  const setRankEstimate = useSetRankEstimate();
  const setPreferences = useSetPreferences();

  const [input, setInput] = useState<StudentInput>(DEFAULTS);
  const [estimate, setEstimate] = useState<RankEstimate | null>(null);
  const [busy, setBusy] = useState(false);

  // Anything already worked out shows straight away rather than making the
  // student re-enter four numbers they have entered once.
  useEffect(() => {
    if (!hydrated) return;
    if (storedInput) setInput(storedInput);
    if (storedEstimate) setEstimate(storedEstimate);
  }, [hydrated, storedInput, storedEstimate]);

  const patch = (next: Partial<StudentInput>) =>
    setInput((current) => ({ ...current, ...next }));

  const kcetPercent = (input.kcetScore / KCET_MAX) * 100;

  const calculate = () => {
    setBusy(true);
    // One frame of spinner: the arithmetic is instant, but the result
    // replacing itself with no transition reads as nothing having happened.
    window.setTimeout(() => {
      const result = estimateRank(input);
      setEstimate(result);
      setStudentInput(input);
      setRankEstimate(result);
      setPreferences({
        rank: result.estimatedRank,
        category: input.category,
        gender: input.gender,
        isHKRegion: input.isHKRegion,
        preferredCities: [],
        preferredBranches: [],
        willingToHostel: true,
        maxFee: null,
        collegeType: [],
      });
      setBusy(false);
    }, 260);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      {/* ── Form ── */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-xl border border-[#E5E0D8] bg-white p-5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-[#1A1A1A]">
              Your 2nd PUC Marks
            </h2>
            <Tooltip>
              <TooltipTrigger
                aria-label="How the rank is worked out"
                className="text-[#9B9B9B] transition-colors hover:text-[#B5351F] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CC3D2E]/40"
              >
                <Info className="size-3.5" aria-hidden />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                KEA weighs your board marks and your KCET score equally. Physics,
                Chemistry and Maths are taken out of {BOARD_MAX}, the KCET paper
                out of {KCET_MAX}, and each half contributes 50% of the score your
                rank is read off.
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="mt-5 space-y-5">
            <MarksRow
              label="Physics"
              value={input.physicsMarks}
              max={100}
              onChange={(physicsMarks) => patch({ physicsMarks })}
            />
            <MarksRow
              label="Chemistry"
              value={input.chemistryMarks}
              max={100}
              onChange={(chemistryMarks) => patch({ chemistryMarks })}
            />
            <MarksRow
              label="Maths"
              value={input.mathsMarks}
              max={100}
              onChange={(mathsMarks) => patch({ mathsMarks })}
            />

            <div className="border-t border-[#E5E0D8] pt-5">
              <MarksRow
                label="KCET Score"
                value={input.kcetScore}
                max={KCET_MAX}
                onChange={(kcetScore) => patch({ kcetScore })}
                hint={`= ${kcetPercent.toFixed(1)}% (${input.kcetScore} marks out of ${KCET_MAX})`}
              />
            </div>
          </div>

          <div className="mt-6 space-y-4 border-t border-[#E5E0D8] pt-5">
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm text-[#6B6B6B]"
              >
                Category
              </label>
              <Select
                value={input.category}
                onValueChange={(category) =>
                  patch({ category: category as Category })
                }
              >
                <SelectTrigger
                  id="category"
                  className="h-11 w-full rounded-lg border-[#E5E0D8] bg-[#F0EDE8]"
                >
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
                          {CATEGORIES[key]}{" "}
                          <span className="font-mono text-[#9B9B9B]">({key})</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[#6B6B6B]">Gender</span>
              <ToggleGroup
                type="single"
                value={input.gender}
                onValueChange={(gender) =>
                  gender && patch({ gender: gender as Gender })
                }
                className="rounded-lg bg-[#F0EDE8] p-1"
              >
                <ToggleGroupItem
                  value="M"
                  aria-label="Male"
                  className="h-8 rounded-md px-4 text-xs text-[#6B6B6B] data-[state=on]:border data-[state=on]:border-[#E5E0D8] data-[state=on]:bg-white data-[state=on]:text-[#1A1A1A]"
                >
                  M
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="F"
                  aria-label="Female"
                  className="h-8 rounded-md px-4 text-xs text-[#6B6B6B] data-[state=on]:border data-[state=on]:border-[#E5E0D8] data-[state=on]:bg-white data-[state=on]:text-[#1A1A1A]"
                >
                  F
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                Kalyana-Karnataka (371j)
                <Tooltip>
                  <TooltipTrigger
                    aria-label="What the 371(j) quota is"
                    className="text-[#9B9B9B] transition-colors hover:text-[#B5351F] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CC3D2E]/40"
                  >
                    <Info className="size-3.5" aria-hidden />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    Candidates from the Kalyana-Karnataka region — Bidar,
                    Kalaburagi, Yadgir, Raichur, Koppal, Ballari and Vijayanagara
                    — are considered for a separate pool of reserved seats under
                    Article 371(j), which KEA publishes as its own report.
                  </TooltipContent>
                </Tooltip>
              </span>
              <Switch
                checked={input.isHKRegion}
                onCheckedChange={(isHKRegion) => patch({ isHKRegion })}
                aria-label="Kalyana-Karnataka region candidate"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={calculate}
            disabled={busy}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#CC3D2E] text-sm font-medium text-white transition-colors hover:bg-[#B5351F] active:scale-[0.97] disabled:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CC3D2E]/40"
          >
            {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {busy ? "Calculating" : "Calculate My Rank"}
          </button>
        </div>
      </div>

      {/* ── Result ── */}
      <div>
        <AnimatePresence mode="wait">
          {estimate ? (
            <ResultCard
              key="result"
              estimate={estimate}
              category={input.category}
            />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyResult />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default RankCalculator;
