import { cn } from "@/lib/utils";
import type { Tier } from "@/types";

const TIER_STYLES: Record<Tier, string> = {
  Safe: "bg-success/10 text-success border-success/25",
  Moderate: "bg-warning/10 text-warning border-warning/25",
  Aspirational: "bg-brand-to/10 text-brand-to border-brand-to/25",
};

/** How likely this seat is at the current rank. */
export function ChanceBadge({
  tier,
  chance,
  className,
}: {
  tier: Tier;
  chance?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
        TIER_STYLES[tier],
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {tier}
      {typeof chance === "number" && (
        <span className="font-mono opacity-80">{chance}%</span>
      )}
    </span>
  );
}

export default ChanceBadge;
