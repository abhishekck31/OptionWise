import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#CC3D2E]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F4F0] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[#CC3D2E] text-white hover:bg-[#B5351F] active:bg-[#A02E1A]",
        destructive:
          "bg-[#CC3D2E] text-white hover:bg-[#B5351F]",
        outline:
          "border border-[#E5E0D8] bg-transparent text-[#1A1A1A] hover:bg-[#F0EDE8] hover:border-[#C9C4BC]",
        secondary:
          "border border-[#CC3D2E] bg-transparent text-[#CC3D2E] hover:bg-[#F5E8E6]",
        ghost:
          "text-[#6B6B6B] hover:bg-[#F0EDE8] hover:text-[#1A1A1A]",
        link: "text-[#CC3D2E] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2.5 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
