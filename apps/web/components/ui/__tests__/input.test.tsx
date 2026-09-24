import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "../input";

describe("Input", () => {
  it("associates the label with the field", () => {
    render(<Input label="KCET marks" />);
    expect(screen.getByLabelText("KCET marks")).toBeInTheDocument();
  });

  it("shows the hint and wires it up via aria-describedby", () => {
    render(<Input label="Category" hint="Why we ask: used to check eligibility." />);
    const input = screen.getByLabelText("Category");
    expect(screen.getByText("Why we ask: used to check eligibility.")).toBeInTheDocument();
    expect(input.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("marks the field invalid and shows the error message", () => {
    render(<Input label="Category" error="Choose a category to continue." />);
    const input = screen.getByLabelText("Category");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Choose a category to continue.")).toBeInTheDocument();
  });
});
