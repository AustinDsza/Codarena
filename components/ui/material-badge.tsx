"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface MaterialBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error"
  size?: "small" | "medium"
}

const MaterialBadge = React.forwardRef<HTMLSpanElement, MaterialBadgeProps>(
  ({ className, variant = "default", size = "medium", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-gray-100 text-gray-800 border-gray-200",
      primary: "bg-blue-100 text-blue-800 border-blue-200",
      secondary: "bg-cyan-100 text-cyan-800 border-cyan-200",
      success: "bg-green-100 text-green-800 border-green-200",
      warning: "bg-orange-100 text-orange-800 border-orange-200",
      error: "bg-red-100 text-red-800 border-red-200",
    }

    const sizeClasses = {
      small: "px-2 py-0.5 text-xs",
      medium: "px-2.5 py-1 text-sm",
    }

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium border transition-colors duration-200",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </span>
    )
  },
)

MaterialBadge.displayName = "MaterialBadge"

export { MaterialBadge }
