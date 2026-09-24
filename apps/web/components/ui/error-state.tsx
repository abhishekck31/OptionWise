import { type ReactNode } from "react";

export interface ErrorStateProps {
  /** What happened — plain language, never vague (SPEC.md "UI / UX"). */
  title: string;
  /** How to fix it. */
  description: string;
  action?: ReactNode;
}

export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 rounded-lg border border-error/30 bg-error-surface px-6 py-10 text-center">
      <h3 className="font-heading text-lg font-semibold text-error-text">{title}</h3>
      <p className="max-w-sm text-sm text-ink/70">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
