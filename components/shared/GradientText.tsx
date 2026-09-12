import { cn } from "@/lib/utils";

/** Accent-coloured text, used for the one number that matters on a screen. */
export function GradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-[#CC3D2E]",
        className
      )}
    >
      {children}
    </span>
  );
}

export default GradientText;
