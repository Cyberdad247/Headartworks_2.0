"use client";

import { useEffect } from "react";

/**
 * ClientBody Component
 * 
 * A client-side wrapper component that manages body styling and ensures
 * consistent appearance during hydration. Particularly useful for
 * preventing style flashes and maintaining smooth font rendering.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render
 * @returns {React.ReactElement} Wrapped children with consistent styling
 */
export default function ClientBody({
  children,
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <div className="antialiased min-h-screen flex flex-col">
      {children}
    </div>
  );
}
