"use client";

import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { ITestimonial } from "@/lib/db/models/Testimonial";

interface FloatingCardProps {
  testimonial: ITestimonial;
  index: number;
  rotation?: number;
  isPaused?: boolean;
}

export default function FloatingCard({ testimonial, index, rotation = 0, isPaused = false }: FloatingCardProps) {

  // Individual floating duration and delay for the " gently suspended" effect
  const floatDuration = 4 + (index % 3);
  const floatDelay = index * 0.5;

  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotation }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ 
        delay: index * 0.12,
        duration: 0.6,
        ease: "easeOut"
      }}
      viewport={{ once: true }}
      className="relative z-10 w-[280px] md:w-[320px]"
    >
      <motion.div
        animate={isPaused ? { y: 0 } : { y: [0, -10, 0] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        }}
        whileHover={{ 
          y: -15, 
          scale: 1.02,
          transition: { duration: 0.2 } 
        }}
        className="group relative rounded-2xl border border-border/40 bg-background/50 backdrop-blur-md p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
      >
        {/* Decorative Quote Mark */}
        <div className="absolute -top-3 left-4 text-5xl font-serif text-primary/5 transition-colors group-hover:text-primary/10">
          &ldquo;
        </div>

        <p className="relative mb-6 text-sm leading-relaxed text-muted-foreground/90 md:text-base font-medium">
          {testimonial.quote}
        </p>

        <div className="flex items-center gap-3 border-t border-border/30 pt-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/5 text-[10px] font-bold text-primary border border-primary/10 transition-transform group-hover:scale-110">
            {testimonial.avatar_url ? (
              <img src={testimonial.avatar_url} alt={testimonial.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-bold tracking-tight text-foreground">
              {testimonial.name}
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50 uppercase tracking-widest truncate font-semibold">
              <span>{testimonial.role}</span>
              {testimonial.linkedin_url && (
                <a 
                  href={testimonial.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors inline-flex"
                >
                  <FaLinkedin size={10} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Relationship Badge */}
        <div className="absolute top-4 right-4 text-[7px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 px-2 py-0.5 border border-border/30 rounded-full bg-secondary/10">
          {testimonial.relationship}
        </div>
      </motion.div>
    </motion.div>
  );
}
