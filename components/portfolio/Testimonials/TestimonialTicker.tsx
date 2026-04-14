"use client";

import { motion } from "framer-motion";
import { ITestimonial } from "@/lib/db/models/Testimonial";

interface TestimonialTickerProps {
  testimonials: ITestimonial[];
}

export default function TestimonialTicker({ testimonials }: TestimonialTickerProps) {
  // Triple the items to ensure seamless infinite scroll
  const tickerItems = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="relative mt-24 py-12 border-y border-border/50 bg-secondary/5 overflow-hidden">
      <motion.div
        animate={{ x: [0, -100 * testimonials.length] }} // Approximate width calculation, will be refined by render width
        transition={{
          duration: testimonials.length * 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="flex space-x-12 whitespace-nowrap px-12"
      >
        {tickerItems.map((t, i) => (
          <div key={`${t.name}-${i}`} className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/40 italic">
            <span className="text-primary/40 text-lg not-italic">&ldquo;</span>
            <span className="max-w-[300px] truncate">&ldquo;{t.quote}&rdquo;</span>
            <span className="not-italic opacity-40">— {t.name}, {t.role.split('·')[0]}</span>
            <span className="w-2 h-2 rounded-full bg-primary/20 mx-4" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
