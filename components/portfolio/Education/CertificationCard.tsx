"use client";

import { motion } from "framer-motion";
import { ExternalLink, Eye } from "lucide-react";
import { ICertification } from "@/lib/db/models/Certification";
import TimelineNode from "./TimelineNode";
import SkillTags from "./SkillTags";
import { useState } from "react";
import CertificateLightbox from "./CertificateLightbox";

interface CardProps {
  item: ICertification;
  isRight: boolean;
}

export default function CertificationCard({ item, isRight }: CardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div className={`relative flex w-full mb-12 last:mb-0 ${isRight ? "lg:justify-end" : "lg:justify-start"}`}>
        {/* Timeline Junction */}
        <TimelineNode />

        {/* Card Wrapper */}
        <motion.div
          initial={{ opacity: 0, x: isRight ? 60 : -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-full lg:max-w-lg group relative ${isRight ? "lg:pl-16" : "lg:pr-16"}`}
        >
          {/* Connector Line */}
          <div className={`absolute top-10 w-16 h-px bg-border/40 hidden lg:block ${isRight ? "left-0" : "right-0"}`} />

          <motion.div
            whileHover={{ y: -4 }}
            className="p-5 md:p-6 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex flex-col gap-5">
              {/* Header: Title + Logo */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold tracking-tight text-foreground leading-snug mb-1">
                    {item.certificate_name}
                  </h4>
                  <a
                    href={item.ins_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                  >
                    <img src={item.ins_logo} className="w-4 h-4 rounded-sm" />
                    {item.ins_name}
                  </a>
                </div>
                {item.cgpa && (
                  <div className="shrink-0 px-2 py-1 rounded bg-secondary/50 border border-border/50 text-[10px] font-bold text-primary">
                    {item.cgpa} / 4.00
                  </div>
                )}
              </div>

              {/* Preview Thumbnail */}
              {item.preview_link && (
                <div 
                  className="relative aspect-video rounded-xl overflow-hidden border border-border/50 bg-secondary/20 cursor-pointer group/preview"
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={item.preview_link}
                    alt={item.certificate_name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="px-4 py-2 bg-background/90 backdrop-blur-sm rounded-full text-xs font-bold flex items-center gap-2 shadow-2xl">
                      <Eye className="w-4 h-4" /> Quick View
                    </div>
                  </div>
                </div>
              )}

              {/* Description / Skills */}
              {item.description && item.description !== "N/A" && (
                <div className="pt-2">
                   {item.description.includes("·") ? (
                      <SkillTags skills={item.description} />
                   ) : (
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                   )}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground/60">
                  Issued: {item.issue_date}
                </span>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="text-xs font-bold text-primary hover:underline transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  {item.certificate_link && item.certificate_link !== "N/A" && (
                    <a
                      href={item.certificate_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      Verify <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

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
