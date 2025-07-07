"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface MaterialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "contained" | "outlined" | "text"
  size?: "small" | "medium" | "large"
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  loading?: boolean
  fullWidth?: boolean
}

const MaterialButton = React.forwardRef<HTMLButtonElement, MaterialButtonProps>(
  (
    {
      className,
      variant = "contained",
      size = "medium",
      startIcon,
      endIcon,
      loading = false,
      fullWidth = false,
      children,
      disabled,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [ripple, setRipple] = React.useState<{ x: number; y: number; show: boolean }>({
      x: 0,
      y: 0,
      show: false,
    })

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setRipple({ x, y, show: true })

      if (onClick) {
        onClick(e)
      }

      setTimeout(() => {
        setRipple((prev) => ({ ...prev, show: false }))
      }, 600)
    }

    const baseClasses =
      "relative overflow-hidden transition-all duration-300 font-medium uppercase tracking-wider inline-flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

    const variantClasses = {
      contained: "bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700 active:shadow-xl",
      outlined: "border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 active:bg-blue-100",
      text: "text-blue-600 bg-transparent hover:bg-blue-50 active:bg-blue-100",
    }

    const sizeClasses = {
      small: "px-4 py-2 text-sm min-h-[32px]",
      medium: "px-6 py-3 text-sm min-h-[40px]",
      large: "px-8 py-4 text-base min-h-[48px]",
    }

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          loading && "cursor-not-allowed",
          className,
        )}
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple Effect */}
        {ripple.show && (
          <span
            className="absolute rounded-full bg-white/30 pointer-events-none animate-ping"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
          />
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div className={cn("flex items-center gap-2", loading && "opacity-0")}>
          {startIcon && <span className="flex-shrink-0">{startIcon}</span>}
          {children}
          {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
        </div>
      </button>
    )
  },
)

MaterialButton.displayName = "MaterialButton"

export { MaterialButton }
