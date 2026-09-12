"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCutoffs } from "@/lib/data/cutoffs";
import { CATEGORY_KEYS, ROUNDS, ROUND_KEYS } from "@/types";
import { cn } from "@/lib/utils";
import type { Branch, Category } from "@/types";

export interface CutoffTableProps {
  collegeId: string;
  branch: Branch;
  /** The student's category, highlighted so their row is easy to find. */
  category: Category;
  /** When given, cells this rank clears are marked. */
  candidateRank?: number;
  year?: number;
}

/** Closing ranks for one branch: every category, every round with data. */
export function CutoffTable({
  collegeId,
  branch,
  category,
  candidateRank,
  year,
}: CutoffTableProps) {
  const rows = useMemo(
    () => getCutoffs({ collegeId, branch, year }),
    [collegeId, branch, year]
  );

  // Only show rounds this branch actually published, in counselling order.
  const rounds = useMemo(
    () => ROUND_KEYS.filter((round) => rows.some((r) => r.round === round)),
    [rows]
  );

  const closingFor = (cat: Category, round: string) =>
    rows.find((r) => r.category === cat && r.round === round)?.closingRank;

  if (rows.length === 0) {
    return (
      <p className="text-sm text-foreground-muted">
        No cutoffs published for this branch yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-subtle">
      <Table>
        <TableHeader>
          <TableRow className="border-border-subtle hover:bg-transparent">
            <TableHead className="text-foreground-subtle">Category</TableHead>
            {rounds.map((round) => (
              <TableHead key={round} className="text-right text-foreground-subtle">
                {ROUNDS[round]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {CATEGORY_KEYS.filter((cat) =>
            rows.some((r) => r.category === cat)
          ).map((cat) => {
            const isMine = cat === category;

            return (
              <TableRow
                key={cat}
                className={cn(
                  "border-border-subtle",
                  isMine && "bg-brand-to/5 hover:bg-brand-to/10"
                )}
              >
                <TableCell
                  className={cn(
                    "font-mono text-xs",
                    isMine ? "font-semibold text-brand-to" : "text-foreground-muted"
                  )}
                >
                  {cat}
                  {isMine && (
                    <span className="ml-2 font-sans text-[10px] font-normal text-foreground-subtle">
                      yours
                    </span>
                  )}
                </TableCell>

                {rounds.map((round) => {
                  const closing = closingFor(cat, round);
                  const clears =
                    typeof candidateRank === "number" &&
                    typeof closing === "number" &&
                    candidateRank <= closing;

                  return (
                    <TableCell
                      key={round}
                      className={cn(
                        "text-right font-mono text-xs",
                        clears ? "text-success" : "text-foreground-muted"
                      )}
                    >
                      {closing === undefined
                        ? "—"
                        : `#${closing.toLocaleString("en-IN")}`}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default CutoffTable;
