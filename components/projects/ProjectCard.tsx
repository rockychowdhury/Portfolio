"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, Github, ExternalLink, Code2, Layers } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { IProject } from "@/lib/db/models/Project";
import clsx from "clsx";

interface ProjectCardProps {
  project: IProject;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const isFeatured = project.isFeatured;
  const skillsList = project.skills?.slice(0, 4) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-[450px] w-full rounded-[2.5rem] overflow-hidden cursor-pointer bg-muted"
    >
      {/* 1. Full-bleed Background Thumbnail */}
      <div className="absolute inset-0 z-0">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          unoptimized
        />
        {/* Dynamic Multi-layered Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-primary/5 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* 2. Content Overlay - Permanent (Lower) & Reveal (Upper) */}
      <div className="relative z-10 h-full w-full p-8 md:p-12 flex flex-col justify-end">
        
        {/* Header Tags (Static) */}
        <div className="absolute top-8 left-8 flex gap-3">
          <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 text-white/80">
            {isFeatured ? "Showcase" : "Repository"}
          </span>
        </div>

        {/* Links Overlay (Hidden -> Slide in from Top Right) */}
        <div className="absolute top-8 right-8 flex gap-3 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
           {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-primary hover:border-primary transition-all duration-300"
            >
              <FaGithub size={20} />
            </a>
          )}
           {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-primary hover:border-primary transition-all duration-300"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>

        {/* Main Text Content */}
        <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
          <div className="flex items-center gap-4 mb-4">
             <div className="h-px w-8 bg-primary/60 group-hover:w-16 transition-all duration-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                Technical Case Study
             </span>
          </div>

          <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-anton leading-[0.85] mb-6 [text-shadow:0_4px_24px_rgba(0,0,0,0.5)]">
            {project.title}
          </h3>

          {/* Reveal Content (Description & Skills) */}
          <div className="max-h-0 opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 transition-all duration-700 ease-in-out overflow-hidden">
            <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium mb-6 line-clamp-2 italic font-serif">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {skillsList.map((s: any, i: number) => {
                const name = typeof s === 'string' ? s : s.name;
                return (
                  <span 
                    key={i} 
                    className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {name}
                  </span>
                );
              })}
              {(project.skills?.length || 0) > 4 && (
                <span className="text-[9px] font-bold text-white/20 self-center">
                  +{(project.skills?.length || 0) - 4}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Indicator (Bottom Right) */}
        <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500 group-hover:scale-110">
           <ArrowUpRight size={20} />
        </div>
      </div>

      {/* Glass Light Sweep Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        <div className="absolute top-[-100%] left-[-100%] w-[300%] h-[300%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_120deg,rgba(255,255,255,0.05)_180deg,transparent_240deg,transparent_360deg)] animate-[spin_4s_linear_infinite]" />
      </div>
    </motion.div>
  );
}
