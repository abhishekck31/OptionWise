import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SampleDataBannerView } from "../SampleDataBannerView";

describe("SampleDataBannerView", () => {
  it("shows the given title and description as a status region", () => {
    render(<SampleDataBannerView title="Sample data — not real cutoffs." description="Made up for testing." />);
    expect(screen.getByRole("status")).toHaveTextContent(/sample data — not real cutoffs\./i);
    expect(screen.getByText("Made up for testing.")).toBeInTheDocument();
  });
});
