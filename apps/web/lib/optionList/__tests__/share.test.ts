import { describe, expect, it } from "vitest";
import { decodeShareData, encodeShareData, type ShareEntry } from "../share";

const list: ShareEntry[] = [
  { collegeCode: "A1", collegeName: "College A", courseCode: "CS", courseName: "Computer Science", chance: "safe" },
  { collegeCode: "B1", collegeName: "College B", courseCode: "EC", courseName: "Electronics", chance: "reach" },
];

describe("share encoding", () => {
  it("round-trips a list, order preserved", () => {
    const decoded = decodeShareData(encodeShareData(list));
    expect(decoded).toEqual(list);
  });

  it("carries no fields beyond the read-only display ones (no rank, no personal data)", () => {
    const encoded = encodeShareData(list);
    const decoded = decodeShareData(encoded) as ShareEntry[];
    expect(Object.keys(decoded[0]).sort()).toEqual(["chance", "collegeCode", "collegeName", "courseCode", "courseName"]);
  });

  it("returns null for garbage input instead of throwing", () => {
    expect(decodeShareData("not-valid-base64!!!")).toBeNull();
    expect(decodeShareData(btoa(encodeURIComponent(JSON.stringify({ not: "an array" }))))).toBeNull();
    expect(decodeShareData(btoa(encodeURIComponent(JSON.stringify([{ collegeCode: "A1" }]))))).toBeNull();
  });

  it("rejects an entry with an invalid chance value", () => {
    const bad = [{ ...list[0], chance: "definitely-maybe" }];
    expect(decodeShareData(btoa(encodeURIComponent(JSON.stringify(bad))))).toBeNull();
  });

  it("handles an empty list", () => {
    expect(decodeShareData(encodeShareData([]))).toEqual([]);
  });
});
