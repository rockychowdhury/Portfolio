"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Project, FeatureCard as FeatureCardType } from "@/types/project";

import ProjectVideo from "./ProjectVideo";
import HoverButtons from "./HoverButtons";
import FeatureCardRow from "./FeatureCardRow";

// ─── Layout Constants ───
const SLIDE_DURATION = 0.55;
const DEBOUNCE_MS = 600;

export default function ProjectSlider({
  projects,
  featureCards,
}: {
  projects: Project[];
  featureCards: FeatureCardType[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isAnimating = useRef(false);
  const lastSlideTime = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [entryDone, setEntryDone] = useState(false);

  const isInView = useInView(sectionRef, { once: true, margin: "-30% 0px" });

  const n = projects.length;
  const prevIndex = (activeIndex - 1 + n) % n;
  const nextIndex = (activeIndex + 1) % n;

  // ─── Entry Animation ───
  useEffect(() => {
    if (!isInView || entryDone) return;
    const timer = setTimeout(() => setEntryDone(true), 100);
    return () => clearTimeout(timer);
  }, [isInView, entryDone]);

  // ─── Slide Transition ───
  const slideTo = useCallback(
    (direction: "next" | "prev") => {
      const now = Date.now();
      if (isAnimating.current || now - lastSlideTime.current < DEBOUNCE_MS) return;
      isAnimating.current = true;
      lastSlideTime.current = now;

      if (videoRef.current) videoRef.current.pause();

      setActiveIndex((prev) => {
        if (direction === "next") return (prev + 1) % n;
        return (prev - 1 + n) % n;
      });

      setTimeout(() => {
        isAnimating.current = false;
      }, SLIDE_DURATION * 1000 + 100);
    },
    [n]
  );

  const handleVideoEnded = useCallback(() => {
    slideTo("next");
  }, [slideTo]);

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") slideTo("next");
      if (e.key === "ArrowLeft") slideTo("prev");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [slideTo]);

  if (!projects.length) return null;

  const centerProject = projects[activeIndex];
  const leftProject = projects[prevIndex];
  const rightProject = projects[nextIndex];

  return (
    <div ref={sectionRef} className="w-full">
      {/* ─── Slider Container — FULL VIEWPORT WIDTH ─── */}
      <div
        className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden"
        style={{ height: "clamp(500px, 80vh, 900px)" }}
      >
        {/* LEFT flanking card — bleeds to left edge */}
        <motion.div
          className="absolute top-0 left-0 h-full cursor-pointer"
          style={{ width: "22%", zIndex: 5 }}
          initial={{ opacity: 0, x: -80 }}
          animate={{
            opacity: entryDone ? 0.6 : 0,
            x: entryDone ? 0 : -80,
            scale: 0.92,
          }}
          transition={{
            duration: SLIDE_DURATION,
            ease: [0.65, 0, 0.35, 1],
            delay: entryDone ? 0 : 0.6,
          }}
          onClick={() => slideTo("prev")}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={leftProject.id || leftProject._id}
              className="h-full w-full overflow-hidden"
              style={{ borderRadius: "0 16px 16px 0" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={leftProject.thumbnail}
                alt={leftProject.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* CENTER card — large, full opacity */}
        <motion.div
          className="absolute top-0 h-full"
          style={{
            left: "20%",
            right: "20%",
            zIndex: 10,
          }}
          initial={{ y: 120, opacity: 0 }}
          animate={{
            y: entryDone ? 0 : 120,
            opacity: entryDone ? 1 : 0,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-[0_32px_80px_-16px_rgba(0,0,0,0.25)] border border-white/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={centerProject.id || centerProject._id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <ProjectVideo
                  ref={videoRef}
                  src={centerProject.videoPreviewLink}
                  thumbnail={centerProject.thumbnail}
                  isActive={entryDone}
                  isPaused={isHovered}
                  onEnded={handleVideoEnded}
                />
              </motion.div>
            </AnimatePresence>

            {/* Hover Buttons */}
            <HoverButtons
              isVisible={isHovered}
              projectId={centerProject._id || centerProject.id}
              liveLink={centerProject.liveLink}
            />

            {/* Bottom gradient overlay for text */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-15" />

            {/* Project info overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-16 px-8 pb-6 flex items-end justify-between pointer-events-none">
              <div className="flex items-center gap-4">
                <span className="text-white/50 text-xs font-black tracking-[0.3em] uppercase font-mono">
                  {String(activeIndex + 1).padStart(2, "0")}/{String(n).padStart(2, "0")}
                </span>
                <div className="h-px w-6 bg-white/20" />
                <span className="text-white/90 text-base font-semibold tracking-tight">
                  {centerProject.title}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT flanking card — bleeds to right edge */}
        <motion.div
          className="absolute top-0 right-0 h-full cursor-pointer"
          style={{ width: "22%", zIndex: 5 }}
          initial={{ opacity: 0, x: 80 }}
          animate={{
            opacity: entryDone ? 0.6 : 0,
            x: entryDone ? 0 : 80,
            scale: 0.92,
          }}
          transition={{
            duration: SLIDE_DURATION,
            ease: [0.65, 0, 0.35, 1],
            delay: entryDone ? 0 : 0.6,
          }}
          onClick={() => slideTo("next")}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={rightProject.id || rightProject._id}
              className="h-full w-full overflow-hidden"
              style={{ borderRadius: "16px 0 0 16px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={rightProject.thumbnail}
                alt={rightProject.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (i !== activeIndex) setActiveIndex(i);
              }}
              className={`transition-all duration-500 rounded-full ${
                i === activeIndex
                  ? "w-8 h-2 bg-white/90"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ─── Feature Cards Row — full width ─── */}
      {featureCards.length > 0 && (
        <div className="w-screen left-1/2 -translate-x-1/2 relative mt-14 px-4 md:px-8">
          <FeatureCardRow
            featureCards={featureCards}
            projects={projects}
            activeProjectId={centerProject._id || centerProject.id}
          />
        </div>
      )}
    </div>
  );
}
