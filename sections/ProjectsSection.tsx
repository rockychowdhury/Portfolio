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
        <div className="max-w-[1400px] mx-auto lg:px-10">
          {/* Cinematic Header */}
          <div className="mb-32 lg:mb-48">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <h2 className="flex flex-wrap items-end text-[4.5rem] font-medium leading-[1.1] tracking-tighter text-foreground sm:text-[6rem] md:text-[8rem] lg:text-[10rem]">
                {headerLetters.map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterAnimation}
                    className="inline-block origin-bottom"
                  >
                    {letter}
                  </motion.span>
                ))}
              </h2>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                className="mt-12 flex items-center gap-4"
              >
                <div className="h-px w-8 bg-foreground/40" />
                <p className="text-xs md:text-sm font-medium italic tracking-[0.1em] text-muted-foreground/40">
                  {featured.length + all.length} Full-Stack Projects Shipped to Production
                </p>
              </motion.div>
            </motion.div>
          </div>







          {/* 5/12 and 7/12 sticky layout for better text space */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
            {/* LEFT: 5/12 column span — scrollable project list */}
            <div className="flex flex-col lg:col-span-5">
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

            {/* RIGHT: 7/12 column span — sticky window preview */}
            <div className="hidden lg:block lg:col-span-7 sticky top-32 self-start pb-48 pointer-events-none">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
                className="relative group pointer-events-auto"
              >
                <div className="absolute inset-0 bg-foreground/[0.03] blur-[120px] rounded-full -z-10" />
                <ProjectWindowPreview project={activeProject} />
              </motion.div>
            </div>

          </div>

          {/* Unified Project Archive — Merged into the main flow */}
          <div className="mt-20 lg:mt-32">
            <ProjectArchiveScroll projects={all} />
          </div>
        </div>
      </section>
    </div>


  );
}

