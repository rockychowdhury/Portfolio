"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useInView } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import FilterRow from "./FilterRow";
import MasonryGrid from "./MasonryGrid";
import SearchBar from "./SearchBar";
import { IBlog } from "@/lib/db/models/Blog";
import { Loader2, ChevronsDown } from "lucide-react";

const ITEMS_PER_PAGE = 12;

export default function BlogsSection() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

  // Initial visible count adjustment for mobile/tablet
  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth < 1024) {
        setVisibleCount(4);
      } else {
        setVisibleCount(ITEMS_PER_PAGE);
      }
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Spotlight Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs/list");
        const data = await res.json();
        if (Array.isArray(data)) {
          setBlogs(data);
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Extract unique platforms and tags from data
  const platforms = useMemo(() => {
    return Array.from(new Set(blogs.map((b) => b.platform)));
  }, [blogs]);

  const tags = useMemo(() => {
    const allTags = blogs.flatMap((b) => b.tags);
    return Array.from(new Set(allTags)).slice(0, 8); // Top tags
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    let result = blogs;

    // 1. apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((blog) =>
        blog.title.toLowerCase().includes(q) ||
        blog.subtitle.toLowerCase().includes(q) ||
        blog.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // 2. apply platform/tag filters
    if (activeFilters.length > 0) {
      result = result.filter((blog) =>
        activeFilters.includes(blog.platform) ||
        blog.tags.some(tag => activeFilters.includes(tag))
      );
    }

    return result;
  }, [blogs, activeFilters, searchQuery]);

  const handleFilterToggle = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
    setVisibleCount(ITEMS_PER_PAGE); // Reset count on filter
  };

  const handleClearAll = () => {
    setActiveFilters([]);
    setSearchQuery("");
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      setLoadingMore(false);
    }, 800);
  };

  const displayedBlogs = useMemo(() => {
    const list = filteredBlogs;
    if (list.length <= 4 || typeof window === "undefined" || window.innerWidth >= 1024) {
      return list.slice(0, visibleCount);
    }
    
    // On mobile, try to pick 4 different types for variety
    const result: IBlog[] = [];
    const usedIndices = new Set<number>();
    
    // 1. Always start with the first one (usually featured/hero)
    result.push(list[0]);
    usedIndices.add(0);

    // 2. Find a dark quote or micro
    const varietyIdx = list.findIndex((b, i) => i > 0 && (b.platform === "LinkedIn" || b.platform === "Hashnode"));
    if (varietyIdx !== -1) {
      result.push(list[varietyIdx]);
      usedIndices.add(varietyIdx);
    }

    // 3. Find an overlay or medium post
    const overlayIdx = list.findIndex((b, i) => i > 0 && !usedIndices.has(i) && (b.platform === "Medium" || b.thumbnail_url));
    if (overlayIdx !== -1) {
      result.push(list[overlayIdx]);
      usedIndices.add(overlayIdx);
    }

    // 4. Fill the rest from the original order
    for (let i = 0; i < list.length && result.length < 4; i++) {
      if (!usedIndices.has(i)) {
        result.push(list[i]);
        usedIndices.add(i);
      }
    }

    return result;
  }, [filteredBlogs, visibleCount]);

  const hasMore = visibleCount < filteredBlogs.length;

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

  return (
    <SectionWrapper
      id="blogs"
      className="pt-16 lg:pt-24 pb-32 relative overflow-hidden bg-secondary/5 dark:bg-zinc-900/40 border-y border-border/10"
      onMouseMove={handleMouseMove}
    >
      {/* Background Pattern Detail: Horizontal (X-axis) Lines */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "100% 80px",
        }}
      />

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

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-start mb-12 gap-8 border-b border-border/10 pb-6 w-full overflow-hidden"
        >
          <div className="flex-shrink-0">
            <SearchBar 
              query={searchQuery} 
              setQuery={setSearchQuery} 
              hasResults={searchQuery.trim() === "" || filteredBlogs.length > 0} 
            />
          </div>
          <div className="flex-1 overflow-hidden min-w-0">
            {!loading && (
              <FilterRow
                platforms={platforms}
                tags={tags}
                activeFilters={activeFilters}
                onFilterToggle={handleFilterToggle}
                onClearAll={handleClearAll}
              />
            )}
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[2.5rem] bg-secondary/5 border border-border/10 overflow-hidden animate-pulse h-[400px]"
              >
                <div className="w-full h-48 bg-secondary/10" />
                <div className="p-8 space-y-4">
                  <div className="h-4 w-24 bg-secondary/10 rounded" />
                  <div className="h-8 w-full bg-secondary/10 rounded" />
                  <div className="h-8 w-3/4 bg-secondary/10 rounded" />
                  <div className="space-y-2 pt-4">
                    <div className="h-4 w-full bg-secondary/10 rounded" />
                    <div className="h-4 w-2/3 bg-secondary/10 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedBlogs.length > 0 ? (
          <div className="w-full">
            <MasonryGrid blogs={displayedBlogs} onTagClick={handleFilterToggle} />

            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative w-full flex items-center justify-center">
                {/* Subtle Divider Line */}
                <div className="absolute inset-x-0 h-px bg-border/10" />
                
                <div className="relative z-10 bg-background px-12">
                  {hasMore ? (
                    <motion.button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      whileHover={{ scale: 1.02 }}
                      className="group flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/60 hover:text-foreground transition-all duration-500 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {loadingMore ? (
                        <Loader2 size={14} className="animate-spin text-primary" />
                      ) : (
                        <>
                          <div className="flex items-center gap-3 transition-all duration-700">
                            <ChevronsDown size={14} className="group-hover:translate-y-1 transition-transform duration-500 opacity-60 group-hover:opacity-100 shrink-0" />
                            <span className="group-hover:tracking-[0.8em] transition-all duration-700 whitespace-nowrap">Load More</span>
                            <div className="w-6 h-px bg-muted-foreground/20 group-hover:w-10 group-hover:bg-primary transition-all duration-700 shrink-0" />
                          </div>
                        </>
                      )}
                    </motion.button>
                  ) : (
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/10">
                      End of technical archive // 2026
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border border-border/80 rounded-3xl bg-white shadow-sm dark:bg-zinc-800/80">
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">No entries found.</p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
