"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChanceBadge from "@/components/shared/ChanceBadge";
import RankTrendChart from "./RankTrendChart";
import CutoffTable from "./CutoffTable";
import { BRANCHES } from "@/types";
import type {
  Branch,
  Category,
  CutoffHistoryPoint,
  PredictionResult,
} from "@/types";

export interface BranchTabsProps {
  collegeId: string;
  branches: Branch[];
  category: Category;
  candidateRank: number;
  historyFor: (branch: Branch) => CutoffHistoryPoint[];
  predictionFor: (branch: Branch) => PredictionResult | undefined;
}

/** One tab per branch: how the cutoff moved, and the full category table. */
export function BranchTabs({
  collegeId,
  branches,
  category,
  candidateRank,
  historyFor,
  predictionFor,
}: BranchTabsProps) {
  // Radix hands the tab value back as a plain string.
  const [active, setActive] = useState<string>(branches[0] ?? "");

  if (branches.length === 0) {
    return (
      <p className="text-sm text-foreground-muted">
        No branch data recorded for this college yet.
      </p>
    );
  }

  return (
    <Tabs value={active} onValueChange={setActive} className="w-full">
      <div className="overflow-x-auto pb-1">
        <TabsList className="bg-background-elevated">
          {branches.map((branch) => (
            <TabsTrigger
              key={branch}
              value={branch}
              className="data-[state=active]:bg-brand-to/15 data-[state=active]:text-brand-to"
            >
              {branch.replace("_", "-")}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {branches.map((branch) => {
        const prediction = predictionFor(branch);

        return (
          <TabsContent key={branch} value={branch} className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  {BRANCHES[branch]}
                </h3>
                {prediction && (
                  <p className="text-xs text-foreground-muted mt-1">
                    {prediction.avgPackage} LPA average package &bull;{" "}
                    {prediction.chancePercent}% chance at your rank
                  </p>
                )}
              </div>

              {prediction && (
                <ChanceBadge
                  tier={prediction.tier}
                  chance={prediction.chancePercent}
                />
              )}
            </div>

            <RankTrendChart
              data={historyFor(branch)}
              candidateRank={candidateRank}
              branchName={branch.replace("_", "-")}
            />

            <CutoffTable
              collegeId={collegeId}
              branch={branch}
              category={category}
              candidateRank={candidateRank}
            />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

export default BranchTabs;
