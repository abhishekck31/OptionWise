"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Bento from "@/components/home/Bento";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import Ticker from "@/components/home/Ticker";
import Magnetic from "@/components/motion/Magnetic";
import Reveal from "@/components/motion/Reveal";
import { FIRST_YEAR, LATEST_YEAR } from "@/lib/showcase";

/* ─── Closing note ────────────────────────────────────────────────────────── */

function SourceNote() {
  return (
    <section className="relative overflow-hidden border-t border-[#E5E0D8] py-32">
      <div className="wrap">
        <div className="grid-editorial gap-y-10">
          <Reveal className="col-span-4 md:col-span-5 xl:col-span-6 xl:col-start-2">
            <h2 className="text-[clamp(2.25rem,4vw,3.75rem)] leading-[1] tracking-[-0.04em] text-[#1A1A1A]">
              <span className="block font-light">Plan it here.</span>
              <span className="block font-bold">Lock it at KEA.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="col-span-4 md:col-span-3 xl:col-span-4 xl:col-start-9">
            <p className="text-[15px] leading-[1.7] text-[#6B6B6B]">
              Cut-offs come from KEA&rsquo;s official {FIRST_YEAR}–{LATEST_YEAR} allotment
              reports. Use this to plan, then confirm every code at
              cetonline.karnataka.gov.in before you lock your option entry.
            </p>
            <div className="mt-8">
              <Magnetic>
                <Link
                  href="/predict/college"
                  data-cursor="button"
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#1A1A1A] px-7 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-[#CC3D2E]"
                >
                  Start with your rank
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Hero() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <Ticker />
      <Bento />
      <SourceNote />
    </>
  );
}

export default Hero;
