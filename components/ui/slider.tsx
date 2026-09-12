"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

/**
 * Range slider.
 *
 * The filled portion reads its colour from `--slider-fill`, so a caller can
 * let the fill follow the value — the marks sliders turn red, amber then green
 * as the number climbs — without reaching into the internals.
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-1 w-full grow overflow-hidden rounded-full bg-[#E5E0D8]"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full"
          style={{ background: "var(--slider-fill, #CC3D2E)" }}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          style={{ borderColor: "var(--slider-fill, #CC3D2E)" }}
          className="block size-[18px] shrink-0 cursor-grab rounded-full border-2 bg-white shadow-[0_1px_3px_rgba(26,26,26,0.12)] transition-transform duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 active:cursor-grabbing active:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#CC3D2E]/10 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
