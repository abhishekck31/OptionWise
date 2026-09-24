import { ArrowUpRight, Info } from "lucide-react";
import type { KeaReport } from "@/lib/kea/types";

/**
 * Says exactly which KEA report a table was read from, links to the PDF, and
 * flags a mock or provisional list so it is never mistaken for a final one.
 */
export function SourceNote({ report, year }: { report: KeaReport; year: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#9B9B9B]">
      <span>
        Source: KEA {year} · <span className="text-[#6B6B6B]">{report.title}</span>
      </span>
      {report.mock && (
        <span className="rounded-full bg-[#FEF3E2] px-2 py-0.5 font-medium text-[#B45309]">
          KEA titled this a mock allotment
        </span>
      )}
      {report.provisional && (
        <span className="rounded-full bg-[#FEF3E2] px-2 py-0.5 font-medium text-[#B45309]">
          Provisional list — KEA has not posted a final one
        </span>
      )}
      {report.url && (
        <a
          href={report.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-medium text-[#1A1A1A] underline-offset-2 hover:underline"
        >
          Original PDF
          <ArrowUpRight className="size-3" strokeWidth={1.5} aria-hidden />
        </a>
      )}
    </div>
  );
}

/** The caveat every rank-to-seat reading needs. */
export function VariesNote({ year }: { year: number }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#E5E0D8] bg-white px-5 py-4 text-[13px] leading-[1.65] text-[#6B6B6B]">
      <Info className="mt-[3px] size-3.5 shrink-0 text-[#9B9B9B]" strokeWidth={1.5} aria-hidden />
      <p>
        These are the closing ranks KEA published for {year}. Cut-offs move every
        year with the difficulty of the paper, the number of students appearing,
        and the seats each college offers, so treat this as what your rank would
        have got in {year} — a guide for your option entry, not a guarantee.
      </p>
    </div>
  );
}
