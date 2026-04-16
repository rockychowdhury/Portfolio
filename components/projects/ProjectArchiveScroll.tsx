
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Code2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { ProjectTags } from "@/components/projects/ProjectTags";
import { IProject } from "@/lib/db/models/Project";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";
import { WindowChrome } from "./WindowChrome";

interface ProjectArchiveScrollProps {
  projects: IProject[];
}

/**
 * Individual Row Component for the left-side scrolling details.
 * Communicates its visibility to the parent stage.
 */
function ArchiveDetailBlock({
  project,
  index,
  onInView
}: {
  project: IProject;
  index: number;
  onInView: (index: number) => void
}) {
  const { ref, inView } = useInView({
    threshold: 0.6,
  });

  useEffect(() => {
    if (inView) {
      onInView(index);
    }
  }, [inView, index, onInView]);

  return (
    <div ref={ref} className="min-h-[70vh] flex flex-col justify-center py-20 lg:py-40">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, margin: "-10% 0px" }}
        transition={{ duration: 0.8 }}
        className="max-w-xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <span className="text-foreground/40 font-black font-mono text-[10px] uppercase tracking-[0.4em]">
            Archive Artifact // 0{index + 1}
          </span>
          <div className="h-px w-12 bg-foreground/10" />
        </div>

        <h3 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter font-anton leading-[0.9] mb-8">
          {project.title}
        </h3>

        <p className="text-base md:text-xl text-foreground/40 leading-relaxed font-medium mb-10 italic">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {project.skills?.slice(0, 6).map((s: any, i: number) => (
            <span key={i} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-foreground/[0.03] border border-foreground/5 text-foreground/50">
              {typeof s === 'string' ? s : s.name}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-6">
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:text-foreground transition-all group"
            >
              <FaGithub size={16} className="group-hover:rotate-12 transition-transform" />
              Source Code
            </a>
          )}
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 px-8 py-3 bg-foreground text-background rounded-full font-black text-[10px] uppercase tracking-widest overflow-hidden transition-all hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10">Launch Stage</span>
              <ArrowUpRight size={14} className="relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectArchiveScroll({ projects }: ProjectArchiveScrollProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prevIndexRef = useRef(0);
  const activeProject = projects[activeIndex];

  // Determine scroll direction for animation: 1 for down, -1 for up
  const direction = activeIndex >= prevIndexRef.current ? 1 : -1;

  useEffect(() => {
    prevIndexRef.current = activeIndex;
  }, [activeIndex]);

  if (!projects || projects.length === 0) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start relative">

        {/* LEFT: Scrolling Details */}
        <div className="relative">
          <div className="h-[20vh]" aria-hidden />
          {projects.map((project, index) => (
            <ArchiveDetailBlock
              key={project._id}
              project={project}
              index={index}
              onInView={setActiveIndex}
            />
          ))}
          <div className="h-[40vh]" aria-hidden />
        </div>

        <div className="hidden lg:block sticky top-32 h-[calc(100vh-8rem)] w-full flex items-center justify-center">
          <WindowChrome 
            url={activeProject.liveLink || activeProject.githubLink}
            showOverlays={false}
            className="w-[90%]"
          >

            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={activeProject._id}
                custom={direction}
                initial={{ y: direction > 0 ? "100%" : "-100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction > 0 ? "-100%" : "100%", opacity: 0, transition: { duration: 0.3 } }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 35,
                  mass: 0.8
                }}
                className="absolute inset-0"
              >
                <Image
                  src={activeProject.thumbnail}
                  alt={activeProject.title}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </WindowChrome>
        </div>
      </div>
    </div>
  );
}
