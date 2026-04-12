"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";

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

// Stagger container
const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3, // Handled naturally via conditional mount
    },
  },
};

// Individual item fade up
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] },
  },
};

// Slide from left
const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] },
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
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

// Line draw animation
const lineGrow = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1, delay: 1.1, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export default function HeroSection({ preloaderDone = true }: { preloaderDone?: boolean }) {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

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
      className="relative min-h-screen w-full overflow-hidden bg-background pt-24 lg:pt-0"
    >
      <div className="mx-auto flex h-full max-w-[1400px] flex-col px-6 md:px-12 lg:flex-row lg:px-20">
        {/* ── Left Content ── */}
        <div className="relative z-20 flex flex-1 flex-col justify-center py-12 lg:py-0">
          {/* Vertical Label — Desktop Only */}
          <div className="absolute top-1/2 -left-12 hidden -translate-y-1/2 flex-col items-center gap-6 lg:flex">
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground [writing-mode:vertical-lr] rotate-180">
              Problem Solver
            </span>
            <div className="h-24 w-px border-l border-dashed border-border" />
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground [writing-mode:vertical-lr] rotate-180">
              2024
            </span>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate={preloaderDone ? "visible" : "hidden"}
            className="lg:pl-12"
          >
            {/* Stats Row */}
            <motion.div
              variants={fadeUp}
              className="mb-16 flex flex-wrap items-start gap-12 md:gap-20"
            >
              <div>
                <span className="text-5xl font-light tracking-tight text-foreground md:text-6xl">
                  +700
                </span>
                <p className="mt-2 text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                  DSA problems solved
                </p>
              </div>
              <div>
                <span className="text-5xl font-light tracking-tight text-foreground md:text-6xl">
                  +10
                </span>
                <p className="mt-2 text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                  Projects Completed
                </p>
              </div>
            </motion.div>

            {/* Main Heading */}
            <div className="relative">
              <h1 
                className="flex text-[7rem] font-medium leading-[0.85] tracking-tighter text-foreground sm:text-[9rem] md:text-[11rem] lg:text-[12rem] xl:text-[14rem]"
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
                className="mt-6 flex items-center gap-4"
              >
                <div className="h-px w-8 bg-foreground" />
                <p className="text-lg font-medium text-foreground md:text-xl">
                  It&apos;s Rocky Chowdhury a Software Engineer
                </p>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={preloaderDone ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1.5 }} 
              className="mt-20 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground"
            >
              Scroll down <ArrowDown className="size-3" />
            </motion.div>
          </motion.div>
        </div>

        {/* ── Right Content: Image ── */}
        <div className="relative flex flex-1 items-end justify-center lg:h-screen lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={preloaderDone ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }} 
            style={{ x: imageX, y: imageY }}
            className="relative h-[65vh] w-[110%] right-[-5%] transition-all md:h-[75vh] lg:h-[88vh] lg:w-full lg:right-0 xl:w-[105%] xl:right-[-2.5%]"
          >
            <Image
              src="/profile.png"
              alt="Rocky Chowdhury — Software Engineer"
              fill
              unoptimized
              className="object-contain object-bottom scale-[1.2] lg:scale-[1.4] xl:scale-[1.4] origin-bottom"
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
