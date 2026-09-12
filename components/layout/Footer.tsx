"use client";

import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { colleges } from "@/lib/data/colleges";
import { cutoffs, VERIFIED_YEAR } from "@/lib/data/cutoffs";

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

export default function Footer() {
  return (
    <footer className="print-hide border-t border-[#E5E0D8] bg-[#F7F4F0] py-14 text-xs text-[#6B6B6B]">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="flex size-5 items-center justify-center rounded-md bg-[#CC3D2E] text-[11px] font-semibold text-white"
              >
                K
              </span>
              <span className="text-sm font-semibold tracking-tight text-[#1A1A1A]">
                KCET Predictor
              </span>
            </div>
            <p className="max-w-sm leading-relaxed text-[#6B6B6B]">
              Karnataka Common Entrance Test rank prediction and counselling
              intelligence, built on KEA&rsquo;s 50:50 composite formula and the
              closing ranks it publishes after every round.
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E0D8] bg-white px-2.5 py-1 text-[11px] text-[#1A1A1A]">
              <ShieldCheck className="size-3.5 text-[#1F7A4A]" aria-hidden />
              Built on KEA&rsquo;s published UGCET {VERIFIED_YEAR} round 1&ndash;3
              cutoffs
            </span>
          </div>

          <div className="space-y-2.5">
            <span className="block text-[11px] font-medium uppercase tracking-wider text-[#1A1A1A]">
              Tools
            </span>
            <ul className="space-y-2">
              {APP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#B5351F]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2.5">
            <span className="block text-[11px] font-medium uppercase tracking-wider text-[#1A1A1A]">
              KEA Resources
            </span>
            <ul className="space-y-2">
              {KEA_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 transition-colors hover:text-[#B5351F]"
                  >
                    {link.label}
                    <ExternalLink className="size-3 text-[#9B9B9B]" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#E5E0D8] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[#9B9B9B]">
            {cutoffs.length.toLocaleString("en-IN")} published cutoffs across{" "}
            {colleges.length} colleges. Not affiliated with KEA.
          </p>
          <p className="text-[#9B9B9B]">
            Verify every code at cetonline.karnataka.gov.in before option entry.
          </p>
        </div>
      </div>
    </footer>
  );
}
