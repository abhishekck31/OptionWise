import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Every screen that shows a predicted rank or a chance percentage needs this.
 * It draws the line between the figures KEA published and the ones this app
 * worked out, so neither gets mistaken for the other.
 */
export function Disclaimer({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-[#E5E0D8] bg-white px-5 py-4 text-[13px] leading-[1.65] text-[#6B6B6B]",
        className
      )}
    >
      <Info className="mt-[3px] size-3.5 shrink-0 text-[#9B9B9B]" strokeWidth={1.5} aria-hidden />
      <p>
        {children ?? (
          <>
            The 2026 closing ranks here are KEA&rsquo;s own, taken from the round
            1&ndash;3 allotment reports. Earlier years, opening ranks and every
            chance percentage are this site&rsquo;s estimates. Real cutoffs move
            each year with the number of candidates, seat matrix changes and how
            many people accept a seat, so treat this as a shortlist to check
            against the official KEA allotment, not a guarantee.
          </>
        )}
      </p>
    </div>
  );
}

export default Disclaimer;
