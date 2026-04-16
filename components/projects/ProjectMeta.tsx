"use client";

import { motion, AnimatePresence } from "framer-motion";

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
              <div className="flex items-center gap-6 mb-8 group/num">
                <span className="text-5xl font-black text-foreground/5 tracking-tighter font-mono transition-colors group-hover/num:text-primary/20">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="h-px w-12 bg-primary/20" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-foreground/30">
                   Case Study // 0{i + 1}
                </span>
              </div>

              <h3 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter mb-6 uppercase font-anton leading-[0.85] [text-wrap:balance]">
                {project.title}
              </h3>

              <div className="flex items-center gap-3 mb-8">
                 <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                 <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/60">
                    Production Grade Application
                 </span>
              </div>

              <p className="text-sm md:text-base font-medium text-foreground/50 leading-relaxed mb-8 border-l-2 border-foreground/10 pl-6 italic font-serif">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-10">
                {project.skills?.map((s: any) => {
                  const skillName = typeof s === 'string' ? s : s.name;
                  const color = typeof s === 'object' && s.color ? s.color : 'currentColor';
                  return (
                    <span 
                      key={skillName} 
                      className="text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg border border-foreground/5 bg-foreground/5 text-foreground/40 hover:bg-foreground/10 hover:text-foreground/80 transition-all cursor-default"
                      style={{ '--skill-color': color } as any}
                    >
                      {skillName}
                    </span>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 pointer-events-auto">
                {project.liveLink && (
                  <a 
                    href={project.liveLink} 
                    target="_blank" 
                    className="px-8 py-4 bg-foreground text-background text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-primary transition-colors flex items-center gap-2 group"
                  >
                    View Project
                    <div className="w-1.5 h-1.5 rounded-full bg-background group-hover:scale-150 transition-transform" />
                  </a>
                )}
                {project.githubLink && (
                  <a 
                    href={project.githubLink} 
                    target="_blank" 
                    className="p-4 border border-foreground/10 rounded-full hover:bg-foreground/5 transition-colors group"
                  >
                    <svg className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.011-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12"/></svg>
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
