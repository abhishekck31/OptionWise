import { cn } from "@/lib/utils";

/** One shimmering block. Size it with `className`. */
function Bar({ className }: { className?: string }) {
  return <div className={cn("animate-shimmer rounded-md", className)} />;
}

/**
 * A CollegeCard that has not loaded yet.
 *
 * Laid out to the same rhythm as the real card — title row, branch and city,
 * the three-figure strip, the trend and chance row, the action row — so the
 * grid does not jump when the results arrive.
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("card border-b-2 border-b-[#F0EDE8]", className)}
    >
      <div className="flex items-center justify-between gap-3">
        <Bar className="h-4 w-28" />
        <Bar className="h-5 w-12" />
      </div>

      <Bar className="mt-2.5 h-3.5 w-48" />
      <Bar className="mt-2 h-3 w-24" />

      <div className="my-4 grid grid-cols-3 gap-3 border-t border-[#F0EDE8] pt-4">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <Bar className="h-4 w-14" />
            <Bar className="mt-2 h-2.5 w-10" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Bar className="h-3.5 w-20" />
        <Bar className="h-6 w-28 rounded-full" />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#F0EDE8] pt-3">
        <Bar className="h-4 w-20" />
        <Bar className="h-4 w-14" />
      </div>
    </div>
  );
}

/** A run of skeleton cards, each starting its shimmer a beat after the last. */
export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ animationDelay: `${i * 90}ms` }}>
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}

export default SkeletonCard;
