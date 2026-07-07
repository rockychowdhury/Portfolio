"use client";

import { motion } from "framer-motion";
import { IBlog } from "@/lib/db/models/Blog";
import CardRouter from "./CardRouter";

interface MasonryGridProps {
  blogs: IBlog[];
  onTagClick: (tag: string) => void;
}

export default function MasonryGrid({ blogs, onTagClick }: MasonryGridProps) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <div className="relative p-1 md:p-3 rounded-3xl border border-border/10 bg-secondary/[0.01]">
      <div className="columns-1 md:columns-2 xl:columns-4 gap-4">
        {blogs.slice(0, 10).map((blog, itemIdx) => (
          <motion.div
            key={blog._id}
            className="break-inside-avoid mb-4 inline-block w-full"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ 
              duration: 0.4, 
              delay: (itemIdx % 3) * 0.1,
              ease: "easeOut" 
            }}
          >
            <CardRouter 
              blog={blog} 
              index={itemIdx} 
              onTagClick={onTagClick} 
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
