"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface BackgroundTextProps {
  activeIndex: number;
  projects: any[];
}

export default function BackgroundText({ activeIndex, projects }: BackgroundTextProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 100 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const moveX = useTransform(springX, [0, 1920], [50, -50]);
  const moveY = useTransform(springY, [0, 1080], [50, -50]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        {projects.map((project, i) => {
          if (i !== activeIndex) return null;

          return (
            <motion.h2
              key={project._id || i}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
              animate={{ opacity: 0.1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ 
                WebkitTextStroke: "1px var(--stroke-color, rgba(0, 0, 0, 0.15))",
                x: moveX,
                y: moveY,
              }}
              className="absolute whitespace-nowrap text-[16vw] font-black uppercase tracking-tighter text-transparent select-none leading-none font-anton dark:[--stroke-color:rgba(255,255,255,0.15)]"
            >
              {project.title}
            </motion.h2>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

