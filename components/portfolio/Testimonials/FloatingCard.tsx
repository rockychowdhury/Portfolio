"use client";

import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { ITestimonial } from "@/lib/db/models/Testimonial";

interface FloatingCardProps {
  testimonial: ITestimonial;
  index: number;
  rotation?: number;
  isPaused?: boolean;
  isInert?: boolean; // For clipped cards
}

const relationshipConfig = {
  Mentor: { color: "#8B5CF6", strength: 5 },
  Client: { color: "#10B981", strength: 5 },
  Colleague: { color: "#3B82F6", strength: 4 },
  Collaborator: { color: "#F59E0B", strength: 4 },
  Classmate: { color: "#6B7280", strength: 3 },
};

export default function FloatingCard({ 
  testimonial, 
  index, 
  rotation = 0, 
  isPaused = false,
  isInert = false 
}: FloatingCardProps) {
  const config = relationshipConfig[testimonial.relationship] || relationshipConfig.Classmate;
  
  // 1. Dynamic Width based on quote length
  const quoteLength = testimonial.quote.length;
  const widthClass = quoteLength < 100 ? "w-[220px]" : quoteLength < 200 ? "w-[280px]" : "w-[340px]";
  
  // 2. Subconscious Hierarchy Scale
  const baseScale = config.strength === 5 ? 1 : 0.97;

  // 3. Animation Values
  const floatDuration = 5 + (index % 4);
  const breathDuration = 6 + (index % 3);
  const floatDelay = index * 0.7;

  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      whileInView={{ opacity: 1, scale: baseScale, y: 0 }}
      transition={{ 
        delay: index * 0.08, // Radial bloom handled by index ordering in parent
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }}
      viewport={{ once: true, margin: "-100px" }}
      className={`relative z-10 ${widthClass} ${isInert ? "pointer-events-none opacity-40 grayscale-[0.5]" : ""}`}
    >
      <motion.div
        animate={isPaused ? {} : { 
          y: [0, -12, 0],
          rotate: [rotation - 0.5, rotation + 0.5, rotation - 0.5]
        }}
        transition={{
          y: {
            duration: floatDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: floatDelay,
          },
          rotate: {
            duration: breathDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: floatDelay,
          }
        }}
        whileHover={isInert ? {} : { 
          y: -15, 
          scale: 1.03,
          rotate: 0,
          transition: { duration: 0.3, ease: "easeOut" } 
        }}
        className="group relative rounded-2xl border border-border/40 bg-background/50 backdrop-blur-md p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
        style={{ rotate: rotation }}
      >
        {/* Decorative Quote Mark */}
        <div 
          className="absolute -top-3 left-4 text-5xl font-serif opacity-5 transition-opacity group-hover:opacity-20"
          style={{ color: config.color }}
        >
          &ldquo;
        </div>

        <p className="relative mb-6 text-sm leading-relaxed text-muted-foreground/90 md:text-base font-medium">
          {testimonial.quote}
        </p>

        <div className="flex items-center gap-3 border-t border-border/30 pt-4">
          <div 
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold border transition-transform group-hover:scale-110"
            style={{ 
              backgroundColor: `${config.color}10`, 
              color: config.color,
              borderColor: `${config.color}20`
            }}
          >
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
              {testimonial.linkedin_url && !isInert && (
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

        {/* Relationship Badge with Dot */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border/30 bg-secondary/5">
          <div 
            className="h-1.5 w-1.5 rounded-full" 
            style={{ backgroundColor: config.color }} 
          />
          <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
            {testimonial.relationship}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
