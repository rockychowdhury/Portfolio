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
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Bottom gradient zone — only covers bottom ~35% */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 pointer-events-auto"
            style={{ height: "35%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Gradient backdrop */}
            <div
              className="absolute inset-0 rounded-b-[20px]"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
              }}
            />

            {/* Buttons positioned within the gradient zone */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 pb-8">
              {/* Explore Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
              >
                <Link
                  href={`/projects/${projectId}`}
                  target="_blank"
                  className="group flex items-center gap-2 h-11 px-6 rounded-full bg-white/95 dark:bg-white/90 text-gray-900 font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
                >
                  Explore
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>

              {/* Open Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: "easeOut", delay: 0.12 }}
              >
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 h-11 px-6 rounded-full bg-white/20 dark:bg-white/15 text-white font-semibold text-sm border border-white/30 hover:bg-white/30 transition-all hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
                >
                  Open
                  <ExternalLink className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
