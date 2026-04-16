"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Project } from "@/types/project";
import { ProjectRow } from "@/components/projects/ProjectRow";
import { ProjectWindowPreview } from "@/components/projects/ProjectWindowPreview";
import ProjectArchiveScroll from "@/components/projects/ProjectArchiveScroll";

const headerLetters = "WORKS".split("");

const letterAnimation = {
  hidden: { opacity: 0, y: 80, rotateX: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: 0.2 + i * 0.08,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

export default function ProjectsSection() {
  const [featured, setFeatured] = useState<Project[]>([]);
  const [all, setAll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleActive = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch projects");
        }

        const mappedProjects = data.map((p: any) => ({
          ...p,
          id: p._id,
          skills: p.skills.map((s: any) => typeof s === 'string' ? s : s.name)
        }));
        
        const featuredList = mappedProjects.filter((p: any) => p.isFeatured);
        setFeatured(featuredList);
        setAll(mappedProjects.filter((p: any) => !p.isFeatured));
        
        if (featuredList.length > 0) {
          setActiveId(featuredList[0].id);
        }
      } catch (error) {
        console.error("Projects loading error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground/20 text-[10px] font-black uppercase tracking-[1em] animate-pulse">
        Initializing Projects // 2026
      </div>
    );
  }

  const activeProject = featured.find((p) => p.id === activeId) ?? featured[0];

  return (
    <div className="relative bg-background" ref={containerRef}>
      {/* Featured Projects - Sticky Layout */}
      <section className="relative w-full py-20 md:py-32 px-6 md:px-12 lg:px-20">
        {/* Cinematic Background Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-foreground/5 to-transparent" />
        
        {/* Vertical Labels */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 hidden xl:flex flex-col items-center gap-12 opacity-20 pointer-events-none">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180">
            Featured Artifacts
          </span>
          <div className="h-32 w-px bg-foreground/20 border-l border-dashed border-foreground/30" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180">
            Selected // 026
          </span>
        </div>

        <div className="max-w-[1400px] mx-auto lg:px-10">
          {/* Cinematic Header */}
          <div className="mb-24 lg:mb-32">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-4 mb-8">
                <motion.span variants={fadeUp} className="text-[10px] font-black font-mono uppercase tracking-[0.4em] text-foreground/30">
                  / Portfolio Stage
                </motion.span>
                <motion.div variants={fadeUp} className="h-px flex-1 bg-linear-to-r from-foreground/10 to-transparent" />
              </div>

              <h2 className="flex font-anton text-[clamp(4rem,15vw,12rem)] leading-[0.8] tracking-tighter uppercase text-foreground">
                {headerLetters.map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterAnimation}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </h2>
              
              <motion.p variants={fadeUp} className="mt-8 text-sm md:text-base text-foreground/40 max-w-md font-medium tracking-tight">
                Curated selection of high-fidelity digital experiences and technical architectural solutions.
              </motion.p>
            </motion.div>
          </div>

          {/* 1/4 and 3/4 sticky layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16 items-start">
            {/* LEFT: 1/4 column span — scrollable project list */}
            <div className="flex flex-col lg:col-span-1">
              <div className="h-[20vh] lg:h-[35vh]" aria-hidden />
              
              {featured.map((project, index) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  index={index + 1}
                  isActive={activeId === project.id}
                  onActive={handleActive}
                />
              ))}
              <div className="h-[40vh] lg:h-[65vh]" aria-hidden />
            </div>

            {/* RIGHT: 3/4 column span — sticky window preview */}
            <div className="hidden lg:block lg:col-span-3 sticky top-32 self-start pb-32">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
                className="relative group"
              >
                <ProjectWindowPreview project={activeProject} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Archive */}
      <section className="relative border-t border-foreground/5 bg-background py-32 md:py-48 px-6 md:px-12 lg:px-20">
        {/* Section divider label */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-background border border-foreground/5 rounded-full z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20">Studio Archive</span>
        </div>

         <div className="max-w-[1400px] mx-auto lg:px-10">
            <ProjectArchiveScroll projects={all} />
         </div>
      </section>
    </div>
  );
}

