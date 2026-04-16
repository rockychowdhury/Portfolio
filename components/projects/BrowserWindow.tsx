"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import VideoPreview from "./VideoPreview";

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
          {/* Browser Frame */}
          <div className="relative w-full h-full rounded-2xl border-2 border-foreground/10 bg-background overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/5 bg-muted/30">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 max-w-sm px-4">
                <div className="h-6 w-full rounded-lg bg-foreground/5 border border-foreground/5 flex items-center px-4 overflow-hidden">
                  <span className="text-[10px] text-foreground/40 font-mono truncate">
                    {project.liveLink || "https://project.ai"}
                  </span>
                </div>
              </div>
              <div className="w-16 h-4 bg-foreground/5 rounded-full" />
            </div>

            {/* Content (Screen) */}
            <div className="relative flex-1 w-full overflow-hidden bg-muted/20">
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
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
