
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
    <div ref={ref} className="h-screen flex items-center">
      <motion.div
        initial={{ opacity: 0, x: -100, y: 100, scale: 0.8, filter: "blur(20px)" }}
        animate={inView ? 
          { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" } : 
          { opacity: 0, x: -50, y: -50, scale: 0.9, filter: "blur(10px)" }
        }
        transition={{ 
          duration: 1.2, 
          ease: [0.16, 1, 0.3, 1],
          opacity: { duration: 0.8 }
        }}
        className="max-w-2xl"
      >
        <div className="flex items-center gap-6 mb-12">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/40"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <span className="text-foreground/60 font-black font-mono text-[12px] uppercase tracking-[0.2em]">
              {project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Archive 2026'}
            </span>
          </div>
          <div className="h-px w-24 bg-linear-to-r from-foreground/10 to-transparent" />
        </div>

        <h3 className="text-3xl md:text-5xl font-medium text-foreground tracking-tight leading-tight mb-10 selection:bg-foreground selection:text-background">
          {project.title}
        </h3>


        <p className="text-base md:text-xl text-foreground/50 leading-relaxed font-medium mb-12 tracking-tight max-w-lg">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-16">
          {project.skills?.map((s: any, i: number) => (
            <span key={i} className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors cursor-default">
              {typeof s === 'string' ? s : s.name}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center h-12 px-8 rounded-full bg-foreground text-background transition-all hover:opacity-90 hover:shadow-lg shadow-black/10 font-black text-[11px] uppercase tracking-[0.2em]"
            >
              <ExternalLink className="size-4 mr-3 group-hover:scale-110 transition-transform" strokeWidth={3} />
              Live link
            </a>
          )}

          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center h-12 px-6 rounded-full bg-background border border-border/50 text-foreground transition-all hover:bg-secondary hover:shadow-md font-black text-[11px] uppercase tracking-[0.2em]"
            >
              <FaGithub className="size-5 mr-3 group-hover:rotate-12 transition-transform" />
              GitHub
            </a>
          )}

          {project.videoLink && (
            <a
              href={project.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center h-12 px-6 rounded-full bg-[#FF0000]/5 border border-[#FF0000]/10 text-[#FF0000] transition-all hover:bg-[#FF0000] hover:text-white hover:shadow-[0_8px_20px_-6px_rgba(255,0,0,0.4)] font-black text-[11px] uppercase tracking-[0.2em]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-3 group-hover:scale-110 transition-transform"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              YouTube
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
          {projects.map((project, index) => (
            <ArchiveDetailBlock
              key={project._id}
              project={project}
              index={index}
              onInView={setActiveIndex}
            />
          ))}
          <div className="h-[30vh]" aria-hidden />
        </div>


        {/* RIGHT: Sticky Image Showcase */}
        <div className="hidden lg:block sticky top-0 h-screen self-start w-full pointer-events-none">
          <div className="h-full w-full flex items-center justify-center">

            <div className="relative w-full aspect-[16/10] max-w-4xl mx-auto overflow-hidden rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-foreground/5 bg-background/50 backdrop-blur-xl pointer-events-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject._id}
                  initial={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="absolute inset-0 z-10"
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
            </div>
          </div>
        </div>




      </div>
    </div>
  );
}
