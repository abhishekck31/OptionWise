import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeView } from "../HomeView";

describe("HomeView", () => {
  it("renders the product name, tagline, dev notice, and the KEA disclaimer", () => {
    render(
      <HomeView
        title="OptionWise"
        tagline="Smarter option entry, from rank to college."
        devNotice="This app is under active development."
        footer="Not affiliated with KEA or any government body."
      />,
    );
    expect(screen.getByRole("heading", { name: "OptionWise" })).toBeInTheDocument();
    expect(screen.getByText("Smarter option entry, from rank to college.")).toBeInTheDocument();
    expect(screen.getByText(/not affiliated with kea/i)).toBeInTheDocument();
  });
});
