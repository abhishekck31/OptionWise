import * as React from "react"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-[#E5E0D8] bg-[#FFFFFF] px-3 py-1.5 text-sm text-[#1A1A1A] transition-colors outline-none placeholder:text-[#9B9B9B] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[#CC3D2E] focus-visible:ring-2 focus-visible:ring-[#CC3D2E]/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
