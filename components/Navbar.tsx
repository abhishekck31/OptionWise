"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useKCETHydration, useOptionList } from "@/hooks/useKCETStore";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/predict/rank", label: "Rank Predictor" },
  { href: "/predict/college", label: "College Finder" },
  { href: "/options", label: "Option Entry" },
  { href: "/explore", label: "Explore Colleges" },
] as const;

/** A link is active on its own route and on anything nested under it. */
function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Wordmark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none"
    >
      <span
        aria-hidden
        className="flex size-6 items-center justify-center rounded-lg bg-[#CC3D2E] text-[13px] font-semibold text-white"
      >
        K
      </span>
      <span className="text-base font-medium text-[#1A1A1A]">
        KCET Predictor
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const hydrated = useKCETHydration();
  const optionList = useOptionList();

  // Held back until the persisted list has landed, so the server paint and the
  // first client paint agree on what the badge says.
  const optionCount = hydrated ? optionList.length : 0;

  return (
    <header className="print-hide sticky top-0 z-50 border-b border-[#E5E0D8] bg-[#F7F4F0]/90 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-4 px-6 sm:px-8"
      >
        <Wordmark />

        <ul className="hidden h-full items-center gap-7 md:flex">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href} className="relative flex h-full items-center">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-sm font-medium transition-colors focus-visible:outline-none",
                    active
                      ? "text-[#CC3D2E]"
                      : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                  )}
                >
                  {link.label}
                  {link.href === "/options" && optionCount > 0 && (
                    <span className="ml-1.5 rounded-full border border-[#E8C4BF] bg-[#F5E8E6] px-1.5 py-0.5 font-mono text-[10px] text-[#CC3D2E]">
                      {optionCount}
                    </span>
                  )}
                </Link>
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-[1px] h-0.5 bg-[#CC3D2E]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="https://cetonline.karnataka.gov.in/kea/ugcet2026"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-lg border border-[#CC3D2E] px-3 py-1.5 text-sm text-[#CC3D2E] transition-all duration-150 hover:bg-[#F5E8E6] active:scale-[0.97] sm:inline-flex"
          >
            2026 Data
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-[#E5E0D8] text-[#6B6B6B] transition-all duration-150 hover:bg-[#F0EDE8] hover:text-[#1A1A1A] active:scale-[0.97] md:hidden"
            >
              <Menu className="size-4" aria-hidden />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[260px] border-l border-[#E5E0D8] bg-white p-0 text-[#1A1A1A]"
            >
              <SheetTitle className="border-b border-[#E5E0D8] px-5 py-4 text-left">
                <Wordmark />
              </SheetTitle>
              <ul className="flex flex-col p-3">
                {LINKS.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-[#F5E8E6] text-[#CC3D2E]"
                            : "text-[#6B6B6B] hover:bg-[#F0EDE8] hover:text-[#1A1A1A]"
                        )}
                      >
                        {link.label}
                        {link.href === "/options" && optionCount > 0 && (
                          <span className="rounded-full border border-[#E8C4BF] bg-[#F5E8E6] px-1.5 py-0.5 font-mono text-[10px] text-[#CC3D2E]">
                            {optionCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
