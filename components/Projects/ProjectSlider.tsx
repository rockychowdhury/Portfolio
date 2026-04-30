"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Project } from "@/types/project";

import ProjectVideo from "./ProjectVideo";
import HoverButtons from "./HoverButtons";

// ─── Constants ───
const SLIDE_DURATION = 0.55;
const DEBOUNCE_MS = 650;
const GAP = 10;
const VIDEO_FALLBACK_DURATION = 8; // seconds, used when no video or duration unavailable

// ─── Per-project gradient pairs (derived from PROJECT_COLORS palette) ───
const PROJECT_GRADIENTS = [
  { from: "#6366f1", to: "#312e81" }, // indigo → deep navy
  { from: "#f59e0b", to: "#c2410c" }, // amber → burnt orange
  { from: "#10b981", to: "#065f46" }, // emerald → deep teal
  { from: "#ef4444", to: "#881337" }, // red → dark rose
  { from: "#8b5cf6", to: "#4c1d95" }, // violet → deep purple
  { from: "#06b6d4", to: "#164e63" }, // cyan → dark cyan
  { from: "#f97316", to: "#9a3412" }, // orange → dark orange
  { from: "#ec4899", to: "#831843" }, // pink → dark magenta
];

// Position presets (GSAP targets) — 10% side cards
const POS_LEFT = { left: "0%", width: "10%", borderRadius: "0 20px 20px 0" };
const POS_CENTER = {
  left: `calc(10% + ${GAP}px)`,
  width: `calc(80% - ${GAP * 2}px)`,
  borderRadius: "20px",
};
const POS_RIGHT = { left: "90%", width: "10%", borderRadius: "20px 0 0 20px" };

// Side card opacity
const SIDE_OPACITY = 0.35;

function getGradient(projectIndex: number) {
  const g = PROJECT_GRADIENTS[projectIndex % PROJECT_GRADIENTS.length];
  return `linear-gradient(135deg, ${g.from}, ${g.to})`;
}

export default function ProjectSlider({
  projects,
}: {
  projects: Project[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isAnimating = useRef(false);
  const lastSlideTime = useRef(0);

  // Which project index each of the 3 card elements shows
  const [cardData, setCardData] = useState<[number, number, number]>([0, 0, 0]);
  // Which card element (0, 1, 2) is currently at which position
  const roleMap = useRef<{ left: number; center: number; right: number }>({
    left: 0,
    center: 1,
    right: 2,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [entryDone, setEntryDone] = useState(false);
  const [centerIndex, setCenterIndex] = useState(0);
  const [videoDuration, setVideoDuration] = useState(VIDEO_FALLBACK_DURATION);

  // Track a key that resets when center changes, to restart progress animation
  const [progressKey, setProgressKey] = useState(0);

  const isInView = useRef(false);
  const n = projects.length;

  // Card DOM refs
  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  // Initialize card data
  useEffect(() => {
    if (n < 3) return;
    setCardData([(n - 1) % n, 0, 1 % n]); // left, center, right
    setCenterIndex(0);
  }, [n]);

  // Entry animation via IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView.current) {
          isInView.current = true;
          setTimeout(() => setEntryDone(true), 100);
        }
      },
      { rootMargin: "-30% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Handle video metadata loaded — read actual duration
  const handleVideoMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video && video.duration && isFinite(video.duration)) {
      setVideoDuration(video.duration);
    } else {
      setVideoDuration(VIDEO_FALLBACK_DURATION);
    }
    // Reset progress animation
    setProgressKey((k) => k + 1);
  }, []);

  // When center changes, reset duration to fallback until video loads
  useEffect(() => {
    const centerProject = projects[centerIndex];
    if (!centerProject?.videoPreviewLink) {
      setVideoDuration(VIDEO_FALLBACK_DURATION);
    }
    setProgressKey((k) => k + 1);
  }, [centerIndex, projects]);

  // ─── Slide Transition ───
  const slideTo = useCallback(
    (direction: "next" | "prev") => {
      const now = Date.now();
      if (isAnimating.current || now - lastSlideTime.current < DEBOUNCE_MS) return;
      isAnimating.current = true;
      lastSlideTime.current = now;

      if (videoRef.current) videoRef.current.pause();

      const { left: leftIdx, center: centerIdx, right: rightIdx } = roleMap.current;
      const leftEl = cardRefs.current[leftIdx];
      const centerEl = cardRefs.current[centerIdx];
      const rightEl = cardRefs.current[rightIdx];

      if (!leftEl || !centerEl || !rightEl) {
        isAnimating.current = false;
        return;
      }

      if (direction === "next") {
        const newCenterProjectIndex = cardData[rightIdx];
        const newRightProjectIndex = (newCenterProjectIndex + 1) % n;

        // 1. Teleport left card off-screen instantly
        gsap.set(leftEl, {
          left: "102%",
          width: "10%",
          opacity: 0,
          zIndex: 1,
          borderRadius: "20px 0 0 20px",
        });

        // 2. Update teleported card's data (invisible, no blink)
        setCardData((prev) => {
          const next = [...prev] as [number, number, number];
          next[leftIdx] = newRightProjectIndex;
          return next;
        });

        // 3. Center → left (shrink + dim)
        gsap.to(centerEl, {
          ...POS_LEFT,
          opacity: SIDE_OPACITY,
          zIndex: 5,
          duration: SLIDE_DURATION,
          ease: "power2.inOut",
        });

        // 4. Right → center (grow + brighten)
        gsap.to(rightEl, {
          ...POS_CENTER,
          opacity: 1,
          zIndex: 10,
          duration: SLIDE_DURATION,
          ease: "power2.inOut",
        });

        // 5. Fade teleported card in at right position
        gsap.to(leftEl, {
          ...POS_RIGHT,
          opacity: SIDE_OPACITY,
          zIndex: 5,
          duration: 0.3,
          delay: SLIDE_DURATION * 0.6,
          ease: "power2.out",
        });

        roleMap.current = {
          left: centerIdx,
          center: rightIdx,
          right: leftIdx,
        };

        setCenterIndex(newCenterProjectIndex);

        setTimeout(() => {
          isAnimating.current = false;
        }, SLIDE_DURATION * 1000 + 80);

      } else {
        // PREV direction — mirror
        const newCenterProjectIndex = cardData[leftIdx];
        const newLeftProjectIndex = (newCenterProjectIndex - 1 + n) % n;

        // 1. Teleport right card off-screen left
        gsap.set(rightEl, {
          left: "-12%",
          width: "10%",
          opacity: 0,
          zIndex: 1,
          borderRadius: "0 20px 20px 0",
        });

        // 2. Update teleported card's data
        setCardData((prev) => {
          const next = [...prev] as [number, number, number];
          next[rightIdx] = newLeftProjectIndex;
          return next;
        });

        // 3. Center → right (shrink + dim)
        gsap.to(centerEl, {
          ...POS_RIGHT,
          opacity: SIDE_OPACITY,
          zIndex: 5,
          duration: SLIDE_DURATION,
          ease: "power2.inOut",
        });

        // 4. Left → center (grow + brighten)
        gsap.to(leftEl, {
          ...POS_CENTER,
          opacity: 1,
          zIndex: 10,
          duration: SLIDE_DURATION,
          ease: "power2.inOut",
        });

        // 5. Fade teleported card in at left position
        gsap.to(rightEl, {
          ...POS_LEFT,
          opacity: SIDE_OPACITY,
          zIndex: 5,
          duration: 0.3,
          delay: SLIDE_DURATION * 0.6,
          ease: "power2.out",
        });

        roleMap.current = {
          left: rightIdx,
          center: leftIdx,
          right: centerIdx,
        };

        setCenterIndex(newCenterProjectIndex);

        setTimeout(() => {
          isAnimating.current = false;
        }, SLIDE_DURATION * 1000 + 80);
      }
    },
    [n, cardData]
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

  // Cleanup GSAP on unmount
  useEffect(() => {
    return () => {
      cardRefs.current.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, []);

  if (!projects.length || n < 3) return null;

  // Derive center project for label
  const centerElIdx = roleMap.current.center;
  const centerProject = projects[cardData[centerElIdx]] || projects[0];

  // ─── Render a card element ───
  const renderCard = (elIdx: number) => {
    const projIdx = cardData[elIdx];
    const project = projects[projIdx] || projects[0];
    const isCenter = roleMap.current.center === elIdx;
    const isSide = !isCenter;
    const gradient = getGradient(projIdx);

    return (
      <div
        key={`card-el-${elIdx}`}
        ref={(el) => { cardRefs.current[elIdx] = el; }}
        className="absolute top-0 h-full overflow-hidden"
        style={{
          willChange: "transform, opacity",
          cursor: isCenter ? "default" : "pointer",
          ...(elIdx === 0 ? { ...POS_LEFT, borderRadius: POS_LEFT.borderRadius, zIndex: 5, opacity: SIDE_OPACITY } : {}),
          ...(elIdx === 1 ? { ...POS_CENTER, borderRadius: POS_CENTER.borderRadius, zIndex: 10, opacity: 1 } : {}),
          ...(elIdx === 2 ? { ...POS_RIGHT, borderRadius: POS_RIGHT.borderRadius, zIndex: 5, opacity: SIDE_OPACITY } : {}),
        }}
        onClick={() => {
          if (roleMap.current.left === elIdx) slideTo("prev");
          if (roleMap.current.right === elIdx) slideTo("next");
        }}
        onMouseEnter={() => {
          if (roleMap.current.center === elIdx) setIsHovered(true);
        }}
        onMouseLeave={() => {
          if (roleMap.current.center === elIdx) setIsHovered(false);
        }}
      >
        {/* ─── Gradient placeholder as base layer (always present) ─── */}
        <div
          className="absolute inset-0 z-0 flex items-center justify-center"
          style={{ background: gradient }}
        >
          <h3
            className="text-white text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center px-8 select-none"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            {project.title}
          </h3>
        </div>

        {/* Video only on center card element */}
        {isCenter && project.videoPreviewLink && (
          <div className="absolute inset-0 z-10">
            <ProjectVideo
              ref={videoRef}
              src={project.videoPreviewLink}
              thumbnail={project.thumbnail}
              isActive={entryDone && isCenter}
              onEnded={handleVideoEnded}
              onLoadedMetadata={handleVideoMetadata}
            />
          </div>
        )}

        {/* Hover buttons only on center */}
        {isCenter && (
          <HoverButtons
            isVisible={isHovered}
            projectId={project._id || project.id}
            liveLink={project.liveLink}
          />
        )}
      </div>
    );
  };

  return (
    <div ref={sectionRef} className="w-full">
      {/* ─── Slider — FULL VIEWPORT ─── */}
      <motion.div
        className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden"
        style={{ height: "clamp(480px, 75vh, 850px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: entryDone ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderCard(0)}
        {renderCard(1)}
        {renderCard(2)}

        {/* Left vignette mask */}
        <div
          className="absolute top-0 left-0 h-full z-30 pointer-events-none"
          style={{
            width: "120px",
            background: "linear-gradient(to right, var(--background), transparent)",
          }}
        />
        {/* Right vignette mask */}
        <div
          className="absolute top-0 right-0 h-full z-30 pointer-events-none"
          style={{
            width: "120px",
            background: "linear-gradient(to left, var(--background), transparent)",
          }}
        />
      </motion.div>

      {/* ─── Project Label + Line Indicators ─── */}
      <div className="flex flex-col items-center gap-4 mt-8">
        {/* Project name + counter in small-caps */}
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-muted-foreground/60">
          {centerProject.title} — {String(centerIndex + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </p>

        {/* Line indicators */}
        <div className="flex items-center gap-1.5">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (i === centerIndex) return;
                const diff = (i - centerIndex + n) % n;
                if (diff <= n / 2) {
                  slideTo("next");
                } else {
                  slideTo("prev");
                }
              }}
              className="relative rounded-full overflow-hidden transition-all duration-500"
              style={{
                width: i === centerIndex ? "40px" : "20px",
                height: "3px",
              }}
              aria-label={`Go to project ${i + 1}`}
            >
              {/* Inactive background track */}
              <div className="absolute inset-0 bg-foreground/15 rounded-full" />

              {/* Active fill — animates left-to-right as progress */}
              {i === centerIndex && (
                <motion.div
                  key={`progress-${centerIndex}-${progressKey}`}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "var(--foreground)",
                    opacity: 0.7,
                    transformOrigin: "left center",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: videoDuration,
                    ease: "linear",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
