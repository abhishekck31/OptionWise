import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast } from "../toast";

function TriggerButton() {
  const { showToast } = useToast();
  return (
    <button onClick={() => showToast({ title: "Saved", description: "Your option list was saved." })}>
      Trigger
    </button>
  );
}

describe("ToastProvider / useToast", () => {
  it("shows a toast with the given title and description after showToast is called", async () => {
    render(
      <ToastProvider>
        <TriggerButton />
      </ToastProvider>,
    );

    expect(screen.queryByText("Saved")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));

    await waitFor(() => expect(screen.getByText("Saved")).toBeInTheDocument());
    expect(screen.getByText("Your option list was saved.")).toBeInTheDocument();
  });

  it("runs the action callback and dismisses the toast when its action button is clicked", async () => {
    const onUndo = vi.fn();
    function UndoTrigger() {
      const { showToast } = useToast();
      return (
        <button onClick={() => showToast({ title: "Removed", action: { label: "Undo", onClick: onUndo } })}>
          Trigger
        </button>
      );
    }
    render(
      <ToastProvider>
        <UndoTrigger />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));
    const undoButton = await screen.findByRole("button", { name: "Undo" });
    await userEvent.click(undoButton);

    expect(onUndo).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByText("Removed")).not.toBeInTheDocument());
  });
});
