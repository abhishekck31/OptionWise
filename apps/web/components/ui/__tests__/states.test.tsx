import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "../skeleton";
import { EmptyState } from "../empty-state";
import { ErrorState } from "../error-state";

describe("Skeleton", () => {
  it("is hidden from assistive tech", () => {
    const { container } = render(<Skeleton className="h-4 w-24" />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });
});

describe("EmptyState", () => {
  it("tells the student what to do next", () => {
    render(<EmptyState title="No colleges yet" description="Enter your marks to get started." />);
    expect(screen.getByRole("heading", { name: "No colleges yet" })).toBeInTheDocument();
    expect(screen.getByText("Enter your marks to get started.")).toBeInTheDocument();
  });
});

describe("ErrorState", () => {
  it("is announced as an alert and says what happened", () => {
    render(<ErrorState title="Couldn't load cutoffs" description="Check your connection and try again." />);
    expect(screen.getByRole("alert")).toHaveTextContent("Couldn't load cutoffs");
    expect(screen.getByText("Check your connection and try again.")).toBeInTheDocument();
  });
});
