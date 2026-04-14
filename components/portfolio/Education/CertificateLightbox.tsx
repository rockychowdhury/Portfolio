"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { useEffect } from "react";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  title: string;
  date: string;
  link: string;
}

export default function CertificateLightbox({ 
  isOpen, 
  onClose, 
  image, 
  title, 
  date, 
  link 
}: LightboxProps) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-background/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-secondary transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row h-full">
              {/* Image Side */}
              <div className="flex-1 bg-secondary/20 p-4 flex items-center justify-center overflow-auto min-h-[300px] md:min-h-0">
                <img
                  src={image}
                  alt={title}
                  className="max-w-full max-h-[70vh] object-contain rounded shadow-lg"
                />
              </div>

              {/* Sidebar Info */}
              <div className="w-full md:w-80 p-8 border-t md:border-t-0 md:border-l border-border/50 bg-card flex flex-col justify-center">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-3">
                  Verification Detail
                </span>
                <h3 className="text-xl font-semibold tracking-tight leading-tight mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground mb-8">
                  Issued: {date}
                </p>

                <div className="space-y-4 pt-6 border-t border-border/50">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Verify Authenticity
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  
                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-secondary/50 border border-border/50 rounded-xl font-semibold text-sm hover:bg-secondary transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
