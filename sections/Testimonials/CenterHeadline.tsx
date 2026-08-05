"use client";

import { motion } from "framer-motion";

interface CenterHeadlineProps {
  onLeaveTestimonial: () => void;
}

export default function CenterHeadline({ onLeaveTestimonial }: CenterHeadlineProps) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-primary"
      >
        Testimonials
      </motion.div>

      <div className="space-y-2 mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70 md:text-7xl"
        >
          Trusted by people
        </motion.h2>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl font-black tracking-tighter text-muted-foreground/20 md:text-6xl"
        >
          who&apos;ve worked with me.
        </motion.h2>
      </div>


      <div className="relative">
        {/* Premium Pulse Effect */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-xl"
        />

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: "spring", damping: 15 }}
          onClick={onLeaveTestimonial}
          className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-foreground px-8 py-4 text-xs font-black uppercase tracking-widest text-background transition-all hover:shadow-[0_0_40px_-10px_rgba(var(--primary-rgb),0.5)] md:text-sm cursor-pointer"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 w-[200%] -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          
          <span className="relative z-10">Leave a Testimonial</span>
          <motion.span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
            →
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
}
