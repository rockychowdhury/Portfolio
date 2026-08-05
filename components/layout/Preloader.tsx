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

  // New Terminal States - start typing immediately (or alongside letters)
  const [terminalState, setTerminalState] = useState<"hidden" | "typing" | "loading" | "done">("typing");
  const [commandText, setCommandText] = useState("");
  const [logs, setLogs] = useState<({ id: number; isWarn: false; method: string; url: string; status: string; time: string; } | { id: number; isWarn: true; text: string; })[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Phase 2: Typing Animation
  useEffect(() => {
    if (terminalState !== "typing") return;

    const fullCommand = "sudo init portfolio";
    let currentIndex = 0;
    let interval: NodeJS.Timeout;
    
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        if (currentIndex <= fullCommand.length) {
          setCommandText(fullCommand.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
             setTerminalState("loading");
          }, 150); // slight pause simulating user hitting 'Enter'
        }
      }, 22); // Fast, smooth typing
    }, 200); // Delay typing slightly so it aligns nicely with ROCKY letters fading in

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [terminalState]);

  // Phase 3: Loading Progress & Logs
  useEffect(() => {
    if (terminalState !== "loading") return;

    const LOG_TYPES = [
      { type: "req", method: "GET", url: "/", status: "200 OK" },
      { type: "req", method: "GET", url: `/api/stats/problem-solving?_=${Date.now()}`, status: "200 OK" },
      { type: "req", method: "GET", url: "/api/github", status: "200 OK" },
      { type: "req", method: "GET", url: "/api/skills", status: "200 OK" },
      { type: "req", method: "GET", url: "/api/stats", status: "200 OK" },
      { type: "req", method: "GET", url: "/api/stats?refresh=true", status: "200 OK" },
      { type: "req", method: "GET", url: "/api/education?limit=all", status: "200 OK" },
      { type: "req", method: "GET", url: "/api/blogs/list", status: "200 OK" },
      { type: "req", method: "GET", url: "/api/achievements", status: "200 OK" },
      { type: "req", method: "GET", url: "/api/journey", status: "200 OK" },
      { type: "req", method: "GET", url: "/api/testimonials/list", status: "200 OK" },
      { type: "req", method: "GET", url: "/api/projects", status: "200 OK" },
      { type: "warn", text: "(node:41843) [MONGOOSE] Warning: mongoose: the `new` option for `findOneAndUpdate()` is deprecated." },
      { type: "warn", text: "[browser] Please ensure that the container has a non-static position, like 'relative'." },
    ];

    let currentProgress = 0;
    let lastRenderedProgress = 0;
    let rafId: number;
    let lastTime = performance.now();
    let logCounter = 0;
    const localLogs: typeof logs = [];

    function tick(now: number) {
      const delta = now - lastTime;
      
      // Update every ~25ms for fast but stable rendering
      if (delta >= 25) {
        lastTime = now;
        
        if (currentProgress < 100) {
          // Progress logic
          const increment = currentProgress < 85 ? Math.random() * 10 : Math.random() * 3;
          currentProgress = Math.min(currentProgress + increment, 100);

          const rounded = Math.round(currentProgress);
          if (rounded !== lastRenderedProgress) {
            lastRenderedProgress = rounded;
            setProgress(rounded);
          }

          // Logs logic (add log on 40% of ticks)
          if (Math.random() > 0.6) {
            const logItem = LOG_TYPES[Math.floor(Math.random() * LOG_TYPES.length)];
            
            if (logItem.type === "req") {
                // Occasionally simulate a slow network request
                const timeMs = Math.floor(Math.random() * (Math.random() > 0.85 ? 1500 : 150)) + 10;
                localLogs.push({
                    id: logCounter++,
                    isWarn: false,
                    method: logItem.method as string,
                    url: logItem.url as string,
                    status: logItem.status as string,
                    time: `${timeMs}ms`
                });
            } else {
                localLogs.push({
                    id: logCounter++,
                    isWarn: true,
                    text: logItem.text as string
                });
            }
            
            // Keep max 12 logs in memory/DOM
            if (localLogs.length > 12) {
              localLogs.shift();
            }
            
            setLogs([...localLogs]);
          }
        } else {
          setTerminalState("done");
          return;
        }
      }
      
      rafId = requestAnimationFrame(tick);
    }
    
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [terminalState]);

  // Phase 4: Trigger Morph Transition after completion
  useEffect(() => {
    if (terminalState === "done") {
      const timeout = setTimeout(() => {
        const logo = logoRef.current;
        const navAnchor = document.getElementById("navbar-logo-anchor");
        if (logo && navAnchor) {
          const logoRect = logo.getBoundingClientRect();
          const navRect = navAnchor.getBoundingClientRect();

          const scale = navRect.height / logoRect.height;
          
          const dx = (navRect.left + navRect.width / 2) - (logoRect.left + logoRect.width / 2);
          const dy = (navRect.top + navRect.height / 2) - (logoRect.top + logoRect.height / 2);

          setMorph({ x: dx, y: dy, scale });
        }

        setPhase("morph");
        
        const fallback = setTimeout(() => {
          handleMorphComplete();
        }, 900);
        
        return () => clearTimeout(fallback);
      }, 150); // Wait 150ms at 100% before morphing

      return () => clearTimeout(timeout);
    }
  }, [terminalState]);

  const handleMorphComplete = () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.body.style.height = "";
    document.documentElement.style.height = "";
    onComplete?.();
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[9998] bg-[#09090b] origin-top"
        initial={{ y: 0 }}
        animate={phase === "morph" ? { y: "-100%" } : { y: 0 }}
        transition={{
          duration: 0.45,
          ease: [0.76, 0, 0.24, 1],
        }}
      />

      {/* ── Logo & Loader Container ── */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
            <motion.div
            ref={logoRef}
            className="flex font-black uppercase text-5xl md:text-8xl tracking-tighter transform-gpu relative z-10"
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
                duration: 0.5,
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

            {/* Terminal / Loader (Absolutely positioned to prevent layout shift) */}
            {phase === "letters" && terminalState !== "hidden" && (
                <div className="absolute top-[calc(50%+2.5rem)] md:top-[calc(50%+4rem)] w-full flex justify-center z-0 px-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={terminalState === "done" ? { opacity: 0, filter: "blur(4px)" } : { opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-[18rem] md:max-w-[24rem] flex flex-col gap-2.5 items-center"
                    >
                        <div className="flex justify-between w-full items-center px-1">
                            <div className="font-mono text-[11px] md:text-xs text-green-400 flex items-center">
                                <span className="text-white/40 mr-2">$</span>
                                <span>{commandText}</span>
                                {(terminalState === "typing" || terminalState === "loading") && (
                                    <motion.span 
                                        animate={{ opacity: [1, 0] }} 
                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                        className="inline-block w-2 h-3.5 md:h-4 bg-green-400 ml-1"
                                    />
                                )}
                            </div>
                            <span className="text-[10px] md:text-xs font-mono text-white/40">
                                {terminalState === "loading" || terminalState === "done" ? `${Math.round(progress)}%` : "0%"}
                            </span>
                        </div>

                        <div className="w-full h-[2px] bg-white/10 relative overflow-hidden rounded-full">
                            <motion.div 
                                className="absolute top-0 left-0 h-full bg-white"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>

                        {/* Logs Window */}
                        <div className="w-full h-32 md:h-40 bg-[#050505] border border-white/10 rounded-lg overflow-hidden flex flex-col justify-end p-2 md:p-3 relative shadow-inner">
                            <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-[#050505] to-transparent z-10"></div>
                            <div className="flex flex-col gap-1.5 w-full relative z-0">
                                {logs.map((log) => (
                                    log.isWarn ? (
                                        <div key={log.id} className="text-[9px] md:text-[10px] font-mono leading-tight whitespace-nowrap flex w-full overflow-hidden text-yellow-400/80">
                                            <span className="truncate">{log.text}</span>
                                        </div>
                                    ) : (
                                        <div key={log.id} className="text-[9px] md:text-[10px] font-mono leading-tight whitespace-nowrap flex gap-1.5 md:gap-2 items-center w-full overflow-hidden">
                                            <span className="shrink-0 text-green-400">{log.method}</span>
                                            <span className="text-white/70 truncate shrink">{log.url}</span>
                                            <span className="text-white/40 shrink-0">-</span>
                                            <span className="shrink-0 text-green-400">{log.status}</span>
                                            <span className="text-white/30 shrink-0 ml-auto">{log.time}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
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
