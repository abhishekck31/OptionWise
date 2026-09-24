import { formatRank } from "@/lib/format";
import { LATEST_YEAR, SHOWCASE, TOP_CSE } from "@/lib/showcase";

function Items({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {TOP_CSE.map((seat) => (
        <li key={seat.code} className="flex items-center gap-3 px-8">
          <span className="text-[14px] font-medium text-[#1A1A1A]">{seat.shortName}</span>
          <span className="font-mono text-[14px] text-[#9B9B9B]">{formatRank(seat.closingRank)}</span>
          <span aria-hidden className="ml-5 size-1 rounded-full bg-[#C9C4BC]" />
        </li>
      ))}
    </ul>
  );
}

/**
 * A full-bleed band of real numbers: the most contested computer science
 * seats in the state and where each one closed. It runs edge to edge on
 * purpose — the one element on the homepage that ignores the margins.
 */
export function Ticker() {
  return (
    <section
      aria-label={`Computer science general merit closing ranks, ${LATEST_YEAR} ${SHOWCASE.finalRound.label}`}
      className="marquee relative overflow-hidden border-b border-[#E5E0D8] bg-white py-5"
    >
      <div className="marquee-track">
        <Items />
        <Items hidden />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 flex items-center bg-gradient-to-r from-white from-60% to-transparent pl-5 pr-16 md:pl-10 xl:pl-20"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#9B9B9B]">
          CSE · GM · {SHOWCASE.finalRound.round} {LATEST_YEAR}
        </span>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent"
      />
    </section>
  );
}

export default Ticker;
