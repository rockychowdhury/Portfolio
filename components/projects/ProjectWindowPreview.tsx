// components/projects/ProjectWindowPreview.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Project } from "@/types/project";
import { WindowChrome } from "./WindowChrome";

interface ProjectWindowPreviewProps {
  project: Project;
}

export function ProjectWindowPreview({ project }: ProjectWindowPreviewProps) {
  return (
    <WindowChrome
      url={project.liveLink || project.previewLink}
      className="w-full"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id || project._id}
          className="absolute inset-0 z-10"
          initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {project.previewLink ? (
            <video
              src={project.previewLink}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="relative w-full h-full">
               <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </WindowChrome>
  );
}
