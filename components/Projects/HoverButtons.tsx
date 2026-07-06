"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

interface HoverButtonsProps {
  isVisible: boolean;
  projectId: string;
  liveLink: string;
}

export default function HoverButtons({
  isVisible,
  projectId,
  liveLink,
}: HoverButtonsProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-end justify-center pb-6 md:pb-8">
          <motion.div
            className="pointer-events-auto flex items-center p-1.5 gap-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* View Details */}
            <Link
              href={`/projects/${projectId}`}
              className="group flex items-center gap-2 h-10 px-5 rounded-full bg-white text-black font-semibold text-[13px] hover:bg-white/90 transition-colors shadow-sm"
            >
              View Details
              <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>

            {/* Live Site */}
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 h-10 px-5 rounded-full bg-white/10 text-white font-semibold text-[13px] hover:bg-white/20 transition-colors"
            >
              Live Site
              <ExternalLink className="size-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
