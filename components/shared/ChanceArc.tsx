import type { ChanceLabel } from "@/types";

/**
 * The chance stroke follows the tier palette used across the option list and
 * the rank spectrum — green for a likely seat, amber for a coin toss, red for
 * a reach — so one colour means one thing everywhere on the site.
 */
const STROKE: Record<ChanceLabel, string> = {
  High: "#10B981",
  Moderate: "#F59E0B",
  Low: "#CC3D2E",
};

/**
 * Chance as a small donut: the arc fills in proportion to the percentage and
 * the figure sits inside it.
 */
export function ChanceArc({
  percent,
  label,
  size = 32,
  track = "#E5E0D8",
  textClassName = "fill-[#1A1A1A]",
}: {
  percent: number;
  label: ChanceLabel;
  size?: number;
  track?: string;
  textClassName?: string;
}) {
  const stroke = size <= 28 ? 2.5 : 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (Math.max(0, Math.min(100, percent)) / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${label} chance, ${percent}%`}
      className="shrink-0"
    >
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={track} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={STROKE[label]}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        className={textClassName}
        style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: size <= 28 ? 8.5 : 10 }}
      >
        {percent}
      </text>
    </svg>
  );
}

export default ChanceArc;
