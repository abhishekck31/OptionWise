"use client";

import type { RankEstimate } from "@/types";

/**
 * Shows how the two halves of the 50:50 rule add up.
 * Each side is halved before being summed, so the parts read as points
 * out of 100 rather than as two percentages that look like they clash.
 */
export function ScoreBreakdown({ estimate }: { estimate: RankEstimate | null }) {
  if (!estimate) return null;

  const boardPoints = (estimate.boardPercent * 0.5).toFixed(2);
  const kcetPoints = (estimate.kcetPercent * 0.5).toFixed(2);

  return (
    <div className="space-y-3 pt-4 border-t border-white/8 mb-6 text-xs">
      <div className="flex justify-between items-center text-[#6B6B6B]">
        <span>Board marks, halved</span>
        <span className="font-mono text-[#1A1A1A]">
          {estimate.boardPercent}% ({boardPoints} pts)
        </span>
      </div>

      <div className="flex justify-between items-center text-[#6B6B6B]">
        <span>KCET score, halved</span>
        <span className="font-mono text-[#1A1A1A]">
          {estimate.kcetPercent}% ({kcetPoints} pts)
        </span>
      </div>

      <div className="flex justify-between items-center text-[#1A1A1A] font-semibold pt-2 border-t border-white/8">
        <span>Composite score</span>
        <span className="font-mono text-sm text-[#CC3D2E]">
          {estimate.finalScore}% / 100
        </span>
      </div>
    </div>
  );
}

export default ScoreBreakdown;
