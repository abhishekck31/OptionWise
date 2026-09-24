import { createElement, forwardRef, type AnchorHTMLAttributes } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test-utils/intl";
import { encodeShareData, type ShareEntry } from "@/lib/optionList/share";
import SharePage from "../page";

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  Link: forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function MockLink(props, ref) {
    return createElement("a", { ...props, ref });
  }),
}));

function setHash(value: string) {
  window.location.hash = value;
}

afterEach(() => {
  setHash("");
});

describe("SharePage", () => {
  it("shows an invalid-link state when the URL fragment is empty", async () => {
    renderWithIntl(<SharePage />);
    expect(await screen.findByText("This share link is invalid.")).toBeInTheDocument();
  });

  it("shows an invalid-link state when the fragment doesn't decode to a share payload", async () => {
    setHash("garbage");
    renderWithIntl(<SharePage />);
    expect(await screen.findByText("This share link is invalid.")).toBeInTheDocument();
  });

  it("renders the shared list read-only, in order, with chance chips", async () => {
    const entries: ShareEntry[] = [
      { collegeCode: "A1", collegeName: "College A", courseCode: "CS", courseName: "Computer Science", chance: "safe" },
      { collegeCode: "B1", collegeName: "College B", courseCode: "EC", courseName: "Electronics", chance: "reach" },
    ];
    setHash(encodeShareData(entries));

    renderWithIntl(<SharePage />);

    expect(await screen.findByText("1. College A")).toBeInTheDocument();
    expect(screen.getByText("2. College B")).toBeInTheDocument();
    expect(screen.getByText("Safe")).toBeInTheDocument();
    expect(screen.getByText("Reach")).toBeInTheDocument();
  });

  it("shows an empty state for a valid but empty shared list", async () => {
    setHash(encodeShareData([]));
    renderWithIntl(<SharePage />);
    expect(await screen.findByText("This list is empty.")).toBeInTheDocument();
  });
});
