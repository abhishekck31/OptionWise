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

const DM_MONO = "var(--font-dm-mono), monospace";

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
      <div className="h-64 animate-shimmer rounded-2xl border border-[#E5E0D8]" />
    );
  }

  const tone =
    optionList.length === 0
      ? "border-[#E5E0D8] bg-white text-[#6B6B6B]"
      : strategy.isBalanced
        ? "border-[#B8DFC9] bg-[#E8F5EE] text-[#1F7A4A]"
        : strategy.safe.length < 3
          ? "border-[#F5C4BF] bg-[#FEE8E6] text-[#A02E1A]"
          : "border-[#F5D9A0] bg-[#FEF3E2] text-[#8A4B0F]";

  const AdviceIcon =
    strategy.isBalanced && optionList.length > 0
      ? CheckCircle2
      : optionList.length === 0
        ? Info
        : AlertTriangle;

  return (
    <div className="space-y-4 lg:sticky lg:top-20">
      <h2 className="type-h3">Strategy</h2>

      {distribution.length > 0 && (
        <div className="card">
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={34}
                  outerRadius={58}
                  paddingAngle={distribution.length > 1 ? 2 : 0}
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
          <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-[#F0EDE8] pt-4 text-center">
            {(
              [
                ["Aspirational", strategy.aspirational.length],
                ["Moderate", strategy.moderate.length],
                ["Safe", strategy.safe.length],
              ] as const
            ).map(([name, count]) => (
              <div key={name}>
                <dd className="font-mono text-[15px] font-medium text-[#1A1A1A]">{count}</dd>
                <dt className="mt-1 flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#9B9B9B]">
                  <span aria-hidden className="size-1.5 rounded-full" style={{ background: TIER_COLOR[name] }} />
                  {name === "Aspirational" ? "Reach" : name}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className={cn("flex items-start gap-3 rounded-2xl border px-5 py-4", tone)}>
        <AdviceIcon className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden />
        <p className="text-[13px] leading-[1.6]">{strategy.advice}</p>
      </div>

      <div className="rounded-2xl border border-[#E5E0D8] bg-white px-5">
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
        <div className="card">
          <p className="type-label">
            Average package, top {packages.length}
          </p>
          <p className="mt-1 text-[12px] text-[#9B9B9B]">
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
                  tick={{ fill: "#6B6B6B", fontSize: 12 }}
                />
                <Bar
                  dataKey="package"
                  fill="#1A1A1A"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                  isAnimationActive={false}
                  label={{ position: "right", fill: "#6B6B6B", fontSize: 11, fontFamily: DM_MONO, formatter: (v: unknown) => `₹${v}L` }}
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
