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

      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Ambient Light Blooms */}
        <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-blue-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Featured Projects - Sticky Layout */}
      <section className="relative w-full py-20 md:py-40 px-6 md:px-12 lg:px-20">
        {/* Horizontal Technical Line */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-foreground/5 to-transparent" />
        
        {/* Stage Coordinates Overlay */}
        <div className="absolute top-12 right-12 hidden xl:flex flex-col items-end opacity-20 pointer-events-none">
          <span className="text-[9px] font-black font-mono tracking-[0.3em]">STAGE_COORD: 34.0522° N, 118.2437° W</span>
          <span className="text-[9px] font-black font-mono tracking-[0.3em] mt-1">SYSTEM_VER: 2.0.4 // ARTIFACT_ARCHIVE</span>
        </div>

        {/* Vertical Labels */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 hidden xl:flex flex-col items-center gap-12 opacity-10 pointer-events-none">
          <span className="text-[9px] font-black uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180">
            Featured Artifacts
          </span>
          <div className="h-32 w-px bg-foreground/20 border-l border-dashed border-foreground/30" />
          <span className="text-[9px] font-black uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180">
            Selected // 026
          </span>
        </div>

        <div className="max-w-[1400px] mx-auto lg:px-10">
          {/* Cinematic Header */}
          <div className="mb-32 lg:mb-48">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-6 mb-12">
                <motion.div variants={fadeUp} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-foreground/20 animate-pulse" />
                  <span className="text-[10px] font-black font-mono uppercase tracking-[0.5em] text-foreground/40">
                    Portfolio Stage // 001
                  </span>
                </motion.div>
                <motion.div variants={fadeUp} className="h-px flex-1 bg-linear-to-r from-foreground/10 to-transparent" />
              </div>

              <h2 className="flex font-anton text-[clamp(4rem,12vw,10rem)] leading-[0.8] tracking-tighter uppercase text-foreground relative">
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
                {/* Subtle Glow behind the header */}
                <div className="absolute inset-0 bg-foreground/[0.02] blur-3xl rounded-full -z-10" />
              </h2>
              
              <motion.div variants={fadeUp} className="mt-12 flex flex-col md:flex-row md:items-end gap-8">
                <p className="text-sm md:text-lg text-foreground/40 max-w-xl font-medium tracking-tight leading-relaxed">
                  Curated selection of high-fidelity digital experiences and technical architectural solutions designed for the modern web.
                </p>
                <div className="flex-1 h-px bg-foreground/5 mb-2 hidden md:block" />
              </motion.div>
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
            <div className="hidden lg:block lg:col-span-3 sticky top-32 self-start pb-48">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-foreground/[0.03] blur-[120px] rounded-full -z-10" />
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

