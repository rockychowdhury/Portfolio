// components/projects/ProjectRow.tsx
"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Project } from "@/types/project";
import { ProjectTags } from "./ProjectTags";
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
      whileInView={{ opacity: isActive ? 1 : 0.3, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      animate={{ 
        opacity: isActive ? 1 : 0.3,
        x: isActive ? 4 : 0
      }}
      className={clsx(
        "relative py-12 border-b border-foreground/5 transition-all duration-700 ease-in-out group/row"
      )}
    >
      {/* Vertical Index label */}
      <div className="absolute -left-12 top-12 hidden lg:flex flex-col items-center gap-4">
        <span className={clsx(
          "text-[10px] font-black font-mono transition-colors duration-500",
          isActive ? "text-foreground" : "text-foreground/10"
        )}>
          {index.toString().padStart(2, '0')}
        </span>
        <div className={clsx(
          "w-px h-8 transition-all duration-500",
          isActive ? "bg-foreground scale-y-100" : "bg-foreground/10 scale-y-50"
        )} />
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <div className="flex flex-col gap-2 mb-4">
             <div className="flex items-center justify-between gap-4">
                <h3
                  className={clsx(
                    "text-3xl md:text-5xl font-black tracking-tight transition-all duration-500 font-anton uppercase leading-none",
                    isActive ? "text-foreground translate-x-1" : "text-foreground/20 translate-x-0"
                  )}
                >
                  {project.title}
                </h3>
                
                {/* External links */}
                <div className="flex items-center gap-3 shrink-0">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        "p-2 rounded-full border border-foreground/5 transition-all duration-300 hover:bg-foreground hover:text-background",
                        isActive ? "text-foreground/40" : "text-foreground/10"
                      )}
                      aria-label="GitHub"
                    >
                      <FaGithub className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        "p-2 rounded-full border border-foreground/5 transition-all duration-300 hover:bg-foreground hover:text-background",
                        isActive ? "text-foreground/40" : "text-foreground/10"
                      )}
                      aria-label="Live site"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
             </div>
          </div>

          <p className={clsx(
            "text-sm leading-relaxed transition-all duration-500 max-w-[95%] font-medium",
            isActive ? "text-foreground/60" : "text-foreground/5"
          )}>
            {project.description}
          </p>
        </div>

        <ProjectTags skills={project.skills} active={isActive} className="mt-2" />
      </div>

      {/* Subtle indicator line that grows when active */}
      <div className={clsx(
        "absolute bottom-0 left-0 h-[2px] bg-foreground transition-all duration-700 ease-out",
        isActive ? "w-full opacity-100" : "w-0 opacity-0"
      )} />
    </motion.div>
  );
}

