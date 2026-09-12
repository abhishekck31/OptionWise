"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ROUNDS } from "@/types";
import type { CutoffHistoryPoint } from "@/types";

export interface RankTrendChartProps {
  data: CutoffHistoryPoint[];
  /** Draws the student's rank across the chart so the gap is visible. */
  candidateRank?: number;
  branchName?: string;
}

const AXIS = "hsl(var(--foreground-subtle))";

/**
 * Closing rank across the three rounds.
 *
 * The Y axis is reversed so rank 1 sits at the top, the way ranks are read.
 * A line falling to the right means the cutoff loosened as rounds went on.
 */
export function RankTrendChart({
  data,
  candidateRank,
  branchName,
}: RankTrendChartProps) {
  const points = data.map((d) => ({ ...d, label: ROUNDS[d.round] }));
  const ranks = data.map((d) => d.closingRank);
  const lo = Math.min(...ranks, candidateRank ?? Infinity);
  const hi = Math.max(...ranks, candidateRank ?? 0);
  const pad = Math.max(Math.round((hi - lo) * 0.15), 50);

  return (
    <figure className="m-0">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
            <CartesianGrid
              stroke="hsl(var(--border-subtle))"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              stroke={AXIS}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border-subtle))" }}
              tick={{ fontSize: 11, fill: AXIS }}
            />
            <YAxis
              reversed
              domain={[Math.max(0, lo - pad), hi + pad]}
              stroke={AXIS}
              tickLine={false}
              axisLine={false}
              width={64}
              tick={{ fontSize: 11, fill: AXIS }}
              tickFormatter={(v: number) => `#${v.toLocaleString("en-IN")}`}
            />
            <Tooltip
              cursor={{ stroke: "hsl(var(--border))" }}
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: 12,
              }}
              labelStyle={{ color: "hsl(var(--foreground-muted))" }}
              formatter={(value) => [
                `#${Number(value ?? 0).toLocaleString("en-IN")}`,
                "Closing rank",
              ]}
            />

            {typeof candidateRank === "number" && (
              <ReferenceLine
                y={candidateRank}
                stroke="hsl(var(--success))"
                strokeDasharray="4 4"
                label={{
                  value: `You: #${candidateRank.toLocaleString("en-IN")}`,
                  position: "insideTopLeft",
                  fill: "hsl(var(--success))",
                  fontSize: 11,
                }}
              />
            )}

            <Line
              type="monotone"
              dataKey="closingRank"
              stroke="hsl(var(--brand-to))"
              strokeWidth={2}
              dot={{ r: 4, fill: "hsl(var(--brand-to))", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <figcaption className="mt-2 text-xs text-foreground-subtle">
        Closing rank by round{branchName ? ` for ${branchName}` : ""}. Rank 1 is at
        the top, so a line dropping to the right means the seat stayed open for
        higher ranks later in counselling.
      </figcaption>
    </figure>
  );
}

export default RankTrendChart;
