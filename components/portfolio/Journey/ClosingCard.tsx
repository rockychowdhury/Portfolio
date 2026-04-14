"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const ClosingCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });
  
  return (
    <div ref={containerRef} className="relative w-full py-8 flex items-start gap-4">
      {/* status indicator - pill */}
      <div className="absolute left-[-20px] w-[9px] h-[9px] rounded-full border border-amber-500 bg-background z-20" />
      
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center gap-3">
          <Smile className="w-4 h-4 text-amber-500" />
          <h3 className="text-[14px] font-medium text-foreground">
            Thanks for following my journey.
          </h3>
        </div>
        
        <p className="text-[12px] text-muted-foreground leading-relaxed max-w-[400px]">
          Every milestone and line of code has shaped who I am today. 
          Reached the present — let's build the next chapter together.
        </p>

        <div className="flex self-start px-2 py-0.5 rounded bg-amber-500/10 text-[9px] font-bold uppercase tracking-[0.2em] text-amber-600/60 border border-amber-500/10">
          Reached Today
        </div>
      </motion.div>
    </div>
  );
};



export default ClosingCard;
