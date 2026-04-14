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
    <section id="all-projects" className="relative bg-background py-24 lg:py-40 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-[1400px]">
        {/* Section Header - Aligned with Education style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 lg:mb-32 max-w-2xl"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8 bg-primary/60" />
            <span className="text-sm font-bold tracking-[0.3em] uppercase text-primary">
              Portfolio & Products
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[0.9]">
            Recent <br /> 
            <span className="text-muted-foreground font-light">Development.</span>
          </h2>
          
          <p className="text-lg text-muted-foreground/80 leading-relaxed font-medium">
            Building digital experiences that matter. <br className="hidden md:block" />
            From concept to production.
            <span className="block mt-4 text-sm font-normal italic opacity-60 font-serif">
              A curated collection of my work in web development, AI, and problem solving.
            </span>
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project, index) => (
            <ProjectCard key={project._id} project={project} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
