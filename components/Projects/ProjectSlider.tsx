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
const GAP = 12;
const VIDEO_FALLBACK_DURATION = 8;

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

// ─── Side card widths ───
const SIDE_WIDTH = "13%";
const SIDE_WIDTH_NUM = 13; // numeric for calc

// Position presets (GSAP targets)
const POS_LEFT = { left: "0%", width: SIDE_WIDTH, borderRadius: "0 16px 16px 0" };
const POS_CENTER = {
  left: `calc(${SIDE_WIDTH_NUM}% + ${GAP}px)`,
  width: `calc(${100 - SIDE_WIDTH_NUM * 2}% - ${GAP * 2}px)`,
  borderRadius: "16px",
};
const POS_RIGHT = {
  left: `${100 - SIDE_WIDTH_NUM}%`,
  width: SIDE_WIDTH,
  borderRadius: "16px 0 0 16px",
};

// Side card opacity
const SIDE_OPACITY = 0.3;

function getGradient(projectIndex: number) {
  const g = PROJECT_GRADIENTS[projectIndex % PROJECT_GRADIENTS.length];
  return `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)`;
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

  const [cardData, setCardData] = useState<[number, number, number]>([0, 0, 0]);
  const roleMap = useRef<{ left: number; center: number; right: number }>({
    left: 0,
    center: 1,
    right: 2,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [entryDone, setEntryDone] = useState(false);
  const [centerIndex, setCenterIndex] = useState(0);
  const [videoDuration, setVideoDuration] = useState(VIDEO_FALLBACK_DURATION);
  const [progressKey, setProgressKey] = useState(0);

  const isInView = useRef(false);
  const n = projects.length;

  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  // Initialize card data
  useEffect(() => {
    if (n < 3) return;
    setCardData([(n - 1) % n, 0, 1 % n]);
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
      { rootMargin: "-20% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Handle video metadata — read actual duration
  const handleVideoMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video && video.duration && isFinite(video.duration)) {
      setVideoDuration(video.duration);
    } else {
      setVideoDuration(VIDEO_FALLBACK_DURATION);
    }
    setProgressKey((k) => k + 1);
  }, []);

  // When center changes, reset duration to fallback until video metadata loads
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

        gsap.set(leftEl, {
          left: "102%",
          width: SIDE_WIDTH,
          opacity: 0,
          zIndex: 1,
          borderRadius: POS_RIGHT.borderRadius,
        });

        setCardData((prev) => {
          const next = [...prev] as [number, number, number];
          next[leftIdx] = newRightProjectIndex;
          return next;
        });

        gsap.to(centerEl, {
          ...POS_LEFT,
          opacity: SIDE_OPACITY,
          zIndex: 5,
          duration: SLIDE_DURATION,
          ease: "power2.inOut",
        });

        gsap.to(rightEl, {
          ...POS_CENTER,
          opacity: 1,
          zIndex: 10,
          duration: SLIDE_DURATION,
          ease: "power2.inOut",
        });

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
        const newCenterProjectIndex = cardData[leftIdx];
        const newLeftProjectIndex = (newCenterProjectIndex - 1 + n) % n;

        gsap.set(rightEl, {
          left: `-${SIDE_WIDTH_NUM + 2}%`,
          width: SIDE_WIDTH,
          opacity: 0,
          zIndex: 1,
          borderRadius: POS_LEFT.borderRadius,
        });

        setCardData((prev) => {
          const next = [...prev] as [number, number, number];
          next[rightIdx] = newLeftProjectIndex;
          return next;
        });

        gsap.to(centerEl, {
          ...POS_RIGHT,
          opacity: SIDE_OPACITY,
          zIndex: 5,
          duration: SLIDE_DURATION,
          ease: "power2.inOut",
        });

        gsap.to(leftEl, {
          ...POS_CENTER,
          opacity: 1,
          zIndex: 10,
          duration: SLIDE_DURATION,
          ease: "power2.inOut",
        });

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

  const centerElIdx = roleMap.current.center;
  const centerProject = projects[cardData[centerElIdx]] || projects[0];

  // ─── Render a single card element ───
  const renderCard = (elIdx: number) => {
    const projIdx = cardData[elIdx];
    const project = projects[projIdx] || projects[0];
    const isCenter = roleMap.current.center === elIdx;
    const gradient = getGradient(projIdx);

    // Determine initial position preset
    const initialPos =
      elIdx === 0 ? POS_LEFT : elIdx === 1 ? POS_CENTER : POS_RIGHT;
    const initialOpacity = elIdx === 1 ? 1 : SIDE_OPACITY;
    const initialZIndex = elIdx === 1 ? 10 : 5;

    return (
      <div
        key={`card-el-${elIdx}`}
        ref={(el) => { cardRefs.current[elIdx] = el; }}
        className="absolute top-0 h-full overflow-hidden"
        style={{
          willChange: "transform, opacity",
          cursor: isCenter ? "default" : "pointer",
          ...initialPos,
          borderRadius: initialPos.borderRadius,
          zIndex: initialZIndex,
          opacity: initialOpacity,
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
        {/* ─── Gradient placeholder — always present as base ─── */}
        <div
          className="absolute inset-0 z-0"
          style={{ background: gradient }}
        >
          {/* Title text — only rendered on center card to avoid clipped text on narrow side cards */}
          {isCenter && (
            <div className="absolute inset-0 flex items-center justify-center">
              <h3
                className="text-white/90 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center px-12 select-none leading-tight"
                style={{ textShadow: "0 4px 30px rgba(0,0,0,0.35)" }}
              >
                {project.title}
              </h3>
            </div>
          )}
        </div>

        {/* Video — only on center card when available */}
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

        {/* Hover buttons — only on center */}
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
      {/* ─── Slider Container — FULL VIEWPORT WIDTH ─── */}
      <motion.div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "16 / 9", maxHeight: "80vh" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: entryDone ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {renderCard(0)}
        {renderCard(1)}
        {renderCard(2)}

        {/* Left edge vignette — blends side card into section background */}
        <div
          className="absolute top-0 left-0 h-full z-30 pointer-events-none"
          style={{
            width: "clamp(100px, 14vw, 200px)",
            background:
              "linear-gradient(to right, var(--background) 0%, var(--background) 15%, transparent 100%)",
          }}
        />
        {/* Right edge vignette */}
        <div
          className="absolute top-0 right-0 h-full z-30 pointer-events-none"
          style={{
            width: "clamp(100px, 14vw, 200px)",
            background:
              "linear-gradient(to left, var(--background) 0%, var(--background) 15%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* ─── Project Label + Line Progress Indicators ─── */}
      <div className="flex flex-col items-center gap-3 mt-6">
        {/* Project name + counter */}
        <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-muted-foreground/50 select-none">
          {centerProject.title}
          <span className="mx-2 text-muted-foreground/25">—</span>
          {String(centerIndex + 1).padStart(2, "0")}
          <span className="mx-1 text-muted-foreground/25">/</span>
          {String(n).padStart(2, "0")}
        </p>

        {/* Line indicators */}
        <div className="flex items-center gap-[6px]">
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
              className="relative rounded-full overflow-hidden transition-all duration-500 cursor-pointer"
              style={{
                width: i === centerIndex ? "36px" : "16px",
                height: "2.5px",
              }}
              aria-label={`Go to project ${i + 1}`}
            >
              {/* Track background */}
              <div className="absolute inset-0 bg-foreground/12 rounded-full" />

              {/* Active fill — progress bar animation */}
              {i === centerIndex && (
                <motion.div
                  key={`progress-${centerIndex}-${progressKey}`}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "var(--foreground)",
                    opacity: 0.6,
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
