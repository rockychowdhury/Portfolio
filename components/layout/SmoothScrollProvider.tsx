"use client";

// components/SmoothScrollProvider.tsx

import { ReactNode } from "react";

// Smooth scroll (Lenis) is intentionally disabled. Its main-thread lerp loop
// (driven by a continuous GSAP ticker) caused scroll jank, frame drops and
// stutter, and fought React re-renders while it ran every frame — even when idle.
// Native scrolling is compositor-driven and costs nothing while idle, and
// anchor navigation falls back to window.scrollTo / scrollIntoView in lib/lenis.
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
