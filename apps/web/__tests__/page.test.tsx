import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home page", () => {
  it("renders the product name and the KEA disclaimer", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "OptionWise" })).toBeInTheDocument();
    expect(screen.getByText(/not affiliated with kea/i)).toBeInTheDocument();
  });
});
