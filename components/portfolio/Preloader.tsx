"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const NAME = "ROCKY";
const LETTERS = NAME.split("");

export default function Preloader({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const logoRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"letters" | "morph">("letters");
  const [morph, setMorph] = useState({ x: 0, y: 0, scale: 1 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Simulate progress while checking for data
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Slower at the end to feel more realistic
        const increment = prev < 70 ? Math.random() * 15 : Math.random() * 2;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const logo = logoRef.current;
      const navAnchor = document.getElementById("navbar-logo-anchor");
      if (logo && navAnchor) {
        const logoRect = logo.getBoundingClientRect();
        const navRect = navAnchor.getBoundingClientRect();

        const scale = navRect.height / logoRect.height;
        
        // Center-to-center is most reliable for different text sizes/fonts
        const dx = (navRect.left + navRect.width / 2) - (logoRect.left + logoRect.width / 2);
        const dy = (navRect.top + navRect.height / 2) - (logoRect.top + logoRect.height / 2);

        setMorph({ x: dx, y: dy, scale });
      }

      setPhase("morph");
    }
  }, [progress]);

  const handleMorphComplete = () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    onComplete?.();
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[9998] bg-[#09090b] origin-top"
        animate={phase === "morph" ? { y: "-100%" } : { y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.76, 0, 0.24, 1],
        }}
      />

      {/* ── Logo & Loader Container ── */}
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-8">
            <motion.div
            ref={logoRef}
            className="flex font-black uppercase text-5xl md:text-8xl tracking-tighter transform-gpu"
            style={{ fontFamily: "var(--font-sans)" }}
            animate={
                phase === "morph"
                ? {
                    x: morph.x,
                    y: morph.y,
                    scale: morph.scale,
                    color: "var(--foreground)",
                    opacity: 1,
                    }
                : {
                    x: 0,
                    y: 0,
                    scale: 1,
                    color: "#ffffff",
                    opacity: 1,
                    }
            }
            transition={{
                duration: 0.7,
                ease: [0.76, 0, 0.24, 1],
            }}
            onAnimationComplete={() => {
                if (phase === "morph") handleMorphComplete();
            }}
            >
            {LETTERS.map((letter, i) => (
                <span
                key={i}
                className="inline-block relative opacity-0"
                style={{
                    zIndex: LETTERS.length - i,
                    animation: `letterIn 600ms cubic-bezier(0.25, 1, 0.5, 1) forwards`,
                    animationDelay: `${i * 100}ms`,
                }}
                >
                {letter}
                </span>
            ))}
            </motion.div>

            {/* Premium Loader */}
            {phase === "letters" && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="w-48 md:w-64 flex flex-col gap-3 items-center"
                >
                    <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                        <motion.div 
                            className="absolute top-0 left-0 h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>
                    <div className="flex justify-between w-full">
                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Loading Data</span>
                        <span className="text-[10px] font-mono text-white/40">{Math.round(progress)}%</span>
                    </div>
                </motion.div>
            )}
        </div>
      </div>

      <style>{`
        @keyframes letterIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
