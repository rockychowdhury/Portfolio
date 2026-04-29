"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FeatureCard as FeatureCardType, Project } from "@/types/project";
import FeatureCard from "./FeatureCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Color palette for project accent chips
const PROJECT_COLORS = [
  "#6366f1", // indigo
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#f97316", // orange
  "#ec4899", // pink
];

interface FeatureCardRowProps {
  featureCards: FeatureCardType[];
  projects: Project[];
  activeProjectId?: string;
}

export default function FeatureCardRow({
  featureCards,
  projects,
  activeProjectId,
}: FeatureCardRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Build project color map
  const projectColorMap = new Map<string, string>();
  projects.forEach((p, i) => {
    const id = p._id || p.id;
    projectColorMap.set(id, PROJECT_COLORS[i % PROJECT_COLORS.length]);
  });

  // Build project name map
  const projectNameMap = new Map<string, string>();
  projects.forEach((p) => {
    const id = p._id || p.id;
    projectNameMap.set(id, p.title);
  });

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    updateScrollButtons();
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [updateScrollButtons]);

  // Optional: scroll to active project's cards when slider changes
  useEffect(() => {
    if (!activeProjectId || !scrollRef.current) return;
    const firstCard = scrollRef.current.querySelector(
      `[data-project-id="${activeProjectId}"]`
    );
    if (firstCard) {
      firstCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [activeProjectId]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 340;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full">
      {/* Section label */}
      <div className="flex items-center gap-4 mb-6 px-1">
        <div className="h-px w-6 bg-foreground/20" />
        <span className="text-xs font-black tracking-[0.3em] uppercase text-muted-foreground/50">
          Features & Problems Solved
        </span>
      </div>

      {/* Navigation arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/90 border border-border/50 shadow-lg flex items-center justify-center hover:bg-secondary transition-colors backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft className="size-5 text-foreground/60" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/90 border border-border/50 shadow-lg flex items-center justify-center hover:bg-secondary transition-colors backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight className="size-5 text-foreground/60" />
        </button>
      )}

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide px-1 pb-4 scroll-smooth"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
        }}
      >
        {featureCards.map((card, i) => (
          <motion.div
            key={card._id || card.id || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex-shrink-0 scroll-snap-align-start"
            data-project-id={card.projectId}
          >
            <FeatureCard
              card={card}
              accentColor={projectColorMap.get(card.projectId) || "#6366f1"}
              projectName={projectNameMap.get(card.projectId) || ""}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
