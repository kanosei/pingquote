"use client";

import { useState, useEffect } from "react";

// Tailwind's default breakpoints
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

/**
 * Hook to detect current breakpoint based on window width
 * SSR-safe: returns null on server, updates on client mount
 */
export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint | null>(null);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width >= breakpoints["2xl"]) {
        setCurrentBreakpoint("2xl");
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint("xl");
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint("lg");
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint("md");
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint("sm");
      } else {
        setCurrentBreakpoint(null); // Mobile (< 640px)
      }
    };

    // Initial update
    updateBreakpoint();

    // Listen for resize events
    window.addEventListener("resize", updateBreakpoint);

    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return currentBreakpoint;
}

/**
 * Hook to check if current viewport is mobile
 * Returns true for screens smaller than md breakpoint (< 768px)
 */
export function useIsMobile() {
  const breakpoint = useBreakpoint();

  // null or 'sm' means mobile
  return breakpoint === null || breakpoint === "sm";
}

/**
 * Hook to check if current viewport is tablet
 * Returns true for screens between md and lg (768px - 1023px)
 */
export function useIsTablet() {
  const breakpoint = useBreakpoint();

  return breakpoint === "md";
}

/**
 * Hook to check if current viewport is desktop
 * Returns true for screens lg and above (>= 1024px)
 */
export function useIsDesktop() {
  const breakpoint = useBreakpoint();

  return breakpoint === "lg" || breakpoint === "xl" || breakpoint === "2xl";
}
