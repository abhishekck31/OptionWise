import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sheet } from "../sheet";

function ControlledSheet({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        onOpenChange?.(next);
      }}
      title="Compare colleges"
      trigger={<button>Open compare tray</button>}
    >
      <p>Sheet body</p>
    </Sheet>
  );
}

describe("Sheet", () => {
  it("is closed until the trigger is clicked, then shows its title and content", async () => {
    render(<ControlledSheet />);
    expect(screen.queryByText("Compare colleges")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Open compare tray" }));

    await waitFor(() => expect(screen.getByRole("heading", { name: "Compare colleges" })).toBeInTheDocument());
    expect(screen.getByText("Sheet body")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const onOpenChange = vi.fn();
    render(<ControlledSheet onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Open compare tray" }));
    await waitFor(() => expect(screen.getByRole("heading", { name: "Compare colleges" })).toBeInTheDocument());

    await userEvent.keyboard("{Escape}");

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });
});
