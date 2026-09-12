"use client";

import { memo, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  MapPin,
  Minus,
  Plus,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import ChanceChip, { CHANCE_EDGE } from "@/components/shared/ChanceChip";
import { getCollegeCutoffHistory } from "@/lib/predict";
import {
  optionKey,
  useAddToOptionList,
  useAppStore,
  useOptionKeys,
  useRemoveFromOptionList,
} from "@/hooks/useKCETStore";
import { useToast } from "@/components/Toast";
import { linkedInAlumniUrl } from "@/components/LinkedInSearch";
import { formatCount, formatFee, formatRank } from "@/lib/format";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import type { Category, CollegeType, PredictionResult } from "@/types";
import { cn } from "@/lib/utils";

const TYPE_SHORT: Record<CollegeType, string> = {
  Government: "Govt",
  "Government Aided": "Aided",
  "Private Unaided": "Private",
};

function TrendChip({ trend, delta }: { trend: PredictionResult["trend"]; delta: number }) {
  const size = "size-3.5";
  if (trend === "tightening") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px] text-[#B45309]">
        <TrendingUp className={size} strokeWidth={1.5} aria-hidden />
        Tightening
        {delta > 0 && <span className="font-mono">~{formatCount(delta)}/yr</span>}
      </span>
    );
  }
  if (trend === "relaxing") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px] text-[#1F7A4A]">
        <TrendingDown className={size} strokeWidth={1.5} aria-hidden />
        Relaxing
        {delta > 0 && <span className="font-mono">~{formatCount(delta)}/yr</span>}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-[#9B9B9B]">
      <Minus className={size} strokeWidth={1.5} aria-hidden />
      Stable
    </span>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0">
      <dd className="truncate font-mono text-[15px] font-medium tracking-[-0.01em] text-[#1A1A1A]">
        {value}
      </dd>
      <dt className="mt-1 text-[11px] font-medium uppercase tracking-[0.06em] text-[#B0AAA2]">
        {label}
      </dt>
    </div>
  );
}

export interface CollegeCardProps {
  prediction: PredictionResult;
  /** The category the prediction was run under; the history follows it. */
  category: Category;
}

function CollegeCardImpl({ prediction, category }: CollegeCardProps) {
  const [open, setOpen] = useState(false);
  const [chartReady, setChartReady] = useState(false);

  const addToOptionList = useAddToOptionList();
  const removeFromOptionList = useRemoveFromOptionList();
  const optionKeys = useOptionKeys();
  const { toast } = useToast();

  const { college, branch, branchName, closingRank, chanceLabel, chancePercent } =
    prediction;

  const key = optionKey(college.id, branch);
  const added = optionKeys.has(key);

  const series = useMemo(
    () =>
      getCollegeCutoffHistory(college.id, branch, category)
        .slice(-4)
        .map((point) => ({ year: point.year, rank: point.closingRank })),
    [college.id, branch, category]
  );

  const toggleOption = () => {
    if (added) {
      const entry = useAppStore
        .getState()
        .optionList.find(
          (e) => optionKey(e.prediction.college.id, e.prediction.branch) === key
        );
      if (entry) removeFromOptionList(entry.id);
      toast("Removed from option list", "neutral");
    } else {
      addToOptionList(prediction);
      toast("Added to option list", "success");
    }
  };

  const isPublic = college.type !== "Private Unaided";

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15, ease: EASE_IN_OUT }}
      style={{ borderBottomColor: CHANCE_EDGE[chanceLabel] }}
      className="card border-b-2 transition-colors duration-150 hover:border-[#C9C4BC]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 truncate text-[15px] font-medium tracking-[-0.01em] text-[#1A1A1A]">
          {college.shortName}
        </h3>
        <span
          className={cn(
            "shrink-0 rounded-md border border-[#E5E0D8] bg-[#F7F4F0] px-1.5 py-0.5 text-[11px] font-medium",
            isPublic ? "text-[#1A1A1A]" : "text-[#9B9B9B]"
          )}
        >
          {TYPE_SHORT[college.type]}
        </span>
      </div>

      <p className="mt-1.5 truncate text-[13px] text-[#6B6B6B]">{branchName}</p>
      <p className="mt-1 flex items-center gap-1 text-[12px] text-[#B0AAA2]">
        <MapPin className="size-2.5" strokeWidth={1.5} aria-hidden />
        {college.city}
        <span className="ml-1.5 font-mono">{college.kea_code}</span>
      </p>

      <dl className="my-4 grid grid-cols-3 gap-3 border-t border-[#F0EDE8] pt-4">
        <Stat value={formatRank(closingRank)} label="Closing" />
        <Stat value={`₹${college.avgPackage}L`} label="Avg pkg" />
        <Stat value={formatFee(college.annualFee)} label="Fee/yr" />
      </dl>

      <div className="flex items-center justify-between gap-3">
        <TrendChip trend={prediction.trend} delta={prediction.trendDelta} />
        <ChanceChip label={chanceLabel} percent={chancePercent} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F0EDE8] pt-3">
        <button
          type="button"
          onClick={toggleOption}
          aria-pressed={added}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-lg px-2 -ml-2 text-[13px] font-medium transition-colors duration-150 active:scale-[0.97]",
            added
              ? "text-[#1F7A4A] hover:bg-[#E8F5EE]"
              : "text-[#1A1A1A] hover:bg-[#F7F4F0]"
          )}
        >
          {added ? (
            <Check className="size-3.5" strokeWidth={1.5} aria-hidden />
          ) : (
            <Plus className="size-3.5" strokeWidth={1.5} aria-hidden />
          )}
          {added ? "On your list" : "Add to list"}
        </button>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="-mr-2 inline-flex h-8 items-center gap-1 rounded-lg px-2 text-[13px] font-medium text-[#6B6B6B] transition-colors duration-150 hover:bg-[#F7F4F0] hover:text-[#1A1A1A]"
        >
          Details
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200",
              open && "rotate-180"
            )}
            strokeWidth={1.5}
            aria-hidden
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="details"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            // Recharts measures its container on mount. Mounting it mid-height
            // animation gives it a box of zero width and it draws dots but no
            // line, so the chart waits for the expand to finish.
            onAnimationComplete={() => setChartReady(true)}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="pt-4"
            >
              <div className="flex items-baseline justify-between">
                <p className="type-label">Final-round closing rank</p>
                <p className="font-mono text-[11px] text-[#9B9B9B]">
                  {series[0]?.year}&ndash;{series[series.length - 1]?.year}
                </p>
              </div>
              <div className="mt-2 h-20 w-full">
                {chartReady && series.length > 1 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={series}
                      margin={{ top: 6, right: 6, bottom: 6, left: 6 }}
                    >
                      {/* Lower rank is better, so the axis runs downward. */}
                      <YAxis hide reversed domain={["dataMin", "dataMax"]} />
                      <Line
                        type="monotone"
                        dataKey="rank"
                        stroke="#1A1A1A"
                        strokeWidth={1.5}
                        dot={{ r: 2.5, fill: "#FFFFFF", stroke: "#1A1A1A", strokeWidth: 1.5 }}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <a
                  href={linkedInAlumniUrl(college.shortName, branchName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-ml-2 inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[13px] font-medium text-[#6B6B6B] transition-colors hover:bg-[#F7F4F0] hover:text-[#1A1A1A]"
                >
                  <Users className="size-3.5" strokeWidth={1.5} aria-hidden />
                  Alumni
                </a>

                <Link
                  href={`/college/${college.id}?branch=${branch}&category=${category}`}
                  className="group inline-flex items-center gap-1 text-[13px] font-medium text-[#1A1A1A] transition-colors hover:text-[#CC3D2E]"
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/**
 * A prediction card.
 *
 * Memoised because the results grid re-renders on every filter keystroke and
 * sixty of these each redraw a chart.
 */
export const CollegeCard = memo(CollegeCardImpl);

export default CollegeCard;
