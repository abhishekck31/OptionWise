import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Movement between two closing ranks.
 *
 * A cutoff rank going *up* means the seat got easier to reach, so that reads
 * as the positive direction here even though the number grew.
 */
export function TrendBadge({
  from,
  to,
  className,
}: {
  from: number;
  to: number;
  className?: string;
}) {
  const delta = to - from;
  const pct = from === 0 ? 0 : Math.round((delta / from) * 100);
  const eased = delta > 0;
  const flat = delta === 0;

  const Icon = flat ? Minus : eased ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[11px] font-medium",
        flat
          ? "bg-background-elevated text-foreground-subtle"
          : eased
            ? "bg-success/10 text-success"
            : "bg-danger/10 text-danger",
        className
      )}
    >
      <Icon className="size-3" aria-hidden />
      {flat ? "no change" : `${eased ? "+" : ""}${pct}%`}
    </span>
  );
}

export default TrendBadge;
