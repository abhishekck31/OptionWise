"use client";

import { Search } from "lucide-react";

export interface EmptyStateProps {
  onReset: () => void;
  title?: string;
  description?: string;
}

export function EmptyState({
  onReset,
  title = "No colleges match these filters",
  description = "Widen the search — clear the text box, switch back to all branches, or pick \u201CAll choices\u201D to see every seat your rank reaches.",
}: EmptyStateProps) {
  return (
    <div className="bg-white border border-white/8 rounded-xl p-12 text-center">
      <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center mx-auto mb-4 text-[#9B9B9B]">
        <Search className="w-6 h-6" aria-hidden />
      </div>
      <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">{title}</h3>
      <p className="text-xs text-[#6B6B6B] max-w-md mx-auto mb-6">{description}</p>
      <button
        onClick={onReset}
        className="bg-transparent hover:bg-[#F0EDE8] border border-[#E5E0D8] text-xs font-medium text-[#1A1A1A] px-4 py-2 rounded-lg transition-colors"
      >
        Clear filters
      </button>
    </div>
  );
}

export default EmptyState;
