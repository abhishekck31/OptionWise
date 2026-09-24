"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Magnetic from "@/components/motion/Magnetic";
import { formatCount, formatRank } from "@/lib/format";
import { EASE_OUT } from "@/lib/motion";
import {
  COLLEGE_COUNT,
  FIRST_YEAR,
  FLAGSHIP,
  LATEST_YEAR,
  reachable,
  SHOWCASE,
  TOTAL_RANKS,
  YEARS_COVERED,
} from "@/lib/showcase";

/* ─── Headline ────────────────────────────────────────────────────────────── */

const WORD_STAGGER = 0.12;

/**
 * The top line drops in tipping back; the accent line rises tipping forward.
 * The two meet in the middle, so the headline pinches together as it forms.
 */
const wordFromAbove: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: -20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.9, ease: EASE_OUT, delay: 0.15 + i * WORD_STAGGER },
  }),
};

const wordFromBelow: Variants = {
  hidden: { opacity: 0, y: -40, rotateX: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.9, ease: EASE_OUT, delay: 0.15 + i * WORD_STAGGER },
  }),
};

const HEADLINE_SIZE = "text-[clamp(3.5rem,7vw,7rem)] leading-[0.95] tracking-[-0.04em]";

/** When the last word has landed, everything else follows. */
const AFTER_HEADLINE = 0.15 + 3 * WORD_STAGGER + 0.35;

function Headline() {
  return (
    <h1 className="mt-5 [perspective:600px]">
      <span className={`block font-light text-[#1A1A1A] ${HEADLINE_SIZE}`}>
        {["Find", "your"].map((word, i) => (
          <motion.span key={word} custom={i} variants={wordFromAbove} className="inline-block origin-bottom will-change-transform">
            {word}
            {i === 0 && " "}
          </motion.span>
        ))}
      </span>
      <span className={`block font-bold text-[#CC3D2E] ${HEADLINE_SIZE}`}>
        <motion.span custom={2} variants={wordFromBelow} className="inline-block origin-top will-change-transform">
          college.
        </motion.span>
      </span>
    </h1>
  );
}

/* ─── Card cluster ────────────────────────────────────────────────────────── */

type CardSpec = {
  rotate: number;
  depth: number;
  delay: number;
  className: string;
  children: React.ReactNode;
};

/**
 * One card: an outer layer that drifts with the mouse, and an inner layer that
 * plays the entrance. Kept apart so the parallax never fights the arrival.
 */
function FloatingCard({ mx, my, spec }: { mx: MotionValue<number>; my: MotionValue<number>; spec: CardSpec }) {
  const reduceMotion = useReducedMotion();
  const x = useTransform(mx, (v) => v * spec.depth);
  const y = useTransform(my, (v) => v * spec.depth);

  return (
    <motion.div style={{ x, y }} className={`absolute ${spec.className}`}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20, rotate: spec.rotate + 5 }}
        animate={{ opacity: 1, y: 0, rotate: spec.rotate }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: AFTER_HEADLINE + spec.delay }}
      >
        {spec.children}
      </motion.div>
    </motion.div>
  );
}

const SAMPLE_RANK = 5000;

function RoundBars() {
  const rows = reachable(SAMPLE_RANK);
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <ul className="mt-4 space-y-2">
      {rows.map(({ round, count }) => (
        <li key={round.round} className="grid grid-cols-[4rem_1fr_2.75rem] items-center gap-2">
          <span className="text-[11px] text-white/50">
            {round.label}
            {round.mock && <span className="text-white/30"> ·m</span>}
          </span>
          <span className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full rounded-full bg-[#F7F4F0]/70" style={{ width: `${(count / max) * 100}%` }} />
          </span>
          <span className="text-right font-mono text-[12px] text-white">{formatCount(count)}</span>
        </li>
      ))}
    </ul>
  );
}

function CardCluster() {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.6 });
  const my = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.6 });

  const cards: CardSpec[] = [
    {
      rotate: -2,
      depth: 10,
      delay: 0,
      className: "left-0 top-0 z-10",
      children: FLAGSHIP && (
        <div className="w-72 rounded-2xl border border-[#E5E0D8] bg-white p-5">
          <p className="text-[14px] font-medium text-[#1A1A1A]">{FLAGSHIP.shortName} · CSE · GM</p>
          <p className="type-caption mt-1">Closing rank {LATEST_YEAR}, by round</p>
          <ol className="mt-4 flex items-end justify-between gap-2">
            {SHOWCASE.rounds.map((r) => (
              <li key={r.round} className="text-center">
                <span className="block font-mono text-[26px] font-medium leading-none tracking-[-0.03em] text-[#1A1A1A]">
                  {formatRank(FLAGSHIP?.ranks[r.round] ?? 0)}
                </span>
                <span className="mt-1.5 block text-[11px] text-[#9B9B9B]">
                  {r.label.replace("Round ", "R")}
                  {r.mock ? " mock" : r.provisional ? " prov." : ""}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ),
    },
    {
      rotate: 1,
      depth: -18,
      delay: 0.1,
      className: "left-[76px] top-[150px] z-20",
      children: (
        <div className="w-64 rounded-2xl bg-[#1A1A1A] p-5 text-white">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40">Rank {formatCount(SAMPLE_RANK)} · GM</p>
          <p className="mt-2 text-[15px] leading-snug text-white">Courses it reached in {LATEST_YEAR}</p>
          <RoundBars />
        </div>
      ),
    },
    {
      rotate: 3,
      depth: 26,
      delay: 0.2,
      className: "right-[-28px] top-[352px] z-30 xl:right-[-56px]",
      children: (
        <div className="w-48 rounded-xl bg-[#CC3D2E] px-4 py-3 text-white">
          <p className="text-[13px] font-medium leading-snug">
            <span className="font-mono">{YEARS_COVERED}</span> years of KEA reports, {FIRST_YEAR}–{LATEST_YEAR}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div
      aria-hidden
      className="relative mx-auto h-[430px] w-[340px]"
      onPointerMove={(e) => {
        if (reduceMotion || e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        rawX.set((e.clientX - rect.left) / rect.width - 0.5);
        rawY.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
    >
      {cards.map((spec, i) => (
        <FloatingCard key={i} mx={mx} my={my} spec={spec} />
      ))}
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */

const TRUST = [
  `${COLLEGE_COUNT} colleges`,
  `${YEARS_COVERED} years of reports`,
  `${formatCount(TOTAL_RANKS)} closing ranks`,
  "Official KEA source",
];

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const after = (extra = 0) => ({
    initial: reduceMotion ? false : ({ opacity: 0, y: 16 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE_OUT, delay: AFTER_HEADLINE + extra - 0.25 },
  });

  return (
    <section className="relative isolate overflow-hidden">
      {/* ── Depth: a watermark and two slow blobs ── */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <p className="watermark left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 text-[clamp(20vw,25vw,30vw)] text-black/[0.03]">
          KCET
        </p>
        <div className="blob -right-40 -top-40 h-[500px] w-[600px] bg-[#CC3D2E] opacity-[0.06] blur-[80px]" />
        <div className="blob blob-reverse -bottom-32 -left-32 h-[350px] w-[400px] bg-[#F59E0B] opacity-[0.04] blur-[60px]" />
      </div>

      <div className="wrap">
        <div className="grid-editorial items-center pb-24 pt-20 md:pt-28 lg:pb-32 lg:pt-32">
          {/* ── Words ── */}
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            className="col-span-4 text-center md:col-span-8 lg:col-span-5 lg:text-left xl:col-span-7"
          >
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#6B6B6B]"
            >
              Karnataka engineering admissions · {FIRST_YEAR}–{LATEST_YEAR}
            </motion.p>

            <Headline />

            <motion.p {...after()} className="mx-auto mt-8 max-w-[460px] text-[17px] leading-[1.7] text-[#6B6B6B] lg:mx-0">
              Enter your KCET rank and category. See every college and course that
              rank reached in round 1, 2 and 3 — read straight off KEA&rsquo;s
              official cut-off reports.
            </motion.p>

            <motion.div
              {...after(0.1)}
              className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Magnetic>
                <Link
                  href="/predict/college"
                  data-cursor="button"
                  className="inline-flex h-12 items-center rounded-full bg-[#1A1A1A] px-8 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-[#CC3D2E]"
                >
                  Find colleges for my rank
                </Link>
              </Magnetic>
              <Link
                href="/cutoffs"
                className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-[#6B6B6B] transition-colors duration-200 hover:text-[#1A1A1A]"
              >
                Browse year-wise cut-offs
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={1.5} aria-hidden />
              </Link>
            </motion.div>

            <motion.ul {...after(0.2)} className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3 lg:justify-start">
              {TRUST.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[13px] text-[#9B9B9B]">
                  <span aria-hidden className="size-1.5 rounded-full bg-[#CC3D2E]/50" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ── The editorial break: cards that stack, tilt and hang into the margin ── */}
          <div className="hidden lg:col-span-3 lg:block xl:col-span-5">
            <div className="origin-center lg:scale-[0.88] xl:scale-100">
              <CardCluster />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
