"use client";

// components/SmoothScrollProvider.tsx
"use client";

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
      lerp: 0.06, // Ultra-fluid, weighted interpolation
      wheelMultiplier: 0.9, // Controlled, premium resistance
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Integration with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis through GSAP's ticker — single unified RAF loop
    // instead of running a separate requestAnimationFrame loop
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000); // GSAP ticker uses seconds, Lenis expects ms
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0); // Prevent GSAP from throttling on lag

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return <>{children}</>;
}
