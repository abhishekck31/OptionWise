import { createElement, forwardRef, type AnchorHTMLAttributes } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/test-utils/intl";
import { ToastProvider } from "@/components/ui/toast";
import { EMPTY_ANSWERS } from "@/lib/onboarding/schema";
import { saveOnboarding, type StoredOnboarding } from "@/lib/onboarding/storage";
import { saveOptionList } from "@/lib/optionList/storage";
import type { CollegePrediction } from "@/lib/predictors/predictColleges";
import OptionListPage from "../page";

function renderPage() {
  return renderWithIntl(
    <ToastProvider>
      <OptionListPage />
    </ToastProvider>,
  );
}

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  Link: forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function MockLink(props, ref) {
    return createElement("a", { ...props, ref });
  }),
}));

const stored: StoredOnboarding = {
  answers: { ...EMPTY_ANSWERS, kcetMarks: "150", boardPcmPercent: "88", categoryBase: "GM" },
  categoryCode: "GM",
  prediction: {
    meritScore: 80,
    optimisticRank: 5000,
    likelyRank: 6000,
    conservativeRank: 7000,
    confidence: "medium",
    basedOnSampleData: true,
  },
};

function item(collegeCode: string, chance: CollegePrediction["chance"] = "safe"): CollegePrediction {
  return {
    chance,
    trendAdjustedRank: 1000,
    evidence: [{ year: 2024, round: 1, closingRank: 8000 }],
    collegeCode,
    courseCode: "CS",
    collegeName: `College ${collegeCode}`,
    courseName: "Computer Science",
    city: null,
    feesInr: 100000,
  };
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("OptionListPage", () => {
  it("shows an empty state when the option list has nothing in it", async () => {
    renderPage();
    expect(await screen.findByText("Your option list is empty.")).toBeInTheDocument();
  });

  it("renders saved options in their stored order, with positions", async () => {
    saveOnboarding(stored);
    saveOptionList([item("A"), item("B"), item("C")]);

    renderPage();

    expect(await screen.findByText("1. College A")).toBeInTheDocument();
    expect(screen.getByText("2. College B")).toBeInTheDocument();
    expect(screen.getByText("3. College C")).toBeInTheDocument();
  });

  it("moves an option up and down and persists the new order", async () => {
    saveOnboarding(stored);
    saveOptionList([item("A"), item("B")]);
    renderPage();
    await screen.findByText("1. College A");

    const moveDownButtons = screen.getAllByText("Move down");
    await userEvent.click(moveDownButtons[0]); // move A down, past B

    expect(await screen.findByText("1. College B")).toBeInTheDocument();
    expect(screen.getByText("2. College A")).toBeInTheDocument();

    const { loadOptionList } = await import("@/lib/optionList/storage");
    expect(loadOptionList().map((p) => p.collegeCode)).toEqual(["B", "A"]);
  });

  it("removes an option and restores it via the toast's Undo action", async () => {
    saveOnboarding(stored);
    saveOptionList([item("A"), item("B")]);
    renderPage();
    await screen.findByText("1. College A");

    await userEvent.click(screen.getAllByText("Remove")[0]);
    expect(screen.queryByText("College A")).not.toBeInTheDocument();

    const undoButton = await screen.findByRole("button", { name: "Undo" });
    await userEvent.click(undoButton);

    expect(await screen.findByText("1. College A")).toBeInTheDocument();
    expect(screen.getByText("2. College B")).toBeInTheDocument();
  });

  it("shows a too-few-safe banner and a per-row safe-above-reach warning with a working fix button", async () => {
    saveOnboarding(stored);
    // Only one Safe option (min is 3), and it shadows a later Reach option.
    saveOptionList([item("A", "safe"), item("B", "reach")]);
    renderPage();

    expect(await screen.findByText(/You only have 1 Safe option/)).toBeInTheDocument();
    expect(screen.getByText(/is a Safe pick placed above/)).toBeInTheDocument();

    await userEvent.click(screen.getByText("Move below the Reach options it shadows"));

    expect(await screen.findByText("1. College B")).toBeInTheDocument();
    expect(screen.getByText("2. College A")).toBeInTheDocument();
    expect(screen.queryByText(/is a Safe pick placed above/)).not.toBeInTheDocument();
  });

  it("shows a live simulation once onboarding rank data is available", async () => {
    saveOnboarding(stored);
    saveOptionList([item("A")]);
    renderPage();

    expect(await screen.findByText("Live simulation")).toBeInTheDocument();
    expect(screen.getByText("College A (Computer Science)")).toBeInTheDocument();
  });

  it("downloads a CSV when 'Download CSV' is clicked", async () => {
    saveOnboarding(stored);
    saveOptionList([item("A")]);
    const createObjectURL = vi.fn().mockReturnValue("blob:mock");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { ...URL, createObjectURL, revokeObjectURL });
    // jsdom doesn't support the <a download> attribute and otherwise tries (and
    // fails) to navigate to the fake blob: URL when the element is clicked.
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    renderPage();
    await userEvent.click(await screen.findByText("Download CSV"));

    expect(createObjectURL).toHaveBeenCalledOnce();
    const blob = createObjectURL.mock.calls[0][0] as Blob;
    expect(blob.type).toContain("text/csv");
    click.mockRestore();
  });

  it("downloads a PDF via the export API when 'Download PDF' is clicked", async () => {
    saveOnboarding(stored);
    saveOptionList([item("A")]);
    const pdfBlob = new Blob(["%PDF-fake"], { type: "application/pdf" });
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, blob: async () => pdfBlob });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("URL", { ...URL, createObjectURL: vi.fn().mockReturnValue("blob:mock"), revokeObjectURL: vi.fn() });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    renderPage();
    await userEvent.click(await screen.findByText("Download PDF"));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/export/pdf", expect.objectContaining({ method: "POST" })));
    click.mockRestore();
  });

  it("shows an error toast when the PDF export request fails", async () => {
    saveOnboarding(stored);
    saveOptionList([item("A")]);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    renderPage();
    await userEvent.click(await screen.findByText("Download PDF"));

    expect(await screen.findByText("Couldn't generate the PDF. Try again.")).toBeInTheDocument();
  });

  it("copies a share link to the clipboard when 'Copy share link' is clicked", async () => {
    saveOnboarding(stored);
    saveOptionList([item("A")]);
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });

    renderPage();
    await userEvent.click(await screen.findByText("Copy share link"));

    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText.mock.calls[0][0]).toContain("/share#");
    expect(await screen.findByText("Link copied to clipboard")).toBeInTheDocument();
  });
});
