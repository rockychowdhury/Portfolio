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
  Mentor: { color: "var(--primary)", strength: 5 },
  Client: { color: "var(--primary)", strength: 5 },
  Colleague: { color: "#94a3b8", strength: 4 },
  Collaborator: { color: "#94a3b8", strength: 4 },
  Classmate: { color: "#64748b", strength: 3 },
};

export default function FloatingCard({ 
  testimonial, 
  index, 
  rotation = 0, 
  isPaused = false,
  isInert = false,
  isMobile = false 
}: FloatingCardProps) {
  const config = relationshipConfig[testimonial.relationship as keyof typeof relationshipConfig] || relationshipConfig.Colleague;
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const widthClass = isMobile ? "w-full" : index % 3 === 0 ? "w-[320px]" : index % 3 === 1 ? "w-[360px]" : "w-[280px]";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`relative z-10 ${widthClass} ${isInert ? "pointer-events-none opacity-40 grayscale-[0.5]" : ""}`}
    >
      <motion.div
        whileHover={{ 
          y: -20, 
          scale: 1.05,
          rotate: 0,
          filter: "blur(0px)",
          opacity: 1,
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
        }}
        className={`group relative rounded-[2rem] border border-white/10 bg-background/95 p-7 will-change-transform transform-gpu shadow-[0_8px_16px_-8px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.02)] transition-[filter,opacity] duration-500 ${isInert ? "blur-[2px] opacity-30" : "opacity-100"}`}
        style={{ 
          rotate: rotation,
        }}
      >
        {/* Premium Inner Glow on Hover */}
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

        {/* Decorative Quote Mark */}
        <div 
          className="absolute top-4 left-6 text-4xl font-serif opacity-[0.03] transition-all duration-500 group-hover:opacity-10"
          style={{ color: 'currentColor' }}
        >
          &ldquo;
        </div>

        <p className="relative pt-6 mb-8 text-[15px] leading-relaxed text-foreground/80 md:text-[16px] font-medium tracking-tight italic">
          {testimonial.quote}
        </p>

        <div className="flex items-center gap-4 border-t border-white/5 pt-6">
          <div 
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[13px] font-black border border-white/10 bg-white/5 text-muted-foreground transition-all duration-500 group-hover:scale-110 shadow-sm"
          >
            {testimonial.avatar_url ? (
              <img src={testimonial.avatar_url} alt={testimonial.name} className="h-full w-full rounded-2xl object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-[15px] font-black tracking-tight text-foreground transition-colors">
              {testimonial.name}
            </h4>
            <div className="flex items-center gap-2 text-[9px] text-muted-foreground/40 uppercase tracking-[0.25em] truncate font-black">
              <span className="bg-white/5 px-2 py-0.5 rounded-md border border-white/5">{testimonial.role}</span>
            </div>
          </div>
        </div>

        <div 
          className="absolute top-5 right-6 flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-md transition-all duration-500 group-hover:bg-white/10"
        >
          <div 
            className="h-1 w-1 rounded-full" 
            style={{ 
              backgroundColor: config.color === "var(--primary)" ? "var(--primary)" : "#64748b",
              boxShadow: config.color === "var(--primary)" ? `0 0 8px var(--primary)` : "none"
            }} 
          />
          <span className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
            {testimonial.relationship}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
