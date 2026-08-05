"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface GridBackgroundProps {
  isPaused?: boolean;
  pulseColor?: string;
}

export default function GridBackground({ isPaused = false, pulseColor = "bg-primary/20" }: GridBackgroundProps) {
  // CSS-based pulses are more performant than React state for this background effect
  const pulsePositions = [
    { top: '10%', left: '15%' },
    { top: '80%', left: '85%' },
    { top: '40%', left: '70%' },
    { top: '60%', left: '20%' },
    { top: '25%', left: '45%' },
    { top: '90%', left: '35%' },
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]">
      {/* Static Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} 
      />

      {/* Pulsing Signal Effect (Pure CSS for performance) */}
      {pulsePositions.map((pos, i) => (
        <div
          key={i}
          className={`absolute h-[80px] w-[80px] ${pulseColor} blur-xl rounded-full ${isPaused ? "" : "animate-pulse"}`}
          style={{ 
            top: pos.top, 
            left: pos.left,
            animationDelay: `${i * 1.5}s`,
            animationDuration: '4s'
          }}
        />
      ))}

      {/* Subtle Breathing Overlay */}
      <motion.div 
        animate={{ opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-transparent"
      />
    </div>
  );
}
