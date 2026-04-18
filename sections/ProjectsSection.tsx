"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Project } from "@/types/project";
import { ProjectRow } from "@/components/projects/ProjectRow";
import { ProjectWindowPreview } from "@/components/projects/ProjectWindowPreview";
import { WindowChrome } from "@/components/projects/WindowChrome";
import Image from "next/image";
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform values for the cinematic window reveal
  // From 0 to 0.1 of section scroll, we transition from center/large to right/normal
  const windowX = useTransform(scrollYProgress, [0, 0.08], ["-15%", "0%"]);
  const windowScale = useTransform(scrollYProgress, [0, 0.08], [1.1, 1]);

  // Monitor scroll progress to force the first project into focus during the intro phase
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.05 && featured.length > 0) {
      if (activeId !== featured[0].id) {
        setActiveId(featured[0].id);
      }
    }
  });

  const activeProject = featured.find((p) => p.id === activeId) ?? featured[0];

  return (
    <div className="relative bg-background" ref={containerRef} id="projects">
      {loading ? (
        <div className="flex h-screen items-center justify-center text-foreground/20 text-[10px] font-black uppercase tracking-[1em] animate-pulse">
          Initializing Projects // 2026
        </div>
      ) : (
        <>
          {/* Section Entrance Padding to avoid Navbar collision */}
          <div className="pt-12 md:pt-10" />

          {/* Featured Projects - Sticky Layout */}
          <section className="relative w-full pt-12 md:pt-10 pb-10 md:pb-20">
            <div className="container-main">
              {/* Cinematic Header */}
              <div className="mb-16 lg:mb-48">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col"
                >
                  <h2 className="flex flex-wrap items-end text-[clamp(4rem,10vw,8rem)] font-medium leading-[1.1] tracking-tighter text-foreground">
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
                    className="mt-6 lg:mt-12 flex items-center gap-4"
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
                <div className="flex flex-col lg:col-span-5 relative z-20">
                  <div className="h-[5vh] lg:h-[40vh]" aria-hidden />

                  {featured.map((project, index) => (
                    <div key={project.id}>
                      <ProjectRow
                        project={project}
                        index={index + 1}
                        isActive={activeId === project.id}
                        onActive={handleActive}
                      />
                      {/* Mobile-only inline preview — visible below lg */}
                      <div className="block lg:hidden my-6">
                        <WindowChrome
                          url={project.liveLink || project.previewLink}
                          className="w-full"
                        >
                          <div className="relative w-full">
                            {project.previewLink ? (
                              <video
                                src={project.previewLink}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full aspect-video object-cover"
                              />
                            ) : (
                              <div className="relative w-full aspect-video">
                                <Image
                                  src={project.thumbnail}
                                  alt={project.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            )}
                          </div>
                        </WindowChrome>
                      </div>
                    </div>
                  ))}
                  <div className="h-[10vh] lg:h-[30vh]" aria-hidden />
                </div>


                {/* RIGHT: 7/12 column span — sticky window preview with Intro Animation */}
                <div className="hidden lg:block lg:col-span-7 sticky top-32 self-start pb-20 pointer-events-none">
                  <motion.div 
                    style={{ x: windowX, scale: windowScale }}
                    className="relative group pointer-events-auto z-10"
                  >
                    <ProjectWindowPreview project={activeProject} />
                  </motion.div>
                </div>
              </div>

              {/* Unified Project Archive — Merged into the main flow */}
              <div className="mt-12 lg:mt-16">
                <ProjectArchiveScroll projects={all} />
              </div>
            </div>
          </section>
        </>
      )}
    </div>

  );
}
