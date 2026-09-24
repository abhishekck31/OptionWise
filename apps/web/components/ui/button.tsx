import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "default" | "sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render as the single child element instead of a <button> — e.g.
   * <Button asChild><Link href="/x">Go</Link></Button> — so a link can look like a
   * button without nesting an <a> inside a <button>. */
  asChild?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand text-brand-contrast hover:opacity-90",
  secondary: "border border-ink/15 bg-card text-ink hover:bg-ink/5",
  ghost: "text-ink hover:bg-ink/5",
};

// Both sizes keep the 44px minimum touch target (SPEC.md "UI / UX" -> Quality
// floor) — "sm" varies padding/text size only, never height.
const SIZE_CLASSES: Record<ButtonSize, string> = {
  default: "h-11 px-5 text-sm",
  sm: "h-11 px-3 text-xs",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "default", asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        "disabled:pointer-events-none disabled:opacity-50",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    />
  );
});
