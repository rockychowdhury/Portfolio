// components/projects/ProjectRow.tsx
"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Project } from "@/types/project";
import { ProjectTags } from "@/components/projects/ProjectTags";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import clsx from "clsx";

interface ProjectRowProps {
  project: Project;
  isActive: boolean;
  onActive: (id: string) => void;
  index: number;
}

export function ProjectRow({ project, isActive, onActive, index }: ProjectRowProps) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    rootMargin: "-25% 0px -40% 0px",
  });

  useEffect(() => {
    if (inView) {
      onActive(project.id || project._id || "");
    }
  }, [inView, project.id, project._id, onActive]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      animate={{ 
        opacity: isActive ? 1 : 0.2,
        x: isActive ? 8 : 0
      }}
      className={clsx(
        "relative py-16 border-b border-foreground/5 transition-all duration-700 ease-in-out group/row"
      )}
    >

      <div className="flex flex-col gap-6">
        <div className="relative">
          <div className={clsx(
            "mb-8 flex items-center gap-6 transition-opacity duration-500",
            isActive ? "opacity-100" : "opacity-0"
          )}>
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/40"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              <span className="text-foreground/60 font-black font-mono text-[12px] uppercase tracking-[0.2em]">
                {/* @ts-ignore */}
                {project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Archive 2026'}
              </span>
            </div>
            <div className="h-px w-24 bg-linear-to-r from-foreground/10 to-transparent" />
          </div>

          <div className="flex flex-col gap-2 mb-6">
             <div className="flex items-end justify-between gap-6">
                <h3
                  className={clsx(
                    "text-3xl md:text-5xl font-medium tracking-tight transition-all duration-700 leading-tight",
                    isActive ? "text-foreground" : "text-foreground/30"
                  )}
                >
                  {project.title}
                </h3>

                
             </div>
          </div>

          <p className={clsx(
            "text-sm md:text-base leading-relaxed transition-all duration-700 max-w-[90%] font-medium tracking-tight",
            isActive ? "text-foreground/60" : "text-foreground/10"
          )}>
            {project.description}
          </p>
        </div>

        <div className={clsx(
          "flex flex-wrap gap-x-6 gap-y-2 mt-4 transition-all duration-700",
          isActive ? "opacity-100 translate-y-0" : "opacity-20 translate-y-2"
        )}>
          {project.skills.map((skill, i) => (
            <span 
              key={i}
              className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={clsx(
          "flex flex-wrap items-center gap-4 mt-8 transition-all duration-700 delay-100",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center h-10 px-6 rounded-full bg-foreground text-background transition-all hover:opacity-90 hover:shadow-lg shadow-black/10 font-black text-[10px] uppercase tracking-[0.2em]"
            >
              <ExternalLink className="size-3.5 mr-2 group-hover:scale-110 transition-transform" strokeWidth={3} />
              Live link
            </a>
          )}

          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center h-10 px-5 rounded-full bg-background border border-border/50 text-foreground transition-all hover:bg-secondary hover:shadow-md font-black text-[10px] uppercase tracking-[0.2em]"
            >
              <FaGithub className="size-4 mr-2 group-hover:rotate-12 transition-transform" />
              GitHub
            </a>
          )}

          {project.videoLink && (
            <a
              href={project.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center h-10 px-5 rounded-full bg-[#FF0000]/5 border border-[#FF0000]/10 text-[#FF0000] transition-all hover:bg-[#FF0000] hover:text-white hover:shadow-[0_8px_20px_-6px_rgba(255,0,0,0.4)] font-black text-[10px] uppercase tracking-[0.2em]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2 group-hover:scale-110 transition-transform"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              YouTube
            </a>
          )}
        </div>
      </div>

      {/* Futuristic Glowing Pulse Line */}
      <div className={clsx(
        "absolute bottom-0 left-0 h-[2px] transition-all duration-1000 ease-in-out",
        isActive ? "w-full bg-foreground opacity-100 shadow-[0_0_20px_rgba(0,0,0,0.3)]" : "w-0 bg-foreground/10 opacity-0"
      )} />
    </motion.div>

  );
}

