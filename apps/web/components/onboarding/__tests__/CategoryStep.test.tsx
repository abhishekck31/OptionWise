import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/test-utils/intl";
import { EMPTY_ANSWERS } from "@/lib/onboarding/schema";
import { CategoryStep } from "../CategoryStep";

describe("CategoryStep", () => {
  it("hides the quota field until a quota-requiring category is chosen", () => {
    renderWithIntl(<CategoryStep answers={EMPTY_ANSWERS} errors={{}} onChange={vi.fn()} />);
    expect(screen.queryByLabelText("Quota")).not.toBeInTheDocument();
  });

  it("shows the quota field for a non-GM category, with its 'why we ask' hint", () => {
    renderWithIntl(<CategoryStep answers={{ ...EMPTY_ANSWERS, categoryBase: "2A" }} errors={{}} onChange={vi.fn()} />);
    expect(screen.getByLabelText("Quota")).toBeInTheDocument();
    expect(
      screen.getByText("Why we ask: rural, Kannada-medium, and Hyderabad-Karnataka quotas each have their own cutoff."),
    ).toBeInTheDocument();
  });

  it("tells the student GM needs no quota instead of showing an empty field", () => {
    renderWithIntl(<CategoryStep answers={{ ...EMPTY_ANSWERS, categoryBase: "GM" }} errors={{}} onChange={vi.fn()} />);
    expect(screen.queryByLabelText("Quota")).not.toBeInTheDocument();
    expect(screen.getByText("General Merit doesn't need a quota — you're all set.")).toBeInTheDocument();
  });

  it("reports category changes", async () => {
    const onChange = vi.fn();
    renderWithIntl(<CategoryStep answers={EMPTY_ANSWERS} errors={{}} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByLabelText("Category"), "General Merit (GM)");
    expect(onChange).toHaveBeenCalledWith("categoryBase", "GM");
  });
});
