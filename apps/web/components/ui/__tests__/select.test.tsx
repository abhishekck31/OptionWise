import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "../select";

describe("Select", () => {
  it("associates the label and lists every option", () => {
    render(
      <Select
        label="Category"
        options={[
          { value: "GM", label: "General Merit" },
          { value: "SC", label: "Scheduled Caste" },
        ]}
      />,
    );
    const select = screen.getByLabelText("Category");
    expect(select).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "General Merit" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Scheduled Caste" })).toBeInTheDocument();
  });

  it("calls onChange with the selected value", async () => {
    const onChange = vi.fn();
    render(
      <Select
        label="Category"
        onChange={onChange}
        options={[
          { value: "GM", label: "General Merit" },
          { value: "SC", label: "Scheduled Caste" },
        ]}
      />,
    );
    await userEvent.selectOptions(screen.getByLabelText("Category"), "SC");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows an error message and marks the field invalid", () => {
    render(<Select label="Category" error="Choose a category." options={[]} />);
    expect(screen.getByLabelText("Category")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Choose a category.")).toBeInTheDocument();
  });
});
