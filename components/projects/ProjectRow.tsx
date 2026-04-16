// components/projects/ProjectRow.tsx
"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Project } from "@/types/project";
import { ProjectTags } from "./ProjectTags";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import clsx from "clsx";

interface ProjectRowProps {
  project: Project;
  isActive: boolean;
  onActive: (id: string) => void;
}

export function ProjectRow({ project, isActive, onActive }: ProjectRowProps) {
  const { ref, inView } = useInView({
    threshold: 0.5,           // fires when 50% of the row is visible
    rootMargin: "-25% 0px -40% 0px", // focus detection on the middle-top area
  });

  useEffect(() => {
    if (inView) {
      onActive(project.id || project._id || "");
    }
  }, [inView, project.id, project._id, onActive]);

  return (
    <div
      ref={ref}
      className={clsx(
        "py-12 border-b border-foreground/5 transition-all duration-700 ease-in-out",
        isActive ? "opacity-100 translate-x-0" : "opacity-15 -translate-x-1"
      )}
    >
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex flex-col gap-2 mb-4">
             <div className="flex items-center justify-between gap-4">
                <h3
                  className={clsx(
                    "text-3xl md:text-5xl font-black tracking-tight transition-all duration-500 font-anton uppercase leading-none",
                    isActive ? "text-foreground" : "text-foreground/5"
                  )}
                >
                  {project.title}
                </h3>
                
                {/* External links - Moved closer to title */}
                <div className="flex items-center gap-3 shrink-0">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        "transition-all duration-300 hover:text-foreground",
                        isActive ? "text-foreground/40" : "text-foreground/10"
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
                        "transition-all duration-300 hover:text-foreground",
                        isActive ? "text-foreground/40" : "text-foreground/10"
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
            "text-sm leading-relaxed transition-all duration-500 max-w-[90%]",
            isActive ? "text-foreground/60 contrast-125" : "text-foreground/10"
          )}>
            {project.description}
          </p>
        </div>

        <ProjectTags skills={project.skills} active={isActive} className="mt-2" />
      </div>
    </div>
  );
}
