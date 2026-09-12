"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  Info,
  ListOrdered,
  Search,
  type LucideIcon,
} from "lucide-react";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import ChanceChip from "@/components/shared/ChanceChip";
import { colleges, getCollegeByCode } from "@/lib/data/colleges";
import {
  cutoffs,
  getCutoff,
  getCutoffHistory,
  VERIFIED_YEAR,
} from "@/lib/data/cutoffs";
import { calculateChancePercent, getChanceLabel } from "@/lib/kcet-formula";
import { formatCount, formatRank } from "@/lib/format";
import { EASE_OUT, riseItem, staggerContainer } from "@/lib/motion";
import { CATEGORY_KEYS } from "@/types";

/* Every figure below is read off the dataset, so the page cannot drift out of
 * step with what the app can actually answer. */
const COLLEGE_COUNT = colleges.length;
const CATEGORY_COUNT = CATEGORY_KEYS.length;
const PUBLISHED_COUNT = cutoffs.filter((row) => row.year === VERIFIED_YEAR).length;

/* ─── The sample in the hero card ───────────────────────────────────────── */

/**
 * RVCE computer science, general merit: the seat most students measure
 * themselves against. The sample rank sits comfortably inside its real
 * closing rank, and the match count is every college that rank clears.
 */
const SAMPLE = (() => {
  const college = getCollegeByCode("E005");
  if (!college) return null;

  const row = getCutoff(college.id, "CSE", "GM", "R3");
  if (!row) return null;

  const rank = Math.max(50, Math.floor((row.closingRank * 0.7) / 50) * 50);
  const chance = calculateChancePercent(rank, row.closingRank);

  const history = getCutoffHistory(college.id, "CSE", "GM")
    .filter((point) => point.round === "R3")
    .slice(-3);

  const matching = new Set(
    cutoffs
      .filter(
        (c) =>
          c.year === VERIFIED_YEAR &&
          c.round === "R3" &&
          c.category === "GM" &&
          c.seatType === "Regular" &&
          rank <= c.closingRank
      )
      .map((c) => c.collegeId)
  );

  return {
    shortName: college.shortName,
    closingRank: row.closingRank,
    rank,
    chanceLabel: getChanceLabel(chance),
    history,
    moreColleges: Math.max(0, matching.size - 1),
  };
})();

/* ─── Motion ─────────────────────────────────────────────────────────────── */

const WORD_STAGGER = 0.08;

/** `custom` is the word's position across both lines. */
const word: Variants = {
  hidden: { opacity: 0, filter: "blur(4px)", y: 16 },
  show: (index: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT, delay: index * WORD_STAGGER },
  }),
};

const LINES = [
  { text: "Find your engineering", className: "type-display" },
  { text: "college in Karnataka", className: "type-display-accent" },
] as const;

const WORD_COUNT = LINES.reduce((n, line) => n + line.text.split(" ").length, 0);

/** When the headline has finished arriving, the rest follows. */
const AFTER_HEADLINE = WORD_COUNT * WORD_STAGGER + 0.1;

function Headline() {
  let index = 0;
  return (
    <h1 className="mt-6">
      {LINES.map((line) => (
        <span key={line.text} className={`block ${line.className} lg:text-[clamp(3rem,4.4vw,4rem)]`}>
          {line.text.split(" ").map((w, i, words) => {
            const position = index++;
            return (
              <motion.span
                key={`${w}-${i}`}
                variants={word}
                custom={position}
                className="inline-block will-change-transform"
              >
                {w}
                {i < words.length - 1 && " "}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

/* ─── Sample output card ─────────────────────────────────────────────────── */

/** Three final-round points drawn as a line. Lower ranks sit higher, as on
 *  every rank chart on the site, so a falling line means the seat relaxed. */
function Sparkline({ points }: { points: { year: number; closingRank: number }[] }) {
  const width = 240;
  const height = 56;
  const pad = 6;

  const ranks = points.map((p) => p.closingRank);
  const min = Math.min(...ranks);
  const max = Math.max(...ranks);
  const span = max - min || 1;

  const coords = points.map((p, i) => ({
    x: pad + (i * (width - pad * 2)) / Math.max(1, points.length - 1),
    y: pad + ((p.closingRank - min) / span) * (height - pad * 2),
  }));

  const pairs = coords.map((c) => `${c.x},${c.y}`);
  const line = pairs.join(" ");
  const area = `M${coords[0].x},${height} L${pairs.join(" L")} L${coords[coords.length - 1].x},${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-14 w-full overflow-visible"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A1A1A" stopOpacity={0.06} />
          <stop offset="100%" stopColor="#1A1A1A" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <polyline
        points={line}
        fill="none"
        stroke="#1A1A1A"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {coords.map((c, i) => (
        <circle
          key={i}
          cx={c.x}
          cy={c.y}
          r={i === coords.length - 1 ? 3 : 2}
          fill={i === coords.length - 1 ? "#1A1A1A" : "#FFFFFF"}
          stroke="#1A1A1A"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

function SampleCard() {
  if (!SAMPLE) return null;
  const first = SAMPLE.history[0];
  const last = SAMPLE.history[SAMPLE.history.length - 1];

  return (
    <div className="card p-8">
      <p className="type-caption">Sample output</p>

      <div className="mt-5 rounded-xl bg-[#F7F4F0] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="type-h3">{SAMPLE.shortName}</p>
            <p className="type-body-sm mt-0.5">Computer Science, GM</p>
          </div>
          <ChanceChip label={SAMPLE.chanceLabel} />
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <dt className="type-caption">Your rank</dt>
            <dd className="type-mono-sm mt-1 text-[22px]">
              {formatRank(SAMPLE.rank)}
            </dd>
          </div>
          <div>
            <dt className="type-caption">Closing rank</dt>
            <dd className="type-mono-sm mt-1 text-[22px]">
              {formatRank(SAMPLE.closingRank)}
            </dd>
          </div>
        </dl>
      </div>

      {SAMPLE.history.length > 1 && first && last && (
        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <p className="type-label">Final-round closing rank</p>
            <p className="font-mono text-[11px] text-[#9B9B9B]">
              {first.year}&ndash;{last.year}
            </p>
          </div>
          <div className="mt-3">
            <Sparkline points={SAMPLE.history} />
          </div>
        </div>
      )}

      <p className="type-body-sm mt-6 border-t border-[#F0EDE8] pt-5">
        <span className="font-mono font-medium text-[#1A1A1A]">
          {formatCount(SAMPLE.moreColleges)}
        </span>{" "}
        more colleges match rank{" "}
        <span className="font-mono text-[#1A1A1A]">{formatRank(SAMPLE.rank)}</span>
      </p>
    </div>
  );
}

/* ─── Stats ──────────────────────────────────────────────────────────────── */

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
    <div className="rounded-xl border border-[#E5E0D8] bg-white p-5 transition-[transform,border-color] duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-[#C9C4BC]">
      <dt className="sr-only">{label}</dt>
      <dd>
        {value !== undefined ? (
          <AnimatedCounter
            value={value}
            duration={1}
            className="block font-mono text-[28px] font-medium leading-none tracking-[-0.02em] text-[#1A1A1A]"
          />
        ) : (
          <span className="block font-mono text-[28px] font-medium leading-none tracking-[-0.02em] text-[#1A1A1A]">
            {text}
          </span>
        )}
        <span aria-hidden className="type-caption mt-2.5 block">
          {label}
        </span>
      </dd>
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */

function HeroSection() {
  const reduceMotion = useReducedMotion();
  const after = (extra = 0) => ({
    duration: 0.5,
    ease: EASE_OUT,
    delay: reduceMotion ? 0 : AFTER_HEADLINE + extra,
  });

  return (
    <section className="relative overflow-hidden">
      <div className="dot-grid dot-grid-fade absolute inset-0" aria-hidden />

      <div className="relative mx-auto grid w-full max-w-[1120px] items-center gap-16 px-6 py-20 sm:px-8 lg:grid-cols-[58fr_42fr] lg:gap-12 lg:py-[96px]">
        {/* Words */}
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="text-center lg:text-left"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <span className="inline-flex h-7 items-center gap-2 rounded-full border border-[#E5E0D8] bg-white/70 px-3 text-[12px] font-medium text-[#6B6B6B]">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#1F7A4A] opacity-50" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[#1F7A4A]" />
              </span>
              KEA {VERIFIED_YEAR} round 3 cutoffs
            </span>
          </motion.p>

          <Headline />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={after()}
            className="type-body-lg mx-auto mt-6 max-w-[520px] lg:mx-0"
          >
            Enter your board marks and KCET score. See the rank KEA&rsquo;s 50:50
            formula gives you, and every college and branch that rank reached
            in {VERIFIED_YEAR}.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={after(0.08)}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link href="/predict/rank" className="btn btn-primary group w-full sm:w-auto">
              Predict my rank
              <ArrowRight
                className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
                strokeWidth={1.5}
                aria-hidden
              />
            </Link>
            <Link href="/predict/college" className="btn btn-ghost w-full sm:w-auto">
              I know my rank
            </Link>
          </motion.div>
        </motion.div>

        {/* Proof */}
        <div className="mx-auto w-full max-w-[460px] lg:mx-0 lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={after(0.16)}
            className="hidden lg:block"
          >
            <SampleCard />
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={after(0.24)}
            className="grid grid-cols-2 gap-3 lg:mt-5"
          >
            <Stat value={COLLEGE_COUNT} label="Colleges" />
            <Stat value={PUBLISHED_COUNT} label={`KEA ${VERIFIED_YEAR} cutoffs`} />
            <Stat value={CATEGORY_COUNT} label="Categories" />
            <Stat text="R1–R3" label="Rounds covered" />
          </motion.dl>
        </div>
      </div>
    </section>
  );
}

/* ─── How it works ───────────────────────────────────────────────────────── */

const STEPS = [
  {
    title: "Enter your marks",
    body: "Physics, Chemistry and Maths from your 2nd PUC board, plus your KCET score out of 180.",
  },
  {
    title: "Get your rank band",
    body: "KEA weighs the two halves equally. You see the composite score and the rank range it lands in.",
  },
  {
    title: "Shortlist colleges",
    body: `Every college and branch that rank reached in ${VERIFIED_YEAR}, ready to order into your option entry.`,
  },
] as const;

function HowItWorks() {
  return (
    <section className="border-y border-[#E5E0D8] bg-white py-[96px]">
      <div className="mx-auto max-w-[1120px] px-6 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <h2 className="type-h2">How it works</h2>
            <p className="type-body mt-3 max-w-xs">
              Three steps, in the order KEA itself runs them.
            </p>
          </div>

          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-10 sm:grid-cols-3 sm:gap-8"
          >
            {STEPS.map((step, i) => (
              <motion.li
                key={step.title}
                variants={riseItem}
                className="border-t border-[#E5E0D8] pt-5"
              >
                <span className="font-mono text-[13px] text-[#B0AAA2]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="type-h3 mt-3">{step.title}</h3>
                <p className="type-body-sm mt-2">{step.body}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

/* ─── Tools ──────────────────────────────────────────────────────────────── */

const TOOLS: {
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
  cta: string;
}[] = [
  {
    icon: Calculator,
    title: "Rank Predictor",
    body: "Four numbers in, the rank band KEA would place you in out, with the working shown.",
    href: "/predict/rank",
    cta: "Predict my rank",
  },
  {
    icon: Search,
    title: "College Finder",
    body: `Filter ${COLLEGE_COUNT} colleges by city, branch, fee and type, sorted by what your rank can reach.`,
    href: "/predict/college",
    cta: "Find colleges",
  },
  {
    icon: ListOrdered,
    title: "Option Builder",
    body: "Order your option entry, check it has enough safe seats, and print it before the deadline.",
    href: "/options",
    cta: "Build my list",
  },
];

function Tools() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 py-[96px] sm:px-8">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-5 md:grid-cols-3"
      >
        {TOOLS.map(({ icon: Icon, title, body, href, cta }) => (
          <motion.div key={title} variants={riseItem}>
            <Link
              href={href}
              className="card card-hover group flex h-full flex-col focus-visible:outline-none"
            >
              <span className="flex size-10 items-center justify-center rounded-[10px] border border-[#E5E0D8] bg-[#F7F4F0] text-[#1A1A1A]">
                <Icon className="size-[18px]" strokeWidth={1.5} aria-hidden />
              </span>
              <h3 className="type-h3 mt-6">{title}</h3>
              <p className="type-body-sm mt-2 flex-1">{body}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1A1A1A]">
                {cta}
                <ArrowRight
                  className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── Provenance note ────────────────────────────────────────────────────── */

function SourceNote() {
  return (
    <div className="mx-auto mb-[96px] max-w-[720px] px-6 sm:px-8">
      <div className="flex items-start gap-3 rounded-2xl border border-[#F5D9A0] bg-[#FEF3E2] px-5 py-4">
        <Info className="mt-0.5 size-4 shrink-0 text-[#B45309]" strokeWidth={1.5} aria-hidden />
        <p className="text-[13px] leading-[1.6] text-[#8A4B0F]">
          Cutoffs come from KEA&rsquo;s official {VERIFIED_YEAR} allotment
          reports. Use this to plan, then confirm every code at
          cetonline.karnataka.gov.in before you lock your option entry.
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
      <Tools />
      <SourceNote />
    </>
  );
}

export default Hero;
