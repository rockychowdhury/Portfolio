"use client";

import { useEffect, useState } from "react";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import AllProjects from "@/components/projects/AllProjects";

export default function ProjectsSection() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [all, setAll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        
        setFeatured(data.filter((p: any) => p.isFeatured));
        setAll(data.filter((p: any) => !p.isFeatured));
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
        Initializing Projects // 2025
      </div>
    );
  }

  return (
    <div className="relative">
      <FeaturedProjects projects={featured} />
      <AllProjects projects={all} />
    </div>
  );
}
