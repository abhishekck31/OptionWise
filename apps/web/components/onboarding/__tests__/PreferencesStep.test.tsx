import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test-utils/intl";
import { EMPTY_ANSWERS } from "@/lib/onboarding/schema";
import { PreferencesStep } from "../PreferencesStep";

describe("PreferencesStep", () => {
  it("shows all three preference fields, all optional (no errors when blank)", () => {
    renderWithIntl(<PreferencesStep answers={EMPTY_ANSWERS} errors={{}} onChange={vi.fn()} />);
    expect(screen.getByLabelText("Preferred location")).toBeInTheDocument();
    expect(screen.getByLabelText("Maximum fees (₹ per year)")).toBeInTheDocument();
    expect(screen.getByLabelText("Preferred branches")).toBeInTheDocument();
  });

  it("shows a translated error for an invalid fee cap", () => {
    renderWithIntl(
      <PreferencesStep answers={EMPTY_ANSWERS} errors={{ maxFeesInr: "errors.maxFeesInrRange" }} onChange={vi.fn()} />,
    );
    expect(screen.getByText("Maximum fees can't be negative.")).toBeInTheDocument();
  });
});
