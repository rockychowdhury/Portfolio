import { motion, useSpring, useTransform, AnimatePresence, useMotionValue } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import MiniSparkline from "./MiniSparkline";
import { Copy, Check, ExternalLink } from "lucide-react";

interface PlatformCardProps {
  name: string;
  username: string;
  iconPath: string;
  rankDisplay: string | number | null;
  maxRating: number;
  solveCount: number;
  contestCount: number;
  ratingGraph: number[];
  color: string;
  profileUrl: string;
  loading?: boolean;
  solvedStats?: {
    easy: number;
    medium: number;
    hard: number;
  };
  percentageDisplay?: string;
}

function Counter({ value }: { value: number }) {
  const count = useSpring(0, { stiffness: 40, damping: 20 });
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    count.set(value);
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default function PlatformCard({
  name,
  username,
  iconPath,
  rankDisplay,
  maxRating,
  solveCount,
  contestCount,
  ratingGraph,
  color,
  profileUrl,
  loading,
  solvedStats,
  percentageDisplay,
}: PlatformCardProps) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  // --- 3D Hover & Spotlight Effects ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);
  
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const spotlightBackground = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(circle at ${(x as number + 0.5) * 100}% ${(y as number + 0.5) * 100}%, var(--brand-color) 0%, transparent 50%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates from -0.5 to 0.5
    mouseX.set((x / rect.width) - 0.5);
    mouseY.set((y / rect.height) - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (loading) {
    return (
      <div className="h-[460px] bg-secondary/5 border border-border/10 rounded-3xl animate-pulse" />
    );
  }

  const isLeetCode = name.toLowerCase().includes('leetcode');
  const isCodeChef = name.toLowerCase().includes('codechef');
  const totalSolved = solveCount;

  const copyUsername = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.a
      ref={cardRef}
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col rounded-3xl bg-transparent p-8 transition-shadow duration-700 hover:shadow-2xl min-h-[460px] cursor-pointer"
      style={{ 
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
        // @ts-ignore
        '--brand-color': color 
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {/* ── Background & Borders ── */}
      <div className="absolute inset-0 rounded-3xl border border-white/5 bg-[#0a0a0a]/90 backdrop-blur-xl overflow-hidden -z-10 shadow-inner">
        {/* Spotlight Follower */}
        <motion.div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: spotlightBackground,
            mixBlendMode: "screen",
            opacity: 0.15
          }}
        />
        {/* Subtle Brand Glow */}
        <div 
          className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ backgroundColor: color }}
        />
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-[var(--brand-color)]/30 transition-colors duration-500 pointer-events-none -z-10" />

      {/* ── Header ── */}
      <div className="flex items-start justify-between relative z-10 mb-8" style={{ transform: "translateZ(30px)" }}>
        <div className="flex items-center gap-4">
          {/* Logo Container */}
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white/5 p-3 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
            <Image 
              src={iconPath} 
              alt={name} 
              fill 
              className={`object-contain p-1 filter drop-shadow-md ${isCodeChef ? 'brightness-0 invert' : ''}`}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="flex flex-col">
            <h3 className="text-xl font-bold tracking-tight text-white leading-none mb-1.5 flex items-center gap-2">
              {name}
              <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-[var(--brand-color)] transition-colors" />
            </h3>
            <div className="flex items-center gap-1.5 group/copy relative z-30">
              <span className="text-[10px] font-mono font-medium text-white/40 uppercase tracking-widest">{username}</span>
              <button 
                onClick={copyUsername}
                className="relative p-1 rounded-md hover:bg-white/10 transition-colors duration-300"
                title="Copy Username"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                      <Check className="w-3 h-3 text-green-400" />
                    </motion.div>
                  ) : (
                    <motion.div key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="opacity-0 group-hover/copy:opacity-100 transition-opacity">
                      <Copy className="w-3 h-3 text-white/40 hover:text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
        
        {/* Status Pill */}
        <div className="flex flex-col items-end">
          <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
            <span className="text-xs font-bold tracking-wide" style={{ color: color }}>
              {isLeetCode && percentageDisplay ? percentageDisplay : rankDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* ── Body Stats ── */}
      <div className="flex-1 flex flex-col justify-center relative z-10" style={{ transform: "translateZ(40px)" }}>
        <div className="flex flex-col gap-8">
          
          {/* Row 1: Problems Solved */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              Problems Solved
            </span>
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="text-6xl lg:text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-lg leading-none">
                <Counter value={solveCount} />
              </div>
              
              {isLeetCode && solvedStats && (
                <div className="flex items-center gap-2 pb-1.5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00b8a3]" />
                    <span className="text-sm font-bold text-white/80">{solvedStats.easy}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffc01e]" />
                    <span className="text-sm font-bold text-white/80">{solvedStats.medium}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff375f]" />
                    <span className="text-sm font-bold text-white/80">{solvedStats.hard}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Contests & Peak Rating */}
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Contests</span>
              <div className="text-3xl font-black text-white/80 tracking-tighter tabular-nums leading-none">
                <Counter value={contestCount} />
              </div>
            </div>

            {maxRating > 0 && (
              <div className="flex flex-col border-l border-white/10 pl-6">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Peak Rating</span>
                <div className="text-3xl font-black tracking-tighter tabular-nums leading-none" style={{ color: color }}>
                  <Counter value={maxRating} />
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* ── Graph Footer ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none rounded-b-3xl overflow-hidden -z-0 opacity-80 mix-blend-screen">
        {/* Fade mask for smooth integration */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] z-10" />
        <MiniSparkline data={ratingGraph} color={color} width={400} height={128} strokeWidth={2} />
      </div>
    </motion.a>
  );
}
