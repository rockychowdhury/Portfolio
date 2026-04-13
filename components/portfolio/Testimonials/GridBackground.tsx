"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function GridBackground() {
  const [pulses, setPulses] = useState<{ id: number; top: string; left: string }[]>([]);

  // Periodically add a signal pulse to a random grid cell
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const top = `${Math.floor(Math.random() * 20) * 5}%`;
      const left = `${Math.floor(Math.random() * 20) * 5}%`;
      
      setPulses((prev) => [...prev.slice(-10), { id, top, left }]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
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

      {/* Pulsing Signal Effect */}
      {pulses.map((pulse) => (
        <motion.div
          key={pulse.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.2, 0], scale: [0.5, 1.2, 0.8] }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute h-[80px] w-[80px] bg-primary/20 blur-xl rounded-full"
          style={{ top: pulse.top, left: pulse.left }}
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
