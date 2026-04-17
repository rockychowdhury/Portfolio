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
      {/* Vertical Index label - Robotic style */}
      <div className="absolute -left-16 top-16 hidden lg:flex flex-col items-center gap-6">
        <div className="flex flex-col items-center">
          <span className={clsx(
            "text-[8px] font-black font-mono uppercase tracking-[0.2em] mb-1 transition-colors duration-500",
            isActive ? "text-foreground/40" : "text-foreground/10"
          )}>
            Art.
          </span>
          <span className={clsx(
            "text-xl font-black font-mono transition-all duration-500",
            isActive ? "text-foreground scale-110" : "text-foreground/10 scale-100"
          )}>
            {index.toString().padStart(2, '0')}
          </span>
        </div>
        <div className={clsx(
          "w-px h-16 transition-all duration-700 origin-top",
          isActive ? "bg-foreground scale-y-100 shadow-[0_0_15px_rgba(0,0,0,0.5)]" : "bg-foreground/5 scale-y-50"
        )} />
      </div>

      <div className="flex flex-col gap-6">
        <div className="relative">
          {/* Artifact Version Label */}
          <div className={clsx(
            "mb-4 flex items-center gap-3 transition-opacity duration-500",
            isActive ? "opacity-100" : "opacity-0"
          )}>
            <span className="text-[10px] font-black font-mono uppercase tracking-[0.3em] text-foreground/40">
              V.2.0.4 // STAGE_ARCHIVE
            </span>
            <div className="h-px w-8 bg-foreground/10" />
          </div>

          <div className="flex flex-col gap-2 mb-6">
             <div className="flex items-end justify-between gap-6">
                <h3
                  className={clsx(
                    "text-4xl md:text-6xl font-black tracking-tighter transition-all duration-700 font-anton uppercase leading-[0.85]",
                    isActive ? "text-foreground" : "text-foreground/20"
                  )}
                >
                  {project.title}
                </h3>
                
                {/* External links - Futuristic glass buttons */}
                <div className="flex items-center gap-3 shrink-0 mb-1">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        "p-3 rounded-xl border border-foreground/5 transition-all duration-300 backdrop-blur-sm hover:bg-foreground hover:text-background",
                        isActive ? "text-foreground/40" : "text-foreground/5"
                      )}
                      aria-label="GitHub"
                    >
                      <FaGithub className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        "p-3 rounded-xl border border-foreground/5 transition-all duration-300 backdrop-blur-sm hover:bg-foreground hover:text-background",
                        isActive ? "text-foreground/40" : "text-foreground/5"
                      )}
                      aria-label="Live site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
             </div>
          </div>

          <p className={clsx(
            "text-sm md:text-base leading-relaxed transition-all duration-700 max-w-[90%] font-medium tracking-tight",
            isActive ? "text-foreground/60" : "text-foreground/5"
          )}>
            {project.description}
          </p>
        </div>

        {/* Tech Tags - Glassmorphic Upgrade */}
        <div className={clsx(
          "flex flex-wrap gap-2 mt-2 transition-all duration-700",
          isActive ? "opacity-100 translate-y-0" : "opacity-20 translate-y-2"
        )}>
          {project.skills.map((skill, i) => (
            <span 
              key={i}
              className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-foreground/[0.03] border border-foreground/5 text-foreground/50 backdrop-blur-sm"
            >
              {skill}
            </span>
          ))}
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

