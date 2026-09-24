import { type ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

/** SPEC.md "UI / UX": "Empty states tell the student what to do next." */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-ink/15 px-6 py-10 text-center">
      <h3 className="font-heading text-lg font-semibold text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-ink/70">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
