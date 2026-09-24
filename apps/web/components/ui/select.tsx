import { type SelectHTMLAttributes, useId } from "react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

/** A native <select> — on mobile this opens the OS's own picker, which is more
 * usable than a custom dropdown (SPEC.md "UI / UX": mobile-first). */
export function Select({ label, hint, error, options, placeholder, className, ...props }: SelectProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="text-xs text-ink/60">
          {hint}
        </p>
      ) : null}
      <select
        id={id}
        aria-describedby={cn(hintId, errorId) || undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          "h-11 rounded-lg border bg-card px-3 text-base text-ink",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          error ? "border-error" : "border-ink/15",
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="text-xs text-error-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}
