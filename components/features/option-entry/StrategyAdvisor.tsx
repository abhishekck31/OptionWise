"use client";

import { AlertTriangle, HelpCircle, ShieldCheck } from "lucide-react";
import type { Category, OptionEntry } from "@/types";

export interface StrategyAdvisorProps {
  optionList: OptionEntry[];
  candidateRank: number;
  category: Category;
}

/**
 * Reads the shape of the list back to the student.
 *
 * What actually costs people seats in KEA counselling is a list with no safe
 * options at the bottom, so that is the first thing checked here.
 */
export function StrategyAdvisor({
  optionList,
  candidateRank,
  category,
}: StrategyAdvisorProps) {
  const safeCount = optionList.filter((e) => e.tier === "Safe").length;
  const targetCount = optionList.filter((e) => e.tier === "Moderate").length;
  const reachCount = optionList.filter((e) => e.tier === "Aspirational").length;

  let verdict = "Balanced list";
  let verdictColor = "text-emerald-400";
  if (optionList.length === 0) {
    verdict = "Nothing on the list yet";
    verdictColor = "text-[#9B9B9B]";
  } else if (safeCount === 0) {
    verdict = "Risky, no safe seats";
    verdictColor = "text-red-400";
  } else if (safeCount < 3) {
    verdict = "Add two more safe picks";
    verdictColor = "text-amber-400";
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white border border-white/8 rounded-xl p-5">
        <span className="text-xs text-[#6B6B6B] block mb-1">Options chosen</span>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold text-[#1A1A1A]">
            {optionList.length}
          </span>
          <span className="text-xs text-[#9B9B9B]">aim for 20&ndash;30</span>
        </div>
      </div>

      <div className="bg-white border border-white/8 rounded-xl p-5">
        <span className="text-xs text-[#6B6B6B] block mb-1">Safety check</span>
        <div
          className={`text-sm font-semibold ${verdictColor} flex items-center gap-1.5 mt-1`}
        >
          {safeCount >= 3 ? (
            <ShieldCheck className="w-4 h-4" aria-hidden />
          ) : (
            <AlertTriangle className="w-4 h-4" aria-hidden />
          )}
          <span>{verdict}</span>
        </div>
      </div>

      <div className="bg-white border border-white/8 rounded-xl p-5">
        <span className="text-xs text-[#6B6B6B] block mb-1">Mix</span>
        <div className="flex items-center gap-2 mt-1 font-mono text-xs flex-wrap">
          <span className="text-[#CC3D2E]">{reachCount} aspirational</span>
          <span className="text-[#9B9B9B]">&bull;</span>
          <span className="text-amber-400">{targetCount} moderate</span>
          <span className="text-[#9B9B9B]">&bull;</span>
          <span className="text-emerald-400">{safeCount} safe</span>
        </div>
      </div>

      <div className="bg-white border border-white/8 rounded-xl p-5">
        <span className="text-xs text-[#6B6B6B] block mb-1">Ordering for</span>
        <div className="font-mono text-xl font-bold text-[#CC3D2E] mt-0.5">
          #{candidateRank.toLocaleString("en-IN")}{" "}
          <span className="text-sm text-[#6B6B6B]">({category})</span>
        </div>
      </div>
    </div>
  );
}

/** The one rule about option entry that costs students seats when missed. */
export function OptionEntryGuidance() {
  return (
    <div className="mt-8 p-5 rounded-xl bg-white border border-white/8 flex items-start gap-3.5">
      <HelpCircle
        className="w-5 h-5 text-[#CC3D2E] flex-shrink-0 mt-0.5"
        aria-hidden
      />
      <div className="text-xs leading-relaxed text-[#6B6B6B]">
        <span className="font-semibold text-[#1A1A1A] block mb-1">
          Put them in the order you actually want them
        </span>
        Order by where you genuinely want to study, not by how likely each one
        is. If you are allotted your third choice in round 1, everything below
        it is dropped for round 2 &mdash; so an ambitious college placed fourth
        can never come back to you. Keep the colleges you want most in the first
        few slots, even if they look out of reach.
      </div>
    </div>
  );
}

export default StrategyAdvisor;
