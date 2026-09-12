"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { colleges } from "@/lib/data/colleges";
import { cutoffs, VERIFIED_YEAR } from "@/lib/data/cutoffs";
import { formatCount } from "@/lib/format";

const APP_LINKS = [
  { href: "/predict/rank", label: "Rank Predictor" },
  { href: "/predict/college", label: "College Finder" },
  { href: "/options", label: "Option Entry" },
  { href: "/explore", label: "Explore Colleges" },
];

const KEA_LINKS = [
  { href: "https://cetonline.karnataka.gov.in/kea/", label: "Official KEA Portal" },
  { href: "https://cetonline.karnataka.gov.in/kea/ugcet2026", label: "UGCET 2026" },
];

const PUBLISHED = cutoffs.filter((row) => row.year === VERIFIED_YEAR).length;

export default function Footer() {
  return (
    <footer className="print-hide border-t border-[#E5E0D8] bg-[#F7F4F0] py-16">
      <div className="mx-auto max-w-[1120px] px-6 sm:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="flex size-6 items-center justify-center rounded-md bg-[#CC3D2E] font-mono text-[12px] font-medium text-white"
              >
                K
              </span>
              <span className="text-[15px] font-medium tracking-[-0.01em] text-[#1A1A1A]">
                KCET Predictor
              </span>
            </div>
            <p className="type-body-sm mt-4 max-w-sm">
              Rank prediction and option entry planning for the Karnataka Common
              Entrance Test, built on KEA&rsquo;s 50:50 composite formula and the
              closing ranks it publishes after every round.
            </p>
          </div>

          <nav aria-label="Tools">
            <p className="type-caption">Tools</p>
            <ul className="mt-4 space-y-2.5">
              {APP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[#6B6B6B] transition-colors duration-150 hover:text-[#1A1A1A]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="KEA resources">
            <p className="type-caption">KEA resources</p>
            <ul className="mt-4 space-y-2.5">
              {KEA_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[13px] text-[#6B6B6B] transition-colors duration-150 hover:text-[#1A1A1A]"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[#E5E0D8] pt-6 text-[12px] text-[#9B9B9B] sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-mono">{formatCount(PUBLISHED)}</span> published{" "}
            {VERIFIED_YEAR} cutoffs across{" "}
            <span className="font-mono">{colleges.length}</span> colleges. Not
            affiliated with KEA.
          </p>
          <p>Verify every code at cetonline.karnataka.gov.in before option entry.</p>
        </div>
      </div>
    </footer>
  );
}
