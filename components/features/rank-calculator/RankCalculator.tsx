"use client";

import { useState, useEffect } from "react";
import { Calculator, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { estimateRank } from "@/lib/kcet-formula";
import { CATEGORY_OPTIONS } from "@/lib/data/categories";
import RankResultCard from "./RankResultCard";
import type { Category, Gender, RankEstimate, StudentInput } from "@/types";

interface RankCalculatorProps {
  onEstimate?: (input: StudentInput, estimate: RankEstimate) => void;
  onRankCalculated?: (rank: number, category?: Category) => void;
  initialRank?: number;
  initialCategory?: Category;
  /** Not collected on this screen; carried through from the store. */
  initialGender?: Gender;
}

export default function RankCalculator({
  onEstimate,
  onRankCalculated,
  initialRank = 3500,
  initialCategory = "GM",
  initialGender = "M",
}: RankCalculatorProps) {
  const router = useRouter();

  const [calcMode, setCalcMode] = useState<"marks" | "direct">("marks");

  // Marks inputs
  const [boardMarks, setBoardMarks] = useState({
    physics: 92,
    chemistry: 94,
    math: 95,
  });

  const [kcetMarks, setKcetMarks] = useState({
    physics: 44,
    chemistry: 46,
    math: 48,
  });

  // Direct rank input
  const [directRank, setDirectRank] = useState<number>(initialRank > 0 ? initialRank : 3500);

  // Category
  const [category, setCategory] = useState<Category>(initialCategory);

  // Special quotas
  const [hasHkQuota, setHasHkQuota] = useState(false);
  const [hasRuralQuota, setHasRuralQuota] = useState(false);
  const [hasKannadaQuota, setHasKannadaQuota] = useState(false);

  // Calculated state
  const [estimate, setEstimate] = useState<RankEstimate | null>(null);

  // Calculate whenever marks change
  useEffect(() => {
    // The KCET paper is entered per subject but the model carries one total.
    const input: StudentInput = {
      physicsMarks: boardMarks.physics,
      chemistryMarks: boardMarks.chemistry,
      mathsMarks: boardMarks.math,
      kcetScore: kcetMarks.physics + kcetMarks.chemistry + kcetMarks.math,
      category,
      gender: initialGender,
      isHKRegion: hasHkQuota,
    };

    if (calcMode === "marks") {
      const result = estimateRank(input);
      setEstimate(result);
      if (onEstimate) onEstimate(input, result);
      if (onRankCalculated) onRankCalculated(result.estimatedRank, category);
    } else {
      const rank = Math.max(1, Math.min(250000, directRank || 1));
      // A rank typed in directly needs no score behind it, so the score
      // fields stay at zero and the breakdown is hidden in this mode.
      const typedIn: RankEstimate = {
        minRank: Math.max(1, rank - 400),
        maxRank: rank + 400,
        estimatedRank: rank,
        confidence: "High",
        boardPercent: 0,
        kcetPercent: 0,
        finalScore: 0,
      };
      setEstimate(typedIn);
      if (onEstimate) onEstimate(input, typedIn);
      if (onRankCalculated) onRankCalculated(rank, category);
    }
    // onEstimate is a store action with a stable identity, so it is
    // deliberately left out: including it would re-run this on every render
    // if a caller ever passed an inline function.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardMarks, kcetMarks, directRank, calcMode, category, hasHkQuota, initialGender]);

// Pure lightweight canvas celebration burst
function triggerCelebration() {
  if (typeof window === "undefined") return;
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#CC3D2E", "#E8C4BF", "#3b82f6", "#10b981", "#B45309"];
  const particles = Array.from({ length: 45 }, () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.7,
    vx: (Math.random() - 0.5) * 12,
    vy: -(Math.random() * 10 + 6),
    size: Math.random() * 6 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 1,
    rotation: Math.random() * 360,
    vRot: (Math.random() - 0.5) * 10,
  }));

  let frame = 0;
  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.alpha -= 0.015;
      p.rotation += p.vRot;

      if (p.alpha > 0) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    frame++;
    if (active && frame < 120) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(animate);
}

  const handlePreset = (preset: "topper" | "competitive" | "average") => {
    if (preset === "topper") {
      setBoardMarks({ physics: 98, chemistry: 97, math: 99 });
      setKcetMarks({ physics: 54, chemistry: 53, math: 56 });
    } else if (preset === "competitive") {
      setBoardMarks({ physics: 90, chemistry: 88, math: 92 });
      setKcetMarks({ physics: 42, chemistry: 44, math: 46 });
    } else {
      setBoardMarks({ physics: 78, chemistry: 80, math: 75 });
      setKcetMarks({ physics: 32, chemistry: 35, math: 34 });
    }
  };

  return (
    <section id="rank-calculator" className="py-16 md:py-24 max-w-[1200px] mx-auto px-6 sm:px-8">
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#CC3D2E] mb-2">
          <Calculator className="w-4 h-4" />
          <span>Precision Prediction Engine</span>
        </div>
        <h2 className="text-3xl font-light tracking-tight text-[#1A1A1A]">
          KCET Rank Calculator & Score Breakdown
        </h2>
        <p className="text-sm text-[#6B6B6B] mt-1 max-w-2xl font-normal">
          Calculates engineering rank using the official 50% Board PCM + 50% KCET PCM formula normalized against 260,000+ candidates.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div className="inline-flex p-1 rounded-lg bg-white border border-white/8">
          <button
            onClick={() => setCalcMode("marks")}
            className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${
              calcMode === "marks"
                ? "bg-[#CC3D2E] text-white shadow-sm"
                : "text-[#6B6B6B] hover:text-[#1A1A1A]"
            }`}
          >
            Calculate from Marks (50:50)
          </button>
          <button
            onClick={() => setCalcMode("direct")}
            className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${
              calcMode === "direct"
                ? "bg-[#CC3D2E] text-white shadow-sm"
                : "text-[#6B6B6B] hover:text-[#1A1A1A]"
            }`}
          >
            Direct Rank Entry
          </button>
        </div>

        {calcMode === "marks" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9B9B9B] hidden sm:inline">Presets:</span>
            <button
              onClick={() => handlePreset("topper")}
              className="px-2.5 py-1 text-xs rounded-lg bg-transparent hover:bg-[#F0EDE8] border border-white/8 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              Topper (98%)
            </button>
            <button
              onClick={() => handlePreset("competitive")}
              className="px-2.5 py-1 text-xs rounded-lg bg-transparent hover:bg-[#F0EDE8] border border-white/8 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              Competitive (88%)
            </button>
            <button
              onClick={() => handlePreset("average")}
              className="px-2.5 py-1 text-xs rounded-lg bg-transparent hover:bg-[#F0EDE8] border border-white/8 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              Average (75%)
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Inputs Form */}
        <div className="lg:col-span-7 space-y-6">
          {calcMode === "marks" ? (
            <>
              {/* Board Marks Card */}
              <div className="bg-white border border-white/8 rounded-xl p-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8] mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1A1A] tracking-tight flex items-center gap-2">
                      <span>Class 12 / PUC Board Marks (PCM)</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F5E8E6] text-[#CC3D2E] border border-[#E8C4BF]">
                        50% Weightage
                      </span>
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-0.5">
                      Theory + Practical marks out of 100 for each subject (Total 300)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-semibold text-[#1A1A1A]">
                      {boardMarks.physics + boardMarks.chemistry + boardMarks.math}
                    </span>
                    <span className="text-xs text-[#9B9B9B]"> / 300</span>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Physics */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[#6B6B6B]">Physics</span>
                      <span className="font-mono font-medium text-[#1A1A1A]">{boardMarks.physics} / 100</span>
                    </div>
                    <input
                      type="range"
                      min="35"
                      max="100"
                      value={boardMarks.physics}
                      onChange={(e) => setBoardMarks({ ...boardMarks, physics: Number(e.target.value) })}
                    />
                  </div>

                  {/* Chemistry */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[#6B6B6B]">Chemistry</span>
                      <span className="font-mono font-medium text-[#1A1A1A]">{boardMarks.chemistry} / 100</span>
                    </div>
                    <input
                      type="range"
                      min="35"
                      max="100"
                      value={boardMarks.chemistry}
                      onChange={(e) => setBoardMarks({ ...boardMarks, chemistry: Number(e.target.value) })}
                    />
                  </div>

                  {/* Math */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[#6B6B6B]">Mathematics</span>
                      <span className="font-mono font-medium text-[#1A1A1A]">{boardMarks.math} / 100</span>
                    </div>
                    <input
                      type="range"
                      min="35"
                      max="100"
                      value={boardMarks.math}
                      onChange={(e) => setBoardMarks({ ...boardMarks, math: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* KCET Marks Card */}
              <div className="bg-white border border-white/8 rounded-xl p-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1A1A] tracking-tight flex items-center gap-2">
                      <span>KCET Exam Marks (PCM)</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F5E8E6] text-[#CC3D2E] border border-[#E8C4BF]">
                        50% Weightage
                      </span>
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-0.5">
                      KEA entrance marks out of 60 per subject (Total 180)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-semibold text-[#CC3D2E]">
                      {kcetMarks.physics + kcetMarks.chemistry + kcetMarks.math}
                    </span>
                    <span className="text-xs text-[#9B9B9B]"> / 180</span>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Physics */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[#6B6B6B]">Physics</span>
                      <span className="font-mono font-medium text-[#1A1A1A]">{kcetMarks.physics} / 60</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={kcetMarks.physics}
                      onChange={(e) => setKcetMarks({ ...kcetMarks, physics: Number(e.target.value) })}
                    />
                  </div>

                  {/* Chemistry */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[#6B6B6B]">Chemistry</span>
                      <span className="font-mono font-medium text-[#1A1A1A]">{kcetMarks.chemistry} / 60</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={kcetMarks.chemistry}
                      onChange={(e) => setKcetMarks({ ...kcetMarks, chemistry: Number(e.target.value) })}
                    />
                  </div>

                  {/* Math */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[#6B6B6B]">Mathematics</span>
                      <span className="font-mono font-medium text-[#1A1A1A]">{kcetMarks.math} / 60</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={kcetMarks.math}
                      onChange={(e) => setKcetMarks({ ...kcetMarks, math: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Direct Rank Entry Card */
            <div className="bg-white border border-white/8 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-[#1A1A1A] tracking-tight mb-2">
                Enter Official or Expected KCET Rank
              </h3>
              <p className="text-xs text-[#6B6B6B] mb-6">
                If you already received your KEA rank card or want to test hypothetical rank cutoffs directly.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#6B6B6B] mb-2 uppercase tracking-wider">
                  KCET Engineering Rank
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="265000"
                    value={directRank}
                    onChange={(e) => setDirectRank(Number(e.target.value))}
                    className="w-full bg-[#F0EDE8] border border-[#E5E0D8] focus:border-[#E8C4BF] focus:ring-1 focus:ring-[#CC3D2E]/20 rounded-lg h-12 text-lg font-mono px-4 text-[#1A1A1A] transition-colors outline-none"
                    placeholder="e.g. 2450"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#9B9B9B]">
                    RANK
                  </span>
                </div>
              </div>

              {/* Slider for quick adjusting */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-[#6B6B6B] mb-2">
                  <span>Quick Rank Slider</span>
                  <span className="font-mono text-[#CC3D2E]">#{directRank.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="120000"
                  step="50"
                  value={directRank}
                  onChange={(e) => setDirectRank(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] font-mono text-[#9B9B9B] mt-1">
                  <span>#50 (RVCE CSE)</span>
                  <span>#25,000</span>
                  <span>#60,000</span>
                  <span>#120,000</span>
                </div>
              </div>
            </div>
          )}

          {/* Category & Reservation Settings */}
          <div className="bg-white border border-white/8 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-[#1A1A1A] tracking-tight mb-4 flex items-center justify-between">
              <span>KEA Category & Reservation Quota</span>
              <span className="text-[10px] font-mono text-[#CC3D2E]">Impacts Cutoff Ranks</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#6B6B6B] mb-2">Select Your Reservation Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-[#F0EDE8] border border-[#E5E0D8] focus:border-[#E8C4BF] focus:ring-1 focus:ring-[#CC3D2E]/20 rounded-lg h-11 text-sm px-3 text-[#1A1A1A] transition-colors outline-none appearance-none cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-white text-[#1A1A1A]">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#6B6B6B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Special Quotas */}
              <div className="pt-2 border-t border-white/8">
                <span className="text-xs text-[#6B6B6B] block mb-2.5 font-medium">Special Quota Claims:</span>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setHasHkQuota(!hasHkQuota)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      hasHkQuota
                        ? "bg-[#CC3D2E]/20 border-[#E8C4BF] text-[#CC3D2E]"
                        : "bg-transparent border-white/8 text-[#6B6B6B] hover:bg-[#F0EDE8]"
                    }`}
                  >
                    Hyderabad-Karnataka (Article 371-J)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasRuralQuota(!hasRuralQuota)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      hasRuralQuota
                        ? "bg-[#CC3D2E]/20 border-[#E8C4BF] text-[#CC3D2E]"
                        : "bg-transparent border-white/8 text-[#6B6B6B] hover:bg-[#F0EDE8]"
                    }`}
                  >
                    Rural Quota
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasKannadaQuota(!hasKannadaQuota)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      hasKannadaQuota
                        ? "bg-[#CC3D2E]/20 border-[#E8C4BF] text-[#CC3D2E]"
                        : "bg-transparent border-white/8 text-[#6B6B6B] hover:bg-[#F0EDE8]"
                    }`}
                  >
                    Kannada Medium Quota
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <RankResultCard
          estimate={estimate}
          category={category}
          showBreakdown={calcMode === "marks"}
          onConfirm={() => {
            triggerCelebration();
            router.push("/predict/college");
          }}
        />
      </div>
    </section>
  );
}
