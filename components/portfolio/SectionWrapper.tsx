"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface SectionWrapperProps extends HTMLMotionProps<"section"> {
  children: ReactNode;
  id?: string;
  className?: string;
}

export default function SectionWrapper({ children, id, className, ...props }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.4, 0.25, 1], // Premium custom ease
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}
