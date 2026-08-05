"use client";

// components/SmoothScrollProvider.tsx

import { useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Disable on admin routes
    if (pathname?.startsWith("/admin")) return;

    // Skip Lenis on mobile/touch devices for better native performance and to avoid scroll lock issues
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                    (window.innerWidth <= 768) ||
                    ('ontouchstart' in window);
    
    if (isMobile) return;

    const lenis = new Lenis({
      lerp: 0.09, // Balanced smoothing — low enough to feel smooth, high enough to avoid a laggy "crawl"
      wheelMultiplier: 0.9, // Controlled, premium resistance
      touchMultiplier: 1.5,
      infinite: false,
      smoothWheel: true,
      syncTouch: false,
    });

    // Expose the instance globally so anchor scrolls route through Lenis
    // instead of native scrollIntoView (which would fight Lenis and stutter).
    (window as any).__lenis = lenis;
    // Snap to top on initial mount / route change
    lenis.scrollTo(0, { immediate: true });

    // Integration with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis through GSAP's ticker — single unified RAF loop
    // instead of running a separate requestAnimationFrame loop
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000); // GSAP ticker uses seconds, Lenis expects ms
    };
    gsap.ticker.add(tickerCallback);
    // Keep lag smoothing ON so a single slow frame doesn't hard-stutter the scroll
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      gsap.ticker.remove(tickerCallback);
      if ((window as any).__lenis === lenis) {
        delete (window as any).__lenis;
      }
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [pathname]);

  return <>{children}</>;
}
