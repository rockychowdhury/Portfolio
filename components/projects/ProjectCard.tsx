"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface ProjectCardProps {
  project: any;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-foreground/5 bg-foreground/[0.02] transition-all hover:border-foreground/10 hover:bg-foreground/[0.04]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex items-center justify-center gap-4">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white text-black hover:scale-110 transition-transform"
            >
              <FaGithub size={20} />
            </a>
          )}
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white text-black hover:scale-110 transition-transform"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.techStack?.slice(0, 3).map((tag: string) => (
            <span key={tag} className="text-[8px] font-bold uppercase tracking-widest text-foreground/30">
              #{tag}
            </span>
          ))}
        </div>

        <h3 className="mb-2 text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        <p className="line-clamp-2 text-sm text-foreground/40 leading-relaxed mb-6">
          {project.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.techStack?.slice(0, 4).map((tag: string, i: number) => (
                <div key={i} className="h-6 w-6 rounded-full border border-background bg-secondary flex items-center justify-center text-[8px] font-bold text-foreground/50 ring-1 ring-foreground/5 uppercase">
                    {tag.charAt(0)}
                </div>
            ))}
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground transition-colors"
          >
            Details ↗
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
