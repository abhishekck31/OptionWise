import { describe, expect, it } from "vitest";
import { formatIndianNumber } from "../formatNumber";

describe("formatIndianNumber", () => {
  it("groups digits the Indian way (lakhs), not the Western way", () => {
    expect(formatIndianNumber(120000)).toBe("1,20,000");
    expect(formatIndianNumber(2500000)).toBe("25,00,000");
  });

  it("leaves small numbers unchanged", () => {
    expect(formatIndianNumber(999)).toBe("999");
  });
});
