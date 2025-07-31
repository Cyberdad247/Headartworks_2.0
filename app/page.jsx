"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, Search, ShoppingCart, User } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 theme-transition">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between py-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center space-x-6">
              <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">SHOP</span>
              <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">JOURNAL</span>
              <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">ABOUT</span>
              <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">CONTACT</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>FREE SHIPPING</span>
              <span>NEWSLETTER</span>
            </div>
          </div>

          {/* Main header */}
          <div className="flex items-center justify-between py-4">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="flex flex-col space-y-4 mt-8">
                    <a href="#" className="text-lg font-medium">Shop</a>
                    <a href="#" className="text-lg font-medium">Journal</a>
                    <a href="#" className="text-lg font-medium">About</a>
                    <a href="#" className="text-lg font-medium">Contact</a>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-wider text-black dark:text-white">
              HEAD ARTWORKS
            </h1>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Search className="h-5 w-5" />
              </Button>
              <ThemeToggle />
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 min-h-[60vh] flex items-center overflow-hidden">
        {/* Hero content here */}
      </section>

      {/* About Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        {/* About content here */}
      </section>

      {/* Featured Collections */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        {/* Collections content here */}
      </section>

      {/* Featured Product Range */}
      <section className="py-16 bg-white dark:bg-gray-950">
        {/* Product range content here */}
      </section>

      {/* Fragrances Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        {/* Fragrances content here */}
      </section>

      {/* Newsletter Footer */}
      <footer className="bg-black dark:bg-gray-950 text-white py-16">
        {/* Footer content here */}
      </footer>
    </div>
  );
}
