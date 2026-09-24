import { describe, expect, it } from "vitest";
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
});
