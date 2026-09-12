"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  ListOrdered,
  Search,
  type LucideIcon,
} from "lucide-react";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import { colleges } from "@/lib/data/colleges";
import { VERIFIED_YEAR } from "@/lib/data/cutoffs";
import { CATEGORY_KEYS } from "@/types";

/* Every figure below is read off the dataset, so the page cannot drift out of
 * step with what the app can actually answer. */
const COLLEGE_COUNT = colleges.length;
const CATEGORY_COUNT = CATEGORY_KEYS.length;

/** Claude's easing: settles rather than bounces. */
const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

/* ─── Hero ─────────────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="dot-grid absolute inset-0" aria-hidden />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-[1200px] px-6 py-24 text-center sm:px-8 lg:py-28"
      >
        <motion.p variants={rise}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8C4BF] bg-[#F5E8E6] px-3 py-1 text-xs font-medium text-[#CC3D2E]">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#1F7A4A] opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#1F7A4A]" />
            </span>
            Official KEA {VERIFIED_YEAR} Data
          </span>
        </motion.p>

        <motion.h1
          variants={rise}
          className="mx-auto mt-7 max-w-3xl text-4xl font-light leading-tight tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-6xl"
        >
          <span className="block">Find Your Engineering</span>
          <span className="block">College in Karnataka</span>
        </motion.h1>

        <motion.p
          variants={rise}
          className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#6B6B6B]"
        >
          Enter your KCET score and board marks to discover every engineering
          college you qualify for — with real cutoff data from {COLLEGE_COUNT}{" "}
          Karnataka colleges.
        </motion.p>

        <motion.div
          variants={rise}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/predict/rank"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#CC3D2E] px-6 text-sm font-medium text-white transition-all duration-150 hover:bg-[#B5351F] active:scale-[0.97] active:bg-[#A02E1A] sm:w-auto"
          >
            Predict My Rank
          </Link>
          <Link
            href="/predict/college"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#E5E0D8] bg-white px-6 text-sm font-medium text-[#1A1A1A] transition-all duration-150 hover:border-[#C9C4BC] hover:bg-[#F0EDE8] active:scale-[0.97] sm:w-auto"
          >
            Find by Rank
          </Link>
        </motion.div>

        <motion.div variants={rise} className="mt-14 flex justify-center">
          <dl className="flex flex-wrap items-center justify-center gap-y-5 rounded-2xl border border-[#E5E0D8] bg-white px-8 py-5">
            <Stat value={COLLEGE_COUNT} label="Colleges" />
            <Divider />
            <Stat value={CATEGORY_COUNT} label="Categories" />
            <Divider />
            <Stat text={`2018–${VERIFIED_YEAR}`} label="Cutoff years" />
            <Divider />
            <Stat text="Real KEA" label="Data source" />
          </dl>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Divider() {
  return <span aria-hidden className="mx-6 hidden h-8 w-px bg-[#E5E0D8] sm:block" />;
}

function Stat({
  value,
  text,
  label,
}: {
  value?: number;
  text?: string;
  label: string;
}) {
  return (
    <div className="px-4 text-center sm:px-0">
      <dt className="sr-only">{label}</dt>
      <dd>
        {value !== undefined ? (
          <AnimatedCounter
            value={value}
            duration={1.2}
            className="block text-lg font-semibold text-[#1A1A1A]"
          />
        ) : (
          <span className="block text-lg font-semibold text-[#1A1A1A]">
            {text}
          </span>
        )}
        <span className="mt-0.5 block text-xs text-[#9B9B9B]">{label}</span>
      </dd>
    </div>
  );
}

/* ─── How it works ─────────────────────────────────────────────────────── */

const STEPS = [
  {
    title: "Enter Marks",
    body: "Physics, Chemistry and Maths board marks, plus your KCET score out of 180.",
  },
  {
    title: "Get Rank",
    body: "KEA's 50:50 formula weighs both halves equally and gives your estimated rank range.",
  },
  {
    title: "Find Colleges",
    body: `See every college and branch that rank qualifies for, against real ${VERIFIED_YEAR} cutoffs.`,
  },
] as const;

function HowItWorks() {
  return (
    <section className="border-y border-[#E5E0D8] bg-white py-16">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <h2 className="text-center text-2xl font-normal tracking-tight text-[#1A1A1A]">
          How it works
        </h2>

        <div className="relative mt-12">
          {/* The line joining the three steps, desktop only. */}
          <div
            aria-hidden
            className="absolute left-[16.66%] right-[16.66%] top-[18px] hidden border-t border-dashed border-[#E5E0D8] lg:block"
          />

          <motion.ol
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="relative grid gap-10 lg:grid-cols-3"
          >
            {STEPS.map((step, i) => (
              <motion.li key={step.title} variants={rise} className="text-center">
                <span className="mx-auto flex size-9 items-center justify-center rounded-full border border-[#E8C4BF] bg-[#F5E8E6] text-sm font-semibold text-[#CC3D2E]">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-medium text-[#1A1A1A]">
                  {step.title}
                </h3>
                <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-[#6B6B6B]">
                  {step.body}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

/* ─── Features ─────────────────────────────────────────────────────────── */

const FEATURES: {
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
  cta: string;
}[] = [
  {
    icon: Calculator,
    title: "Rank Predictor",
    body: "Turn four numbers into the rank band KEA would place you in, with the working shown.",
    href: "/predict/rank",
    cta: "Try it",
  },
  {
    icon: Search,
    title: "College Finder",
    body: `Filter ${COLLEGE_COUNT} colleges by city, branch, fee and type, ranked by what your rank can reach.`,
    href: "/predict/college",
    cta: "Find Colleges",
  },
  {
    icon: ListOrdered,
    title: "Option Builder",
    body: "Order your KEA option entry, check the shape of the list, and print it for the deadline.",
    href: "/options",
    cta: "Build List",
  },
];

function Features() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-20 sm:px-8">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-4 md:grid-cols-3 md:gap-6"
      >
        {FEATURES.map(({ icon: Icon, title, body, href, cta }) => (
          <motion.div key={title} variants={rise} whileHover={{ y: -2 }}>
            <Link
              href={href}
              className="group flex h-full flex-col rounded-xl border border-[#E5E0D8] bg-white p-6 transition-all duration-200 hover:border-[#C9C4BC] focus-visible:outline-none"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-[#F5E8E6] text-[#CC3D2E]">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-3 font-medium text-[#1A1A1A]">{title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[#6B6B6B]">
                {body}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#CC3D2E] transition-all group-hover:gap-2">
                {cta}
                <ArrowRight className="size-3.5" aria-hidden />
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── Provenance note ──────────────────────────────────────────────────── */

function SourceNote() {
  return (
    <div className="mx-auto mb-20 max-w-3xl px-6 sm:px-8">
      <div className="rounded-xl border border-[#F5D9A0] bg-[#FEF3E2] p-4">
        <p className="text-center text-xs leading-relaxed text-[#B45309]">
          Cutoff data sourced from KEA official {VERIFIED_YEAR} allotment
          reports. This tool is for planning only — always verify at
          cetonline.karnataka.gov.in before final option entry.
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <Features />
      <SourceNote />
    </>
  );
}

export default Hero;
