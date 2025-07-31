import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} ButtonProps
 * @property {string} [className] - Additional CSS classes to apply
 * @property {string} [variant] - Button variant (default, destructive, outline, secondary, ghost, link, success, warning, glass, gradient, soft)
 * @property {string} [size] - Button size (default, sm, lg, xl, 2xl, icon, icon-sm, icon-lg)
 * @property {string} [animation] - Animation style (none, default, smooth, bounce, pulse, shimmer)
 * @property {string} [rounded] - Border radius style (none, sm, default, lg, full)
 * @property {boolean} [asChild] - Whether to render as child component
 * @property {boolean} [loading] - Whether the button is in a loading state
 * @property {boolean} [disabled] - Whether the button is disabled
 * @property {React.ReactNode} [children] - The button content
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 theme-transition",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:bg-primary/95",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/95",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:bg-accent/90",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-secondary/85",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/90",
        link: "text-primary underline-offset-4 hover:underline focus-visible:ring-0",
        success: "bg-green-600 text-white shadow hover:bg-green-700 active:bg-green-800",
        warning: "bg-yellow-500 text-white shadow hover:bg-yellow-600 active:bg-yellow-700",
        glass: "backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 text-white shadow-glow",
        gradient: "bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90",
        soft: "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
        "2xl": "h-16 rounded-lg px-12 text-xl",
      },
      animation: {
        none: "",
        default: "transition-all active:scale-95",
        smooth: "transition-all duration-300 ease-in-out hover:scale-105 active:scale-100",
        bounce: "transition-transform hover:animate-bounce",
        pulse: "animate-pulse",
        shimmer: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
      },
      rounded: {
        default: "rounded-md",
        none: "rounded-none",
        sm: "rounded-sm",
        lg: "rounded-lg",
        full: "rounded-full",
      },
      loading: {
        true: "relative !text-transparent hover:!text-transparent !cursor-wait [&_svg]:animate-spin [&_svg]:block [&_svg]:mx-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    disabled,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {children}
        {loading && (
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
