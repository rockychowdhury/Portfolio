"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import * as SiIcons from "react-icons/si";
import type { IconType } from "react-icons";

// ── Types ──
interface Skill {
  _id: string;
  name: string;
  icon: string;
  description: string;
  group: string;
  is_top_skill: boolean;
  order: number;
}

// ── Animation Constants ──
const BUILD_STAGGER = 0.05; // seconds between each icon
const BUILD_DURATION = 0.5; // each icon's entrance duration
const FLOAT_DURATION = 6; // seconds for one float cycle
const BREATHE_DURATION = 4; // seconds for one breathe cycle
const SHIMMER_INTERVAL = 4000; // ms between shimmer events

// ── Shape groups and their assignment ──
const SHAPE_GROUPS: Record<string, "circle" | "triangle" | "square"> = {
  frontend: "circle",
  backend: "triangle",
  devops: "square",
};

const TICKER_GROUPS = ["database", "cs-fundamentals", "tools"];

const GROUP_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps",
  database: "Database",
  "cs-fundamentals": "CS Fundamentals",
  tools: "Tools",
};

// ── Icon resolver ──
function getIcon(iconName: string): IconType | null {
  const icons = SiIcons as Record<string, IconType>;
  return icons[iconName] || null;
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
}: {
  skill: Skill;
  x: number;
  y: number;
  index: number;
  isBuilt: boolean;
  floatPhase: number;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [shimmer, setShimmer] = useState(false);
  const Icon = getIcon(skill.icon);

  // Random shimmer
  useEffect(() => {
    if (!isBuilt) return;
    const delay = Math.random() * SHIMMER_INTERVAL * 3;
    const interval = setInterval(() => {
      setShimmer(true);
      setTimeout(() => setShimmer(false), 600);
    }, SHIMMER_INTERVAL + delay);
    return () => clearInterval(interval);
  }, [isBuilt]);

  const breatheDelay = useMemo(() => Math.random() * BREATHE_DURATION, []);

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={
        isBuilt
          ? {
              scale: [1, 1.04, 1],
              opacity: 1,
            }
          : { scale: 0, opacity: 0 }
      }
      transition={
        isBuilt
          ? {
              scale: {
                duration: BREATHE_DURATION,
                repeat: Infinity,
                delay: breatheDelay,
                ease: "easeInOut",
              },
              opacity: { duration: BUILD_DURATION, delay: index * BUILD_STAGGER },
            }
          : { duration: BUILD_DURATION, delay: index * BUILD_STAGGER }
      }
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0}
      role="button"
      aria-label={`${skill.name}: ${skill.description}`}
    >
      <div
        className={`relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl transition-all duration-300 cursor-pointer
          ${shimmer ? "ring-2 ring-primary/30 shadow-[0_0_12px_rgba(0,0,0,0.1)] dark:ring-white/30 dark:shadow-[0_0_12px_rgba(255,255,255,0.2)]" : ""}
          hover:scale-125 hover:shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-accent
        `}
      >
        {Icon && (
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground hover:text-foreground transition-colors" />
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          role="tooltip"
          className="absolute -top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none whitespace-nowrap"
        >
          <div className="bg-popover/90 backdrop-blur-md border border-border rounded-lg px-3 py-2 shadow-xl">
            <p className="text-xs font-bold text-popover-foreground">{skill.name}</p>
            <p className="text-[10px] text-popover-foreground/60 mt-0.5 max-w-[200px] whitespace-normal">
              {skill.description}
            </p>
          </div>
          <div className="w-2 h-2 bg-popover/90 border-b border-r border-border rotate-45 mx-auto -mt-1" />
        </div>
      )}
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
}: {
  groupName: string;
  shape: "circle" | "triangle" | "square";
  skills: Skill[];
  isInView: boolean;
  floatDelay: number;
}) {
  const [isBuilt, setIsBuilt] = useState(false);

  useEffect(() => {
    if (isInView && !isBuilt) {
      const totalBuildTime = skills.length * BUILD_STAGGER * 1000 + BUILD_DURATION * 1000;
      const timer = setTimeout(() => setIsBuilt(true), totalBuildTime);
      return () => clearTimeout(timer);
    }
  }, [isInView, isBuilt, skills.length]);

  const shapeSize = 140; // radius for circle, side-length for triangle/square
  const positions = useMemo(() => {
    switch (shape) {
      case "circle":
        return getCirclePositions(skills.length, shapeSize);
      case "triangle":
        return getTrianglePositions(skills.length, shapeSize * 2.2);
      case "square":
        return getSquarePositions(skills.length, shapeSize * 2);
    }
  }, [shape, skills.length]);

  return (
    <motion.div
      className="relative flex-1 min-w-[280px] max-w-[400px] aspect-square flex items-center justify-center"
      animate={
        isBuilt
          ? { y: [0, -8, 0] }
          : {}
      }
      transition={
        isBuilt
          ? {
              duration: FLOAT_DURATION,
              repeat: Infinity,
              ease: "easeInOut",
              delay: floatDelay,
            }
          : {}
      }
    >
      {/* Group label at center */}
      <div className="absolute z-10 flex flex-col items-center gap-1">
        <span className="text-lg md:text-xl font-bold text-foreground/90 tracking-tight">
          {GROUP_LABELS[groupName]}
        </span>
        <div className="h-px w-8 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
      </div>

      {/* Skill icons placed along the shape */}
      {skills.map((skill, i) => (
        <SkillIcon
          key={skill._id}
          skill={skill}
          x={positions[i]?.x ?? 0}
          y={positions[i]?.y ?? 0}
          index={i}
          isBuilt={isInView}
          floatPhase={floatDelay}
        />
      ))}
    </motion.div>
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
        className="flex items-center gap-6 whitespace-nowrap"
        style={{
          animation: `tickerScroll 40s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {/* Duplicate content for seamless loop */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-6 shrink-0">
            {items.map((item, i) => {
              if (item.type === "label") {
                return (
                  <span
                    key={`${copy}-label-${i}`}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mx-2"
                  >
                    {item.value} ›
                  </span>
                );
              }
              const Icon = item.skill ? getIcon(item.skill.icon) : null;
              return (
                <div
                  key={`${copy}-skill-${i}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-accent/20 hover:bg-accent/40 hover:border-border transition-all group cursor-default"
                >
                  {Icon && (
                    <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
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
  const isInView = useInView(shapesRef, { once: true, margin: "-15% 0px -15% 0px" });
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then((data: Skill[]) => setSkills(data))
      .catch(() => {});
  }, []);

  // Group skills
  const shapeSkills = useMemo(() => {
    const result: Record<string, Skill[]> = {};
    for (const group of Object.keys(SHAPE_GROUPS)) {
      result[group] = skills.filter((s) => s.group === group);
    }
    return result;
  }, [skills]);

  const tickerSkills = useMemo(
    () => skills.filter((s) => TICKER_GROUPS.includes(s.group)),
    [skills]
  );

  const topSkills = useMemo(
    () => skills.filter((s) => s.is_top_skill),
    [skills]
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full bg-background py-24 md:py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
            Technical Skills
          </h2>
        </div>

        {/* Top Skills Bar */}
        {topSkills.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap mb-20 md:mb-28">
            {topSkills.map((s, i) => (
              <span key={s._id} className="flex items-center gap-2">
                <span className="text-sm font-semibold text-muted-foreground">{s.name}</span>
                {i < topSkills.length - 1 && (
                  <span className="text-border text-xs">·</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Shape Groups */}
        <div
          ref={shapesRef}
          className="flex flex-wrap justify-center gap-8 md:gap-4 lg:gap-0 mb-20 md:mb-28"
        >
          {Object.entries(SHAPE_GROUPS).map(([group, shape], i) => (
            <ShapeGroup
              key={group}
              groupName={group}
              shape={shape}
              skills={shapeSkills[group] || []}
              isInView={isInView}
              floatDelay={i * 0.8}
            />
          ))}
        </div>
      </div>

      {/* Ticker Row — full width */}
      <SkillTicker skills={tickerSkills} />

      {/* Ticker animation keyframes */}
      <style>{`
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
