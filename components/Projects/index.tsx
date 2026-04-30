"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Project } from "@/types/project";
import ProjectSlider from "./ProjectSlider";

const headerLetters = "PROJECTS".split("");

const letterAnimation = {
  hidden: { opacity: 0, y: 80, rotateX: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: 0.2 + i * 0.06,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const projectsRes = await fetch("/api/projects");
        const projectsData = await projectsRes.json();

        if (projectsRes.ok) {
          const mapped = projectsData.map((p: any) => ({
            ...p,
            id: p._id,
          }));
          setProjects(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="relative bg-background" id="projects">
      {loading ? (
        <div className="flex h-screen items-center justify-center text-foreground/20 text-[10px] font-black uppercase tracking-[1em] animate-pulse">
          Initializing Projects
        </div>
      ) : (
        <>
          <div className="pt-12 md:pt-10" />

          <section className="relative w-full pt-12 md:pt-10 pb-10 md:pb-20">
            {/* Section Header — constrained */}
            <div className="container-main">
              <div className="mb-16 lg:mb-20">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col"
                >
                  <h2 className="flex flex-wrap items-end text-[clamp(2.5rem,9vw,7rem)] font-medium leading-[1.1] tracking-tighter text-foreground">
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
                    transition={{
                      duration: 1,
                      delay: 0.8,
                      ease: [0.25, 0.4, 0.25, 1],
                    }}
                    className="mt-6 lg:mt-10 flex items-center gap-4"
                  >
                    <div className="h-px w-8 bg-foreground/40" />
                    <p className="text-xs md:text-sm font-medium italic tracking-[0.1em] text-muted-foreground/40">
                      {projects.length} Full-Stack Projects Shipped to
                      Production
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Slider — FULL WIDTH, breaks out of container */}
            {projects.length > 0 && (
              <ProjectSlider projects={projects} />
            )}
          </section>
        </>
      )}
    </div>
  );
}
