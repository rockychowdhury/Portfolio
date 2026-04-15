"use client";

import { motion } from "framer-motion";
import { ICertification } from "@/lib/db/models/Certification";
import { ExternalLink, Calendar, Award, Trophy, ArrowUpRight, GraduationCap } from "lucide-react";
import { useState } from "react";
import CertificateLightbox from "./CertificateLightbox";
import AnimatedBorder from "../../common/AnimatedBorder";
import SkillTags from "./SkillTags";

interface Props {
  item: ICertification;
  index: number;
}

export default function BentoCertCard({ item, index }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isEducation = item.type === "education";

  // Skills parsing for compact display
  const skillList = item.description && item.description !== "N/A" 
    ? item.description.split(" · ").slice(0, 10).join(" · ") 
    : "";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.8, 
          delay: index * 0.05,
          ease: [0.215, 0.61, 0.355, 1] 
        }}
        whileHover={{ y: -8 }}
        className="h-full"
      >
        <div className={`
          group h-full flex flex-col justify-between transition-all duration-500 relative rounded-3xl overflow-hidden
          ${isEducation 
            ? "bg-[#1b1813] border border-white/10 hover:border-primary/40" 
            : "bg-card/40 dark:bg-zinc-900/40 backdrop-blur-xl p-5 md:p-6 border border-border/50 hover:border-primary/20 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)]"}
          ${isEducation ? "p-5 md:p-6" : ""}
        `}>
          {/* Background Glow on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${isEducation ? "from-primary/[0.15]" : ""}`} />
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isEducation ? "bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.6)]" : "bg-primary/40"}`} />
              <span className={`text-[8px] font-black tracking-[0.2em] uppercase ${isEducation ? "text-zinc-400" : "text-muted-foreground/50"}`}>
                {isEducation ? "Education" : "Certification"}
              </span>
            </div>
            
            {item.cgpa && (
              <div className={`
                flex items-center gap-2 px-3 py-1 rounded-full shadow-md scale-90 md:scale-95 origin-right transition-transform group-hover:scale-100
                ${isEducation ? "bg-zinc-800 text-zinc-100 border border-zinc-700" : "bg-foreground text-background"}
              `}>
                {isEducation ? <GraduationCap className="w-3 h-3 text-primary" /> : <Trophy className="w-3 h-3" />}
                <span className="text-[9px] font-black tracking-tight uppercase">
                  {isEducation ? "CGPA" : "Score"} {item.cgpa}
                </span>
              </div>
            )}
          </div>

          <div 
            className={`
              relative aspect-[1.6/1] w-full mb-4 rounded-xl overflow-hidden border border-border/10 bg-muted/20 cursor-pointer group/media active:scale-[0.98] transition-all
              ${isEducation ? "bg-zinc-800/50 border-white/5" : ""}
            `}
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={item.preview_link || item.ins_logo}
              alt={item.certificate_name}
              className={`w-full h-full transition-transform duration-1000 group-hover/media:scale-105 ${isEducation ? "object-contain p-2 md:p-3" : "object-cover"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/media:opacity-100 transition-all duration-500 flex items-center justify-center">
               <div className="bg-white/20 backdrop-blur-md p-3 rounded-full scale-0 group-hover/media:scale-100 transition-transform duration-500">
                  <ArrowUpRight className="text-white w-5 h-5" />
               </div>
            </div>
          </div>

          <div className="mb-4 flex-1 px-1 relative z-10 flex flex-col">
            <h4 className={`text-lg md:text-xl font-bold tracking-tight leading-[1.2] mb-2 transition-colors duration-500 line-clamp-2 ${isEducation ? "text-white group-hover:text-white" : "text-foreground group-hover:text-primary"}`}>
              {item.certificate_name}
            </h4>
            
            <div className="flex items-center gap-2.5 mb-3 opacity-80">
              <div className={`w-7 h-7 rounded-lg p-0.5 shadow-sm border border-border/10 flex items-center justify-center overflow-hidden ${isEducation ? "bg-white/10 border-white/10" : "bg-white dark:bg-zinc-800"}`}>
                  <img 
                  src={item.ins_logo} 
                  alt={item.ins_name} 
                  className="w-full h-full object-contain"
                  />
              </div>
              <a 
                href={item.ins_web}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[9px] font-black transition-all uppercase tracking-[0.05em] ${isEducation ? "text-zinc-400 hover:text-zinc-100" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.ins_name}
              </a>
            </div>

            <div className="flex-1">
              {item.description && item.description !== "N/A" && (
                <div className="pt-1">
                  <SkillTags skills={item.description} />
                </div>
              )}
            </div>
          </div>

          {/* 4. Footer */}
          <div className={`flex items-center justify-between pt-4 mt-auto border-t relative z-10 ${isEducation ? "border-white/5" : "border-border/10"}`}>
            <div className={`flex items-center gap-2 ${isEducation ? "text-zinc-500" : "text-muted-foreground/30"}`}>
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em]">
                {isEducation ? `${item.start_date} — ${item.end_date}` : item.issue_date}
              </span>
            </div>

            {item.certificate_link && item.certificate_link !== "N/A" && (
              <a
                href={item.certificate_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group/btn relative overflow-hidden flex items-center gap-2 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.15em] transition-all hover:scale-105 active:scale-95 shadow-md ${isEducation ? "bg-zinc-100 text-zinc-900 hover:bg-primary hover:text-white" : "bg-foreground text-background dark:bg-zinc-100 dark:text-zinc-900"}`}
              >
                <span className="relative z-10">Verify</span>
                <ArrowUpRight className="w-2.5 h-2.5 relative z-10 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            )}
          </div>
        </div>
      </motion.div>

      <CertificateLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        image={item.preview_link || item.ins_logo || ""}
        title={item.certificate_name}
        date={item.issue_date || ""}
        link={item.certificate_link || ""}
      />
    </>
  );
}
