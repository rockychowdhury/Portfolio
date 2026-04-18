"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useInView,
  animate,
} from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ── Animated Counter Hook ──
function useAnimatedCounter(target: number, duration = 2) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => unsubscribe();
  }, [rounded]);

  useEffect(() => {
    if (target > 0) {
      const controls = animate(count, target, {
        duration,
        ease: [0.25, 0.4, 0.25, 1],
      });
      return () => controls.stop();
    }
  }, [target, count, duration]);

  return display;
}

// Stagger container
const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

// Individual item fade up
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

// Slide from left
const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

// Letter animation for "Hello"
const helloLetters = "Hello".split("");
const letterAnimation = {
  hidden: { opacity: 0, y: 80, rotateX: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: 0.5 + i * 0.08,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

// Line draw animation
const lineGrow = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1, delay: 1.1, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

export default function HeroSection({
  preloaderDone = true,
}: {
  preloaderDone?: boolean;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Real stats
  const [stats, setStats] = useState({
    totalSolved: 0,
    projectCount: 0,
  });
  const [statsLoaded, setStatsLoaded] = useState(false);

  const resumeUrl =
    process.env.NEXT_PUBLIC_RESUME_URL || "/resume.pdf";

  // Animated counters
  const solvedCount = useAnimatedCounter(
    preloaderDone && statsLoaded ? stats.totalSolved : 0,
    2.5
  );
  const projectCount = useAnimatedCounter(
    preloaderDone && statsLoaded ? stats.projectCount : 0,
    2
  );

  // Phase 1: Fetch cached stats from MongoDB (instant)
  // Phase 2: Background refresh from live APIs, update UI smoothly
  useEffect(() => {
    // 1. Load cached stats
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.totalSolved > 0 || data.projectCount > 0) {
          setStats({
            totalSolved: data.totalSolved,
            projectCount: data.projectCount,
          });
        }
        setStatsLoaded(true);
      })
      .catch(() => {
        setStatsLoaded(true);
      });

    // 2. Background refresh — update cache and UI
    fetch("/api/stats?refresh=true")
      .then((r) => r.json())
      .then((data) => {
        if (data.totalSolved > 0) {
          setStats({
            totalSolved: data.totalSolved,
            projectCount: data.projectCount,
          });
        }
      })
      .catch(() => { }); // silent fail — cached data remains
  }, []);

  // Smooth spring for subtle parallax on image
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const imageX = useTransform(springX, [-500, 500], [5, -5]);
  const imageY = useTransform(springY, [-500, 500], [5, -5]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.width / 2);
      mouseY.set(e.clientY - rect.height / 2);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-background pt-20 lg:pt-0"
    >
      <div className="container-main flex h-full flex-col lg:grid lg:grid-cols-2">
        {/* ── Left Content ── */}
        <div className="relative z-20 flex flex-col lg:flex-1 lg:justify-center pt-10 pb-6 lg:py-0">
          {/* Vertical Label — Desktop Only */}
          <div className="absolute top-1/2 -left-12 hidden -translate-y-1/2 flex-col items-center gap-8 lg:flex">
            <span className="text-[12px] font-semibold tracking-[0.25em] uppercase text-muted-foreground/60 [writing-mode:vertical-lr] rotate-180">
              Problem Solver
            </span>
            <div className="h-64 w-px border-l border-dashed border-border/60" />
            <span className="text-[12px] font-semibold tracking-[0.25em] uppercase text-muted-foreground/60 [writing-mode:vertical-lr] rotate-180">
              2023
            </span>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate={preloaderDone ? "visible" : "hidden"}
            className="lg:pl-12 lg:pt-24 xl:pt-32"
          >
            {/* Stats Row — pushed down */}
            <motion.div
              variants={fadeUp}
              className="mb-8 mt-4 flex flex-wrap items-start gap-12 lg:mb-12 lg:mt-8 md:gap-20"
            >
              <div>
                <span className="text-4xl xs:text-5xl font-light tracking-tight text-foreground md:text-6xl tabular-nums">
                  +{solvedCount}
                </span>
                <p className="mt-2 text-[10px] md:text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                  DSA Problems Solved
                </p>
              </div>
              <div>
                <span className="text-4xl xs:text-5xl font-light tracking-tight text-foreground md:text-6xl tabular-nums">
                  {projectCount > 0 ? `+${projectCount}` : "—"}
                </span>
                <p className="mt-2 text-[10px] md:text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                  Full-Stack Projects Shipped
                </p>
              </div>
            </motion.div>

            {/* Main Heading */}
            <div className="relative">
              <h1
                className="flex font-medium text-fluid-hero text-foreground"
                style={{ perspective: "600px" }}
              >
                {helloLetters.map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterAnimation}
                    initial="hidden"
                    animate={preloaderDone ? "visible" : "hidden"}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </h1>

              <motion.div
                variants={slideLeft}
                initial="hidden"
                animate={preloaderDone ? "visible" : "hidden"}
                className="mt-6 lg:mt-10 flex items-center gap-4"
              >
                <div className="h-px w-8 bg-foreground" />
                <p className="text-lg font-medium text-foreground md:text-xl">
                  It&apos;s Rocky Chowdhury a Software Engineer
                </p>
              </motion.div>

              {/* Recruiter CTAs */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={preloaderDone ? "visible" : "hidden"}
                className="mt-8 lg:mt-12 flex flex-wrap lg:flex-nowrap gap-4"
              >
                <a
                  href="https://linkedin.com/in/rockychowdhury1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-3 px-7 py-3 bg-foreground text-background rounded-full font-bold text-sm overflow-hidden transition-all hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:scale-[0.98] whitespace-nowrap"
                >
                  <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <LinkedinIcon className="size-4 relative z-10" />
                  <span className="relative z-10">LinkedIn</span>
                  <span className="relative z-10 text-[10px] opacity-60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                </a>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-3 px-7 py-3 bg-transparent border border-foreground/10 text-foreground rounded-full font-bold text-sm overflow-hidden transition-all hover:border-foreground/30 hover:bg-foreground/[0.02] hover:-translate-y-1 active:scale-[0.98] whitespace-nowrap"
                >
                  <span className="absolute inset-0 bg-foreground/[0.03] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <ExternalLink className="size-4 relative z-10 group-hover:rotate-12 transition-transform" />
                  <span className="relative z-10">Resume</span>
                </a>
              </motion.div>
            </div>

            {/* Scroll Indicator — pushed inward with pl-12 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={preloaderDone ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 2 }}
              className="mt-20 xl:mt-28 hidden lg:flex items-center gap-4 pl-20"
            >
              <div className="relative flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-5 h-9 border-2 border-muted-foreground/20 rounded-full flex justify-center pt-1.5"
                >
                  <motion.div
                    animate={{ opacity: [1, 0, 1], height: [4, 8, 4] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-1 bg-muted-foreground/40 rounded-full"
                  />
                </motion.div>
                <span className="absolute -bottom-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                  Scroll
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Right Content: Image ── */}
        <div className="relative flex items-start justify-center lg:flex-1 lg:h-screen lg:items-end lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={
              preloaderDone
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 1.05 }
            }
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            style={{ x: imageX, y: imageY }}
            className="relative h-[45vh] xs:h-[55vh] w-[110%] right-[-5%] transition-all md:h-[85vh] lg:h-[90vh] lg:w-full lg:right-0 xl:h-[95vh] 2xl:w-full 2xl:right-0"
          >
            <Image
              src="/profile.png"
              alt="Rocky Chowdhury — Software Engineer"
              fill
              unoptimized
              className="object-contain object-top lg:object-bottom scale-[1.0] 2xl:scale-[1.0] 3xl:scale-[1.4] origin-top lg:origin-bottom"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>

          {/* Subtle decoration */}
          <div className="absolute -right-4 bottom-1/4 hidden h-8 w-8 items-center justify-center lg:flex">
            <div className="size-3 border-r-2 border-b-2 border-border rotate-45" />
          </div>
        </div>
      </div>
    </section>
  );
}
