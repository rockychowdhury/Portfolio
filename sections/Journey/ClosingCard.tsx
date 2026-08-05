"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const ClosingCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });
  
  return (
    <div ref={containerRef} className="relative w-full py-8 flex items-start gap-6 group">
      {/* status indicator - pill */}
      <div className="absolute left-[-24px] w-[11px] h-[11px] rounded-full border-[2px] border-amber-500 bg-background shadow-[0_0_10px_rgba(245,158,11,0.5)] z-20 transition-transform duration-500 group-hover:scale-125" />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        className="flex flex-col gap-4 bg-foreground/[0.02] dark:bg-white/[0.02] border border-border/50 rounded-2xl p-6 md:p-8 hover:border-amber-500/30 transition-colors duration-500 backdrop-blur-sm shadow-sm w-full max-w-[500px]"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-8 rounded-full bg-amber-500/10 mb-1">
             <Smile className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="text-[16px] font-semibold text-foreground tracking-tight">
            Thanks for following my journey.
          </h3>
        </div>
        
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Every milestone and line of code has shaped who I am today. 
          Reached the present — let's build the next chapter together.
        </p>

        <div className="flex self-start px-2.5 py-1 rounded bg-amber-500/10 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600/80 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
          Reached Today
        </div>
      </motion.div>
    </div>
  );
};



export default ClosingCard;
