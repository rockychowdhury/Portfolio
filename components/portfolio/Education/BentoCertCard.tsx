"use client";

import { motion } from "framer-motion";
import { ICertification } from "@/lib/db/models/Certification";
import { ExternalLink, Calendar, Award, Trophy, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import CertificateLightbox from "./CertificateLightbox";
import AnimatedBorder from "../../common/AnimatedBorder";

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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <AnimatedBorder isActive={isEducation}>
          <div className="group h-full bg-card p-5 md:p-6 flex flex-col justify-between transition-all relative">
            
            {/* 1. Top Badges */}
            <div className="flex justify-between items-center mb-6">
              <span className="px-3 py-1 bg-secondary/50 text-[10px] font-bold tracking-wider uppercase rounded-full text-muted-foreground">
                {isEducation ? "Education" : "Certification"}
              </span>
              
              {item.cgpa && (
                <div className="flex items-center gap-2 px-3 py-1 bg-foreground text-background rounded-full">
                  {isEducation ? <Award className="w-3 h-3" /> : <Trophy className="w-3 h-3" />}
                  <span className="text-[11px] font-bold">
                    {isEducation ? "CGPA" : "Score"} {item.cgpa}
                  </span>
                </div>
              )}
            </div>

            {/* 2. Media Section (Large Image) */}
            <div 
              className="relative aspect-[1.4/1] w-full mb-6 rounded-2xl overflow-hidden border border-border/50 bg-secondary/10 cursor-pointer group/media"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={item.preview_link || item.ins_logo}
                alt={item.certificate_name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-110"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/media:opacity-100 transition-opacity" />
            </div>

            {/* 3. Content Block */}
            <div className="mb-6 flex-1">
              <h4 className="text-xl font-bold tracking-tight text-foreground leading-tight mb-3 line-clamp-2">
                {item.certificate_name}
              </h4>
              
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src={item.ins_logo} 
                  alt={item.ins_name} 
                  className="w-5 h-5 object-contain rounded-sm"
                />
                <a 
                  href={item.ins_web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                >
                  {item.ins_name}
                </a>
              </div>

              {skillList && (
                <p className="text-xs text-muted-foreground/70 leading-relaxed font-medium line-clamp-3">
                  {skillList}
                </p>
              )}
            </div>

            {/* 4. Footer */}
            <div className="flex items-center justify-between pt-5 border-t border-border/40">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {isEducation ? `${item.start_date} - ${item.end_date}` : item.issue_date}
                </span>
              </div>

              {item.certificate_link && item.certificate_link !== "N/A" && (
                <a
                  href={item.certificate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn flex items-center gap-1.5 px-4 py-2 bg-secondary/40 hover:bg-secondary rounded-xl text-[11px] font-bold text-foreground transition-all"
                >
                  View credential
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </a>
              )}
            </div>

          </div>
        </AnimatedBorder>
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
