"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface ProjectMetaProps {
  activeIndex: number;
  projects: any[];
}

export default function ProjectMeta({ activeIndex, projects }: ProjectMetaProps) {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none p-8 md:p-24 flex flex-col justify-end md:justify-center">
      <AnimatePresence mode="wait">
        {projects.map((project, i) => {
          if (i !== activeIndex) return null;

          return (
            <motion.div
              key={project._id || i}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-8 bottom-24 md:left-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 max-w-[400px]"
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
                {project.skills?.map((s: any, idx: number) => {
                  const skillName = typeof s === 'string' ? s : s.name;
                  return (
                    <span 
                      key={idx} 
                      className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors cursor-default"
                    >
                      {skillName}
                    </span>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-4 pointer-events-auto">
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

          );
        })}
      </AnimatePresence>

      {/* Navigation Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {projects.map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ 
              opacity: i === activeIndex ? 1 : 0.2,
              width: i === activeIndex ? 24 : 4
            }}
            className="h-1 rounded-full bg-foreground"
          />
        ))}
      </div>
    </div>
  );
}
