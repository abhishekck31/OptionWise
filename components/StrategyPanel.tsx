"use client";

import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { generateOptionEntryStrategy } from "@/lib/predict";
import { useKCETHydration, useOptionList } from "@/hooks/useKCETStore";
import { cn } from "@/lib/utils";

const TIER_COLOR = {
  Aspirational: "#CC3D2E",
  Moderate: "#F59E0B",
  Safe: "#10B981",
} as const;

const TIPS = [
  {
    id: "order",
    title: "How to order your options",
    body: "KEA walks your list from the top and gives you the first seat you qualify for, so order it by what you actually want, not by what you think you will get. Reaches go first — an unreachable option costs you nothing but the line it sits on. Put the safe seats last, and make sure there are enough of them that the list cannot run out.",
  },
  {
    id: "chance",
    title: "Understanding chance %",
    body: "The percentage compares your rank with last year's closing rank for that seat. Comfortably inside it reads as high; sitting right on the line reads as a coin toss. It is a read on one published number, not a probability — a seat matrix change or a heavier year moves the real cutoff.",
  },
  {
    id: "counselling",
    title: "What happens during counselling",
    body: "KEA runs three rounds. After each one you choose to keep the seat, upgrade in the next round, or exit. A seat you accept and hold blocks you from the rounds after it, so read the round rules on the KEA site before you confirm anything.",
  },
];

export function StrategyPanel() {
  const hydrated = useKCETHydration();
  const optionList = useOptionList();

  const strategy = useMemo(
    () => generateOptionEntryStrategy(optionList),
    [optionList]
  );

  const distribution = useMemo(
    () =>
      (
        [
          ["Aspirational", strategy.aspirational.length],
          ["Moderate", strategy.moderate.length],
          ["Safe", strategy.safe.length],
        ] as const
      )
        .filter(([, count]) => count > 0)
        .map(([name, value]) => ({ name, value })),
    [strategy]
  );

  const packages = useMemo(
    () =>
      optionList.slice(0, 5).map((entry) => ({
        name: entry.prediction.college.shortName,
        package: entry.prediction.avgPackage,
      })),
    [optionList]
  );

  if (!hydrated) {
    return (
      <div className="h-64 animate-shimmer rounded-xl border border-[#E5E0D8]" />
    );
  }

  const tone =
    optionList.length === 0
      ? "border-[#E5E0D8] bg-white text-[#6B6B6B]"
      : strategy.isBalanced
        ? "border-[#B8DFC9] bg-[#E8F5EE]] text-[#1F7A4A]"
        : strategy.safe.length < 3
          ? "border-[#F5C4BF] bg-[#FEE8E6]] text-[#CC3D2E]"
          : "border-[#F5D9A0] bg-[#FEF3E2]] text-[#B45309]";

  const AdviceIcon =
    strategy.isBalanced && optionList.length > 0
      ? CheckCircle2
      : optionList.length === 0
        ? Info
        : AlertTriangle;

  return (
    <div className="space-y-4 lg:sticky lg:top-20">
      <h2 className="text-sm font-medium text-[#1A1A1A]">Strategy Analysis</h2>

      {distribution.length > 0 && (
        <div className="rounded-xl border border-[#E5E0D8] bg-white p-5">
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={34}
                  outerRadius={58}
                  paddingAngle={2}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {distribution.map((slice) => (
                    <Cell
                      key={slice.name}
                      fill={TIER_COLOR[slice.name as keyof typeof TIER_COLOR]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-xs text-[#6B6B6B]">
            {strategy.aspirational.length} Aspirational, {strategy.moderate.length}{" "}
            Moderate, {strategy.safe.length} Safe
          </p>
        </div>
      )}

      <div className={cn("flex items-start gap-2.5 rounded-xl border p-4", tone)}>
        <AdviceIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p className="text-xs leading-relaxed">{strategy.advice}</p>
      </div>

      <div className="rounded-xl border border-[#E5E0D8] bg-white px-4">
        <Accordion type="single" collapsible defaultValue="order">
          {TIPS.map((tip) => (
            <AccordionItem key={tip.id} value={tip.id}>
              <AccordionTrigger>{tip.title}</AccordionTrigger>
              <AccordionContent>{tip.body}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {packages.length > 0 && (
        <div className="rounded-xl border border-[#E5E0D8] bg-white p-5">
          <p className="text-xs text-[#6B6B6B]">
            Average package, top {packages.length}
          </p>
          <p className="mt-0.5 text-[11px] text-[#9B9B9B]">
            Indicative — not published by KEA
          </p>
          <div className="mt-3" style={{ height: packages.length * 34 + 20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={packages}
                layout="vertical"
                margin={{ top: 0, right: 28, bottom: 0, left: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={92}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6B6B6B", fontSize: 11 }}
                />
                <Bar
                  dataKey="package"
                  fill="#CC3D2E"
                  radius={[0, 4, 4, 0]}
                  barSize={14}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default StrategyPanel;
