"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * @typedef {Object} SwitchProps
 * @extends {React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>}
 * @property {('default'|'success'|'danger'|'warning'|'info'|'gradient')} [variant] - The visual style variant of the switch
 * @property {('default'|'sm'|'lg'|'xl')} [size] - The size of the switch
 * @property {('default'|'smooth'|'bounce'|'spring')} [animation] - The animation style of the switch
 * @property {boolean} [glow] - Whether to apply a glow effect when checked
 */

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        success: "data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-input",
        danger: "data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-input",
        warning: "data-[state=checked]:bg-yellow-600 data-[state=unchecked]:bg-input",
        info: "data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-input",
        gradient: "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-purple-600 data-[state=unchecked]:bg-input",
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

const Switch = React.forwardRef((props, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchVariants({ 
      variant: props.variant, 
      size: props.size, 
      animation: props.animation, 
      className: props.className 
    }))}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb 
      className={cn(thumbVariants({ 
        variant: props.variant, 
        size: props.size, 
        glow: props.glow 
      }))}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
