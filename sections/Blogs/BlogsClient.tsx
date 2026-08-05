"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useInView } from "framer-motion";
import SectionWrapper from "@/components/layout/SectionWrapper";
import MasonryGrid from "./MasonryGrid";
import FilterRow from "./FilterRow";
import SearchBar from "./SearchBar";
import type { IBlog } from "@/types/blog";
import { Loader2 } from "lucide-react";
import { SlantPattern } from "@/components/ui/BackgroundPatterns";

const ITEMS_PER_PAGE = 10;

export default function BlogsClient({ initialData }: { initialData: IBlog[] }) {
  const [blogs] = useState<IBlog[]>(initialData);

  // Spotlight Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const blogsTitle = "Blogs &".split(" ");
  const resourcesTitle = "Resources".split("");

  const premiumEase: [number, number, number, number] = [0.25, 0.4, 0.25, 1] as const;
  const letterAnimation = {
    hidden: { opacity: 0, y: 100, rotateX: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.7,
        delay: 0.1 + i * 0.02,
        ease: premiumEase,
      },
    }),
  };

  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-10%" });

  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const platforms = useMemo(
    () => Array.from(new Set(blogs.map((b) => b.platform).filter(Boolean))),
    [blogs]
  );

  const filteredBlogs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogs.filter((b) => {
      const matchesPlatform =
        activeFilters.length === 0 || activeFilters.includes(b.platform);
      const haystack = `${b.title} ${b.subtitle} ${(b.tags || []).join(" ")}`.toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      return matchesPlatform && matchesQuery;
    });
  }, [blogs, query, activeFilters]);

  const toggleFilter = (platform: string) =>
    setActiveFilters((prev) => prev.includes(platform)
      ? prev.filter((p) => p !== platform)
      : [...prev, platform]
    );

  return (
    <SectionWrapper
      id="blogs"
      className="pt-16 lg:pt-24 pb-12 lg:pb-16 relative overflow-hidden bg-background border-y border-border/10"
      onMouseMove={handleMouseMove}
    >
      <SlantPattern />
      {/* Spotlight Effect */}

      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 hover:opacity-100" // Note: Section no longer has group, using hover internally where possible or just leaving it
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(var(--primary-rgb), 0.05),
              transparent 80%
            )
          `,
        }}
      />

      <div className="container-main">
        {/* Headline */}
        <div className="flex flex-col items-center mb-16 gap-12" ref={titleRef}>
          <h2 className="flex flex-wrap items-center justify-center text-[clamp(3rem,8vw,8rem)] font-light tracking-tight text-foreground leading-[1.1]">
            {blogsTitle.map((word, wordIdx) => (
              <div key={wordIdx} className="flex overflow-hidden mr-6 pb-4 -mb-4">
                {word.split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i + (wordIdx * 5)}
                    variants={letterAnimation}
                    initial="hidden"
                    animate={isTitleInView ? "visible" : "hidden"}
                    className="inline-block origin-bottom"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            ))}
            <div className="flex overflow-hidden pb-4 -mb-4">
              {resourcesTitle.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i + 10}
                  variants={letterAnimation}
                  initial="hidden"
                  animate={isTitleInView ? "visible" : "hidden"}
                  className="inline-block origin-bottom text-muted-foreground/20"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </h2>
        </div>



        {/* Content */}
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <SearchBar query={query} setQuery={setQuery} hasResults={filteredBlogs.length > 0} />
            <div className="flex-1">
              <FilterRow
                platforms={platforms}
                activeFilters={activeFilters}
                onFilterToggle={toggleFilter}
                onClearAll={() => setActiveFilters([])}
              />
            </div>
          </div>

          {filteredBlogs.length > 0 ? (
            <MasonryGrid blogs={filteredBlogs} onTagClick={toggleFilter} />
          ) : (
            <div className="py-20 text-center text-muted-foreground/50 text-sm italic">
              No articles match your search. Try a different keyword or filter.
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
