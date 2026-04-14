"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  isActive: boolean;
}

export default function AnimatedBorder({ children, isActive }: Props) {
  if (!isActive) return <>{children}</>;

  return (
    <div className="relative p-[2px] rounded-[2rem] overflow-hidden group/border">
      {/* Animated Gradient Background */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_150deg,var(--primary)_180deg,transparent_210deg,transparent_360deg)] opacity-60 group-hover/border:opacity-100 transition-opacity"
      />
      
      {/* Inner Content Container */}
      <div className="relative bg-background rounded-[1.9rem] h-full z-10 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
