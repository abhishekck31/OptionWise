"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookmarkCheck, BookmarkPlus, Briefcase, MapPin } from "lucide-react";
import { ROUNDS } from "@/types";
import type { PredictionResult, Tier } from "@/types";

const ACCENT: Record<Tier, string> = {
  Safe: "#10b981",
  Moderate: "#B45309",
  Aspirational: "#CC3D2E",
};

const BADGE: Record<Tier, string> = {
  Safe: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Moderate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Aspirational: "bg-[#F5E8E6] text-[#CC3D2E] border-[#E8C4BF]",
};

const GAUGE_CIRCUMFERENCE = 113;

export interface CollegeCardProps {
  prediction: PredictionResult;
  index?: number;
  isSaved: boolean;
  onSave: (prediction: PredictionResult) => void;
}

export function CollegeCard({
  prediction,
  index = 0,
  isSaved,
  onSave,
}: CollegeCardProps) {
  const { college } = prediction;
  const accentColor = ACCENT[prediction.tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      className="bg-white border border-white/8 hover:border-white/15 rounded-xl p-6 transition-colors flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-transparent border border-white/8 text-[#1A1A1A]">
                {college.kea_code}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-transparent border border-white/8 text-[#6B6B6B]">
                {college.affiliation}
              </span>
              {college.nirfRank !== null && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F5E8E6] text-[#CC3D2E] border border-[#E8C4BF]">
                  NIRF #{college.nirfRank}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-[#1A1A1A] text-base leading-snug tracking-tight">
              <Link
                href={`/college/${college.id}`}
                className="rounded-sm outline-none transition-colors hover:text-[#B5351F] focus-visible:text-[#CC3D2E]"
              >
                {college.name}
              </Link>
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#9B9B9B]" aria-hidden />
              <span>{college.city}</span>
              <span className="text-[#9B9B9B]">&bull;</span>
              <span>{college.type}</span>
            </div>
          </div>

          <div
            className="relative flex-shrink-0 w-14 h-14 flex items-center justify-center"
            role="img"
            aria-label={`${prediction.chancePercent} percent chance of a seat`}
          >
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 44 44" aria-hidden>
              <circle cx="22" cy="22" r="18" stroke="#F0EDE8" strokeWidth="3" fill="transparent" />
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke={accentColor}
                strokeWidth="3.5"
                strokeDasharray={GAUGE_CIRCUMFERENCE}
                strokeDashoffset={
                  GAUGE_CIRCUMFERENCE -
                  (GAUGE_CIRCUMFERENCE * prediction.chancePercent) / 100
                }
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-xs font-bold text-[#1A1A1A]">
                {prediction.chancePercent}%
              </span>
              <span className="text-[8px] text-[#6B6B6B]">CHANCE</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#F0EDE8] border border-white/8 mb-4">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-[#1A1A1A] tracking-tight">
              {prediction.branchName}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${BADGE[prediction.tier]}`}
            >
              {prediction.tier.toUpperCase()}
            </span>
          </div>
          <div className="text-[11px] text-[#6B6B6B] flex items-center justify-between mt-2 pt-2 border-t border-white/5">
            <span>Average package</span>
            <span className="font-mono font-semibold text-[#1A1A1A]">
              {prediction.avgPackage} LPA
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-black/40 border border-white/5 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#9B9B9B]">
              Closed in {ROUNDS[prediction.round]}
            </span>
            <span className="font-mono text-sm font-semibold text-[#CC3D2E]">
              #{prediction.closingRank.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#9B9B9B] mt-1.5 pt-1.5 border-t border-white/5">
            <span>Your rank</span>
            <span className="font-mono text-[#6B6B6B]">
              #{prediction.yourRank.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="text-xs text-[#6B6B6B] mb-4 space-y-1">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#9B9B9B] shrink-0" aria-hidden />
            <span className="truncate">
              Recruiters: {college.topRecruiters.slice(0, 4).join(", ")}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#9B9B9B] pt-1">
            <span>KEA yearly fee</span>
            <span className="font-mono text-[#6B6B6B]">
              &#8377;{college.annualFee.toLocaleString("en-IN")}/yr
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onSave(prediction)}
        aria-pressed={isSaved}
        className={`w-full py-2.5 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 border ${
          isSaved
            ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/40"
            : "bg-transparent hover:bg-[#F0EDE8] text-[#1A1A1A] border-[#E5E0D8] hover:border-[#E8C4BF]"
        }`}
      >
        {isSaved ? (
          <>
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden />
            <span>On your option list</span>
          </>
        ) : (
          <>
            <BookmarkPlus className="w-3.5 h-3.5 text-[#CC3D2E]" aria-hidden />
            <span>Add to option list</span>
          </>
        )}
      </button>
    </motion.div>
  );
}

export default CollegeCard;
