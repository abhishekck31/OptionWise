import { cn } from "@/lib/utils";
import type { ChanceLabel } from "@/types";

const TONE: Record<ChanceLabel, string> = {
  High: "border-[#B8DFC9] bg-[#E8F5EE] text-[#1F7A4A]",
  Moderate: "border-[#F5D9A0] bg-[#FEF3E2] text-[#B45309]",
  Low: "border-[#F5C4BF] bg-[#FEE8E6] text-[#CC3D2E]",
};

/** The bottom edge of a prediction card, in the same three tones. */
export const CHANCE_EDGE: Record<ChanceLabel, string> = {
  High: "#10B981",
  Moderate: "#F59E0B",
  Low: "#CC3D2E",
};

/** How likely a seat is at the student's rank: a dot, the word, the figure. */
export function ChanceChip({
  label,
  percent,
  className,
}: {
  label: ChanceLabel;
  percent?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-[12px] font-medium leading-none",
        TONE[label],
        className
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {label} chance
      {percent !== undefined && (
        <span className="font-mono opacity-75">{percent}%</span>
      )}
    </span>
  );
}

export default ChanceChip;
