"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface MaterialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 0 | 1 | 2 | 3 | 4 | 8
  interactive?: boolean
}

const MaterialCard = React.forwardRef<HTMLDivElement, MaterialCardProps>(
  ({ className, elevation = 1, interactive = false, children, ...props }, ref) => {
    const elevationClasses = {
      0: "shadow-none",
      1: "shadow-sm",
      2: "shadow-md",
      3: "shadow-lg",
      4: "shadow-xl",
      8: "shadow-2xl",
    }

    const interactiveClasses = interactive
      ? "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      : ""

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-lg border-0 transition-shadow duration-300",
          elevationClasses[elevation],
          interactiveClasses,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

MaterialCard.displayName = "MaterialCard"

export { MaterialCard }
