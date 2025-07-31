"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * @typedef {Object} InputProps
 * @extends {React.InputHTMLAttributes<HTMLInputElement>}
 */

const Input = React.forwardRef(
  /**
   * @param {Object} props
   * @param {string} [props.className]
   * @param {string} [props.type]
   * @param {React.Ref<HTMLInputElement>} ref
   */
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
