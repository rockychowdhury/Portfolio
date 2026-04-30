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
          {/* Localized bottom gradient — covers bottom 30% only */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 pointer-events-auto"
            style={{ height: "30%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Gradient backdrop — matches card bottom border-radius */}
            <div
              className="absolute inset-0 rounded-b-[16px]"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)",
              }}
            />

            {/* Buttons anchored at bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 pb-6 md:pb-7">
              {/* Explore */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
              >
                <Link
                  href={`/projects/${projectId}`}
                  className="group flex items-center gap-2 h-10 px-5 rounded-full bg-white/95 dark:bg-white/90 text-gray-900 font-semibold text-[13px] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] backdrop-blur-sm"
                >
                  Explore
                  <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
              </motion.div>

              {/* Open */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
              >
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 h-10 px-5 rounded-full bg-white/15 text-white font-semibold text-[13px] border border-white/25 hover:bg-white/25 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] backdrop-blur-sm"
                >
                  Open
                  <ExternalLink className="size-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
