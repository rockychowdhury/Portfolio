"use client";

import { motion } from "framer-motion";
import { ICertification } from "@/lib/db/models/Certification";
import { ExternalLink, Eye } from "lucide-react";
import { useState } from "react";
import CertificateLightbox from "./CertificateLightbox";

interface Props {
  item: ICertification;
  index: number;
}

export default function BentoCertCard({ item, index }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
        className="group"
      >
        <motion.div
          whileHover={{ y: -5 }}
          className="h-full bg-card border border-border/50 rounded-3xl p-6 flex flex-col justify-between shadow-sm transition-all hover:shadow-xl hover:border-primary/20"
        >
          {/* Header */}
          <div className="flex justify-between items-start gap-3">
             <div className="p-3 bg-secondary/40 rounded-xl border border-border/50 group-hover:bg-primary/5 transition-colors">
                <img
                  src={item.ins_logo}
                  alt={item.ins_name}
                  className="w-10 h-10 object-contain"
                />
             </div>
             {item.certificate_link && item.certificate_link !== "N/A" && (
                <a
                  href={item.certificate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  title="Verify Certificate"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary" />
                </a>
             )}
          </div>

          {/* Title Area */}
          <div className="my-6">
            <h4 className="text-lg font-bold tracking-tight text-foreground leading-snug line-clamp-2">
              {item.certificate_name}
            </h4>
            <p className="text-xs font-semibold text-muted-foreground mt-2 uppercase tracking-widest">
              {item.ins_name}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
               {item.issue_date}
            </span>
            
            <button
               onClick={() => setLightboxOpen(true)}
               className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
            >
               <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>
        </motion.div>
      </motion.div>

      <CertificateLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        image={item.preview_link || item.ins_logo || "/placeholder-cert.jpg"}
        title={item.certificate_name}
        date={item.issue_date || ""}
        link={item.certificate_link || ""}
      />
    </>
  );
}
