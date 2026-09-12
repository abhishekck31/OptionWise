"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Layers, Sparkles } from "lucide-react";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import { COLLEGES } from "@/lib/data/colleges";
import { PREDICTABLE_CATEGORIES } from "@/lib/data/categories";
import { useKCETHydration, useRank } from "@/hooks/useKCETStore";

const COLLEGE_COUNT = COLLEGES.length;
const BRANCH_COUNT = COLLEGES.reduce(
  (total, college) => total + college.availableBranches.length,
  0
);

export function HeroSection() {
  const candidateRank = useRank();
  const hydrated = useKCETHydration();
  const hasRank = hydrated && candidateRank > 0;

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-24 border-b border-white/8 hero-grid-pattern">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] max-w-full rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #CC3D2E 0%, #E8C4BF 50%, transparent 70%)",
          opacity: 0.15,
          filter: "blur(120px)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/8 text-xs font-medium text-[#CC3D2E] mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" aria-hidden />
            <span>Built on 2024 and 2025 KEA closing ranks</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-[#1A1A1A] leading-[1.1] mb-6">
            Find out which colleges your{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent font-normal">
              KCET rank actually reaches
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#6B6B6B] max-w-2xl mx-auto mb-10 leading-relaxed">
            Enter your board and KCET marks to get a predicted rank, see every
            college and branch that rank has cleared in past rounds, then put
            them in the right order before option entry closes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
            <Link
              href="/predict/rank"
              className="w-full sm:w-auto bg-[#CC3D2E] hover:bg-[#B5351F] text-white font-medium rounded-lg px-6 py-3 transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-[#CC3D2E]" aria-hidden />
              <span>
                {hasRank
                  ? `Update rank #${candidateRank.toLocaleString("en-IN")}`
                  : "Calculate my rank"}
              </span>
              <ArrowRight
                className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>

            <Link
              href="/predict/college"
              className="w-full sm:w-auto bg-transparent hover:bg-[#F0EDE8] border border-[#E5E0D8] text-[#1A1A1A] font-medium rounded-lg px-5 py-3 transition-colors flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-[#6B6B6B]" aria-hidden />
              <span>Browse colleges by cutoff</span>
            </Link>
          </div>

          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-white/8">
            <div className="p-3 text-center">
              <dd className="font-mono text-xl sm:text-2xl font-semibold text-[#1A1A1A]">
                50:50
              </dd>
              <dt className="text-xs text-[#6B6B6B] mt-0.5">
                Board and KCET, weighed equally
              </dt>
            </div>

            <div className="p-3 text-center">
              <dd className="font-mono text-xl sm:text-2xl font-semibold text-[#1A1A1A]">
                <AnimatedCounter value={COLLEGE_COUNT} />
              </dd>
              <dt className="text-xs text-[#6B6B6B] mt-0.5">
                Karnataka colleges
              </dt>
            </div>

            <div className="p-3 text-center">
              <dd className="font-mono text-xl sm:text-2xl font-semibold text-emerald-400">
                <AnimatedCounter value={BRANCH_COUNT} />
              </dd>
              <dt className="text-xs text-[#6B6B6B] mt-0.5">
                Branches with round-wise cutoffs
              </dt>
            </div>

            <div className="p-3 text-center">
              <dd className="font-mono text-xl sm:text-2xl font-semibold text-[#CC3D2E]">
                <AnimatedCounter value={PREDICTABLE_CATEGORIES.length} />
              </dd>
              <dt className="text-xs text-[#6B6B6B] mt-0.5">
                Categories, GM to ST
              </dt>
            </div>
          </dl>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
