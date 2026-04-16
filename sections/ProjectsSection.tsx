"use client";

import { useEffect, useState, useCallback } from "react";
import { Project } from "@/types/project";
import { ProjectRow } from "@/components/projects/ProjectRow";
import { ProjectWindowPreview } from "@/components/projects/ProjectWindowPreview";
import AllProjects from "@/components/projects/AllProjects";

export default function ProjectsSection() {
  const [featured, setFeatured] = useState<Project[]>([]);
  const [all, setAll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>("");

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

        // Map data to Project type
        const mappedProjects = data.map((p: any) => ({
          ...p,
          id: p._id,
          skills: p.skills.map((s: any) => typeof s === 'string' ? s : s.name)
        }));
        
        const featuredList = mappedProjects.filter((p: any) => p.isFeatured);
        setFeatured(featuredList);
        setAll(data.filter((p: any) => !p.isFeatured));
        
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
    <div className="relative bg-background">
      {/* Featured Projects - Sticky Layout */}
      <section className="w-full py-20 md:py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="mb-16">
            <h2 className="text-sm font-mono text-foreground/30 uppercase tracking-[0.3em] mb-4">
              / Featured Work
            </h2>
            <div className="h-px w-full bg-linear-to-r from-foreground/10 to-transparent" />
          </div>

          {/* 1/4 and 3/4 sticky layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16 items-start">
            {/* LEFT: 1/4 column span — scrollable project list */}
            <div className="flex flex-col lg:col-span-1">
              {/* Top spacer to give first project more 'scroll headroom' */}
              <div className="h-[20vh] lg:h-[30vh]" aria-hidden />
              
              {featured.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  isActive={activeId === project.id}
                  onActive={handleActive}
                />
              ))}
              {/* Bottom padding so last item can trigger IntersectionObserver */}
              <div className="h-[40vh] lg:h-[60vh]" aria-hidden />
            </div>

            {/* RIGHT: 3/4 column span — sticky window preview */}
            <div className="hidden lg:block lg:col-span-3 sticky top-32 self-start pb-32">
              <div className="relative group">
                <ProjectWindowPreview project={activeProject} />
                
                {/* Decorative background glow */}
                <div className="absolute -inset-12 bg-foreground/[0.03] blur-[120px] rounded-[5rem] -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              {/* Reflection / Shadow */}
              <div
                className="mt-12 mx-20 h-20 rounded-[3rem] opacity-20 blur-3xl"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)",
                }}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </section>

      {/* All Projects - Existing Card Grid */}
      <section className="border-t border-foreground/5 bg-foreground/[0.01]">
         <AllProjects projects={all} />
      </section>
    </div>
  );
}
