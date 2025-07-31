"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { useState } from "react"

export default function ThemeTestPage() {
  const [loading, setLoading] = useState(false)

  const variants = [
    'default',
    'destructive', 
    'outline',
    'secondary',
    'ghost',
    'link',
    'success',
    'warning'
  ]

  const sizes = [
    'default',
    'sm',
    'lg',
    'xl',
    'icon',
    'icon-sm',
    'icon-lg'
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          {variants.map(variant => (
            <Button 
              key={variant}
              variant={variant}
              onClick={() => console.log(`${variant} clicked`)}
            >
              {variant}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Button Sizes</h2>
        <div className="flex flex-wrap gap-4 items-center">
          {sizes.map(size => (
            <Button 
              key={size}
              size={size}
              onClick={() => console.log(`${size} clicked`)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Loading States</h2>
        <div className="flex gap-4">
          <Button 
            loading={loading}
            onClick={() => setLoading(!loading)}
          >
            Toggle Loading
          </Button>
          <Button 
            variant="destructive"
            loading={loading}
            onClick={() => setLoading(!loading)}
          >
            Destructive Loading
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Custom Classes</h2>
        <div className="flex gap-4">
          <Button className="rounded-full px-8">
            Custom Rounded
          </Button>
          <Button className="border-4 border-yellow-500">
            Custom Border
          </Button>
        </div>
      </div>
    </div>
  )
}