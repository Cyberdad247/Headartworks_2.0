"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {theme === "dark" && (
        <video
          src="https://cdn.shopify.com/videos/c/o/v/334e596aeba84406b0d0c9589799e309.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="fixed inset-0 w-full h-full object-cover opacity-10 -z-10 transition-opacity duration-500 theme-video"
        />
      )}
    </>
  )
}
