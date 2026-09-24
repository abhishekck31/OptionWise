import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/test-utils/intl";
import { Chip, ChanceChip } from "../chip";

describe("Chip", () => {
  it("toggles aria-pressed and calls onClick", async () => {
    const onClick = vi.fn();
    render(
      <Chip selected={false} onClick={onClick}>
        Bengaluru
      </Chip>,
    );
    const chip = screen.getByRole("button", { name: "Bengaluru" });
    expect(chip).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(chip);
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("ChanceChip", () => {
  it("shows a label for every tier, not colour alone", () => {
    renderWithIntl(
      <>
        <ChanceChip chance="safe" />
        <ChanceChip chance="target" />
        <ChanceChip chance="reach" />
      </>,
    );
    expect(screen.getByText("Safe")).toBeInTheDocument();
    expect(screen.getByText("Target")).toBeInTheDocument();
    expect(screen.getByText("Reach")).toBeInTheDocument();
  });

  it("renders a distinct icon per tier (not just colour)", () => {
    const { container: safeContainer } = renderWithIntl(<ChanceChip chance="safe" />);
    const { container: reachContainer } = renderWithIntl(<ChanceChip chance="reach" />);
    expect(safeContainer.querySelector("svg")).toBeInTheDocument();
    expect(safeContainer.querySelector("svg")?.outerHTML).not.toBe(reachContainer.querySelector("svg")?.outerHTML);
  });
});
