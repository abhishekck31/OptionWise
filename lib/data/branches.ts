import { BRANCHES, BRANCH_KEYS, type Branch } from "@/types";

export { BRANCHES, BRANCH_KEYS };
export type { Branch };

/** The full name of a branch, e.g. "Computer Science & Engineering". */
export function getBranchLabel(branch: Branch): string {
  return BRANCHES[branch];
}

/** Ready to feed a <select>, with an "any branch" entry first. */
export const BRANCH_OPTIONS = [
  { id: "ALL" as const, code: "ALL" as const, label: "All engineering branches" },
  ...BRANCH_KEYS.map((id) => ({ id, code: id, label: BRANCHES[id] })),
];

export const ALL_BRANCHES = BRANCH_OPTIONS;

