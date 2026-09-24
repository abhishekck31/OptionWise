import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test-utils/intl";
import type { CollegePrediction } from "@/lib/predictors/predictColleges";
import { SimulatorPanel } from "../SimulatorPanel";

function item(collegeCode: string): CollegePrediction {
  return {
    chance: "safe",
    trendAdjustedRank: 1000,
    evidence: [],
    collegeCode,
    courseCode: "CS",
    collegeName: `College ${collegeCode}`,
    courseName: "Computer Science",
    city: null,
    feesInr: null,
  };
}

describe("SimulatorPanel", () => {
  it("shows a prompt instead of results when the list is empty", () => {
    renderWithIntl(<SimulatorPanel result={{ rounds: [], finalOptionId: null }} orderedList={[]} />);
    expect(screen.getByText("Add at least one option to see a simulation.")).toBeInTheDocument();
  });

  it("shows the held option per round and highlights the final outcome", () => {
    const list = [item("A"), item("B")];
    renderWithIntl(
      <SimulatorPanel
        result={{
          rounds: [
            { round: 1, allottedOptionId: null },
            { round: 2, allottedOptionId: "A-CS" },
          ],
          finalOptionId: "A-CS",
        }}
        orderedList={list}
      />,
    );
    expect(screen.getByText("Round 1")).toBeInTheDocument();
    expect(screen.getByText("Not allotted yet")).toBeInTheDocument();
    expect(screen.getByText("Round 2")).toBeInTheDocument();
    expect(screen.getByText("College A (Computer Science)")).toBeInTheDocument();
    expect(screen.getByText("If counseling ended today")).toBeInTheDocument();
  });

  it("shows a 'no seat' message when nothing was allotted", () => {
    const list = [item("A")];
    renderWithIntl(
      <SimulatorPanel result={{ rounds: [{ round: 1, allottedOptionId: null }], finalOptionId: null }} orderedList={list} />,
    );
    expect(screen.getByText("No seat allotted in this simulation")).toBeInTheDocument();
  });
});
