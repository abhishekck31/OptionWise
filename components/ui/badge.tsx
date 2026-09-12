import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-[#CC3D2E] text-white",
        secondary:
          "bg-[#F0EDE8] text-[#6B6B6B] border border-[#E5E0D8]",
        destructive:
          "bg-[#FEE8E6] text-[#CC3D2E] border border-[#F5C4BF]",
        outline:
          "border border-[#E5E0D8] text-[#1A1A1A] bg-[#FFFFFF]",
        safe:
          "bg-[#E8F5EE] text-[#1F7A4A] border border-[#B8DFC9]",
        target:
          "bg-[#FEF3E2] text-[#B45309] border border-[#F5D9A0]",
        reach:
          "bg-[#F5E8E6] text-[#CC3D2E] border border-[#E8C4BF]",
        ghost: "text-[#6B6B6B] hover:bg-[#F0EDE8]",
        link: "text-[#CC3D2E] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
