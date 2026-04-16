"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { IProject } from "@/lib/db/models/Project";

interface AllProjectsProps {
  projects: IProject[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AllProjects({ projects }: AllProjectsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="all-projects" className="relative bg-background py-32 lg:py-56 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 right-[-10%] w-[60%] aspect-square bg-primary/[0.03] rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] aspect-square bg-primary/[0.02] rounded-full blur-[140px] pointer-events-none -z-10" />
      
      {/* Ultra-subtle Dot Grid */}
      <div className="absolute inset-0 opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_100%)] pointer-events-none -z-10" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, var(--foreground) 0.5px, transparent 0.5px)', 
             backgroundSize: '48px 48px',
             opacity: 0.05
           }} 
      />

      <div className="mx-auto max-w-[1400px]">
        {/* Section Header: Clean Aesthetic Style */}
        <div className="mb-24 lg:mb-32">
          <div className="mb-12">
            <h2 className="text-sm font-mono text-foreground/30 uppercase tracking-[0.3em] mb-4">
              / Project Archives
            </h2>
            <div className="h-px w-full bg-linear-to-r from-foreground/10 to-transparent" />
          </div>
          
          <div className="max-w-4xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-5xl md:text-8xl font-black tracking-tighter text-foreground mb-8 uppercase font-anton leading-none"
            >
              The Full Technical <br /> 
              Spectrum.
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col md:flex-row md:items-end gap-10"
            >
              <p className="text-base md:text-lg text-foreground/40 leading-relaxed max-w-2xl font-medium">
                Beyond the featured highlights, these repositories encompass my broader exploration of system architecture, API design, and complex problem-solving.
              </p>
              
              <div className="hidden md:block flex-1 h-px bg-foreground/[0.05] mb-4" />
              
              <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-foreground/20">
                 <span>{projects.length} Entries</span>
                 <span>//</span>
                 <span>Sorted by Order</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Project Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-12 md:gap-16 sm:grid-cols-2 lg:grid-cols-2"
        >
          {projects.map((project, index) => (
            <ProjectCard key={project._id} project={project} index={index} />
          ))}
        </motion.div>
        
        {/* Footer Hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-32 pt-12 border-t border-foreground/[0.03] flex justify-center"
        >
          <div className="flex items-center gap-4 text-[10px] font-black tracking-[0.3em] uppercase text-foreground/10">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/10" />
            End of technical inventory
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
