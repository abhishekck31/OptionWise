import { cn } from "@/lib/utils";

/** One shimmering block. Size it with `className`. */
function Bar({ className }: { className?: string }) {
  return <div className={cn("animate-shimmer rounded", className)} />;
}

/**
 * A CollegeCard that has not loaded yet.
 *
 * Laid out to the same rhythm as the real card — title row, subtitle, a
 * three-column stat strip and the tier stripe at the bottom — so the list does
 * not jump when the results arrive.
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-xl border border-[#E5E0D8] bg-white p-5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Bar className="h-4 w-28" />
        <Bar className="h-5 w-16 rounded-full" />
      </div>

      <Bar className="mt-3 h-3.5 w-52" />
      <Bar className="mt-2 h-3 w-24" />

      <div className="mt-5 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <Bar className="h-2.5 w-16" />
            <Bar className="mt-2 h-4 w-20" />
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <Bar className="h-5 w-24 rounded-full" />
        <Bar className="h-3 w-14" />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[3px] animate-shimmer" />
    </div>
  );
}

/** A run of skeleton cards, each starting its shimmer a beat after the last. */
export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ animationDelay: `${i * 90}ms` }}>
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}

export default SkeletonCard;
