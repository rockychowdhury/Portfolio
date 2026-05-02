"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, useInView, useMotionValue, useMotionTemplate, AnimatePresence } from "framer-motion";
import * as SiIcons from "react-icons/si";
import * as LuIcons from "lucide-react";
import { Search, Info } from "lucide-react";
import * as FaIcons from "react-icons/fa6";
import * as VscIcons from "react-icons/vsc";
import type { IconType } from "react-icons";
import { BlueprintPattern } from "@/components/ui/BackgroundPatterns";

// ── Types ──
interface Skill {
  _id: string;
  name: string;
  icon: string;
  icon_group: string;
  icon_type: "icon" | "text";
  description: string;
  group: string;
  is_top_skill: boolean;
  order: number;
  color?: string;
}

// ── Animation Constants ──
const BUILD_STAGGER = 0.05; // seconds between each icon
const BUILD_DURATION = 0.5; // each icon's entrance duration
const FLOAT_DURATION = 8; // smooth 8s cycle
const BREATHE_DURATION = 8; // organic pulse cycle
const SHIMMER_INTERVAL = 4000; // ms between shimmer events

// ── Shape groups and their assignment ──
const SHAPE_GROUPS: Record<string, "circle" | "triangle" | "square"> = {
  frontend: "circle",
  backend: "triangle",
  devops: "square",
};

const TICKER_GROUPS_ORDER = ["cs-fundamentals", "database", "tools", "frontend", "backend", "devops"];

const GROUP_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps",
  database: "Database",
  "cs-fundamentals": "CS Fundamentals",
  tools: "Tools",
};

// ── Icon resolver ──
function getIcon(iconName: string, iconGroup: string): IconType | null {
  if (iconGroup === "si") {
    const icons = SiIcons as Record<string, IconType>;
    return icons[iconName] || null;
  }
  if (iconGroup === "lu") {
    const icons = LuIcons as unknown as Record<string, IconType>;
    return icons[iconName] || null;
  }
  if (iconGroup === "fa") {
    const icons = FaIcons as Record<string, IconType>;
    return icons[iconName] || null;
  }
  if (iconGroup === "vsc") {
    const icons = VscIcons as Record<string, IconType>;
    return icons[iconName] || null;
  }
  return null;
}

// ── Geometric position calculators ──
function getCirclePositions(count: number, radius: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });
}

function getTrianglePositions(count: number, size: number) {
  const h = (size * Math.sqrt(3)) / 2;
  const vertices = [
    { x: 0, y: -h * 0.6 }, // top
    { x: -size / 2, y: h * 0.4 }, // bottom-left
    { x: size / 2, y: h * 0.4 }, // bottom-right
  ];
  const edges = [
    [vertices[0], vertices[1]],
    [vertices[1], vertices[2]],
    [vertices[2], vertices[0]],
  ];
  const totalPerimeter =
    edges.reduce(
      (s, [a, b]) => s + Math.hypot(b.x - a.x, b.y - a.y),
      0
    );
  const positions: { x: number; y: number }[] = [];
  let placed = 0;

  for (const [a, b] of edges) {
    const edgeLen = Math.hypot(b.x - a.x, b.y - a.y);
    const edgeCount = Math.round((edgeLen / totalPerimeter) * count);
    const actual = placed + edgeCount > count ? count - placed : edgeCount;

    for (let j = 0; j < actual; j++) {
      const t = actual > 1 ? j / actual : 0;
      positions.push({
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
      });
    }
    placed += actual;
  }

  while (positions.length < count) {
    const t = positions.length / count;
    positions.push({
      x: vertices[0].x + (vertices[1].x - vertices[0].x) * t,
      y: vertices[0].y + (vertices[1].y - vertices[0].y) * t,
    });
  }

  return positions.slice(0, count);
}

function getSquarePositions(count: number, size: number) {
  const half = size / 2;
  const corners = [
    { x: -half, y: -half },
    { x: half, y: -half },
    { x: half, y: half },
    { x: -half, y: half },
  ];
  const positions: { x: number; y: number }[] = [];
  const perSide = Math.ceil(count / 4);

  for (let side = 0; side < 4; side++) {
    const a = corners[side];
    const b = corners[(side + 1) % 4];
    const sideCount = Math.min(perSide, count - positions.length);

    for (let j = 0; j < sideCount; j++) {
      const t = sideCount > 1 ? j / sideCount : 0;
      positions.push({
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
      });
    }
  }

  return positions.slice(0, count);
}

// ── Skill Icon Component ──
function SkillIcon({
  skill,
  x,
  y,
  index,
  isBuilt,
  floatPhase,
  isHighlighted = false,
}: {
  skill: Skill;
  x: number;
  y: number;
  index: number;
  isBuilt: boolean;
  floatPhase: number;
  isHighlighted?: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const activeTooltip = showTooltip || isHighlighted;
  const [floatDelay] = useState(() => Math.random() * FLOAT_DURATION);

  return (
    <motion.div
      className="absolute z-10"
      style={{ 
        left: "50%",
        top: "50%",
        x: x,
        y: y,
        willChange: "transform",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={
        isBuilt
          ? {
            y: [y, y - 8, y],
            opacity: 1,
            scale: 1,
          }
          : { scale: 0, opacity: 0 }
      }
      transition={
        isBuilt
          ? {
            y: {
              duration: FLOAT_DURATION,
              repeat: Infinity,
              delay: floatDelay,
              ease: "easeInOut",
            },
            opacity: { duration: BUILD_DURATION, delay: index * BUILD_STAGGER * 0.5 },
          }
          : { duration: BUILD_DURATION, delay: index * BUILD_STAGGER * 0.5 }
      }
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0}
      role="button"
    >
      <div
        className={`relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl transition-all duration-500 cursor-pointer group border border-border/50
          hover:scale-125 hover:shadow-2xl hover:bg-accent/40 hover:border-border
        `}
      >
        {skill.icon_type === "text" ? (
          <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-tighter transition-colors ${skill.name === "TBA" ? "text-muted-foreground/30" : "text-foreground/70 group-hover:text-foreground"
            }`}>
            {skill.icon}
          </span>
        ) : (
          (() => {
            const Icon = getIcon(skill.icon, skill.icon_group);
            if (!Icon) return null;
            const isTBA = skill.name === "TBA";
            return (
              <Icon
                style={{ color: isTBA ? undefined : skill.color }}
                className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-500 
                  ${activeTooltip ? "scale-125 opacity-100" : ""}
                  ${!activeTooltip && isTBA ? "opacity-20 grayscale text-muted-foreground/20" : "opacity-90"}
                  group-hover:scale-125 group-hover:opacity-100 group-hover:grayscale-0
                `}
              />
            );
          })()
        )}

        {/* Brand highlight glow */}
        {activeTooltip && skill.color && (
          <motion.div
            layoutId={`glow-${skill._id}`}
            className="absolute inset-x-0 -inset-y-2 blur-2xl opacity-30 rounded-full"
            style={{ backgroundColor: skill.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
          />
        )}
      </div>

      {/* Enhanced Tooltip with Line Animation */}
      <AnimatePresence>
        {activeTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="relative">
              <div className="bg-popover border border-border/50 rounded-xl px-4 py-2.5 shadow-xl min-w-[140px]">
                <div className="flex items-center gap-2 mb-1">
                  {skill.color && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: skill.color }} />
                  )}
                  <p className="text-[10px] md:text-xs font-bold text-popover-foreground tracking-tight">
                    {skill.name}
                  </p>
                </div>
                <p className="text-[9px] md:text-[10px] leading-relaxed text-muted-foreground font-medium line-clamp-2">
                  {skill.description}
                </p>
              </div>

              {/* Connecting Line Animation */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 12 }}
                className="w-px bg-gradient-to-b from-border to-transparent mx-auto"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


// ── Shape Group Component ──
function ShapeGroup({
  groupName,
  shape,
  skills,
  isInView,
  floatDelay,
  highlightedIds,
}: {
  groupName: string;
  shape: "circle" | "triangle" | "square";
  skills: Skill[];
  isInView: boolean;
  floatDelay: number;
  highlightedIds: string[];
}) {
  const [isBuilt, setIsBuilt] = useState(false);

  useEffect(() => {
    if (isInView && !isBuilt) {
      const totalBuildTime = skills.length * BUILD_STAGGER * 500 + BUILD_DURATION * 500;
      const timer = setTimeout(() => setIsBuilt(true), totalBuildTime);
      return () => clearTimeout(timer);
    }
  }, [isInView, isBuilt, skills.length]);

  // Higher density shapes optimized for label clearance
  const shapeSize = 130;
  const positions = useMemo(() => {
    switch (shape) {
      case "circle":
        return getCirclePositions(skills.length, shapeSize);
      case "triangle":
        return getTrianglePositions(skills.length, shapeSize * 2.1);
      case "square":
        return getSquarePositions(skills.length, shapeSize * 1.8);
    }
  }, [shape, skills.length]);

  return (
    <div className="flex flex-col items-center gap-12 flex-1 min-w-[280px] xs:min-w-[300px] max-w-[400px]">
      <motion.div
        className="relative aspect-square w-full flex items-center justify-center transform-gpu"
        animate={
          isBuilt
            ? { 
                y: [0, -15, 0],
                rotate: [0, 1, -1, 0] // Subtle organic sway
              }
            : {}
        }
        transition={
          isBuilt
            ? {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: floatDelay,
            }
            : {}
        }
      >
        {/* Skill icons placed along the shape */}
        {skills
          .sort((a, b) => a.order - b.order)
          .map((skill, i) => (
            <SkillIcon
              key={skill._id}
              skill={skill}
              x={positions[i]?.x ?? 0}
              y={positions[i]?.y ?? 0}
              index={i}
              isBuilt={isInView}
              floatPhase={floatDelay}
              isHighlighted={highlightedIds.includes(skill._id)}
            />
          ))}
      </motion.div>

      {/* Category Label Below - Grounded Design */}
      <div className="flex flex-col items-center gap-2.5">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={isBuilt ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xs md:text-sm font-black uppercase tracking-[0.4em] text-foreground/80"
        >
          {GROUP_LABELS[groupName]}
        </motion.span>
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={isBuilt ? { width: 40, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="h-[1.5px] bg-primary/30 rounded-full"
        />
        <motion.span
          initial={{ opacity: 0 }}
          animate={isBuilt ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]"
        >
          {skills.filter(s => s.name !== "TBA").length} Stack Components
        </motion.span>
      </div>
    </div>
  );
}



// ── Ticker Component ──
function SkillTicker({ skills }: { skills: Skill[] }) {
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Group skills by their group for section labels
  const grouped = useMemo(() => {
    const map: Record<string, Skill[]> = {};
    for (const s of skills) {
      if (!map[s.group]) map[s.group] = [];
      map[s.group].push(s);
    }
    return map;
  }, [skills]);

  // Flatten with group labels
  const items = useMemo(() => {
    const result: { type: "label" | "skill"; value: string; skill?: Skill }[] = [];
    for (const [group, groupSkills] of Object.entries(grouped)) {
      result.push({ type: "label", value: GROUP_LABELS[group] || group });
      for (const s of groupSkills) {
        result.push({ type: "skill", value: s.name, skill: s });
      }
    }
    return result;
  }, [grouped]);

  if (items.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden py-6 border-t border-b border-border/50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={tickerRef}
        className="flex items-center gap-6 whitespace-nowrap transform-gpu"
        style={{
          animation: `tickerScroll 40s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        {/* Multiple duplicates to ensure it always fills any screen width immediately */}
        {[0, 1, 2, 3].map((copy) => (
          <div key={copy} className="flex items-center gap-6 shrink-0">
            {items.map((item, i) => {
              if (item.type === "label") {
                return (
                  <span
                    key={`${copy}-label-${i}`}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 mx-2"
                  >
                    {item.value} ›
                  </span>
                );
              }
              const Icon = item.skill ? getIcon(item.skill.icon, item.skill.icon_group) : null;
              return (
                <div
                  key={`${copy}-skill-${i}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-secondary/5 hover:bg-secondary/10 hover:border-border transition-all group cursor-default"
                >
                  {Icon && (
                    <Icon
                      className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors"
                      style={{ color: item.skill?.color }}
                    />
                  )}
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
    </div>
  );
}

// ── Main Section ──
export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(shapesRef, { once: true, margin: "-10% 0px -10% 0px" });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isInfoHovered, setIsInfoHovered] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch("/api/skills")
      .then((r) => r.json())
      .then((data: Skill[]) => setSkills(data))
      .catch(() => { });
  }, []);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search logic - now uses debouncedQuery
  const filteredSearch = useMemo(() => {
    const query = debouncedQuery.trim();
    if (!query) return [];
    return skills.filter(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) &&
        s.name !== "TBA"
    );
  }, [debouncedQuery, skills]);

  const searchStatus = useMemo(() => {
    if (!searchQuery.trim()) return "idle";

    // Check if what the user CURRENTLY typed (not debounced) is matching
    // This gives immediate visual feedback while the "lock on" (highlights) wait for debounce
    const currentMatches = skills.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) &&
        s.name !== "TBA"
    );

    return currentMatches.length > 0 ? "found" : "not_found";
  }, [searchQuery, skills]);

  const highlightedIds = useMemo(() => filteredSearch.map(s => s._id), [filteredSearch]);

  // Group skills
  const shapeSkills = useMemo(() => {
    const result: Record<string, Skill[]> = {};
    for (const group of Object.keys(SHAPE_GROUPS)) {
      result[group] = skills.filter((s) => s.group === group);
    }
    return result;
  }, [skills]);

  const tickerSkills = useMemo(() => {
    // Sort all skills based on the TICKER_GROUPS_ORDER
    return skills
      .filter((s) => s.name !== "TBA")
      .sort((a, b) => {
        const idxA = TICKER_GROUPS_ORDER.indexOf(a.group);
        const idxB = TICKER_GROUPS_ORDER.indexOf(b.group);
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
      });
  }, [skills]);

  const topSkills = useMemo(
    () => skills.filter((s) => s.is_top_skill),
    [skills]
  );

  // Headline Animation Logic (Synced with blogs)
  const title = "Technical".split("");
  const subtitle = "Skillset".split("");
  const premiumEase: [number, number, number, number] = [0.25, 0.4, 0.25, 1];

  const letterAnimation = {
    hidden: { opacity: 0, y: 100, rotateX: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 1,
        delay: 0.1 + i * 0.04,
        ease: premiumEase,
      },
    }),
  };

  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full bg-background pt-20 pb-12 md:pt-32 md:pb-16 overflow-hidden"
    >
      <BlueprintPattern />
      <div className="container-main">

        {/* Section Header */}
        <div className="flex flex-col items-center mb-10 md:mb-16" ref={titleRef}>
          <h2 className="flex flex-wrap items-center justify-center text-[clamp(2.5rem,10vw,9rem)] font-light tracking-tighter text-foreground leading-none">
            <span className="flex overflow-hidden pb-4 -mb-4 mr-4 md:mr-8">
              {title.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterAnimation}
                  initial="hidden"
                  animate={isTitleInView ? "visible" : "hidden"}
                  className="inline-block origin-bottom"
                >
                  {letter}
                </motion.span>
              ))}
            </span>
            <span className="flex overflow-hidden pb-4 -mb-4">
              {subtitle.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i + 8}
                  variants={letterAnimation}
                  initial="hidden"
                  animate={isTitleInView ? "visible" : "hidden"}
                  className="inline-block origin-bottom text-muted-foreground/30"
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </h2>

          {/* Minimal Skill Navigator - Ultra Compact */}
          <div className="flex flex-col items-center mt-6 mb-10 w-full mx-auto" ref={titleRef}>
            <div className="relative flex items-center group max-w-[280px] w-full bg-secondary/20 hover:bg-secondary/30 border border-border/40 rounded-full px-4 py-2 transition-all duration-300 focus-within:border-primary/30 focus-within:bg-secondary/40">
              <Search className="w-3.5 h-3.5 text-muted-foreground/40 mr-3 transition-colors group-focus-within:text-foreground/60" />
              <input
                type="text"
                placeholder="Find a technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none py-0.5 text-[11px] font-medium focus:outline-none placeholder:text-muted-foreground/30 text-foreground"
              />

              <div className="flex items-center gap-3 ml-2">
                {/* Status Indicator first */}
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 shadow-sm ${searchStatus === "idle" ? "bg-muted/10" :
                    searchStatus === "found" ? "bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]" :
                      "bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  }`} />

                {/* Info Icon at the end */}
                <div 
                  className="relative flex items-center justify-center"
                  onMouseEnter={() => setIsInfoHovered(true)}
                  onMouseLeave={() => setIsInfoHovered(false)}
                >
                  <Info className="w-3.5 h-3.5 text-muted-foreground/30 hover:text-muted-foreground/60 cursor-help transition-all duration-300 hover:scale-110" />
                  
                  <AnimatePresence>
                    {isInfoHovered && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-popover/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] z-50 whitespace-nowrap"
                      >
                        <div className="relative">
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-popover-foreground">
                            Skill Availability Check
                          </p>
                          <p className="text-[9px] text-muted-foreground/70 mt-1 font-medium">
                            Try typing "React" or "Python" to see the magic!
                          </p>
                          {/* Triangle pointer */}
                          <div className="absolute -bottom-[14.5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-popover/95 border-r border-b border-border/50 rotate-45" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Skills Prominent Bar */}
        {topSkills.length > 0 && (
          <div className="relative z-20 flex flex-col items-center mb-16 md:mb-24">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isTitleInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="h-px w-8 bg-foreground/10" />
              <span className="text-[10px] md:text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.3em]">Core Expertise</span>
              <div className="h-px w-8 bg-foreground/10" />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05, delayChildren: 1.1 }
                }
              }}
              initial="hidden"
              animate={isTitleInView ? "visible" : "hidden"}
              className="flex items-center justify-center gap-2 md:gap-2.5 flex-wrap px-4 max-w-4xl"
            >
              {topSkills.map((s) => {
                const Icon = getIcon(s.icon, s.icon_group);
                return (
                  <motion.div
                    key={s._id}
                    variants={{
                      hidden: { opacity: 0, y: 15, scale: 0.95, filter: "blur(8px)" },
                      visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                    }}
                    whileHover={{ 
                      y: -4, 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/15 backdrop-blur-sm border border-white/5 transition-all duration-300 group hover:bg-secondary/30 hover:border-white/10 cursor-default shadow-sm overflow-hidden"
                  >
                    {/* Brand Glow on Hover */}
                    <div 
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 pointer-events-none"
                      style={{ backgroundColor: s.color || 'var(--primary)' }}
                    />
                    
                    {Icon && (
                      <Icon 
                        className="w-4 h-4 md:w-4.5 md:h-4.5 text-muted-foreground transition-all duration-300 group-hover:scale-110" 
                        style={{ color: s.color }} 
                      />
                    )}
                    <span className="text-[10px] md:text-xs font-bold text-foreground/70 group-hover:text-foreground transition-colors tracking-tight">
                      {s.name}
                    </span>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        )}

        {/* Shape Groups */}
        <div
          ref={shapesRef}
          className="flex flex-wrap justify-center gap-12 md:gap-20 lg:gap-32 mb-16 md:mb-20"
        >
          {Object.entries(SHAPE_GROUPS).map(([group, shape], i) => (
            <ShapeGroup
              key={group}
              groupName={group}
              shape={shape}
              skills={shapeSkills[group] || []}
              isInView={isInView}
              floatDelay={i * 0.8}
              highlightedIds={highlightedIds}
            />
          ))}
        </div>
      </div>

      {/* Ticker Row */}
      <SkillTicker skills={tickerSkills} />

      <style>{`
        @keyframes tickerScroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-25%, 0, 0); }
        }
      `}</style>
    </section>
  );
}
