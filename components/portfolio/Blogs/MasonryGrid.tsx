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
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setColumns(1);
      else if (window.innerWidth < 1024) setColumns(2);
      else if (window.innerWidth < 1280) setColumns(3);
      else setColumns(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!blogs || blogs.length === 0) return null;

  // Smart Distribution: Categorize by estimated height to balance columns
  // Weights (approximate heights in pixels)
  const getWeight = (blog: IBlog, index: number) => {
    if (blog.is_featured && index === 0) return 600;
    if (blog.thumbnail_url && (blog.platform === "Medium" || index % 8 === 4)) return 450; // Overlay
    if (blog.platform === "YouTube") return 400;
    if (blog.thumbnail_url) return 500; // Standard Hero
    if (blog.platform === "LinkedIn" && !blog.thumbnail_url) return 350; // Dark Quote
    return 250; // Micro/Minimal
  };

  const columnArrays = Array.from({ length: columns }, () => [] as IBlog[]);
  const columnHeights = Array(columns).fill(0);

  blogs.forEach((blog, i) => {
    // Find shortest column
    const shortestColIdx = columnHeights.indexOf(Math.min(...columnHeights));
    columnArrays[shortestColIdx].push(blog);
    columnHeights[shortestColIdx] += getWeight(blog, i);
  });

  return (
    <div className="relative p-1 rounded-[3rem] border border-border/10 bg-secondary/[0.02] backdrop-blur-[2px]">
      <div 
        className="grid gap-5" 
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {columnArrays.map((colItems, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-5">
            <AnimatePresence>
              {colItems.map((blog, itemIdx) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "100px" }}
                  transition={{ 
                    duration: 0.4, 
                    delay: itemIdx * 0.02,
                    ease: "easeOut" 
                  }}
                >
                  <CardRouter 
                    blog={blog} 
                    index={blogs.indexOf(blog)} 
                    onTagClick={onTagClick} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
