"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import VideoPreview from "./VideoPreview";
import { WindowChrome } from "./WindowChrome";

interface BrowserWindowProps {
  activeIndex: number;
  direction: number;
  projects: any[];
  onVideoEnded?: (index: number) => void;
  isPlaying?: boolean;
}

export default function BrowserWindow({ activeIndex, direction, projects, onVideoEnded, isPlaying }: BrowserWindowProps) {
  const project = projects[activeIndex];
  if (!project) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <AnimatePresence initial={false}>
        <motion.div
          key={activeIndex}
          initial={{ 
            clipPath: direction > 0 ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)",
            zIndex: 20
          }}
          animate={{ 
            clipPath: "inset(0% 0 0 0)",
            zIndex: 20
          }}
          exit={{ 
            zIndex: 10,
            opacity: 0,
            transition: { duration: 0.4 }
          }}
          transition={{ 
            duration: 0.8,
            ease: [0.19, 1, 0.22, 1]
          }}
          className="absolute inset-0 w-full h-full pointer-events-auto"
        >
          {/* Browser Frame using WindowChrome */}
          <WindowChrome 
            url={project.liveLink || "https://project.ai"}
            className="w-full h-full"
            showOverlays={true}
          >
            {/* Content (Screen) */}
            <div className="relative w-full h-full overflow-hidden bg-muted/20">
              {project.previewLink ? (
                <VideoPreview 
                  src={project.previewLink} 
                  isActive={isPlaying ?? true} 
                  onEnded={() => onVideoEnded?.(activeIndex)}
                />
              ) : project.thumbnail ? (
                <div className="relative w-full h-full">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover brightness-[0.98] contrast-[1.02]"
                    unoptimized={true}
                    priority
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase tracking-[1em] text-foreground/10">
                  {project.title} Preview
                </div>
              )}
            </div>
          </WindowChrome>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
