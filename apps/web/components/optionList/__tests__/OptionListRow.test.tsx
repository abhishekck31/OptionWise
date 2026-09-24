import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { renderWithIntl } from "@/test-utils/intl";
import type { CollegePrediction } from "@/lib/predictors/predictColleges";
import { buildOptionListView } from "@/lib/optionList/warnings";
import { optionId } from "@/lib/optionList/storage";
import { OptionListRow } from "../OptionListRow";

function item(collegeCode: string, chance: CollegePrediction["chance"]): CollegePrediction {
  return {
    chance,
    trendAdjustedRank: 1000,
    evidence: [],
    collegeCode,
    courseCode: "CS",
    collegeName: `College ${collegeCode}`,
    courseName: "Computer Science",
    city: null,
    feesInr: 100000,
  };
}

function renderRow(list: CollegePrediction[], index: number, extraProps: Partial<React.ComponentProps<typeof OptionListRow>> = {}) {
  const { rows } = buildOptionListView(list);
  const ids = list.map(optionId);
  return renderWithIntl(
    <DndContext>
      <SortableContext items={ids}>
        <ul>
          <OptionListRow
            row={rows[index]}
            total={list.length}
            onMoveUp={vi.fn()}
            onMoveDown={vi.fn()}
            onRemove={vi.fn()}
            {...extraProps}
          />
        </ul>
      </SortableContext>
    </DndContext>,
  );
}

describe("OptionListRow", () => {
  it("shows the college, course, position, and explanation", () => {
    const list = [item("A", "safe"), item("B", "target"), item("C", "safe")];
    renderRow(list, 1);
    expect(screen.getByText("2. College B")).toBeInTheDocument();
    expect(screen.getByText(/Computer Science/)).toBeInTheDocument();
    expect(screen.getByText("Target")).toBeInTheDocument();
    expect(screen.getByText(/Target —/)).toBeInTheDocument();
  });

  it("disables move up on the first row", () => {
    const list = [item("A", "safe"), item("B", "safe"), item("C", "safe")];
    renderRow(list, 0);
    expect(screen.getByText("Move up")).toBeDisabled();
    expect(screen.getByText("Move down")).not.toBeDisabled();
  });

  it("disables move down on the last row", () => {
    const list = [item("A", "safe"), item("B", "safe"), item("C", "safe")];
    renderRow(list, 2);
    expect(screen.getByText("Move down")).toBeDisabled();
    expect(screen.getByText("Move up")).not.toBeDisabled();
  });

  it("calls onMoveUp, onMoveDown, and onRemove", async () => {
    const list = [item("A", "safe"), item("B", "safe"), item("C", "safe")];
    const onMoveUp = vi.fn();
    const onMoveDown = vi.fn();
    const onRemove = vi.fn();
    renderRow(list, 1, { onMoveUp, onMoveDown, onRemove });

    await userEvent.click(screen.getByText("Move up"));
    expect(onMoveUp).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByText("Move down"));
    expect(onMoveDown).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByText("Remove"));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("shows an inline warning with a one-tap fix button when passed", async () => {
    const list = [item("A", "safe"), item("B", "safe"), item("C", "safe"), item("D", "reach")];
    const onFixWarning = vi.fn();
    renderRow(list, 0, { warningMessage: "This safe option shadows a reach pick.", onFixWarning });

    expect(screen.getByText("This safe option shadows a reach pick.")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Move below the Reach options it shadows"));
    expect(onFixWarning).toHaveBeenCalledOnce();
  });

  it("does not render a warning block when no warning is passed", () => {
    const list = [item("A", "safe")];
    renderRow(list, 0);
    expect(screen.queryByText("Move below the Reach options it shadows")).not.toBeInTheDocument();
  });
});
