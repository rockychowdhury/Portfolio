"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { FeatureCard as FeatureCardType, Project } from "@/types/project";
import FeatureCard from "./FeatureCard";

const PROJECT_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f97316", "#ec4899",
];

const SLIDE_DURATION = 0.5;
const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds
const GAP = 10;
const VISIBLE_COUNT = 5; // Cards visible at a time

interface FeatureCardRowProps {
  featureCards: FeatureCardType[];
  projects: Project[];
  activeProjectId?: string;
  slideIndex: number;
}

export default function FeatureCardRow({
  featureCards,
  projects,
  activeProjectId,
  slideIndex,
}: FeatureCardRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [currentStart, setCurrentStart] = useState(0);
  const isSliding = useRef(false);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Drag state
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragOffset = useRef(0);

  const totalCards = featureCards.length;

  // Build maps
  const projectColorMap = new Map<string, string>();
  projects.forEach((p, i) => {
    projectColorMap.set(p._id || p.id, PROJECT_COLORS[i % PROJECT_COLORS.length]);
  });
  const projectNameMap = new Map<string, string>();
  projects.forEach((p) => {
    projectNameMap.set(p._id || p.id, p.title);
  });

  // Calculate card width
  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return;
      const w = (containerRef.current.clientWidth - GAP * (VISIBLE_COUNT - 1)) / VISIBLE_COUNT;
      setCardWidth(Math.max(w, 240));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Get circular index
  const getCard = useCallback(
    (index: number) => featureCards[((index % totalCards) + totalCards) % totalCards],
    [featureCards, totalCards]
  );

  // ─── Slide by N cards ───
  const slideBy = useCallback(
    (count: number) => {
      if (isSliding.current || !trackRef.current || cardWidth === 0) return;
      isSliding.current = true;

      const distance = count * (cardWidth + GAP);

      gsap.to(trackRef.current, {
        x: -distance,
        duration: SLIDE_DURATION,
        ease: "power2.inOut",
        onComplete: () => {
          // After animation, reset position and shift data index
          setCurrentStart((prev) => {
            const newStart = ((prev + count) % totalCards + totalCards) % totalCards;
            return newStart;
          });
          gsap.set(trackRef.current!, { x: 0 });
          isSliding.current = false;
        },
      });
    },
    [cardWidth, totalCards]
  );

  // ─── Auto-slide every 5 seconds ───
  useEffect(() => {
    if (totalCards <= VISIBLE_COUNT) return;

    autoTimerRef.current = setInterval(() => {
      slideBy(1);
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [slideBy, totalCards]);

  // ─── Sync with project slider ───
  useEffect(() => {
    if (slideIndex === 0) return;
    slideBy(1);
  }, [slideIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Mouse Drag ───
  const resetAutoTimer = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    if (totalCards > VISIBLE_COUNT) {
      autoTimerRef.current = setInterval(() => slideBy(1), AUTO_SLIDE_INTERVAL);
    }
  }, [slideBy, totalCards]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isSliding.current) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragOffset.current = 0;
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    dragOffset.current = dragStartX.current - e.clientX;
    gsap.set(trackRef.current, { x: -dragOffset.current });
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current || !trackRef.current) return;
    isDragging.current = false;

    const threshold = cardWidth * 0.3;
    if (Math.abs(dragOffset.current) > threshold) {
      const direction = dragOffset.current > 0 ? 1 : -1;
      const cardsToSlide = Math.max(1, Math.round(Math.abs(dragOffset.current) / (cardWidth + GAP)));

      // Complete the slide from current drag position
      const targetX = direction * cardsToSlide * (cardWidth + GAP);
      gsap.to(trackRef.current, {
        x: -targetX,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          setCurrentStart((prev) =>
            (((prev + direction * cardsToSlide) % totalCards) + totalCards) % totalCards
          );
          gsap.set(trackRef.current!, { x: 0 });
          isSliding.current = false;
        },
      });
      isSliding.current = true;
    } else {
      // Snap back
      gsap.to(trackRef.current, { x: 0, duration: 0.3, ease: "power2.out" });
    }
    resetAutoTimer();
  }, [cardWidth, totalCards, resetAutoTimer]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging.current) handleDragEnd();
  }, [handleDragEnd]);

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isSliding.current) return;
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    dragOffset.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    dragOffset.current = dragStartX.current - e.touches[0].clientX;
    gsap.set(trackRef.current, { x: -dragOffset.current });
  }, []);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (trackRef.current) gsap.killTweensOf(trackRef.current);
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, []);

  // Render enough cards: visible + 2 buffer on each side for smooth circular
  const bufferCount = 2;
  const renderCount = VISIBLE_COUNT + bufferCount * 2;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none"
      style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={trackRef}
        className="flex"
        style={{
          gap: `${GAP}px`,
          willChange: "transform",
          // Offset by buffer cards so we start showing from the right position
          marginLeft: `-${bufferCount * (cardWidth + GAP)}px`,
        }}
      >
        {Array.from({ length: renderCount }, (_, i) => {
          const dataIndex = currentStart - bufferCount + i;
          const card = getCard(dataIndex);
          const circularIdx = ((dataIndex % totalCards) + totalCards) % totalCards;
          return (
            <div
              key={`pos-${i}`}
              className="flex-shrink-0"
              style={{ width: `${cardWidth}px` }}
              data-project-id={card.projectId}
            >
              <FeatureCard
                card={card}
                accentColor={projectColorMap.get(card.projectId) || "#6366f1"}
                projectName={projectNameMap.get(card.projectId) || ""}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
