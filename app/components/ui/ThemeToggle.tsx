"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [videoVisible, setVideoVisible] = React.useState(false)

  const handleThemeChange = (newTheme) => {
    console.log(`Changing theme from ${theme} to ${newTheme}`)
    setVideoVisible(true)
    setTheme(newTheme)
    
    // Hide video after animation completes
    setTimeout(() => {
      setVideoVisible(false)
      console.log(`Theme changed to ${newTheme}`)
    }, 1500) // Duration matches the video length
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleThemeChange("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Theme transition videos */}
      <video
        className={cn(
          "theme-video theme-video-dark",
          videoVisible && theme === 'dark' && "visible"
        )}
        src="https://cdn.shopify.com/videos/c/o/v/334e596aeba84406b0d0c9589799e309.mp4"
        muted
        playsInline
        autoPlay={videoVisible && theme === 'dark'}
      />
      <video
        className={cn(
          "theme-video theme-video-light",
          videoVisible && theme === 'light' && "visible"
        )}
        src="https://cdn.shopify.com/videos/c/o/v/334e596aeba84406b0d0c9589799e309.mp4"
        muted
        playsInline
        autoPlay={videoVisible && theme === 'light'}
        style={{ filter: 'invert(1)' }} // Invert colors for light theme transition
      />
    </>
  )
}
