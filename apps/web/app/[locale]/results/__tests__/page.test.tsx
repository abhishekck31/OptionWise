import { createElement, forwardRef, type AnchorHTMLAttributes } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/test-utils/intl";
import { EMPTY_ANSWERS } from "@/lib/onboarding/schema";
import { saveOnboarding, type StoredOnboarding } from "@/lib/onboarding/storage";
import type { CollegePrediction } from "@/lib/predictors/predictColleges";
import ResultsPage from "../page";

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  Link: forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function MockLink(props, ref) {
    return createElement("a", { ...props, ref });
  }),
}));

const stored: StoredOnboarding = {
  answers: { ...EMPTY_ANSWERS, kcetMarks: "150", boardPcmPercent: "88", categoryBase: "GM" },
  categoryCode: "GM",
  prediction: {
    meritScore: 80,
    optimisticRank: 5000,
    likelyRank: 6000,
    conservativeRank: 7000,
    confidence: "medium",
    basedOnSampleData: true,
  },
};

const onePrediction: CollegePrediction = {
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

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ResultsPage", () => {
  it("prompts to start onboarding when there are no saved answers", async () => {
    renderWithIntl(<ResultsPage />);
    expect(await screen.findByText("We don't have your answers yet.")).toBeInTheDocument();
  });

  it("shows the rank range and fetched colleges once answers exist", async () => {
    saveOnboarding(stored);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ predictions: [onePrediction] }) });
    vi.stubGlobal("fetch", fetchMock);

    renderWithIntl(<ResultsPage />);

    expect(await screen.findByText("You'll most likely get a rank between 5,000 and 7,000.")).toBeInTheDocument();
    expect(await screen.findByText("Sample Engineering College")).toBeInTheDocument();

    const requestedUrl = fetchMock.mock.calls[0][0] as string;
    expect(requestedUrl).toContain("rank=6000");
    expect(requestedUrl).toContain("categoryCode=GM");
  });

  it("filters the list when a chance tab is clicked", async () => {
    saveOnboarding(stored);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          predictions: [onePrediction, { ...onePrediction, collegeCode: "E002", collegeName: "Reach College", chance: "reach" }],
        }),
      }),
    );

    renderWithIntl(<ResultsPage />);
    expect(await screen.findByText("Reach College")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Safe" }));

    expect(screen.getByText("Sample Engineering College")).toBeInTheDocument();
    expect(screen.queryByText("Reach College")).not.toBeInTheDocument();
  });

  it("shows an error state with a retry option when the fetch fails", async () => {
    saveOnboarding(stored);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    renderWithIntl(<ResultsPage />);

    expect(await screen.findByText("Couldn't load colleges")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument());
  });
});
