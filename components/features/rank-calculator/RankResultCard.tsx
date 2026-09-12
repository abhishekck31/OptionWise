"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import ScoreBreakdown from "./ScoreBreakdown";
import { percentileFor, standingFor } from "@/lib/kcet-formula";
import type { Category, RankEstimate } from "@/types";

const CONFIDENCE_STYLES: Record<RankEstimate["confidence"], string> = {
  High: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Low: "bg-[#F5E8E6] text-[#CC3D2E] border-[#E8C4BF]",
};

export interface RankResultCardProps {
  estimate: RankEstimate | null;
  category: Category;
  showBreakdown?: boolean;
  onConfirm: () => void;
}

/** The scorecard that sits beside the marks form and answers the question. */
export function RankResultCard({
  estimate,
  category,
  showBreakdown = true,
  onConfirm,
}: RankResultCardProps) {
  return (
    <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6 self-start">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-white/8 rounded-xl p-8 relative overflow-hidden"
      >
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          aria-hidden
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="text-xs font-medium tracking-wider text-[#CC3D2E]">
              Your predicted rank
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-transparent border border-[#E5E0D8] text-[#6B6B6B]">
              {category}
            </span>
          </div>

          <div className="my-6">
            <span className="text-xs text-[#6B6B6B] block mb-1">
              Estimated engineering rank
            </span>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-[#1A1A1A] rank-glow">
                #{estimate ? estimate.estimatedRank.toLocaleString("en-IN") : "---"}
              </span>
            </div>

            {estimate && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xs text-[#6B6B6B]">Likely between</span>
                <span className="font-mono text-xs text-[#CC3D2E] font-medium">
                  #{estimate.minRank.toLocaleString("en-IN")} &ndash; #
                  {estimate.maxRank.toLocaleString("en-IN")}
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${CONFIDENCE_STYLES[estimate.confidence]}`}
                >
                  {estimate.confidence} confidence
                </span>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-lg bg-[#F0EDE8] border border-white/8 mb-6">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#6B6B6B]">State percentile</span>
              <span className="font-mono font-semibold text-emerald-400">
                {estimate ? percentileFor(estimate.estimatedRank) : "--"}%
              </span>
            </div>
            <div className="text-xs text-[#1A1A1A] font-medium">
              {estimate ? standingFor(estimate.estimatedRank) : null}
            </div>
          </div>

          {showBreakdown && <ScoreBreakdown estimate={estimate} />}

          <div className="space-y-2.5">
            <button
              onClick={onConfirm}
              className="w-full bg-[#CC3D2E] hover:bg-[#B5351F] text-white font-medium rounded-lg px-4 py-2.5 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              <Sparkles className="w-4 h-4 text-[#CC3D2E]" aria-hidden />
              <span>See colleges for this rank</span>
            </button>

            <p className="text-[11px] text-center text-[#9B9B9B] mt-2">
              Checked against closing ranks at RVCE, BMSCE, MSRIT, PES and every
              other college in the dataset.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default RankResultCard;
