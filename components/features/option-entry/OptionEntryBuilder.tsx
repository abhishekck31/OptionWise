"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BookmarkCheck, Sparkles } from "lucide-react";
import { suggestOptionList } from "@/lib/predict";
import {
  useAddToOptionList,
  useClearOptionList,
  useOptionList,
  usePreferenceInput,
  useRemoveFromOptionList,
  useReorderOptionList,
} from "@/hooks/useKCETStore";
import OptionItem from "./OptionItem";
import ExportPanel from "./ExportPanel";
import StrategyAdvisor, { OptionEntryGuidance } from "./StrategyAdvisor";

/**
 * The option-entry list, in submission order.
 *
 * Order is the whole point of this screen, so it can be changed three ways:
 * dragging, the arrow buttons, or the keyboard once the grip has focus.
 */
export function OptionEntryBuilder() {
  const optionList = useOptionList();
  const preferences = usePreferenceInput();
  const addToOptionList = useAddToOptionList();
  const removeFromOptionList = useRemoveFromOptionList();
  const reorderOptionList = useReorderOptionList();
  const clearOptionList = useClearOptionList();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAutoPopulate = () => {
    const { aspirational, moderate, safe } = suggestOptionList(preferences);
    [...aspirational, ...moderate, ...safe].forEach(addToOptionList);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= optionList.length) return;
    reorderOptionList(index, target);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = optionList.findIndex((entry) => entry.id === active.id);
    const to = optionList.findIndex((entry) => entry.id === over.id);
    if (from < 0 || to < 0) return;

    reorderOptionList(from, to);
  };

  const ids = optionList.map((entry) => entry.id);

  return (
    <section
      id="option-entry"
      className="py-16 md:py-24 max-w-[1200px] mx-auto px-6 sm:px-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#CC3D2E] mb-2">
            <BookmarkCheck className="w-4 h-4" aria-hidden />
            <span>Option entry</span>
          </div>
          <h2 className="text-3xl font-light tracking-tight text-[#1A1A1A]">
            Your choice list, in order
          </h2>
          <p className="text-sm text-[#6B6B6B] mt-1 max-w-2xl">
            KEA fills seats by walking down this list from the top. Put the
            colleges you want most first, and keep enough safe options at the
            bottom that the list cannot run out.
          </p>
        </div>

        <ExportPanel
          optionList={optionList}
          candidateRank={preferences.rank}
          category={preferences.category}
          onAutoPopulate={handleAutoPopulate}
          onClear={clearOptionList}
        />
      </div>

      <StrategyAdvisor
        optionList={optionList}
        candidateRank={preferences.rank}
        category={preferences.category}
      />

      {optionList.length === 0 ? (
        <div className="bg-white border border-white/8 rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center mx-auto mb-4 text-[#9B9B9B]">
            <BookmarkCheck className="w-6 h-6" aria-hidden />
          </div>
          <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">
            Nothing on your list yet
          </h3>
          <p className="text-xs text-[#6B6B6B] max-w-md mx-auto mb-6">
            Start from a suggested order built around your rank, then move
            things about. Or add colleges one at a time from the predictor.
          </p>
          <button
            onClick={handleAutoPopulate}
            className="bg-[#CC3D2E] hover:bg-[#B5351F] text-white text-xs font-medium px-5 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#CC3D2E]" aria-hidden />
            <span>
              Build a list for #{preferences.rank.toLocaleString("en-IN")}
            </span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-white/8 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/8 flex items-center justify-between gap-3 text-xs text-[#6B6B6B]">
            <span>Drag a row, or use the arrows, to change priority</span>
            <span className="hidden sm:inline">{optionList.length} options</span>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              <div className="divide-y divide-white/5">
                {optionList.map((entry, idx) => (
                  <OptionItem
                    key={entry.id}
                    entry={entry}
                    index={idx}
                    total={optionList.length}
                    onMove={handleMove}
                    onRemove={removeFromOptionList}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      <OptionEntryGuidance />
    </section>
  );
}

export default OptionEntryBuilder;
