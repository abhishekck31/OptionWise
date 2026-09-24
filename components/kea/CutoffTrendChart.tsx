"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatRank } from "@/lib/format";

/** Chart text is SVG drawn by recharts, so it names the mono face itself. */
const MONO = "var(--font-dm-mono), 'DM Mono', monospace";

export interface TrendPoint {
  year: number;
  R1?: number;
  R2?: number;
  R3?: number;
}

const SERIES = [
  { key: "R1", label: "Round 1", stroke: "#E8C4BF", dash: "4 4", width: 1.5 },
  { key: "R2", label: "Round 2", stroke: "#C9C4BC", dash: undefined, width: 1.5 },
  { key: "R3", label: "Round 3", stroke: "#CC3D2E", dash: undefined, width: 2 },
] as const;

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey?: string | number; value?: number }[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#E5E0D8] bg-white px-3.5 py-3 text-[12px] shadow-[0_12px_32px_rgba(26,26,26,0.08)]">
      <p className="font-mono text-[#1A1A1A]">{label}</p>
      <ul className="mt-2 space-y-1">
        {payload.map((item) =>
          item.value === undefined ? null : (
            <li key={String(item.dataKey)} className="flex min-w-[150px] items-center gap-3">
              <span className="text-[#6B6B6B]">{SERIES.find((s) => s.key === item.dataKey)?.label}</span>
              <span className="ml-auto font-mono text-[#1A1A1A]">{formatRank(item.value)}</span>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

/**
 * Closing rank by year for rounds 1–3. Lower ranks sit higher, as on every
 * rank chart on the site; a gap is a year or round KEA did not publish.
 */
export function CutoffTrendChart({ data }: { data: TrendPoint[] }) {
  const present = SERIES.filter((s) => data.some((d) => d[s.key] !== undefined));
  return (
    <div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 12, bottom: 4, left: 4 }}>
            <CartesianGrid stroke="#F0EDE8" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: "#9B9B9B", fontSize: 11, fontFamily: MONO }} />
            <YAxis
              reversed
              width={68}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#9B9B9B", fontSize: 11, fontFamily: MONO }}
              tickFormatter={(v: number) => formatRank(Math.round(v))}
            />
            <Tooltip cursor={{ stroke: "#C9C4BC" }} content={<ChartTooltip />} />
            {present.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.stroke}
                strokeWidth={s.width}
                strokeDasharray={s.dash}
                connectNulls
                dot={{ r: 3, fill: "#FFFFFF", stroke: s.stroke, strokeWidth: 2 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-5 text-[12px] text-[#6B6B6B]">
        {present.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full" style={{ background: s.stroke }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default CutoffTrendChart;
