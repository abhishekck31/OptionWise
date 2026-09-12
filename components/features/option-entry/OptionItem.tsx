"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-react";
import { ROUNDS } from "@/types";
import type { OptionEntry, Tier } from "@/types";

const BADGE: Record<Tier, string> = {
  Safe: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Moderate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Aspirational: "bg-[#F5E8E6] text-[#CC3D2E] border-[#E8C4BF]",
};

export interface OptionItemProps {
  entry: OptionEntry;
  index: number;
  total: number;
  onMove: (index: number, direction: "up" | "down") => void;
  onRemove: (id: string) => void;
}

/** One preference in the option-entry list. Draggable, and movable by keyboard. */
export function OptionItem({
  entry,
  index,
  total,
  onMove,
  onRemove,
}: OptionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: entry.id });

  const { prediction } = entry;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 flex items-center justify-between gap-4 bg-white transition-colors hover:bg-white/[0.02] ${
        isDragging ? "relative z-10 shadow-lg shadow-black/40" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          className="p-1 -ml-1 rounded text-[#9B9B9B] hover:text-[#6B6B6B] cursor-grab active:cursor-grabbing touch-none"
          aria-label={`Reorder ${prediction.college.shortName} ${prediction.branch}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" aria-hidden />
        </button>

        <span className="font-mono text-sm font-semibold w-7 h-7 rounded-md bg-[#F0EDE8] border border-white/8 flex items-center justify-center text-[#1A1A1A] flex-shrink-0">
          {index + 1}
        </span>

        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-transparent border border-white/8 text-[#1A1A1A]">
              {prediction.college.kea_code}
            </span>
            <span className="font-medium text-sm text-[#1A1A1A] truncate">
              {prediction.college.name}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${BADGE[entry.tier]}`}
            >
              {entry.tier.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#6B6B6B] flex-wrap">
            <span className="text-[#1A1A1A] font-medium">
              {prediction.branchName}
            </span>
            <span className="text-[#9B9B9B]">&bull;</span>
            <span className="font-mono">
              {ROUNDS[prediction.round]} closed #
              {prediction.closingRank.toLocaleString("en-IN")}
            </span>
            <span className="text-[#9B9B9B]">&bull;</span>
            <span>{prediction.chancePercent}% chance</span>
          </div>

          {entry.userNote && (
            <p className="mt-1 text-xs text-[#9B9B9B] italic truncate">
              {entry.userNote}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => onMove(index, "up")}
          disabled={index === 0}
          className="p-1.5 rounded-md bg-transparent hover:bg-[#F0EDE8] border border-white/8 text-[#6B6B6B] hover:text-[#1A1A1A] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Move up one place"
        >
          <ArrowUp className="w-3.5 h-3.5" aria-hidden />
        </button>

        <button
          onClick={() => onMove(index, "down")}
          disabled={index === total - 1}
          className="p-1.5 rounded-md bg-transparent hover:bg-[#F0EDE8] border border-white/8 text-[#6B6B6B] hover:text-[#1A1A1A] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Move down one place"
        >
          <ArrowDown className="w-3.5 h-3.5" aria-hidden />
        </button>

        <button
          onClick={() => onRemove(entry.id)}
          className="p-1.5 rounded-md bg-transparent hover:bg-red-500/20 border border-white/8 text-[#6B6B6B] hover:text-[#CC3D2E] transition-colors ml-1"
          aria-label={`Remove ${prediction.college.shortName} ${prediction.branch}`}
        >
          <Trash2 className="w-3.5 h-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export default OptionItem;
