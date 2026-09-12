"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ButtonLabel from "@/components/shared/ButtonLabel";
import CategoryPicker from "@/components/shared/CategoryPicker";
import ChanceChip from "@/components/shared/ChanceChip";
import { FormulaIllustration } from "@/components/shared/Illustrations";
import {
  BOARD_MAX,
  KCET_MAX,
  TOTAL_CANDIDATES,
  estimateRank,
} from "@/lib/kcet-formula";
import { predictColleges } from "@/lib/predict";
import { formatCount, formatRank } from "@/lib/format";
import { EASE_OUT } from "@/lib/motion";
import {
  useKCETHydration,
  useRankEstimate,
  useSetPreferences,
  useSetRankEstimate,
  useSetStudentInput,
  useStudentInput,
} from "@/hooks/useKCETStore";
import { BRANCHES } from "@/types";
import type { Category, Gender, RankEstimate, StudentInput } from "@/types";
import { cn } from "@/lib/utils";

const DEFAULTS: StudentInput = {
  physicsMarks: 85,
  chemistryMarks: 85,
  mathsMarks: 85,
  kcetScore: 120,
  category: "GM",
  gender: "M",
  isHKRegion: false,
};

/* ─── One marks row: dot, subject, value, slider ──────────────────────── */

function MarksRow({
  id,
  label,
  value,
  max,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  max: number;
  onChange: (next: number) => void;
  hint?: string;
}) {
  const commit = (raw: string) => {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    onChange(Math.min(max, Math.max(0, Math.round(parsed))));
  };

  return (
    <div className="border-b border-[#F0EDE8] py-4 last:border-b-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <label htmlFor={id} className="flex items-center gap-2">
          <span aria-hidden className="size-1.5 rounded-full bg-[#CC3D2E]" />
          <span className="text-[13px] font-medium text-[#6B6B6B]">{label}</span>
        </label>
        <span className="flex items-baseline gap-2">
          {hint && (
            <span className="font-mono text-[13px] text-[#9B9B9B]">{hint}</span>
          )}
          {/* Typed as well as dragged: a student usually knows the exact mark. */}
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={0}
            max={max}
            value={value}
            onChange={(e) => commit(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="w-12 rounded-md bg-transparent px-1 text-right font-mono text-[15px] font-medium text-[#1A1A1A] transition-colors hover:bg-[#F7F4F0] focus:bg-[#F7F4F0] focus-visible:outline-none"
          />
        </span>
      </div>

      <Slider
        value={[value]}
        min={0}
        max={max}
        step={1}
        onValueChange={([next]) => onChange(next)}
        aria-label={label}
      />
      <div aria-hidden className="mt-1.5 flex justify-between font-mono text-[11px] text-[#B0AAA2]">
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

/* ─── A two-way choice ─────────────────────────────────────────────────── */

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; name: string }[];
  onChange: (next: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-[10px] bg-[#F0EDE8] p-0.5">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-label={option.name}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-8 min-w-11 rounded-lg px-3 text-[13px] font-medium transition-colors duration-150",
              active
                ? "bg-white text-[#1A1A1A] shadow-[0_1px_2px_rgba(26,26,26,0.06)]"
                : "text-[#6B6B6B] hover:text-[#1A1A1A]"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Before anything is calculated ───────────────────────────────────── */

function EmptyResult() {
  return (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-4 py-16 text-center">
      <FormulaIllustration />
      <div>
        <p className="text-[15px] text-[#6B6B6B]">
          Your rank lands here once you calculate
        </p>
        <p className="type-body-sm mx-auto mt-1.5 max-w-xs text-[#9B9B9B]">
          Board marks and KCET score count equally. Set both on the left.
        </p>
      </div>
    </div>
  );
}

/* ─── Result pieces ───────────────────────────────────────────────────── */

/**
 * Counts a rank up from zero on a soft spring. Writes to the node directly so
 * the count never re-renders the result, and lands on the exact figure.
 */
function SpringNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduceMotion) {
      node.textContent = formatRank(value);
      return;
    }

    const controls = animate(0, value, {
      type: "spring",
      stiffness: 60,
      damping: 15,
      restDelta: 1,
      onUpdate: (latest) => {
        node.textContent = formatCount(Math.max(0, Math.round(latest)));
      },
      onComplete: () => {
        node.textContent = formatRank(value);
      },
    });
    return () => controls.stop();
  }, [value, reduceMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatRank(value)}
    </span>
  );
}

/** The spectrum runs from rank 1 to this; anything past it pins to the end. */
const SPECTRUM_MAX = 150_000;

/**
 * Square-root scale. On a linear scale the whole top 10% would crowd into the
 * first fifth of the bar; this gives the ranks students care about the room.
 */
const spectrumPosition = (rank: number) =>
  Math.sqrt(Math.min(Math.max(rank, 1), SPECTRUM_MAX) / SPECTRUM_MAX) * 100;

const SPECTRUM_MARKS = [
  { label: "Top 1%", share: 0.01 },
  { label: "Top 5%", share: 0.05 },
  { label: "Top 10%", share: 0.1 },
  { label: "Top 50%", share: 0.5 },
].map((mark) => ({
  ...mark,
  position: spectrumPosition(TOTAL_CANDIDATES * mark.share),
}));

function RankSpectrum({ rank }: { rank: number }) {
  const reduceMotion = useReducedMotion();
  const position = spectrumPosition(rank);
  const topShare = (rank / TOTAL_CANDIDATES) * 100;
  const shareText =
    topShare < 1 ? topShare.toFixed(2) : topShare < 10 ? topShare.toFixed(1) : Math.round(topShare);

  return (
    <div
      role="img"
      aria-label={`Rank ${formatRank(rank)} is in the top ${shareText}% of about ${formatCount(TOTAL_CANDIDATES)} candidates`}
      className="mt-10"
    >
      <div className="relative h-2 rounded-full bg-[linear-gradient(90deg,#CC3D2E,#F59E0B,#10B981)]">
        {SPECTRUM_MARKS.slice(0, -1).map((mark) => (
          <span
            key={mark.label}
            aria-hidden
            className="absolute top-0 h-2 w-px bg-white/70"
            style={{ left: `${mark.position}%` }}
          />
        ))}
        <motion.span
          aria-hidden
          className="absolute top-1/2 -ml-2 -mt-2 size-4 rounded-full border-2 border-[#1A1A1A] bg-white shadow-[0_2px_6px_rgba(26,26,26,0.18)]"
          initial={{ left: reduceMotion ? `${position}%` : "0%", opacity: reduceMotion ? 1 : 0 }}
          animate={{ left: `${position}%`, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT }}
        />
      </div>

      <div aria-hidden className="relative mt-2.5 h-4">
        {SPECTRUM_MARKS.map((mark, i) => (
          <span
            key={mark.label}
            className={cn(
              "absolute whitespace-nowrap text-[11px] font-medium text-[#9B9B9B]",
              i === SPECTRUM_MARKS.length - 1 ? "-translate-x-full" : "-translate-x-1/2"
            )}
            style={{ left: `${mark.position}%` }}
          >
            {mark.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ShareBar({
  label,
  percent,
  tone,
  delay,
}: {
  label: string;
  percent: number;
  tone: string;
  delay: number;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_3.5rem] items-center gap-4">
      <span className="text-[13px] text-[#6B6B6B]">
        {label} <span className="text-[#B0AAA2]">(50%)</span>
      </span>
      <span className="h-1.5 overflow-hidden rounded-full bg-[#E5E0D8]">
        <motion.span
          className={cn("block h-full rounded-full", tone)}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, percent)}%` }}
          transition={{ duration: 0.8, delay, ease: EASE_OUT }}
        />
      </span>
      <span className="text-right font-mono text-[13px] font-medium text-[#1A1A1A]">
        {percent.toFixed(1)}%
      </span>
    </div>
  );
}

function initials(shortName: string): string {
  const letters = shortName.replace(/[^A-Za-z]/g, "");
  return (letters.slice(0, 2) || "—").toUpperCase();
}

function ResultView({
  estimate,
  category,
}: {
  estimate: RankEstimate;
  category: Category;
}) {
  const matches = useMemo(
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
      }),
    [estimate.estimatedRank, category]
  );

  const longest = Math.max(
    formatRank(estimate.minRank).length,
    formatRank(estimate.maxRank).length
  );
  // Six-figure ranks set at full size would not fit side by side.
  const rankSize =
    longest <= 5
      ? "clamp(3rem, 5vw, 4.5rem)"
      : longest <= 6
        ? "clamp(2.5rem, 4.2vw, 3.75rem)"
        : "clamp(2.25rem, 3.6vw, 3.25rem)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
    >
      {/* ── The rank ── */}
      <section aria-labelledby="rank-heading">
        <p id="rank-heading" className="type-caption tracking-[0.1em]">
          Your estimated rank
        </p>

        <p
          className="mt-4 flex flex-wrap items-baseline font-mono font-medium leading-none tracking-[-0.05em] text-[#1A1A1A]"
          style={{ fontSize: rankSize }}
        >
          <SpringNumber value={estimate.minRank} />
          <span className="mx-4 font-sans text-2xl font-normal tracking-normal text-[#C9C4BC]">
            to
          </span>
          <SpringNumber value={estimate.maxRank} />
        </p>

        <p className="type-body-sm mt-4">
          Most likely around{" "}
          <span className="font-mono font-medium text-[#1A1A1A]">
            {formatRank(estimate.estimatedRank)}
          </span>
          <span className="mx-2 text-[#C9C4BC]">/</span>
          {estimate.confidence} confidence
        </p>

        <RankSpectrum rank={estimate.estimatedRank} />
      </section>

      {/* ── How the score was built ── */}
      <section aria-labelledby="breakdown-heading" className="mt-12 border-t border-[#E5E0D8] pt-10">
        <h3 id="breakdown-heading" className="sr-only">
          Score breakdown
        </h3>
        <div className="space-y-4">
          <ShareBar
            label="Board marks"
            percent={estimate.boardPercent}
            tone="bg-[#1A1A1A]"
            delay={0.35}
          />
          <ShareBar
            label="KCET score"
            percent={estimate.kcetPercent}
            tone="bg-[#9B9B9B]"
            delay={0.45}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="type-label">Combined merit score</p>
            <p className="mt-2 font-mono text-[clamp(2.25rem,3.5vw,2.75rem)] font-medium leading-none tracking-[-0.02em] text-[#CC3D2E]">
              {estimate.finalScore.toFixed(1)}%
            </p>
          </div>
          <p className="inline-flex rounded-lg bg-[#F0EDE8] px-4 py-2 font-mono text-[13px] text-[#6B6B6B]">
            ({estimate.boardPercent.toFixed(1)}% × 0.5) + ({estimate.kcetPercent.toFixed(1)}% × 0.5) ={" "}
            {estimate.finalScore.toFixed(1)}%
          </p>
        </div>
      </section>

      {/* ── What it reaches ── */}
      <section aria-labelledby="colleges-heading" className="mt-12 border-t border-[#E5E0D8] pt-10">
        <h3 id="colleges-heading" className="type-label">
          Colleges at this rank
        </h3>

        {matches.length === 0 ? (
          <p className="type-body-sm mt-4">
            No {category} seat closed at or beyond this rank in the published
            round 3 report.
          </p>
        ) : (
          <>
            <ul className="mt-4 space-y-2">
              {matches.slice(0, 3).map((p, i) => (
                <motion.li
                  key={`${p.college.id}-${p.branch}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.04, ease: EASE_OUT }}
                >
                  <Link
                    href={`/college/${p.college.id}?branch=${p.branch}&category=${category}`}
                    className="flex items-center gap-3 rounded-xl border border-[#E5E0D8] bg-white px-4 py-3 transition-colors duration-150 hover:border-[#C9C4BC]"
                  >
                    <span
                      aria-hidden
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F0EDE8] font-mono text-[12px] font-medium text-[#6B6B6B]"
                    >
                      {initials(p.college.shortName)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium text-[#1A1A1A]">
                        {p.college.shortName}
                      </span>
                      <span className="block truncate text-[12px] text-[#9B9B9B]">
                        {BRANCHES[p.branch]}
                      </span>
                    </span>
                    <span className="hidden text-right sm:block">
                      <span className="block font-mono text-[13px] font-medium text-[#1A1A1A]">
                        {formatRank(p.closingRank)}
                      </span>
                      <span className="block text-[11px] text-[#9B9B9B]">closing rank</span>
                    </span>
                    <ChanceChip label={p.chanceLabel} className="shrink-0" />
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="mt-5 flex justify-end">
              <Link
                href={`/predict/college?rank=${estimate.estimatedRank}&category=${category}`}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#CC3D2E] transition-colors hover:text-[#B5351F]"
              >
                See all {formatCount(matches.length)} colleges
                <ArrowRight
                  className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </Link>
            </div>
          </>
        )}
      </section>
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
  // The category the showing result was worked out under, so picking another
  // pill does not quietly change the colleges listed before recalculating.
  const [resultCategory, setResultCategory] = useState<Category>(DEFAULTS.category);

  // Anything already worked out shows straight away rather than making the
  // student re-enter four numbers they have entered once.
  useEffect(() => {
    if (!hydrated) return;
    if (storedInput) {
      setInput(storedInput);
      setResultCategory(storedInput.category);
    }
    if (storedEstimate) setEstimate(storedEstimate);
  }, [hydrated, storedInput, storedEstimate]);

  const patch = (next: Partial<StudentInput>) =>
    setInput((current) => ({ ...current, ...next }));

  const kcetPercent = (input.kcetScore / KCET_MAX) * 100;

  const calculate = () => {
    setBusy(true);
    // A beat of spinner: the arithmetic is instant, but the result replacing
    // itself with no transition reads as nothing having happened.
    window.setTimeout(() => {
      const result = estimateRank(input);
      setEstimate(result);
      setResultCategory(input.category);
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

  // Keyed on the figures, so a new calculation replays the reveal.
  const resultKey = estimate
    ? `${estimate.minRank}-${estimate.maxRank}-${estimate.finalScore}-${resultCategory}`
    : "empty";

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,384px)_minmax(0,1fr)] lg:gap-16">
      {/* ── Form ── */}
      <div className="lg:self-start">
        <div className="card">
          <div className="flex items-center gap-2">
            <h2 className="type-h3">Your marks</h2>
            <Tooltip>
              <TooltipTrigger
                aria-label="How the rank is worked out"
                className="rounded text-[#9B9B9B] transition-colors hover:text-[#1A1A1A]"
              >
                <Info className="size-3.5" strokeWidth={1.5} aria-hidden />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                KEA weighs your board marks and your KCET score equally. Physics,
                Chemistry and Maths are taken out of {BOARD_MAX}, the KCET paper
                out of {KCET_MAX}, and each half contributes 50% of the score your
                rank is read off.
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="type-body-sm mt-1">2nd PUC board, out of 100 each</p>

          <div className="mt-2">
            <MarksRow
              id="marks-physics"
              label="Physics"
              value={input.physicsMarks}
              max={100}
              onChange={(physicsMarks) => patch({ physicsMarks })}
            />
            <MarksRow
              id="marks-chemistry"
              label="Chemistry"
              value={input.chemistryMarks}
              max={100}
              onChange={(chemistryMarks) => patch({ chemistryMarks })}
            />
            <MarksRow
              id="marks-maths"
              label="Maths"
              value={input.mathsMarks}
              max={100}
              onChange={(mathsMarks) => patch({ mathsMarks })}
            />
          </div>

          <div className="mt-2 border-t border-[#E5E0D8] pt-2">
            <MarksRow
              id="marks-kcet"
              label="KCET score"
              value={input.kcetScore}
              max={KCET_MAX}
              onChange={(kcetScore) => patch({ kcetScore })}
              hint={`= ${kcetPercent.toFixed(1)}%`}
            />
          </div>

          <div className="mt-4 border-t border-[#E5E0D8] pt-6">
            <p className="field-label mb-3">Category</p>
            <CategoryPicker
              value={input.category}
              onChange={(category) => patch({ category })}
            />
          </div>

          <div className="mt-6 space-y-4 border-t border-[#E5E0D8] pt-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-medium text-[#6B6B6B]">Gender</span>
              <Segmented<Gender>
                label="Gender"
                value={input.gender}
                onChange={(gender) => patch({ gender })}
                options={[
                  { value: "M", label: "M", name: "Male" },
                  { value: "F", label: "F", name: "Female" },
                ]}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#6B6B6B]">
                Kalyana-Karnataka (371j)
                <Tooltip>
                  <TooltipTrigger
                    aria-label="What the 371(j) quota is"
                    className="rounded text-[#9B9B9B] transition-colors hover:text-[#1A1A1A]"
                  >
                    <Info className="size-3.5" strokeWidth={1.5} aria-hidden />
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
            data-loading={busy}
            aria-busy={busy}
            className="btn btn-primary btn-lg mt-8 w-full"
          >
            <ButtonLabel loading={busy}>Calculate my rank</ButtonLabel>
          </button>
        </div>
      </div>

      {/* ── Result ── */}
      <div aria-live="polite" className="min-w-0 lg:pt-6">
        <AnimatePresence mode="wait">
          {estimate ? (
            <ResultView key={resultKey} estimate={estimate} category={resultCategory} />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
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
