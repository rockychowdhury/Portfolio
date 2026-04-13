"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IBlog } from "@/lib/db/models/Blog";
import CardRouter from "./CardRouter";

interface MasonryGridProps {
  blogs: IBlog[];
  onTagClick: (tag: string) => void;
}

export default function MasonryGrid({ blogs, onTagClick }: MasonryGridProps) {
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setColumns(1);
      else if (window.innerWidth < 1024) setColumns(2);
      else setColumns(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!blogs || blogs.length === 0) return null;

  // Header logic
  const firstBlog = blogs[0];
  const hasWideBanner = firstBlog.is_featured;
  const headerCount = hasWideBanner ? (columns > 1 ? 2 : 1) : 0;
  
  const headerBlogs = blogs.slice(0, headerCount);
  const masonryBlogs = blogs.slice(headerCount);

  // Distribute items into columns based on height/index
  const columnArrays = Array.from({ length: columns }, () => [] as IBlog[]);
  masonryBlogs.forEach((blog, i) => {
    columnArrays[i % columns].push(blog);
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Top Row: Spanning Header */}
      {hasWideBanner && columns > 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CardRouter blog={blogs[0]} index={0} onTagClick={onTagClick} />
          </div>
          <div className="lg:col-span-1">
            <CardRouter blog={blogs[1]} index={1} onTagClick={onTagClick} />
          </div>
        </div>
      )}

      {/* Grid columns */}
      <div 
        className="grid gap-8" 
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {columnArrays.map((colItems, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-8">
            <AnimatePresence mode="popLayout">
              {colItems.map((blog, itemIdx) => (
                <CardRouter 
                  key={blog._id} 
                  blog={blog} 
                  index={itemIdx * columns + colIdx + headerCount} 
                  onTagClick={onTagClick} 
                />
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
