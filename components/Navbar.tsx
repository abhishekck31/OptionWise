"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { VERIFIED_YEAR } from "@/lib/data/cutoffs";
import { cn } from "@/lib/utils";

/** The curve every transition in the bar uses. */
const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

const KEA_PORTAL = "https://cetonline.karnataka.gov.in";

/** Keep in step with the body's top padding in the root layout. */
export const NAV_HEIGHT = 52;

const LINKS = [
  { href: "/predict/college", label: "College Finder", match: ["/predict/college"] },
  // Every college's year-wise page counts as part of the cut-offs section.
  { href: "/cutoffs", label: "Cut-offs", match: ["/cutoffs", "/college"] },
  { href: "/options", label: "Option Entry", match: ["/options"] },
] as const;

/** A link is active on its own routes and anything nested under them. */
function isActive(pathname: string, match: readonly string[]): boolean {
  return match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
}

/* ─── Logo ────────────────────────────────────────────────────────────────── */

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="KCET Predictor, home"
      className="group flex items-center gap-2.5 rounded-lg no-underline"
    >
      <span
        aria-hidden
        className={cn(
          "flex size-[26px] items-center justify-center rounded-[7px] bg-[#1A1A1A] font-mono text-[13px] font-bold tracking-[-0.02em] text-white transition-colors duration-200 group-hover:bg-[#CC3D2E]",
          EASE_CLASS
        )}
      >
        K
      </span>
      <span aria-hidden className="whitespace-nowrap text-[14px] leading-none">
        <span className="font-semibold tracking-[-0.02em] text-[#1A1A1A]">KCET</span>{" "}
        <span className="font-normal tracking-[-0.01em] text-[#9B9B9B]">Predictor</span>
      </span>
    </Link>
  );
}

/* ─── Data badge ──────────────────────────────────────────────────────────── */

function DataBadge({ className }: { className?: string }) {
  return (
    <span className={cn("items-center gap-1.5", className)}>
      <span
        aria-hidden
        className="relative flex size-1.5 rounded-full bg-[#10B981] before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-[#10B981] before:opacity-75 before:[animation-duration:2s]"
      />
      <span className="text-[12px] font-medium text-[#6B6B6B]">{VERIFIED_YEAR} Data</span>
    </span>
  );
}

/* ─── Hamburger ───────────────────────────────────────────────────────────── */

// Lines are 1px tall with a 6px gap, so their centres sit 7px apart: moving the
// outer two 7px onto the middle before rotating is what makes them cross dead
// centre rather than a couple of pixels off.
const topLine: Variants = {
  closed: { y: 0, rotate: 0 },
  open: { y: 7, rotate: 45 },
};
const middleLine: Variants = {
  closed: { opacity: 1, scaleX: 1 },
  open: { opacity: 0, scaleX: 0 },
};
const bottomLine: Variants = {
  closed: { y: 0, rotate: 0 },
  open: { y: -7, rotate: -45 },
};

function Hamburger({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const line = "block h-px w-5 rounded-full bg-[#1A1A1A]";
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="mobile-menu"
      initial={false}
      animate={open ? "open" : "closed"}
      transition={{ duration: 0.3, ease: EASE }}
      className="flex size-8 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-none bg-transparent md:hidden"
    >
      <motion.span variants={topLine} transition={{ duration: 0.3, ease: EASE }} className={line} />
      <motion.span variants={middleLine} transition={{ duration: 0.2, ease: EASE }} className={line} />
      <motion.span variants={bottomLine} transition={{ duration: 0.3, ease: EASE }} className={line} />
    </motion.button>
  );
}

/* ─── Mobile menu ─────────────────────────────────────────────────────────── */

const menuList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const menuItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

function MobileMenu({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.4, ease: EASE }}
      className="print-hide fixed inset-0 z-40 flex flex-col bg-[#F7F4F0] md:hidden"
    >
      {/* The bar itself stays on top, so its logo and its hamburger — now an X —
          are this overlay's header. This spacer keeps the links clear of it. */}
      <div aria-hidden style={{ height: NAV_HEIGHT }} className="shrink-0" />

      <nav aria-label="Mobile" className="flex flex-1 items-center justify-center px-6">
        <motion.ul variants={menuList} initial="hidden" animate="show" className="flex flex-col items-center gap-3">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.match);
            return (
              <motion.li key={link.href} variants={menuItem}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block text-center text-[clamp(2rem,6vw,3rem)] leading-[1.15] tracking-[-0.03em] no-underline transition-colors duration-200",
                    EASE_CLASS,
                    active
                      ? "font-medium text-[#1A1A1A]"
                      : "font-light text-[#C9C4BC] hover:text-[#1A1A1A]"
                  )}
                >
                  {link.label}
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
        className="flex flex-col items-center gap-2 px-6 pb-10"
      >
        <a
          href={KEA_PORTAL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] text-[#9B9B9B] no-underline transition-colors hover:text-[#1A1A1A]"
        >
          Open KEA Portal ↗
        </a>
        <p className="text-[12px] text-[#C9C4BC]">© {new Date().getFullYear()} KCET Predictor</p>
      </motion.div>
    </motion.div>
  );
}

/* ─── The bar ─────────────────────────────────────────────────────────────── */

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Transparent at the very top, so the page reads as floating free; glass
  // fades in over the first 20px and firms up by 60px.
  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 20, 60],
    ["rgba(247, 244, 240, 0)", "rgba(247, 244, 240, 0.75)", "rgba(247, 244, 240, 0.92)"]
  );
  const border = useTransform(
    scrollY,
    [0, 20, 60],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.06)", "rgba(229, 224, 216, 1)"]
  );

  // A navigation always lands with the menu shut.
  useEffect(() => setOpen(false), [pathname]);

  // The page underneath must not scroll while the overlay covers it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // The overlay can outlive a resize to desktop width; close it there.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const onChange = () => desktop.matches && setOpen(false);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        className="print-hide fixed inset-x-0 top-0 z-50 border-b border-solid"
        style={{
          height: NAV_HEIGHT,
          backgroundColor: background,
          // With the overlay open the bar is its header, so the rule goes.
          borderBottomColor: open ? "rgba(0, 0, 0, 0)" : border,
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <div className="mx-auto grid h-full max-w-[1120px] grid-cols-[1fr_auto_1fr] items-center px-6">
          {/* ── Logo ── */}
          {/* Zones are pinned to columns: on a phone the centre nav is
              display:none, and unpinned the actions would drop into its slot. */}
          <div className="col-start-1 justify-self-start">
            <Logo onClick={() => setOpen(false)} />
          </div>

          {/* ── Links ── */}
          <nav aria-label="Primary" className="col-start-2 hidden justify-self-center md:block">
            <ul className="flex items-center gap-1">
              {LINKS.map((link) => {
                const active = isActive(pathname, link.match);
                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium no-underline transition-[color,background-color] duration-150",
                        EASE_CLASS,
                        active
                          ? "bg-black/[0.06] text-[#1A1A1A]"
                          : "text-[#6B6B6B] hover:bg-black/[0.04] hover:text-[#1A1A1A]"
                      )}
                    >
                      {link.label}
                    </Link>
                    {active && (
                      <motion.span
                        layoutId="navdot"
                        aria-hidden
                        // Centred with auto margins rather than a translate, which
                        // the layout animation's own transform would fight.
                        className="absolute inset-x-0 -bottom-[10px] mx-auto size-[3px] rounded-full bg-[#CC3D2E]"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ── Actions ── */}
          <div className="col-start-3 flex items-center gap-3 justify-self-end">
            {/* Between 768 and 1024 the links and the button need the room. */}
            <DataBadge className="hidden min-[380px]:max-md:inline-flex lg:inline-flex" />

            <a
              href={KEA_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="button"
              className={cn(
                "hidden h-8 items-center whitespace-nowrap rounded-lg bg-[#1A1A1A] px-3.5 text-[13px] font-medium tracking-[-0.01em] text-white no-underline transition-[background-color,transform] duration-200 hover:bg-[#CC3D2E] active:scale-[0.97] md:inline-flex",
                EASE_CLASS
              )}
            >
              Open KEA →
            </a>

            <Hamburger open={open} onToggle={() => setOpen((v) => !v)} />
          </div>
        </div>
      </motion.header>

      {/* A sibling of the bar, not a child: backdrop-filter makes an element the
          containing block for fixed descendants, which would trap the overlay
          inside the 52px bar. */}
      <AnimatePresence>
        {open && <MobileMenu pathname={pathname} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </MotionConfig>
  );
}

export default Navbar;
