import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/test-utils/intl";
import { EMPTY_ANSWERS } from "@/lib/onboarding/schema";
import { MarksStep } from "../MarksStep";

describe("MarksStep", () => {
  it("shows both fields and reports changes", async () => {
    const onChange = vi.fn();
    renderWithIntl(<MarksStep answers={EMPTY_ANSWERS} errors={{}} onChange={onChange} />);

    await userEvent.type(screen.getByLabelText("KCET marks"), "150");
    expect(onChange).toHaveBeenCalledWith("kcetMarks", expect.any(String));
  });

  it("shows a translated error message under the right field", () => {
    renderWithIntl(
      <MarksStep
        answers={EMPTY_ANSWERS}
        errors={{ kcetMarks: "errors.kcetMarksRequired" }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Enter your KCET marks.")).toBeInTheDocument();
  });
});
