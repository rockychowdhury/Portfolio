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

      <div className="space-y-4 mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-foreground md:text-6xl"
        >
          Trusted by people
        </motion.h2>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold tracking-tight text-muted-foreground/30 md:text-6xl"
        >
          who&apos;ve worked with me.
        </motion.h2>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mb-10 text-sm md:text-base text-muted-foreground/60 leading-relaxed"
      >
        Kind words from colleagues, mentors, and collaborators <br className="hidden md:block" />
        who&apos;ve seen my work firsthand.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, type: "spring", damping: 15 }}
        onClick={onLeaveTestimonial}
        className="group relative flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest text-background transition-all hover:pr-12 md:text-sm"
      >
        <span>Leave a Testimonial</span>
        <motion.span className="absolute right-8 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
          →
        </motion.span>
      </motion.button>
    </div>
  );
}
