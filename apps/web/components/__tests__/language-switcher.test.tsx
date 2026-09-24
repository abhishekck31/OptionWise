import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/test-utils/intl";
import { LanguageSwitcher } from "@/components/language-switcher";

const replace = vi.fn();

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/",
}));

describe("LanguageSwitcher", () => {
  it("shows English and Kannada options with the current locale selected", () => {
    renderWithIntl(<LanguageSwitcher />);
    const english = screen.getByRole("button", { name: "English" });
    const kannada = screen.getByRole("button", { name: "ಕನ್ನಡ" });
    expect(english).toHaveAttribute("aria-pressed", "true");
    expect(kannada).toHaveAttribute("aria-pressed", "false");
  });

  it("navigates to the same page in the other locale when clicked", async () => {
    renderWithIntl(<LanguageSwitcher />);
    await userEvent.click(screen.getByRole("button", { name: "ಕನ್ನಡ" }));
    expect(replace).toHaveBeenCalledWith("/", { locale: "kn" });
  });
});
