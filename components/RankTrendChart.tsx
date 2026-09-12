"use client";

import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { getCutoffHistory } from "@/lib/data/cutoffs";
import { getTrend } from "@/lib/kcet-formula";
import { VERIFIED_YEAR } from "@/lib/data/cutoffs";
import type { Branch, Category, Round } from "@/types";

const inr = (n: number) => n.toLocaleString("en-IN");

interface Point {
  year: number;
  r1?: number;
  r2?: number;
  r3?: number;
}

interface TooltipPayloadItem {
  dataKey?: string | number;
  value?: number;
  payload?: Point;
}

const ROUND_NAME: Record<string, string> = {
  r1: "Round 1",
  r2: "Round 2",
  r3: "Round 3",
};

/**
 * Recharts 3 types the tooltip content as an element, not a render function,
 * so this is passed as `<ChartTooltip />` and receives its props by cloning.
 */
function ChartTooltip({
  active,
  payload,
  label,
  series,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  series?: Point[];
}) {
  if (!active || !payload?.length) return null;

  const year = Number(label);
  const previous = series?.find((p) => p.year === year - 1);

  return (
    <div className="rounded-xl border border-[#E5E0D8] bg-white p-3 text-xs shadow-sm">
      <p className="font-mono text-[#1A1A1A]">
        {year}
        {year === VERIFIED_YEAR ? (
          <span className="ml-1.5 text-[10px] text-[#1F7A4A]">published</span>
        ) : (
          <span className="ml-1.5 text-[10px] text-[#9B9B9B]">projected</span>
        )}
      </p>
      <ul className="mt-1.5 space-y-1">
        {payload.map((item) => {
          const key = String(item.dataKey);
          const value = item.value;
          if (value === undefined) return null;

          const before = previous?.[key as "r1" | "r2" | "r3"];
          const change = before !== undefined ? value - before : undefined;

          return (
            <li key={key} className="flex items-center gap-2">
              <span className="text-[#6B6B6B]">{ROUND_NAME[key] ?? key}</span>
              <span className="ml-auto font-mono text-[#1A1A1A]">
                #{inr(value)}
              </span>
              {change !== undefined && change !== 0 && (
                <span
                  className={
                    change > 0 ? "text-green-600" : "text-red-500"
                  }
                >
                  {change > 0 ? "↑" : "↓"}
                  {inr(Math.abs(Math.round(change)))}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export interface RankTrendChartProps {
  collegeId: string;
  branch: Branch;
  category: Category;
  /** Highlighted round. R1 and R3 are always drawn. */
  selectedRound?: Round;
  studentRank?: number;
}

export function RankTrendChart({
  collegeId,
  branch,
  category,
  studentRank,
}: RankTrendChartProps) {
  const { data, trend, delta } = useMemo(() => {
    const history = getCutoffHistory(collegeId, branch, category);

    const byYear = new Map<number, Point>();
    for (const point of history) {
      const row = byYear.get(point.year) ?? { year: point.year };
      if (point.round === "R1") row.r1 = point.closingRank;
      if (point.round === "R2") row.r2 = point.closingRank;
      if (point.round === "R3") row.r3 = point.closingRank;
      byYear.set(point.year, row);
    }

    const rows = [...byYear.values()].sort((a, b) => a.year - b.year);
    return { data: rows, ...getTrend(history) };
  }, [collegeId, branch, category]);

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-[#E5E0D8] bg-white text-sm text-[#9B9B9B]">
        No published cutoff for this combination
      </div>
    );
  }

  const TrendIcon =
    trend === "tightening" ? ArrowUp : trend === "relaxing" ? ArrowDown : Minus;
  const trendTone =
    trend === "tightening"
      ? "text-[#CC3D2E]"
      : trend === "relaxing"
        ? "text-[#1F7A4A]"
        : "text-[#9B9B9B]";

  return (
    <div className="relative rounded-xl border border-[#E5E0D8] bg-white p-4">
      <div className="absolute right-4 top-4 z-10 text-right">
        <span
          className={`inline-flex items-center gap-1 text-xs ${trendTone}`}
        >
          <TrendIcon className="size-3" aria-hidden />
          {trend === "stable"
            ? "Stable"
            : `${trend === "tightening" ? "Tightening" : "Relaxing"} ~${inr(delta)} ranks/yr`}
        </span>
        <span className="mt-0.5 block text-[10px] text-[#9B9B9B]">
          projected from {VERIFIED_YEAR}
        </span>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 32, right: 12, bottom: 4, left: 4 }}
          >
            <defs>
              <linearGradient id="r3-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#CC3D2E" stopOpacity={0} />
                <stop offset="100%" stopColor="#CC3D2E" stopOpacity={0.15} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#E5E0D8"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#9B9B9B", fontSize: 11 }}
            />
            {/* A lower rank is a better result, so the axis runs downward. */}
            <YAxis
              reversed
              width={58}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#9B9B9B", fontSize: 11 }}
              tickFormatter={(v: number) => inr(v)}
              label={{
                value: "← Better",
                angle: -90,
                position: "insideLeft",
                fill: "#9B9B9B",
                fontSize: 10,
              }}
            />

            <Tooltip
              cursor={{ stroke: "#C9C4BC" }}
              content={<ChartTooltip series={data} />}
            />

            {/* The axis is reversed, so the baseline sits at the top of the
                plot. Anchoring the fill to the worst rank instead keeps it
                under the line, where it reads as depth rather than a wash. */}
            <Area
              type="monotone"
              dataKey="r3"
              baseValue="dataMax"
              stroke="none"
              fill="url(#r3-fill)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="r1"
              stroke="#E8C4BF"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: "#FFFFFF", stroke: "#E8C4BF", strokeWidth: 2 }}
              animationDuration={1000}
            />
            <Line
              type="monotone"
              dataKey="r3"
              stroke="#CC3D2E"
              strokeWidth={2}
              dot={{ r: 3.5, fill: "#FFFFFF", stroke: "#CC3D2E", strokeWidth: 2 }}
              animationDuration={1000}
            />

            {studentRank !== undefined && studentRank > 0 && (
              <ReferenceLine
                y={studentRank}
                stroke="#CC3D2E"
                strokeOpacity={0.5}
                strokeDasharray="3 3"
                label={{
                  value: "Your Rank",
                  position: "insideTopRight",
                  fill: "#6B6B6B",
                  fontSize: 10,
                }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-center gap-5 text-[11px] text-[#9B9B9B]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-px w-4 border-t border-dashed border-[#E8C4BF]" />
          Round 1
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full bg-[#CC3D2E]" />
          Round 3
        </span>
      </div>
    </div>
  );
}

export default RankTrendChart;
