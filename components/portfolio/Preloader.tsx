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
  const [themeTarget, setThemeTarget] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const totalLetterTime = LETTERS.length * 120 + 400;

    const timer = setTimeout(() => {
      const logo = logoRef.current;
      const navAnchor = document.getElementById("navbar-logo-anchor");
      const themeBtn = document.getElementById("theme-toggle-btn");

      if (logo && navAnchor) {
        const logoRect = logo.getBoundingClientRect();
        const navRect = navAnchor.getBoundingClientRect();

        // center-to-center delta
        const dx =
          navRect.left +
          navRect.width / 2 -
          (logoRect.left + logoRect.width / 2);
        const dy =
          navRect.top +
          navRect.height / 2 -
          (logoRect.top + logoRect.height / 2);
        const scale = navRect.height / logoRect.height;

        setMorph({ x: dx, y: dy, scale });
      }

      if (themeBtn) {
        const r = themeBtn.getBoundingClientRect();
        setThemeTarget({
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
        });
      }

      setPhase("morph");
    }, totalLetterTime);

    return () => clearTimeout(timer);
  }, []);

  const handleMorphComplete = () => {
    document.body.style.overflow = "";
    onComplete?.();
  };

  return (
    <>
      {/* ── Dark overlay ── */}
      {phase === "letters" && (
        <div className="fixed inset-0 z-[9998] bg-[#09090b]" />
      )}
      {phase === "morph" && (
        <motion.div
          className="fixed inset-0 z-[9998] bg-[#09090b]"
          initial={{
            clipPath: `circle(${
              typeof window !== "undefined"
                ? Math.max(window.innerWidth, window.innerHeight) * 1.5
                : 2000
            }px at 50% 50%)`,
          }}
          animate={{
            clipPath: themeTarget
              ? `circle(0px at ${themeTarget.x}px ${themeTarget.y}px)`
              : "circle(0px at 50% 50%)",
          }}
          transition={{
            duration: 0.7,
            ease: [0.76, 0, 0.24, 1] as const,
          }}
        />
      )}

      {/* ── Logo — stays mounted across phases, morphs via transform ── */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
        <motion.div
          ref={logoRef}
          className="flex gap-[0.02em] font-black uppercase text-5xl md:text-7xl tracking-[0.2em]"
          style={{ fontFamily: "var(--font-sans)" }}
          animate={
            phase === "morph"
              ? {
                  x: morph.x,
                  y: morph.y,
                  scale: morph.scale,
                  color: "#1a1a1a",
                }
              : {
                  x: 0,
                  y: 0,
                  scale: 1,
                  color: "#ffffff",
                }
          }
          transition={{
            duration: 0.7,
            ease: [0.76, 0, 0.24, 1] as const,
            color: { duration: 0.35, ease: "easeOut" },
          }}
          onAnimationComplete={() => {
            if (phase === "morph") handleMorphComplete();
          }}
        >
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              className="inline-block opacity-0 relative"
              style={{
                zIndex: LETTERS.length - i,
                transform: "translateX(-50px)",
                animation: `letterIn 400ms cubic-bezier(0.25, 1, 0.5, 1) forwards`,
                animationDelay: `${i * 120}ms`,
              }}
            >
              {letter}
            </span>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes letterIn {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
