"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface MaterialInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  variant?: "outlined" | "filled"
}

const MaterialInput = React.forwardRef<HTMLInputElement, MaterialInputProps>(
  (
    { className, label, error, helperText, startIcon, endIcon, variant = "outlined", type = "text", id, ...props },
    ref,
  ) => {
    const inputId = id || React.useId()
    const [focused, setFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)

    const handleFocus = () => setFocused(true)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false)
      setHasValue(e.target.value.length > 0)
    }

    const inputClasses = cn(
      "w-full px-4 py-3 border rounded-md transition-all duration-300 focus:outline-none peer",
      variant === "outlined" && "bg-white border-gray-300 focus:border-blue-600",
      variant === "filled" &&
        "bg-gray-50 border-b-2 border-transparent border-b-gray-300 focus:border-b-blue-600 rounded-t-md rounded-b-none",
      error && "border-red-500 focus:border-red-500",
      startIcon && "pl-12",
      endIcon && "pr-12",
      className,
    )

    const labelClasses = cn(
      "absolute left-4 transition-all duration-300 pointer-events-none",
      variant === "outlined" && "bg-white px-1",
      focused || hasValue ? "top-0 text-xs -translate-y-1/2 text-blue-600" : "top-1/2 -translate-y-1/2 text-gray-500",
      error && "text-red-500",
    )

    return (
      <div className="relative w-full">
        <div className="relative">
          {startIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{startIcon}</div>}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={inputClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {label && (
            <label htmlFor={inputId} className={labelClasses}>
              {label}
            </label>
          )}

          {endIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{endIcon}</div>}
        </div>

        {(error || helperText) && (
          <p className={cn("mt-1 text-sm", error ? "text-red-500" : "text-gray-500")}>{error || helperText}</p>
        )}
      </div>
    )
  },
)

MaterialInput.displayName = "MaterialInput"

export { MaterialInput }
