"use client";

import { memo, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Users,
  Minus,
  Plus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
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
import type { Category, CollegeType, PredictionResult } from "@/types";
import { cn } from "@/lib/utils";

const inr = (n: number) => n.toLocaleString("en-IN");

const TYPE_BADGE: Record<CollegeType, string> = {
  Government: "border-blue-100 bg-blue-50 text-blue-600",
  "Government Aided": "border-teal-100 bg-teal-50 text-teal-600",
  "Private Unaided": "border-[#E5E0D8] bg-[#F0EDE8] text-[#6B6B6B]",
};

const TYPE_SHORT: Record<CollegeType, string> = {
  Government: "Govt",
  "Government Aided": "Aided",
  "Private Unaided": "Private",
};

const CHANCE_BADGE = {
  High: "border-[#B8DFC9] bg-[#E8F5EE] text-[#1F7A4A]",
  Moderate: "border-[#F5D9A0] bg-[#FEF3E2] text-[#B45309]",
  Low: "border-[#F5C4BF] bg-[#FEE8E6] text-[#CC3D2E]",
} as const;

const CHANCE_STRIPE = {
  High: "bg-gradient-to-r from-green-400 to-emerald-500",
  Moderate: "bg-gradient-to-r from-amber-400 to-orange-400",
  Low: "bg-gradient-to-r from-red-400 to-rose-400",
} as const;

function TrendChip({ trend, delta }: { trend: PredictionResult["trend"]; delta: number }) {
  if (trend === "tightening") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-red-500">
        <TrendingUp className="size-3" aria-hidden />
        Tightening {Math.abs(delta) > 0 && `~${inr(Math.abs(delta))}/yr`}
      </span>
    );
  }
  if (trend === "relaxing") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-600">
        <TrendingDown className="size-3" aria-hidden />
        Relaxing {Math.abs(delta) > 0 && `~${inr(Math.abs(delta))}/yr`}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-[#9B9B9B]">
      <Minus className="size-3" aria-hidden />
      Stable
    </span>
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
      toast("Removed", "neutral");
    } else {
      addToOptionList(prediction);
      toast("Added to option list", "success");
    }
  };

  return (
    <motion.article
      layout
      className="relative overflow-hidden rounded-xl border border-[#E5E0D8] bg-white p-5 transition-all duration-150 hover:-translate-y-px hover:border-[#C9C4BC] hover:bg-[#FAFAF8]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="truncate text-sm font-semibold text-white">
          {college.shortName}
        </h3>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-[11px]",
            TYPE_BADGE[college.type]
          )}
        >
          {TYPE_SHORT[college.type]}
        </span>
      </div>

      <p className="mt-2 truncate text-sm text-[#6B6B6B]">{branchName}</p>
      <p className="mt-0.5 text-xs text-[#9B9B9B]">
        {college.city} · {college.kea_code}
      </p>

      <dl className="mt-5 grid grid-cols-3 gap-3">
        <div>
          <dt className="text-[11px] text-[#9B9B9B]">Closing Rank</dt>
          <dd className="mt-1 font-mono text-sm text-white">
            {inr(closingRank)}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-[#9B9B9B]">Avg Package</dt>
          <dd className="mt-1 font-mono text-sm text-[#1A1A1A]">
            ₹{college.avgPackage} LPA
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-[#9B9B9B]">Chance</dt>
          <dd className="mt-1">
            <span
              className={cn(
                "inline-flex rounded-full border px-2 py-0.5 text-[11px]",
                CHANCE_BADGE[chanceLabel]
              )}
            >
              {chanceLabel} {chancePercent}%
            </span>
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3">
        <TrendChip trend={prediction.trend} delta={prediction.trendDelta} />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#CC3D2E] transition-colors hover:text-[#B5351F] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CC3D2E]/40"
        >
          Details
          <ChevronDown
            className={cn(
              "size-3 transition-transform duration-200",
              open && "rotate-180"
            )}
            aria-hidden
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            // Recharts measures its container on mount. Mounting it mid-height
            // animation gives it a box of zero width and it draws dots but no
            // line, so the chart waits for the expand to finish.
            onAnimationComplete={() => setChartReady(true)}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-[#E5E0D8] pt-4">
              <p className="text-[11px] text-[#9B9B9B]">
                Final round, last {series.length} years
              </p>
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
                        stroke="#CC3D2E"
                        strokeWidth={1.75}
                        dot={{ r: 2, fill: "#CC3D2E", strokeWidth: 0 }}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              <p className="mt-1 flex justify-between font-mono text-[10px] text-[#9B9B9B]">
                <span>{series[0]?.year}</span>
                <span>{series[series.length - 1]?.year}</span>
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={toggleOption}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs transition-colors active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CC3D2E]/40",
                    added
                      ? "border-green-200 bg-[#E8F5EE] text-green-600 hover:bg-[#D9F0E3]"
                      : "border-[#CC3D2E] bg-transparent text-[#CC3D2E] hover:bg-[#F5E8E6]"
                  )}
                >
                  {added ? (
                    <Check className="size-3.5" aria-hidden />
                  ) : (
                    <Plus className="size-3.5" aria-hidden />
                  )}
                  {added ? "Added" : "Add to Options"}
                </button>

                <a
                  href={linkedInAlumniUrl(college.shortName, branchName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-transparent px-3 text-xs text-[#6B6B6B] transition-colors hover:bg-[#F0EDE8] hover:text-[#1A1A1A] active:scale-[0.97]"
                >
                  <Users className="size-3.5" aria-hidden />
                  Alumni
                </a>

                <Link
                  href={`/college/${college.id}?branch=${branch}&category=${category}`}
                  className="group ml-auto inline-flex items-center gap-1 text-xs text-[#CC3D2E] transition-colors hover:text-[#B5351F]"
                >
                  Full Analysis
                  <ArrowRight
                    className="size-3 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 h-0.5 rounded-full",
          CHANCE_STRIPE[chanceLabel]
        )}
      />
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
