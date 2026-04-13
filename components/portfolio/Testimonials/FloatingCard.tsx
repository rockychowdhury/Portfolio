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
        className="group relative rounded-3xl border border-border/50 bg-background p-8 shadow-sm transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
      >
        {/* Decorative Quote Mark */}
        <div className="absolute -top-4 left-6 text-6xl font-serif text-primary/10 transition-colors group-hover:text-primary/20">
          &ldquo;
        </div>

        <p className="relative mb-8 text-sm leading-relaxed text-muted-foreground/80 md:text-base">
          {testimonial.quote}
        </p>

        <div className="flex items-center gap-4 border-t border-border/50 pt-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {testimonial.avatar_url ? (
              <img src={testimonial.avatar_url} alt={testimonial.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-bold text-foreground">
              {testimonial.name}
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 uppercase tracking-widest truncate">
              <span>{testimonial.role}</span>
              {testimonial.linkedin_url && (
                <a 
                  href={testimonial.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <FaLinkedin size={12} />
                </a>
              )}
              {testimonial.platform === "GitHub" && <FaGithub size={12} />}
              {testimonial.platform === "Email" && <FaEnvelope size={12} />}
            </div>
          </div>
        </div>

        {/* Relationship Badge */}
        <div className="absolute top-6 right-6 text-[8px] font-bold uppercase tracking-widest text-muted-foreground/30 px-2 py-1 border border-border/50 rounded-full">
          {testimonial.relationship}
        </div>
      </motion.div>
    </motion.div>
  );
}
