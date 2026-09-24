import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/test-utils/intl";
import { ChanceFilterTabs } from "../ChanceFilterTabs";

describe("ChanceFilterTabs", () => {
  it("shows All, Safe, Target, Reach with the current value selected", () => {
    renderWithIntl(<ChanceFilterTabs value="safe" onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Safe" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Target" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reach" })).toBeInTheDocument();
  });

  it("calls onChange with the clicked tier", async () => {
    const onChange = vi.fn();
    renderWithIntl(<ChanceFilterTabs value="all" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Reach" }));
    expect(onChange).toHaveBeenCalledWith("reach");
  });
});
