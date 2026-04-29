"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Project, FeatureCard as FeatureCardType } from "@/types/project";

import ProjectVideo from "./ProjectVideo";
import HoverButtons from "./HoverButtons";
import FeatureCardRow from "./FeatureCardRow";

// ─── Constants ───
const SLIDE_DURATION = 0.55;
const DEBOUNCE_MS = 650;
const GAP = 10;

// Card positions: left, center, right (percentages of viewport width)
// Left card: 0% to 20% (width 20%), Center: 20%+gap to 80%-gap (width ~60%), Right: 80% to 100% (width 20%)
const POSITIONS = {
  left:   { x: 0,    width: 20, scale: 0.92, opacity: 0.6 },
  center: { x: 20,   width: 60, scale: 1,    opacity: 1   },
  right:  { x: 80,   width: 20, scale: 0.92, opacity: 0.6 },
  // Off-screen positions for circular wrap
  offLeft:  { x: -22, width: 20, scale: 0.92, opacity: 0 },
  offRight: { x: 102, width: 20, scale: 0.92, opacity: 0 },
};

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

  // Track which project index is at each position
  const [slots, setSlots] = useState<{ left: number; center: number; right: number }>({
    left: 0,
    center: 0,
    right: 0,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [entryDone, setEntryDone] = useState(false);

  const isInView = useInView(sectionRef, { once: true, margin: "-30% 0px" });
  const n = projects.length;

  // Card refs for GSAP animation
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize slots
  useEffect(() => {
    if (n < 3) return;
    setSlots({
      left: (n - 1) % n,  // last project wraps to left
      center: 0,
      right: 1 % n,
    });
  }, [n]);

  // ─── Entry Animation ───
  useEffect(() => {
    if (!isInView || entryDone) return;
    const timer = setTimeout(() => setEntryDone(true), 100);
    return () => clearTimeout(timer);
  }, [isInView, entryDone]);

  // ─── GSAP Slide Transition ───
  const slideTo = useCallback(
    (direction: "next" | "prev") => {
      const now = Date.now();
      if (isAnimating.current || now - lastSlideTime.current < DEBOUNCE_MS) return;
      if (!cardRefs.current[0] || !cardRefs.current[1] || !cardRefs.current[2]) return;
      isAnimating.current = true;
      lastSlideTime.current = now;

      // Pause current video
      if (videoRef.current) videoRef.current.pause();

      const leftEl = cardRefs.current[0]!;
      const centerEl = cardRefs.current[1]!;
      const rightEl = cardRefs.current[2]!;

      if (direction === "next") {
        // Center → Left position (slide left, scale down, fade)
        gsap.to(centerEl, {
          left: "0%",
          width: "20%",
          scale: POSITIONS.left.scale,
          opacity: POSITIONS.left.opacity,
          duration: SLIDE_DURATION,
          ease: "power2.inOut",
        });

        // Right → Center position (slide left, scale up, full opacity)
        gsap.to(rightEl, {
          left: `calc(20% + ${GAP}px)`,
          width: `calc(60% - ${GAP * 2}px)`,
          scale: POSITIONS.center.scale,
          opacity: POSITIONS.center.opacity,
          duration: SLIDE_DURATION,
          ease: "power2.inOut",
        });

        // Old Left → Instantly teleport off-screen right, then no animation
        gsap.set(leftEl, {
          left: "80%",
          width: "20%",
          scale: POSITIONS.right.scale,
          opacity: 0,
        });
        // Then fade in at right position
        gsap.to(leftEl, {
          opacity: POSITIONS.right.opacity,
          duration: 0.2,
          delay: SLIDE_DURATION * 0.7,
        });

        // Update slots after animation
        setTimeout(() => {
          setSlots((prev) => {
            const newCenter = prev.right;
            const newRight = (prev.right + 1) % n;
            const newLeft = prev.center;
            return { left: newLeft, center: newCenter, right: newRight };
          });

          // Reset GSAP transforms to match new positions
          gsap.set(leftEl, {
            left: "0%",
            width: "20%",
            scale: POSITIONS.left.scale,
            opacity: POSITIONS.left.opacity,
          });
          gsap.set(centerEl, {
            left: `calc(20% + ${GAP}px)`,
            width: `calc(60% - ${GAP * 2}px)`,
            scale: POSITIONS.center.scale,
            opacity: POSITIONS.center.opacity,
          });
          gsap.set(rightEl, {
            left: "80%",
            width: "20%",
            scale: POSITIONS.right.scale,
            opacity: POSITIONS.right.opacity,
          });

          isAnimating.current = false;
        }, SLIDE_DURATION * 1000 + 50);

      } else {
        // prev direction — mirror of next

        // Center → Right position
        gsap.to(centerEl, {
          left: "80%",
          width: "20%",
          scale: POSITIONS.right.scale,
          opacity: POSITIONS.right.opacity,
          duration: SLIDE_DURATION,
          ease: "power2.inOut",
        });

        // Left → Center position
        gsap.to(leftEl, {
          left: `calc(20% + ${GAP}px)`,
          width: `calc(60% - ${GAP * 2}px)`,
          scale: POSITIONS.center.scale,
          opacity: POSITIONS.center.opacity,
          duration: SLIDE_DURATION,
          ease: "power2.inOut",
        });

        // Old Right → Teleport off-screen left, then position at left
        gsap.set(rightEl, {
          left: "-22%",
          width: "20%",
          scale: POSITIONS.left.scale,
          opacity: 0,
        });
        gsap.to(rightEl, {
          left: "0%",
          opacity: POSITIONS.left.opacity,
          duration: 0.2,
          delay: SLIDE_DURATION * 0.7,
        });

        setTimeout(() => {
          setSlots((prev) => {
            const newCenter = prev.left;
            const newLeft = (prev.left - 1 + n) % n;
            const newRight = prev.center;
            return { left: newLeft, center: newCenter, right: newRight };
          });

          gsap.set(leftEl, {
            left: "0%",
            width: "20%",
            scale: POSITIONS.left.scale,
            opacity: POSITIONS.left.opacity,
          });
          gsap.set(centerEl, {
            left: `calc(20% + ${GAP}px)`,
            width: `calc(60% - ${GAP * 2}px)`,
            scale: POSITIONS.center.scale,
            opacity: POSITIONS.center.opacity,
          });
          gsap.set(rightEl, {
            left: "80%",
            width: "20%",
            scale: POSITIONS.right.scale,
            opacity: POSITIONS.right.opacity,
          });

          isAnimating.current = false;
        }, SLIDE_DURATION * 1000 + 50);
      }
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

  // Cleanup GSAP tweens on unmount
  useEffect(() => {
    return () => {
      cardRefs.current.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, []);

  if (!projects.length || n < 3) return null;

  const leftProject = projects[slots.left];
  const centerProject = projects[slots.center];
  const rightProject = projects[slots.right];

  return (
    <div ref={sectionRef} className="w-full">
      {/* ─── Slider Container — FULL VIEWPORT ─── */}
      <div
        className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden"
        style={{ height: "clamp(480px, 75vh, 850px)" }}
      >
        {/* CARD 0 — starts at LEFT position */}
        <motion.div
          ref={(el) => { cardRefs.current[0] = el; }}
          className="absolute top-0 h-full cursor-pointer overflow-hidden"
          style={{
            left: "0%",
            width: "20%",
            borderRadius: "0 20px 20px 0",
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, x: -60 }}
          animate={{
            opacity: entryDone ? POSITIONS.left.opacity : 0,
            x: entryDone ? 0 : -60,
            scale: entryDone ? POSITIONS.left.scale : 0.92,
          }}
          transition={{
            duration: 0.6,
            ease: [0.65, 0, 0.35, 1],
            delay: entryDone ? 0 : 0.6,
          }}
          onClick={() => slideTo("prev")}
        >
          <img
            src={leftProject.thumbnail}
            alt={leftProject.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>

        {/* CARD 1 — starts at CENTER position */}
        <motion.div
          ref={(el) => { cardRefs.current[1] = el; }}
          className="absolute top-0 h-full overflow-hidden rounded-[20px]"
          style={{
            left: `calc(20% + ${GAP}px)`,
            width: `calc(60% - ${GAP * 2}px)`,
            willChange: "transform, opacity",
          }}
          initial={{ y: 120, opacity: 0 }}
          animate={{
            y: entryDone ? 0 : 120,
            opacity: entryDone ? 1 : 0,
          }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ProjectVideo
            ref={videoRef}
            key={`video-${slots.center}`}
            src={centerProject.videoPreviewLink}
            thumbnail={centerProject.thumbnail}
            isActive={entryDone}
            isPaused={isHovered}
            onEnded={handleVideoEnded}
          />

          {/* Hover Buttons */}
          <HoverButtons
            isVisible={isHovered}
            projectId={centerProject._id || centerProject.id}
            liveLink={centerProject.liveLink}
          />

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
            <div className="bg-gradient-to-t from-black/50 via-black/15 to-transparent px-8 pb-5 pt-16">
              <div className="flex items-center gap-3">
                <span className="text-white/90 text-sm md:text-base font-semibold tracking-tight">
                  {centerProject.title}
                </span>
                <span className="text-white/40 text-xs font-mono font-bold tracking-widest">
                  {String(slots.center + 1).padStart(2, "0")}/{String(n).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CARD 2 — starts at RIGHT position */}
        <motion.div
          ref={(el) => { cardRefs.current[2] = el; }}
          className="absolute top-0 h-full cursor-pointer overflow-hidden"
          style={{
            left: "80%",
            width: "20%",
            borderRadius: "20px 0 0 20px",
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, x: 60 }}
          animate={{
            opacity: entryDone ? POSITIONS.right.opacity : 0,
            x: entryDone ? 0 : 60,
            scale: entryDone ? POSITIONS.right.scale : 0.92,
          }}
          transition={{
            duration: 0.6,
            ease: [0.65, 0, 0.35, 1],
            delay: entryDone ? 0 : 0.6,
          }}
          onClick={() => slideTo("next")}
        >
          <img
            src={rightProject.thumbnail}
            alt={rightProject.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* Slide indicators */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              // Calculate direction and slide
              if (i === slots.center) return;
              const diff = (i - slots.center + n) % n;
              if (diff <= n / 2) {
                slideTo("next");
              } else {
                slideTo("prev");
              }
            }}
            className={`transition-all duration-500 rounded-full ${
              i === slots.center
                ? "w-8 h-2 bg-foreground/70"
                : "w-2 h-2 bg-foreground/15 hover:bg-foreground/30"
            }`}
            aria-label={`Go to project ${i + 1}`}
          />
        ))}
      </div>

      {/* ─── Feature Cards Row ─── */}
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
