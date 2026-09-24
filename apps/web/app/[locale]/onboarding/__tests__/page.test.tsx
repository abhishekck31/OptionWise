import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/test-utils/intl";
import { loadOnboarding } from "@/lib/onboarding/storage";
import OnboardingPage from "../page";

const push = vi.fn();

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
}));

afterEach(() => {
  window.localStorage.clear();
  push.mockClear();
});

describe("OnboardingPage", () => {
  it("blocks advancing past a step with invalid answers, showing the error", async () => {
    renderWithIntl(<OnboardingPage />);
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(await screen.findByText("Enter your KCET marks.")).toBeInTheDocument();
    // Still on step 1 — the category field from step 2 shouldn't be visible.
    expect(screen.queryByLabelText("Category")).not.toBeInTheDocument();
  });

  it("walks all 3 steps, predicts a rank, saves it, and navigates to /results", async () => {
    renderWithIntl(<OnboardingPage />);

    // Step 1: marks
    await userEvent.type(screen.getByLabelText("KCET marks"), "150");
    await userEvent.type(screen.getByLabelText("Board PCM percentage"), "88");
    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    // Step 2: category (GM needs no quota)
    expect(await screen.findByLabelText("Category")).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText("Category"), "General Merit (GM)");
    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    // Step 3: preferences — leave everything blank (all optional)
    expect(await screen.findByLabelText("Preferred location")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "See my results" }));

    expect(push).toHaveBeenCalledWith("/results");
    const stored = loadOnboarding();
    expect(stored?.categoryCode).toBe("GM");
    expect(stored?.answers.kcetMarks).toBe("150");
    expect(stored?.prediction.likelyRank).toBeGreaterThan(0);
  });

  it("goes back to the previous step without losing already-entered answers", async () => {
    renderWithIntl(<OnboardingPage />);
    await userEvent.type(screen.getByLabelText("KCET marks"), "150");
    await userEvent.type(screen.getByLabelText("Board PCM percentage"), "88");
    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(await screen.findByLabelText("Category")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(await screen.findByLabelText("KCET marks")).toHaveValue(150);
  });
});
