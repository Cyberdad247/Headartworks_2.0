"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input shadow-sm",
        success: "data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-input shadow-success",
        danger: "data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-input shadow-danger",
        warning: "data-[state=checked]:bg-yellow-600 data-[state=unchecked]:bg-input shadow-warning",
        info: "data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-input shadow-info",
        gradient: "data-[state=checked]:morph-gradient data-[state=unchecked]:bg-input shadow-lg",
        rainbow: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input shadow-primary glow-rainbow",
        glass: "bg-background/20 backdrop-blur-md border-white/20 data-[state=checked]:bg-background/40",
        neon: "data-[state=checked]:shadow-[0_0_20px_rgba(var(--primary-rgb),0.7)] data-[state=checked]:bg-primary",
        minimal: "data-[state=checked]:bg-primary/50 data-[state=unchecked]:bg-input/50 border-0",
      },
      size: {
        default: "h-5 w-9",
        sm: "h-4 w-7",
        lg: "h-6 w-11",
        xl: "h-7 w-14",
      },
      animation: {
        default: "transition-all duration-200",
        smooth: "transition-all duration-300 ease-in-out",
        bounce: "transition-all duration-300 ease-bounce",
        spring: "transition-all duration-500 ease-spring",
        pulse: "transition-all animate-softPulse",
        elastic: "transition-all duration-500 ease-elastic",
        morph: "transition-all duration-700 ease-out data-[state=checked]:scale-110 data-[state=unchecked]:scale-95",
        swing: "origin-top transition-all duration-500 data-[state=checked]:rotate-12 data-[state=unchecked]:-rotate-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "default",
    },
  }
)

const thumbVariants = cva(
  "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform",
  {
    variants: {
      size: {
        default: "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        sm: "h-3 w-3 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0",
        lg: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        xl: "h-6 w-6 data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0",
      },
      variant: {
        default: "",
        success: "data-[state=checked]:bg-white",
        danger: "data-[state=checked]:bg-white",
        warning: "data-[state=checked]:bg-white",
        info: "data-[state=checked]:bg-white",
        gradient: "data-[state=checked]:bg-white",
      },
      glow: {
        true: "data-[state=checked]:shadow-glow",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      glow: false,
    },
  }
)

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    variant?: "default" | "success" | "danger" | "warning" | "info" | "gradient"
    size?: "default" | "sm" | "lg" | "xl"
    animation?: "default" | "smooth" | "bounce" | "spring"
    glow?: boolean
  }
>(({ className, variant, size, animation, glow, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchVariants({ variant, size, animation, className }))}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb 
      className={cn(thumbVariants({ variant, size, glow }))}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
