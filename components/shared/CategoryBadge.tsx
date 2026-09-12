import { cn } from "@/lib/utils";
import { getCategoryLabel } from "@/lib/data/categories";
import type { Category } from "@/types";

/** The reservation category a prediction was run under. */
export function CategoryBadge({
  category,
  showLabel = false,
  className,
}: {
  category: Category;
  showLabel?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-background-elevated px-2.5 py-0.5 text-[11px] font-medium text-foreground-muted",
        className
      )}
    >
      <span className="font-mono font-semibold text-foreground">{category}</span>
      {showLabel && <span>{getCategoryLabel(category)}</span>}
    </span>
  );
}

export default CategoryBadge;
