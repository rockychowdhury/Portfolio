"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, ArrowUpRight, Monitor, Code } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import AnimatedBorder from "../common/AnimatedBorder";
import { IProject } from "@/lib/db/models/Project";

interface ProjectCardProps {
  project: IProject;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const isFeatured = project.isFeatured;

  // Skills parsing for compact display
  const techList = project.techStack?.slice(0, 10).join(" · ") || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <AnimatedBorder isActive={isFeatured}>
        <div className="group h-full bg-card p-5 md:p-6 flex flex-col justify-between transition-all relative">
          
          {/* 1. Top Badges */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full">
              <Code className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                {isFeatured ? "Featured Project" : "Product"}
              </span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-foreground text-background rounded-full">
               <Monitor className="w-3 h-3" />
               <span className="text-[11px] font-bold uppercase tracking-widest leading-none">
                  {project.techStack?.[0] || "Live"}
               </span>
            </div>
          </div>

          {/* 2. Media Section */}
          <div className="relative aspect-[1.4/1] w-full mb-6 rounded-2xl overflow-hidden border border-border/50 bg-secondary/10 group/media">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover/media:scale-110"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/media:opacity-100 transition-opacity" />
          </div>

          {/* 3. Content Block */}
          <div className="mb-6 flex-1">
            <h3 className="text-xl font-bold tracking-tight text-foreground leading-tight mb-3 line-clamp-2">
              {project.title}
            </h3>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Independent Development
              </span>
            </div>

            {techList && (
              <p className="text-xs text-muted-foreground/70 leading-relaxed font-medium line-clamp-3">
                {techList}
              </p>
            )}
          </div>

          {/* 4. Footer */}
          <div className="flex items-center justify-between pt-5 border-t border-border/40">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                2024 - Present
              </span>
            </div>

            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                  title="Source Code"
                >
                  <FaGithub className="w-4 h-4" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn flex items-center gap-1.5 px-4 py-2 bg-primary/10 border border-primary/20 hover:bg-primary/20 rounded-xl text-[11px] font-bold text-primary transition-all shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
                >
                  Live Demo
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </a>
              )}
            </div>
          </div>

        </div>
      </AnimatedBorder>
    </motion.div>
  );
}
