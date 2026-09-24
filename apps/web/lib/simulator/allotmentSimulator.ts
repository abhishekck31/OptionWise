export const SIMULATION_LABEL = "Simulation based on last year's data";

export interface SimulationOption {
  id: string;
  /** Closing ranks for one year, one entry per round available that year. */
  roundCutoffs: { round: number; closingRank: number }[];
}

export interface RoundOutcome {
  round: number;
  /** The option id the student would hold after this round (their best qualifying
   * option so far), or null if they haven't qualified for anything yet. */
  allottedOptionId: string | null;
}

export interface SimulationResult {
  rounds: RoundOutcome[];
  finalOptionId: string | null;
}

/**
 * Simulates KEA's round-by-round allotment against one year's cutoffs: each round,
 * the student is allotted the most-preferred (earliest in `orderedOptionIds`) option
 * whose cutoff for that round they clear — but never a *less* preferred option than
 * whatever they already hold, matching real counseling ("upgrade-only": once you
 * hold a seat, later rounds can only move you up your list, never down).
 */
export function simulateAllotment(
  orderedOptionIds: string[],
  options: Record<string, SimulationOption>,
  rank: number,
): SimulationResult {
  const allRounds = new Set<number>();
  for (const id of orderedOptionIds) {
    for (const rc of options[id]?.roundCutoffs ?? []) {
      allRounds.add(rc.round);
    }
  }
  const sortedRounds = [...allRounds].sort((a, b) => a - b);

  const rounds: RoundOutcome[] = [];
  let bestPositionSoFar: number | null = null;
  let bestOptionSoFar: string | null = null;

  for (const round of sortedRounds) {
    for (let i = 0; i < orderedOptionIds.length; i++) {
      if (bestPositionSoFar !== null && i >= bestPositionSoFar) break;
      const option = options[orderedOptionIds[i]];
      const cutoff = option?.roundCutoffs.find((rc) => rc.round === round);
      if (cutoff && rank <= cutoff.closingRank) {
        bestPositionSoFar = i;
        bestOptionSoFar = orderedOptionIds[i];
        break;
      }
    }
    rounds.push({ round, allottedOptionId: bestOptionSoFar });
  }

  return { rounds, finalOptionId: bestOptionSoFar };
}
