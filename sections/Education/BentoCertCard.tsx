"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ICertification } from "@/types/certification";
import { ExternalLink, Calendar, Trophy, ArrowUpRight, GraduationCap } from "lucide-react";
import { useState } from "react";
import CertificateLightbox from "./CertificateLightbox";
import SkillTags from "./SkillTags";

interface Props {
  item: ICertification;
  index: number;
  isVisible?: boolean;
}

export default function BentoCertCard({ item, index, isVisible = true }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isEducation = item.type === "education";

  const getTheme = () => {
    if (isEducation) {
      return {
        color: "text-purple-300 dark:text-purple-400",
        bg: "bg-purple-400 dark:bg-purple-700",
        bgLight: "bg-purple-500/20 dark:bg-purple-900/30",
        topBar: "bg-purple-700 dark:bg-purple-900",
        gradient: "from-purple-500 to-purple-700 dark:from-purple-700 dark:to-purple-900",
        bgCard: "bg-cover bg-center",
        badgeIcon: <GraduationCap className="w-3 h-3 text-purple-300 dark:text-purple-400" />
      };
    }
    if (item.ins_name.toLowerCase().includes("programming hero")) {
      return {
        color: "text-[#ea580c]", // Orange
        bg: "bg-[#ea580c]",
        bgLight: "bg-[#ea580c]/10",
        topBar: "bg-[#ea580c]",
        gradient: "from-[#f97316] to-[#ea580c]",
        bgCard: "bg-gradient-to-br from-[#ffffff] via-[#fffaf7] to-[#fdf0e8] dark:from-[#180e0a] dark:via-[#120805] dark:to-[#080301]",
        badgeIcon: <Trophy className="w-3 h-3 text-[#ea580c]" />
      };
    }
    // Default (Phitron/Blue)
    return {
      color: "text-[#3b82f6]", // Blue
      bg: "bg-[#3b82f6]",
      bgLight: "bg-[#3b82f6]/10",
      topBar: "bg-[#3b82f6]",
      gradient: "from-[#3b82f6] to-[#2563eb]",
      bgCard: "bg-gradient-to-br from-[#ffffff] via-[#f8fbff] to-[#eef4ff] dark:from-[#0b101c] dark:via-[#070a12] dark:to-[#030408]",
      badgeIcon: <Trophy className="w-3 h-3 text-[#3b82f6]" />
    };
  };

  const theme = getTheme();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ 
          duration: 0.8, 
          delay: 1.0 + index * 0.1,
          ease: [0.215, 0.61, 0.355, 1] 
        }}
        whileHover={{ y: -4 }}
        className="h-full"
      >
        <div className={`
          group h-full relative p-[1px] pt-[4px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300
          ${isEducation ? "bg-purple-500/20 dark:bg-purple-800/40" : "bg-border/50"}
        `}>
          {/* Top Border Color Bar (with shiny sweep inside) */}
          <div className={`absolute top-0 inset-x-0 h-[24px] ${theme.topBar} z-0`}>
            <motion.div 
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
              animate={{ x: ["-200%", "300%"] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }}
            />
          </div>
          
          {/* Inner Content Card */}
          <div className={`
            relative z-10 h-full flex flex-col justify-between rounded-t-[12px] rounded-b-[15px] overflow-hidden ${theme.bgCard}
            ${isEducation 
              ? "shadow-[inset_0_1px_0_rgba(168,85,247,0.4)] dark:shadow-[inset_0_1px_0_rgba(168,85,247,0.15)]" 
              : "shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"}
          `}>
          
          {/* Paper Texture Overlay */}
          {!isEducation && (
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-[0.5] dark:opacity-[0.6] mix-blend-multiply dark:mix-blend-screen" 
              style={{ backgroundImage: "url(/assets/papers/darktexture.webp)" }}
            />
          )}

          <div className="relative z-10 p-4 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${theme.bg}`} />
                <span className={`text-[10px] font-bold tracking-wider uppercase ${theme.color}`}>
                  {isEducation ? "Education" : "Certification"}
                </span>
              </div>
              
              {item.cgpa && (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${theme.bgLight}`}>
                  {theme.badgeIcon}
                  <span className={`text-[9.5px] font-bold tracking-wide uppercase ${theme.color}`}>
                    {isEducation ? "CGPA" : "Score"} {item.cgpa}
                  </span>
                </div>
              )}
            </div>

            <div 
              className={`relative aspect-[1.7/1] w-full mb-3 rounded-xl overflow-hidden cursor-pointer group/media transition-all flex items-center justify-center ${isEducation ? "bg-transparent p-2" : "border bg-[#f8f9fa] dark:bg-zinc-900 border-border/50"}`}
              onClick={() => setLightboxOpen(true)}
            >
              <Image
                src={item.preview_link || item.ins_logo || ""}
                alt={item.certificate_name}
                fill
                className={`transition-transform duration-700 group-hover/media:scale-105 ${isEducation ? "object-contain p-2 drop-shadow-md" : "object-cover"}`}
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/media:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                 <div className="bg-white/90 dark:bg-black/90 p-2.5 rounded-full scale-0 group-hover/media:scale-100 transition-transform duration-300 shadow-sm">
                    <ArrowUpRight className="text-foreground w-4 h-4" />
                 </div>
              </div>
            </div>

            <div className="mb-3 flex-1 flex flex-col">
              <h4 className={`text-[16px] font-bold tracking-tight leading-snug mb-2.5 line-clamp-2 ${isEducation ? "text-white" : "text-foreground"}`}>
                {item.certificate_name}
              </h4>
              
              <div className="flex items-center gap-2 mb-3">
                <div className={`relative w-6 h-6 rounded flex items-center justify-center border overflow-hidden ${isEducation ? "bg-white/10 border-white/10" : "bg-white dark:bg-zinc-800 border-border"}`}>
                    <Image 
                      src={item.ins_logo || ""} 
                      alt={item.ins_name} 
                      fill
                      className="object-contain p-0.5"
                    />
                </div>
                <a 
                  href={item.ins_web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${isEducation ? "text-purple-200 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {item.ins_name}
                </a>
              </div>

              <div className="mt-auto">
                {item.description && item.description !== "N/A" && (
                  <SkillTags skills={item.description} isDark={isEducation} />
                )}
              </div>
            </div>
          </div>

          <div className={`relative z-10 flex items-center justify-between px-4 py-3 border-t rounded-b-[15px] ${isEducation ? "border-purple-500/20 dark:border-purple-800/40 bg-purple-900/20 dark:bg-[#120326]" : "border-border/50 bg-muted/10"}`}>
            <div className={`flex items-center gap-1.5 ${isEducation ? "text-purple-300 dark:text-purple-400" : "text-muted-foreground"}`}>
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[9.5px] font-bold uppercase tracking-wider">
                {isEducation ? `${item.start_date} — ${item.end_date}` : item.issue_date}
              </span>
            </div>

            {item.certificate_link && item.certificate_link !== "N/A" && (
              <a
                href={item.certificate_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-sm bg-gradient-to-r ${theme.gradient}`}
              >
                VERIFY
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </div>
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
