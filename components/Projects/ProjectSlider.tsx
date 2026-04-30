"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Project } from "@/types/project";

import ProjectVideo from "./ProjectVideo";
import HoverButtons from "./HoverButtons";

// ─── Constants ───
const SLIDE_DURATION = 0.55;
const DEBOUNCE_MS = 650;
const VIDEO_FALLBACK_DURATION = 8;

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
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  const isInView = useRef(false);
  const n = projects.length;

  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  // ─── Responsive Logic ───
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  
  const SIDE_WIDTH_NUM = isMobile ? 5 : isTablet ? 10 : 13;
  const SIDE_WIDTH = `${SIDE_WIDTH_NUM}%`;
  const GAP = isMobile ? 6 : 12;

  const getPosLeft = useCallback(() => ({ left: "0%", width: SIDE_WIDTH, borderRadius: "0 16px 16px 0" }), [SIDE_WIDTH]);
  const getPosCenter = useCallback(() => ({
    left: `calc(${SIDE_WIDTH_NUM}% + ${GAP}px)`,
    width: `calc(${100 - SIDE_WIDTH_NUM * 2}% - ${GAP * 2}px)`,
    borderRadius: "16px",
  }), [SIDE_WIDTH_NUM, GAP]);
  const getPosRight = useCallback(() => ({
    left: `${100 - SIDE_WIDTH_NUM}%`,
    width: SIDE_WIDTH,
    borderRadius: "16px 0 0 16px",
  }), [SIDE_WIDTH_NUM, SIDE_WIDTH]);

  // Initialize card data
  useEffect(() => {
    if (n < 3) return;
    setCardData([(n - 1) % n, 0, 1 % n]);
    setCenterIndex(0);
  }, [n]);

  // Entry animation
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

  // Video metadata
  const handleVideoMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video && video.duration && isFinite(video.duration)) {
      setVideoDuration(video.duration);
    } else {
      setVideoDuration(VIDEO_FALLBACK_DURATION);
    }
    setProgressKey((k) => k + 1);
  }, []);

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

      const POS_LEFT = getPosLeft();
      const POS_CENTER = getPosCenter();
      const POS_RIGHT = getPosRight();

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
          opacity: 1,
          zIndex: 5,
          duration: SLIDE_DURATION,
          ease: "power3.inOut",
        });

        gsap.to(rightEl, {
          ...POS_CENTER,
          opacity: 1,
          zIndex: 10,
          duration: SLIDE_DURATION,
          ease: "power3.inOut",
        });

        gsap.to(leftEl, {
          ...POS_RIGHT,
          opacity: 1,
          zIndex: 5,
          duration: 0.3,
          delay: SLIDE_DURATION * 0.6,
          ease: "power2.out",
        });

        roleMap.current = { left: centerIdx, center: rightIdx, right: leftIdx };
        setCenterIndex(newCenterProjectIndex);

        setTimeout(() => { isAnimating.current = false; }, SLIDE_DURATION * 1000 + 80);

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
          opacity: 1,
          zIndex: 5,
          duration: SLIDE_DURATION,
          ease: "power3.inOut",
        });

        gsap.to(leftEl, {
          ...POS_CENTER,
          opacity: 1,
          zIndex: 10,
          duration: SLIDE_DURATION,
          ease: "power3.inOut",
        });

        gsap.to(rightEl, {
          ...POS_LEFT,
          opacity: 1,
          zIndex: 5,
          duration: 0.3,
          delay: SLIDE_DURATION * 0.6,
          ease: "power2.out",
        });

        roleMap.current = { left: rightIdx, center: leftIdx, right: centerIdx };
        setCenterIndex(newCenterProjectIndex);

        setTimeout(() => { isAnimating.current = false; }, SLIDE_DURATION * 1000 + 80);
      }
    },
    [n, cardData, getPosLeft, getPosCenter, getPosRight, SIDE_WIDTH, SIDE_WIDTH_NUM]
  );

  const handleVideoEnded = useCallback(() => { slideTo("next"); }, [slideTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") slideTo("next");
      if (e.key === "ArrowLeft") slideTo("prev");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [slideTo]);

  useEffect(() => {
    const { left: leftIdx, center: centerIdx, right: rightIdx } = roleMap.current;
    const leftEl = cardRefs.current[leftIdx];
    const centerEl = cardRefs.current[centerIdx];
    const rightEl = cardRefs.current[rightIdx];
    if (leftEl && centerEl && rightEl) {
      gsap.to(leftEl, { ...getPosLeft(), duration: 0.3 });
      gsap.to(centerEl, { ...getPosCenter(), duration: 0.3 });
      gsap.to(rightEl, { ...getPosRight(), duration: 0.3 });
    }
  }, [windowWidth, getPosLeft, getPosCenter, getPosRight]);

  useEffect(() => {
    return () => { cardRefs.current.forEach((el) => { if (el) gsap.killTweensOf(el); }); };
  }, []);

  if (!projects.length || n < 3) return null;

  const centerElIdx = roleMap.current.center;
  const centerProject = projects[cardData[centerElIdx]] || projects[0];

  const renderCard = (elIdx: number) => {
    const projIdx = cardData[elIdx];
    const project = projects[projIdx] || projects[0];
    const isCenter = roleMap.current.center === elIdx;

    const initialPos = elIdx === 0 ? getPosLeft() : elIdx === 1 ? getPosCenter() : getPosRight();
    const initialZIndex = elIdx === 1 ? 10 : 5;

    return (
      <div
        key={`card-el-${elIdx}`}
        ref={(el) => { cardRefs.current[elIdx] = el; }}
        className="absolute top-0 h-full overflow-hidden"
        style={{
          willChange: "transform",
          cursor: isCenter ? "default" : "pointer",
          ...initialPos,
          borderRadius: initialPos.borderRadius,
          zIndex: initialZIndex,
        }}
        onClick={() => {
          if (roleMap.current.left === elIdx) slideTo("prev");
          if (roleMap.current.right === elIdx) slideTo("next");
        }}
        onMouseEnter={() => { if (isCenter) setIsHovered(true); }}
        onMouseLeave={() => { if (isCenter) setIsHovered(false); }}
      >
        {/* ─── Media Layer Group ─── */}
        <div className="absolute inset-0 w-full h-full bg-black/20">
          {/* 1. Base Thumbnail (Clear) */}
          <img
            src={project.thumbnail}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover object-top"
            draggable={false}
          />

          {/* 2. Blurred Overlay Layer — Animated via Opacity (Performant) */}
          <div
            className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] transition-opacity duration-500 ease-out pointer-events-none z-10"
            style={{
              opacity: isCenter ? 0 : 1,
              filter: `blur(${isMobile ? 10 : 17}px) saturate(180%) brightness(1.1)`,
              transform: "scale(1.25)", 
            }}
          >
            {/* Glass tint overlay */}
            <div className="absolute inset-0 bg-white/10 dark:bg-white/5 z-20" />
            
            <img
              src={project.thumbnail}
              alt=""
              className="w-full h-full object-cover object-top"
              draggable={false}
            />
          </div>

          {/* 3. Video — Only Center */}
          {isCenter && project.videoPreviewLink && (
            <ProjectVideo
              ref={videoRef}
              src={project.videoPreviewLink}
              isActive={entryDone && isCenter}
              onEnded={handleVideoEnded}
              onLoadedMetadata={handleVideoMetadata}
            />
          )}
        </div>

        {/* Hover buttons — only on center */}
        {isCenter && (
          <HoverButtons
            isVisible={isHovered || isMobile}
            projectId={project._id || project.id}
            liveLink={project.liveLink}
          />
        )}
      </div>
    );
  };

  return (
    <div ref={sectionRef} className="w-full">
      <motion.div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: isMobile ? "4 / 5" : "16 / 10", maxHeight: isMobile ? "60vh" : "80vh" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: entryDone ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {renderCard(0)}
        {renderCard(1)}
        {renderCard(2)}
      </motion.div>

      <div className="flex flex-col items-center gap-3 mt-6 px-4">
        <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.2em] md:tracking-[0.3em] uppercase text-muted-foreground/50 select-none text-center">
          {centerProject.title}
          <span className="mx-2 text-muted-foreground/25">—</span>
          {String(centerIndex + 1).padStart(2, "0")}
          <span className="mx-1 text-muted-foreground/25">/</span>
          {String(n).padStart(2, "0")}
        </p>

        <div className="flex items-center gap-[4px] md:gap-[6px]">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (i === centerIndex) return;
                const diff = (i - centerIndex + n) % n;
                if (diff <= n / 2) slideTo("next"); else slideTo("prev");
              }}
              className="relative rounded-full overflow-hidden transition-all duration-500 cursor-pointer"
              style={{
                width: i === centerIndex ? (isMobile ? "24px" : "36px") : (isMobile ? "10px" : "16px"),
                height: "2.5px",
              }}
              aria-label={`Go to project ${i + 1}`}
            >
              <div className="absolute inset-0 bg-foreground/12 rounded-full" />
              {i === centerIndex && (
                <motion.div
                  key={`progress-${centerIndex}-${progressKey}`}
                  className="absolute inset-0 rounded-full"
                  style={{ background: "var(--foreground)", opacity: 0.6, transformOrigin: "left center" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: videoDuration, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
