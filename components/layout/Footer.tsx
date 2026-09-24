"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatCount } from "@/lib/format";
import { COLLEGE_COUNT, FIRST_YEAR, LATEST_YEAR, SHOWCASE, TOTAL_RANKS } from "@/lib/showcase";

const APP_LINKS = [
  { href: "/predict/college", label: "College Finder" },
  { href: "/cutoffs", label: "Year-wise Cut-offs" },
  { href: "/options", label: "Option Entry" },
];

const KEA_LINKS = [
  { href: "https://cetonline.karnataka.gov.in/kea/", label: "Official KEA Portal" },
  { href: "https://cetonline.karnataka.gov.in/kea/ugcet2026", label: "UGCET 2026" },
];

export default function Footer() {
  return (
    <footer className="print-hide relative overflow-hidden border-t border-[#E5E0D8] bg-[#F7F4F0] pt-20">
      <div className="wrap">
        <div className="grid-editorial gap-y-12">
          <div className="col-span-4 md:col-span-4 xl:col-span-6">
            <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-light leading-[1.1] tracking-[-0.03em] text-[#1A1A1A]">
              Plan with the numbers.
              <br />
              <span className="font-bold">Confirm with KEA.</span>
            </p>
            <p className="type-body-sm mt-5 max-w-sm">
              Year-wise KCET cut-offs and a rank-to-college finder for Karnataka
              engineering admissions, built entirely on the closing ranks KEA
              publishes after every round.
            </p>
          </div>

          <nav aria-label="Tools" className="col-span-2 md:col-span-2 xl:col-span-3">
            <p className="type-caption tracking-[0.12em]">Tools</p>
            <ul className="mt-4 space-y-2.5">
              {APP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-[#6B6B6B] transition-colors duration-150 hover:text-[#1A1A1A]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="KEA resources" className="col-span-2 md:col-span-2 xl:col-span-3">
            <p className="type-caption tracking-[0.12em]">KEA resources</p>
            <ul className="mt-4 space-y-2.5">
              {KEA_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[14px] text-[#6B6B6B] transition-colors duration-150 hover:text-[#1A1A1A]"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-[#E5E0D8] pt-6 text-[12px] text-[#9B9B9B] sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-mono">{formatCount(TOTAL_RANKS)}</span> closing ranks from{" "}
            <span className="font-mono">{SHOWCASE.reports}</span> KEA reports, {FIRST_YEAR}–{LATEST_YEAR}, across{" "}
            <span className="font-mono">{COLLEGE_COUNT}</span> colleges. Not affiliated with KEA.
          </p>
          <p>Verify every code at cetonline.karnataka.gov.in before option entry.</p>
        </div>
      </div>

      {/* The grid break: a wordmark wider than the page, cropped by the floor. */}
      <p
        aria-hidden
        className="watermark relative mt-10 -mb-[0.18em] select-none text-center text-[26vw] text-[#1A1A1A]/[0.045]"
      >
        KCET
      </p>
    </footer>
  );
}
