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
  { href: "/explore", label: "Explore" },
] as const;

const KEA_PORTAL = "https://cetonline.karnataka.gov.in/kea/ugcet2026";

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
        className="flex size-7 items-center justify-center rounded-lg bg-[#CC3D2E] font-mono text-sm font-medium text-white"
      >
        K
      </span>
      <span className="text-[15px] font-medium tracking-[-0.01em] text-[#1A1A1A]">
        KCET Predictor
      </span>
    </Link>
  );
}

function OptionCount({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F0EDE8] px-1 font-mono text-[11px] text-[#6B6B6B]">
      {count}
    </span>
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
    <header className="print-hide sticky top-0 z-50 border-b border-[#E5E0D8] bg-[#F7F4F0]/80 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="relative mx-auto flex h-14 max-w-[1120px] items-center justify-between gap-4 px-6 sm:px-8"
      >
        <Wordmark />

        <ul className="absolute left-1/2 hidden h-full -translate-x-1/2 items-center gap-8 lg:flex">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href} className="relative flex h-full items-center">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none",
                    active
                      ? "text-[#1A1A1A]"
                      : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                  )}
                >
                  {link.label}
                  {link.href === "/options" && <OptionCount count={optionCount} />}
                </Link>
                {active && (
                  <motion.span
                    layoutId="nav-dot"
                    aria-hidden
                    className="absolute bottom-2 left-1/2 -ml-0.5 size-1 rounded-full bg-[#CC3D2E]"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={KEA_PORTAL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 text-[13px] font-medium text-[#6B6B6B] transition-colors duration-150 hover:text-[#1A1A1A] lg:inline-flex"
          >
            Open KEA Portal
            <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden />
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex size-9 items-center justify-center rounded-[10px] border border-[#E0DCD4] text-[#6B6B6B] transition-colors duration-150 hover:bg-[#F0EDE8] hover:text-[#1A1A1A] active:scale-[0.97] lg:hidden"
            >
              <Menu className="size-4" strokeWidth={1.5} aria-hidden />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] border-l border-[#E5E0D8] bg-[#F7F4F0] p-0 text-[#1A1A1A]"
            >
              <SheetTitle className="border-b border-[#E5E0D8] px-6 py-4 text-left">
                <Wordmark />
              </SheetTitle>
              <ul className="flex flex-col gap-1 p-3">
                {LINKS.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between rounded-[10px] px-3 py-2.5 text-[15px] font-medium transition-colors duration-150",
                          active
                            ? "bg-white text-[#1A1A1A]"
                            : "text-[#6B6B6B] hover:bg-[#F0EDE8] hover:text-[#1A1A1A]"
                        )}
                      >
                        <span className="inline-flex items-center gap-2.5">
                          <span
                            aria-hidden
                            className={cn(
                              "size-1 rounded-full",
                              active ? "bg-[#CC3D2E]" : "bg-transparent"
                            )}
                          />
                          {link.label}
                        </span>
                        {link.href === "/options" && (
                          <OptionCount count={optionCount} />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-[#E5E0D8] px-6 py-4">
                <a
                  href={KEA_PORTAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-[#6B6B6B] transition-colors hover:text-[#1A1A1A]"
                >
                  Open KEA Portal
                  <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden />
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
