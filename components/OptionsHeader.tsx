"use client";

import Reveal from "@/components/motion/Reveal";
import { useKCETHydration, useOptionList } from "@/hooks/useKCETStore";

/**
 * The option builder's opening: a headline on the left, the one rule that
 * matters on the right, and the size of the list set huge behind both.
 */
export function OptionsHeader() {
  const hydrated = useKCETHydration();
  const optionList = useOptionList();
  const count = hydrated ? optionList.length : 0;

  return (
    <section className="relative isolate overflow-hidden pb-14 pt-16 md:pt-24">
      {/* Grid break: the list's length, cut off by the right edge. */}
      <p
        aria-hidden
        className="watermark -right-[0.06em] top-4 -z-10 text-[clamp(9rem,26vw,24rem)] text-black/[0.03]"
      >
        {String(count).padStart(2, "0")}
      </p>

      <div className="wrap">
        <div className="grid-editorial items-end gap-y-6">
          <Reveal className="col-span-4 md:col-span-5 xl:col-span-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9B9B9B]">
              Option Entry Builder
            </p>
            <h1 className="mt-4 text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] tracking-[-0.04em] text-[#1A1A1A]">
              <span className="block font-light">Order your</span>
              <span className="block font-bold">options.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1} className="col-span-4 md:col-span-3 xl:col-span-4 xl:col-start-9">
            <p className="text-[15px] leading-[1.7] text-[#6B6B6B]">
              KEA walks your list from the top and gives you the first seat you
              qualify for. Drag to set the order, and keep enough safe choices at
              the bottom that the list cannot run out.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default OptionsHeader;
