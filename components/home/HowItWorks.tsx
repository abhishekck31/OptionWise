"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Reveal, { VIEWPORT, revealGroup } from "@/components/motion/Reveal";
import { FIRST_YEAR, LATEST_YEAR } from "@/lib/showcase";
import { EASE_OUT } from "@/lib/motion";

const STEPS = [
  {
    title: "Enter your rank",
    body: "Your KCET rank and category, and whether you are a Kalyana-Karnataka 371(j) candidate.",
  },
  {
    title: "See every round",
    body: "Every college and course that rank reached in round 1, 2 and 3, for any year KEA published.",
  },
  {
    title: "Check the trend",
    body: `Open any college for its cut-offs from ${FIRST_YEAR} to ${LATEST_YEAR}, round by round, exactly as KEA printed them.`,
  },
] as const;

const fromRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

export function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-[#1A1A1A] py-32">
      {/* Grid break: the step count, bigger than the section, cut off at the edge. */}
      <p
        aria-hidden
        className="watermark -bottom-[0.12em] -right-[0.08em] -z-10 text-[clamp(14rem,34vw,32rem)] text-white/[0.03]"
      >
        03
      </p>

      <div className="wrap">
        <div className="grid-editorial gap-y-16">
          <Reveal className="col-span-4 md:col-span-3 xl:col-span-5">
            <h2 className="text-[clamp(3rem,5vw,5rem)] leading-[0.95] tracking-[-0.04em]">
              <span className="block font-light text-white/15">How it</span>
              <span className="block font-bold text-white">works.</span>
            </h2>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-[#9B9B9B]">
              Three steps from your rank to a college list you can trust.
            </p>
          </Reveal>

          <motion.ol
            variants={revealGroup(0.15)}
            initial={reduceMotion ? false : "hidden"}
            whileInView="show"
            viewport={VIEWPORT}
            className="col-span-4 md:col-span-5 xl:col-span-7"
          >
            {STEPS.map((step, i) => {
              const last = i === STEPS.length - 1;
              return (
                <motion.li key={step.title} variants={fromRight} className="group relative">
                  <div
                    className={
                      last
                        ? "pl-6"
                        : "border-l border-dashed border-white/10 pb-12 pl-6 transition-colors duration-200 group-hover:border-[#CC3D2E]"
                    }
                  >
                    <span
                      aria-hidden
                      className="absolute -left-[3px] top-1 size-[7px] rounded-full bg-white/20 transition-colors duration-200 group-hover:bg-[#CC3D2E]"
                    />
                    <p className="font-mono text-[11px] tracking-[0.1em] text-[#CC3D2E]/80">
                      {String(i + 1).padStart(2, "0")} ·
                    </p>
                    <h3 className="mt-3 text-[18px] font-medium text-white transition-colors duration-200 group-hover:text-[#CC3D2E]">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md text-[14px] leading-relaxed text-[#6B6B6B]">
                      {step.body}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
