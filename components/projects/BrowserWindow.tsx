"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import VideoPreview from "./VideoPreview";
import { WindowChrome } from "./WindowChrome";

interface BrowserWindowProps {
  activeIndex: number;
  projects: any[];
  onVideoEnded?: (index: number) => void;
  isPlaying?: boolean;
}

export default function BrowserWindow({ activeIndex, projects, onVideoEnded, isPlaying }: BrowserWindowProps) {
  const project = projects[activeIndex];
  if (!project) return null;

  return (
    <div className="absolute inset-0 w-full h-full [perspective:2000px] pointer-events-none">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={activeIndex}
          initial={{ rotateY: -110, opacity: 0, scale: 0.8, z: -100 }}
          animate={{ rotateY: 0, opacity: 1, scale: 1, z: 0 }}
          exit={{ rotateY: 110, opacity: 0, scale: 0.8, z: -100 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="absolute inset-0 w-full h-full pointer-events-auto"
          style={{ transformStyle: "preserve-3d" }}
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
