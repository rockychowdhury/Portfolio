"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const NAME = "ROCKY";
const LETTERS = NAME.split("");

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Wait for letters to stagger in + extra 400ms for safety
    // Instantly afterwards, signal completion to trigger AnimatePresence exit
    const totalLetterTime = LETTERS.length * 120 + 400; 
    
    const flyTimer = setTimeout(() => {
      document.body.style.overflow = ""; 
      onComplete?.();
    }, totalLetterTime);

    return () => clearTimeout(flyTimer);
  }, [onComplete]);

  return (
    <>
      {/* Black overlay — fades out gracefully via AnimatePresence */}
      <motion.div
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 z-[9998] bg-[#0A0A0A]"
      />

      {/* Centered Logo Morph Target */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
        <motion.div
          layoutId="brand-logo"
          className="flex gap-[0.02em] font-black uppercase text-white text-5xl md:text-7xl tracking-[0.2em]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              className="inline-block opacity-0"
              style={{
                transform: "translateY(18px)",
                animation: `letterIn 300ms ease-out forwards`,
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
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
