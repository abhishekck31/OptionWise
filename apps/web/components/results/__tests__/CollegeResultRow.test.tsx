import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/test-utils/intl";
import type { CollegePrediction } from "@/lib/predictors/predictColleges";
import { CollegeResultRow } from "../CollegeResultRow";

const prediction: CollegePrediction = {
  chance: "safe",
  trendAdjustedRank: 10000,
  evidence: [{ year: 2024, round: 1, closingRank: 10000 }],
  collegeCode: "E001",
  collegeName: "Sample Engineering College",
  city: "Bengaluru",
  courseCode: "CS",
  courseName: "Computer Science",
  feesInr: 120000,
};

describe("CollegeResultRow", () => {
  it("shows the college, course, and chance chip", () => {
    renderWithIntl(<CollegeResultRow prediction={prediction} />);
    expect(screen.getByText("Sample Engineering College")).toBeInTheDocument();
    expect(screen.getByText(/Computer Science/)).toBeInTheDocument();
    expect(screen.getByText("Safe")).toBeInTheDocument();
    expect(screen.getByText("₹1,20,000/year")).toBeInTheDocument();
  });

  it("shows a fallback when fees are unknown", () => {
    renderWithIntl(<CollegeResultRow prediction={{ ...prediction, feesInr: null }} />);
    expect(screen.getByText("Fees not available")).toBeInTheDocument();
  });

  it("reveals cutoff evidence on tap, per SPEC.md's option-ladder pattern", async () => {
    renderWithIntl(<CollegeResultRow prediction={prediction} />);
    // <details> keeps its content in the DOM even closed (native browser behaviour
    // hides it visually via CSS, not by removing it) — the reliable signal is the
    // element's own open state, not text presence/absence.
    const details = screen.getByText("2024 round 1: closing rank 10,000").closest("details");
    expect(details).not.toHaveAttribute("open");
    await userEvent.click(screen.getByText("Show past cutoffs"));
    expect(details).toHaveAttribute("open");
  });

  it("shows a message when there's no cutoff history at all", async () => {
    renderWithIntl(<CollegeResultRow prediction={{ ...prediction, evidence: [] }} />);
    await userEvent.click(screen.getByText("Show past cutoffs"));
    expect(screen.getByText("No cutoff history for this category yet.")).toBeInTheDocument();
  });
});
