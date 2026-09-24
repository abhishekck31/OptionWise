import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test-utils/intl";
import { StepIndicator } from "../StepIndicator";

describe("StepIndicator", () => {
  it("shows the current step out of the total and a matching progress value", () => {
    renderWithIntl(<StepIndicator current={2} total={3} />);
    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "2");
    expect(bar).toHaveAttribute("aria-valuemax", "3");
  });
});
