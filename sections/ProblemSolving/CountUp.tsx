"use client";

import { useEffect, useRef } from "react";
import { useInView, useSpring, motion } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
  delay?: number;
}

export default function CountUp({ to, from = 0, duration = 2, className = "", delay = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  
  // Spring config tailored for satisfying count up
  const spring = useSpring(from, {
    stiffness: 80,
    damping: 20,
    duration: duration * 1000 // duration isn't strictly used in spring with stiffness/damping, but we can configure bounce.
  });

  useEffect(() => {
    if (inView) {
      setTimeout(() => {
        spring.set(to);
      }, delay * 1000);
    }
  }, [inView, spring, to, delay]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString();
      }
    });
  }, [spring]);

  return <motion.span ref={ref} className={className}>{from}</motion.span>;
}
