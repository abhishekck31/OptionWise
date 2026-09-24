// @vitest-environment node
import { describe, expect, it } from "vitest";
import { POST } from "../route";

function request(body: unknown): Request {
  return new Request("http://localhost/api/export/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/export/pdf", () => {
  it("returns 400 for a non-JSON body", async () => {
    const response = await POST(new Request("http://localhost/api/export/pdf", { method: "POST", body: "not json" }));
    expect(response.status).toBe(400);
  });

  it("returns 400 when entries is missing or malformed", async () => {
    expect((await POST(request({}))).status).toBe(400);
    expect((await POST(request({ entries: "nope" }))).status).toBe(400);
    expect((await POST(request({ entries: [{ position: 1 }] }))).status).toBe(400);
    expect((await POST(request({ entries: [{ position: 1, collegeCode: "A", collegeName: "A", courseCode: "CS", courseName: "CS", chance: "bogus" }] }))).status).toBe(400);
  });

  it("returns a PDF for valid entries", async () => {
    const response = await POST(
      request({
        entries: [
          { position: 1, collegeCode: "A1", collegeName: "College A", courseCode: "CS", courseName: "Computer Science", chance: "safe" },
        ],
      }),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toContain("optionwise-option-list.pdf");
    const buffer = Buffer.from(await response.arrayBuffer());
    expect(buffer.subarray(0, 4).toString()).toBe("%PDF");
  });

  it("returns a (still-valid, empty-body) PDF for an empty entries array", async () => {
    const response = await POST(request({ entries: [] }));
    expect(response.status).toBe(200);
    const buffer = Buffer.from(await response.arrayBuffer());
    expect(buffer.subarray(0, 4).toString()).toBe("%PDF");
  });
});
