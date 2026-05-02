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
  isMobile?: boolean; // For mobile stacked layout
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
  isInert = false,
  isMobile = false 
}: FloatingCardProps) {
  const config = relationshipConfig[testimonial.relationship] || relationshipConfig.Classmate;
  
  // 1. Dynamic Width based on quote length
  const quoteLength = testimonial.quote.length;
  const widthClass = isMobile ? "w-full" : quoteLength < 100 ? "w-[260px]" : quoteLength < 200 ? "w-[300px]" : "w-[360px]";
  
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
      whileHover={isInert ? {} : { zIndex: 100 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`relative z-10 ${widthClass} ${isInert ? "pointer-events-none opacity-40 grayscale-[0.5]" : ""}`}
    >
      <motion.div
        animate={isPaused || isMobile ? {} : { 
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
          y: -20, 
          scale: 1.05,
          rotate: 0,
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
        }}
        className="group relative rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-md p-7 will-change-transform transform-gpu shadow-[0_10px_25px_-10px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.03)]"
        style={{ 
          rotate: rotation,
        }}
      >
        {/* Premium Inner Glow on Hover */}
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

        {/* Decorative Quote Mark */}
        <div 
          className="absolute -top-4 left-6 text-6xl font-serif opacity-10 transition-all duration-500 group-hover:opacity-30 group-hover:-translate-y-1"
          style={{ color: config.color, filter: 'drop-shadow(0 0 10px currentColor)' }}
        >
          &ldquo;
        </div>

        <p className="relative pt-6 mb-8 text-[15px] leading-relaxed text-foreground/80 md:text-[16px] font-medium tracking-tight italic">
          {testimonial.quote}
        </p>

        <div className="flex items-center gap-4 border-t border-white/10 pt-6">
          <div 
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[13px] font-black border group-hover:scale-110 group-hover:rotate-3 shadow-lg"
            style={{ 
              backgroundColor: `${config.color}20`, 
              color: config.color,
              borderColor: `${config.color}40`,
              boxShadow: `0 8px 16px ${config.color}20`
            }}
          >
            {testimonial.avatar_url ? (
              <img src={testimonial.avatar_url} alt={testimonial.name} className="h-full w-full rounded-2xl object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-[16px] font-black tracking-tight text-foreground transition-colors group-hover:text-primary/90">
              {testimonial.name}
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] truncate font-bold">
              <span className="bg-white/5 px-2.5 py-0.5 rounded-lg border border-white/5">{testimonial.role}</span>
              {testimonial.linkedin_url && !isInert && (
                <a 
                  href={testimonial.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-all duration-300 inline-flex hover:scale-125"
                >
                  <FaLinkedin size={14} className="opacity-40 hover:opacity-100" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Premium Relationship Badge */}
        <div 
          className="absolute top-5 right-6 flex items-center gap-2 px-3 py-1 rounded-xl border group-hover:scale-105"
          style={{ 
            backgroundColor: `${config.color}08`,
            borderColor: `${config.color}20`
          }}
        >
          <div 
            className="h-1.5 w-1.5 rounded-full animate-pulse" 
            style={{ 
              backgroundColor: config.color,
              boxShadow: `0 0 8px ${config.color}`
            }} 
          />
          <span className="text-[8px] font-black uppercase tracking-[0.15em]" style={{ color: config.color }}>
            {testimonial.relationship}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
