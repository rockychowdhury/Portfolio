"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useInView } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import MasonryGrid from "./MasonryGrid";
import { IBlog } from "@/lib/db/models/Blog";
import { Loader2 } from "lucide-react";
import { SlantPattern } from "@/components/ui/BackgroundPatterns";

const ITEMS_PER_PAGE = 10;

export default function BlogsSection() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);

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
        const res = await fetch("/api/blogs/list?featured=true");
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
        ) : blogs.length > 0 ? (
          <div className="w-full">
            <MasonryGrid blogs={blogs.slice(0, 10)} onTagClick={() => {}} />

            <div className="flex flex-col items-center justify-center pt-12 lg:pt-16 pb-8 lg:pb-12">
              <div className="relative w-full flex items-center justify-center">
                {/* Subtle Divider Line */}
                <div className="absolute inset-x-0 h-px bg-border/10" />
                
                <div className="relative z-10 bg-background px-12">
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/10">
                      End of technical archive // 2026
                   </p>
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
