import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../button";

describe("Button", () => {
  it("renders its label and responds to clicks", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save my list</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Save my list" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Save my list
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Save my list" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps a 44px minimum touch target across sizes", () => {
    render(
      <>
        <Button size="default">Default</Button>
        <Button size="sm">Small</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Default" }).className).toMatch(/h-11/);
    expect(screen.getByRole("button", { name: "Small" }).className).toMatch(/h-11/);
  });

  it("renders as its child element (e.g. a link) when asChild is set, not a nested button", () => {
    render(
      <Button asChild>
        <a href="https://example.com/get-started">Get started</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Get started" });
    expect(link.tagName).toBe("A");
    expect(link.className).toMatch(/bg-brand/);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
