"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ICertification } from "@/types/certification";
import { Calendar, Trophy, ArrowUpRight, GraduationCap, ShieldCheck } from "lucide-react";
import { useState } from "react";
import CertificateLightbox from "./CertificateLightbox";
import SkillTags from "./SkillTags";
import { useElementInView } from "@/lib/useElementInView";

interface Props {
  item: ICertification;
  index: number;
  isVisible?: boolean;
}

export default function BentoCertCard({ item, index, isVisible = true }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { ref: animRef } = useElementInView<HTMLDivElement>("50px 0px");
  const isEducation = item.type === "education";
  const isOrange = item.ins_name.toLowerCase().includes("programming hero");

  const theme = (() => {
    if (isEducation) {
      return {
        accentLabel: "text-purple-300",
        accentDot: "bg-purple-400",
        accentChip: "bg-purple-400/10 border-purple-400/20",
        gradient: "from-purple-500 to-purple-700",
        badgeIcon: <GraduationCap className="w-3 h-3 text-purple-300" />,
        surface: "bg-[#16161c]",
        mesh:
          "radial-gradient(120% 100% at 12% 0%, rgba(168,85,247,0.30) 0%, transparent 52%)," +
          "radial-gradient(120% 110% at 92% 18%, rgba(99,102,241,0.24) 0%, transparent 55%)," +
          "radial-gradient(110% 120% at 85% 88%, rgba(20,184,166,0.16) 0%, transparent 56%)," +
          "radial-gradient(110% 110% at 14% 96%, rgba(236,72,153,0.18) 0%, transparent 52%)",
        border: "border-white/[0.08]",
        hoverBorder: "hover:border-purple-400/50",
        hoverShadow: "hover:shadow-[0_24px_60px_-15px_rgba(168,85,247,0.4)]",
        title: "text-[#f3f2f0]",
        muted: "text-[#a2a2a8]",
        imgArea: "bg-white/[0.05] border-white/10",
        logoBox: "bg-white/10 border-white/10",
        footer: "border-white/[0.08] bg-white/[0.04]",
        footerText: "text-white/70",
        link: "text-purple-200 hover:text-white",
        verify: "border-purple-400/40 text-purple-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-700 hover:text-white hover:border-transparent",
        viewPill: "bg-[#0c0c0e]/85 text-white backdrop-blur-sm",
        viewIcon: "text-white",
      };
    }
    if (isOrange) {
      return {
        accentLabel: "text-orange-600",
        accentDot: "bg-orange-500",
        accentChip: "bg-orange-500/10 border-orange-500/20",
        gradient: "from-orange-500 to-orange-600",
        badgeIcon: <Trophy className="w-3 h-3 text-orange-600" />,
        surface: "bg-[#f7f6f4]",
        mesh:
          "radial-gradient(120% 100% at 12% 0%, rgba(249,115,22,0.26) 0%, transparent 52%)," +
          "radial-gradient(120% 110% at 92% 18%, rgba(217,70,239,0.14) 0%, transparent 55%)," +
          "radial-gradient(110% 120% at 85% 88%, rgba(14,165,233,0.16) 0%, transparent 56%)," +
          "radial-gradient(110% 110% at 14% 96%, rgba(236,72,153,0.12) 0%, transparent 52%)",
      border: "border-black/[0.07]",
      hoverBorder: "hover:border-orange-400/60",
      hoverShadow: "hover:shadow-[0_24px_60px_-15px_rgba(249,115,22,0.35)]",
        title: "text-[#1d1d1f]",
        muted: "text-[#7a7a80]",
        imgArea: "bg-white/70 border-black/[0.06]",
        logoBox: "bg-white border-black/[0.08]",
        footer: "border-black/[0.07] bg-white/60",
        footerText: "text-[#8a8a8f]",
        link: "text-[#8a8a8f] hover:text-[#1d1d1f]",
        verify: "border-orange-500/40 text-orange-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white hover:border-transparent",
        viewPill: "bg-white/95 text-[#1d1d1f] shadow-md",
        viewIcon: "text-[#1d1d1f]",
      };
    }
    return {
      accentLabel: "text-blue-600",
      accentDot: "bg-blue-500",
      accentChip: "bg-blue-500/10 border-blue-500/20",
      gradient: "from-blue-500 to-blue-600",
      badgeIcon: <Trophy className="w-3 h-3 text-blue-600" />,
      surface: "bg-[#f7f6f4]",
      mesh:
        "radial-gradient(120% 100% at 12% 0%, rgba(59,130,246,0.26) 0%, transparent 52%)," +
        "radial-gradient(120% 110% at 92% 18%, rgba(217,70,239,0.14) 0%, transparent 55%)," +
        "radial-gradient(110% 120% at 85% 88%, rgba(16,185,129,0.14) 0%, transparent 56%)," +
        "radial-gradient(110% 110% at 14% 96%, rgba(14,165,233,0.18) 0%, transparent 52%)",
      border: "border-black/[0.07]",
      hoverBorder: "hover:border-blue-400/60",
      hoverShadow: "hover:shadow-[0_24px_60px_-15px_rgba(59,130,246,0.35)]",
      title: "text-[#1d1d1f]",
      muted: "text-[#7a7a80]",
      imgArea: "bg-white/70 border-black/[0.06]",
      logoBox: "bg-white border-black/[0.08]",
      footer: "border-black/[0.07] bg-white/60",
      footerText: "text-[#8a8a8f]",
      link: "text-[#8a8a8f] hover:text-[#1d1d1f]",
      verify: "border-blue-500/40 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white hover:border-transparent",
      viewPill: "bg-white/95 text-[#1d1d1f] shadow-md",
      viewIcon: "text-[#1d1d1f]",
    };
  })();

  return (
    <>
      <motion.div
        ref={animRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{
          duration: 0.8,
          delay: 1.0 + index * 0.1,
          ease: [0.215, 0.61, 0.355, 1],
        }}
        whileHover={{ y: -6 }}
        className="h-full"
      >
        <div
          className={`group relative h-full flex flex-col overflow-hidden rounded-[22px] transition-all duration-300 ${theme.surface} ${theme.hoverShadow}`}
          style={{ backgroundImage: theme.mesh }}
        >
          {/* Mesh Pattern Overlay */}
          <div className="absolute inset-0 z-[1] mesh-overlay pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between gap-2 px-5 pt-5 mb-4">
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border ${theme.accentChip}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${theme.accentDot}`} />
              <span className={`text-[10px] font-bold uppercase tracking-[0.14em] ${theme.accentLabel}`}>
                {isEducation ? "Education" : "Certification"}
              </span>
            </div>
            {item.cgpa && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${theme.accentChip}`}>
                {theme.badgeIcon}
                <span className={`text-[10px] font-bold uppercase tracking-[0.08em] ${theme.accentLabel}`}>
                  {isEducation ? "CGPA" : "Score"} {item.cgpa}
                </span>
              </div>
            )}
          </div>

          {/* Preview */}
          <div
            className={`relative z-10 aspect-[1.7/1] mx-5 mb-4 rounded-2xl overflow-hidden cursor-pointer group/media border transition-transform duration-500 ${theme.imgArea}`}
            onClick={() => setLightboxOpen(true)}
          >
            <Image
              src={item.preview_link || item.ins_logo || ""}
              alt={item.certificate_name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`transition-transform duration-700 group-hover/media:scale-105 ${isEducation ? "object-contain p-2 drop-shadow-md" : "object-cover"}`}
            />
            <div className="absolute inset-0 opacity-0 group-hover/media:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-black/0">
              <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full ${theme.viewPill} scale-90 group-hover/media:scale-100 transition-transform duration-300 shadow-md`}>
                <ArrowUpRight className={`w-3.5 h-3.5 ${theme.viewIcon}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider">View</span>
              </div>
            </div>
          </div>

          {/* Title + Institution + Tags */}
          <div className="relative z-10 px-5 flex flex-col flex-1">
            <h4 className={`text-[17px] font-semibold tracking-[-0.01em] leading-snug mb-3.5 line-clamp-2 ${theme.title}`}>
              {item.certificate_name}
            </h4>

            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`relative w-7 h-7 rounded-lg border flex items-center justify-center overflow-hidden shrink-0 ${theme.logoBox}`}>
                  <Image
                    src={item.ins_logo || ""}
                    alt={item.ins_name}
                    fill
                    sizes="28px"
                    className="object-contain p-1"
                  />
                </div>
                <a
                  href={item.ins_web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[11px] font-semibold truncate transition-colors ${theme.link}`}
                >
                  {item.ins_name}
                </a>
              </div>
              {!isEducation && (
                <span className={`flex items-center gap-1 shrink-0 ${theme.accentLabel}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Verified</span>
                </span>
              )}
            </div>

            <div className="mt-auto">
              {item.description && item.description !== "N/A" && (
                <SkillTags skills={item.description} isDark={isEducation} />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={`relative z-10 flex items-center justify-between px-5 py-3.5 border-t mt-5 ${theme.footer}`}>
            <div className={`flex items-center gap-2 ${theme.footerText}`}>
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                {isEducation ? `${item.start_date} — ${item.end_date}` : item.issue_date}
              </span>
            </div>

            {item.certificate_link && item.certificate_link !== "N/A" && (
              <a
                href={item.certificate_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-gradient-to-r transition-all duration-300 hover:scale-105 active:scale-95 ${theme.verify}`}
              >
                Verify
                <ArrowUpRight className="w-3 h-3" />
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