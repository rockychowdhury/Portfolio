"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import FilterRow from "./FilterRow";
import MasonryGrid from "./MasonryGrid";
import SearchBar from "./SearchBar";
import { IBlog } from "@/lib/db/models/Blog";
import { Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 6;

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
    <SectionWrapper id="blogs" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Headline & Search */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-20 gap-8">
          <div className="text-center lg:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4"
            >
              Blogs & Resources
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-2xl"
            >
              Things I've written, shared, and built for the community.
            </motion.p>
          </div>

          <SearchBar query={searchQuery} setQuery={setSearchQuery} />
        </div>

        {/* Filters */}
        {!loading && (
          <FilterRow 
            platforms={platforms}
            tags={tags}
            activeFilters={activeFilters}
            onFilterToggle={handleFilterToggle}
            onClearAll={handleClearAll}
          />
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="animate-spin text-primary mb-4" size={40} />
            <p className="text-muted-foreground animate-pulse font-bold tracking-widest uppercase text-xs">Synchronizing Knowledge Base...</p>
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
                  className="px-8 py-3 rounded-full border border-border/50 text-xs font-black uppercase tracking-widest hover:bg-secondary/10 transition-all flex items-center gap-2 group"
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
                <p className="text-muted-foreground/30 text-xs font-bold uppercase tracking-[0.3em]">
                  That's everything for now // 2025
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-border/20 rounded-[2.5rem]">
             <p className="text-muted-foreground text-sm font-medium">Nothing published yet.</p>
             <p className="text-muted-foreground/40 text-xs mt-1">Check back soon — content is on the way.</p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
