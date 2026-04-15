"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  isActive: boolean;
  innerClassName?: string;
}

export default function AnimatedBorder({ children, isActive, innerClassName }: Props) {
  if (!isActive) return <>{children}</>;

  return (
    <div className="relative p-[1.5px] rounded-[1.6rem] overflow-hidden group/border h-full">
      {/* Animated Neon Beam */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_120deg,var(--primary)_180deg,cyan_210deg,transparent_270deg,transparent_360deg)] opacity-70 group-hover/border:opacity-100 transition-opacity blur-[1px]"
      />
      
      {/* Inner Content Container */}
      <div className={`relative h-full z-10 overflow-hidden rounded-[1.5rem] ${innerClassName || "bg-background"}`}>
        {children}
      </div>
    </div>
  );
}
