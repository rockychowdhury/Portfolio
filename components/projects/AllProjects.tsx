"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

interface AllProjectsProps {
  projects: any[];
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

export default function AllProjects({ projects }: AllProjectsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="all-projects" className="bg-background py-24 px-6 md:px-12 lg:px-24">
      <div className="mx-auto max-max-w-7xl">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">
              Collection // 2025
            </span>
            <h2 className="text-4xl font-black text-foreground tracking-tighter sm:text-5xl">
              All Projects
            </h2>
          </div>
          <div className="hidden h-px flex-1 bg-foreground/5 mx-12 md:block" />
          <div className="text-right">
             <span className="text-3xl font-black text-foreground/10 font-mono">
                {projects.length.toString().padStart(2, '0')}
             </span>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.div key={project._id} variants={cardVariants}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
