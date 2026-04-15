"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import FilterRow from "./FilterRow";
import MasonryGrid from "./MasonryGrid";
import SearchBar from "./SearchBar";
import { IBlog } from "@/lib/db/models/Blog";
import { Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 12;

export default function BlogsSection() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

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

  const displayedBlogs = filteredBlogs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBlogs.length;

  return (
    <SectionWrapper id="blogs" className="py-32 relative overflow-hidden bg-secondary/5 dark:bg-zinc-900/40 border-y border-border/10">
      {/* Background Pattern Detail: Horizontal (X-axis) Lines */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]" 
        style={{
          backgroundImage: `linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "100% 80px",
        }}
      />

      <div className="mx-auto max-w-[1400px] px-6  relative z-10">
        {/* Headline & Search */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-24 gap-8">
          <div className="text-left">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6"
            >
              Blogs & Resources
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground/60 max-w-2xl font-medium"
            >
              Technical writing, shared resources, and community builds.
            </motion.p>
          </div>

          <SearchBar query={searchQuery} setQuery={setSearchQuery} />
        </div>

        {/* Filters */}
        {!loading && (
          <div className="mb-12">
            <FilterRow 
                platforms={platforms}
                tags={tags}
                activeFilters={activeFilters}
                onFilterToggle={handleFilterToggle}
                onClearAll={handleClearAll}
            />
          </div>
        )}

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
            
            {/* Load More */}
            <div className="mt-20 flex justify-center">
              {hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-4 rounded-full border border-border/80 shadow-sm text-xs font-black uppercase tracking-widest hover:bg-secondary/10 transition-all flex items-center gap-2 group"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Articles <span className="group-hover:translate-y-1 transition-transform">↓</span>
                    </>
                  )}
                </button>
              ) : (
                <p className="text-muted-foreground/20 text-[10px] font-black uppercase tracking-[0.4em]">
                  Live Stream Ended // End of content
                </p>
              )}
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
