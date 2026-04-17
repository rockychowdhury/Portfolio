"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface SectionWrapperProps extends HTMLMotionProps<"section"> {
  children: ReactNode;
  id?: string;
  className?: string;
  container?: boolean;
}

export default function SectionWrapper({ children, id, className, container = true, ...props }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {container ? (
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20 w-full">
          {children}
        </div>
      ) : (
        children
      )}
    </motion.section>
  );
}
