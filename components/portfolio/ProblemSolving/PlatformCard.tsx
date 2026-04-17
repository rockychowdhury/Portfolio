import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import MiniSparkline from "./MiniSparkline";
import { Copy, Check } from "lucide-react";

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
  // Specific for LeetCode circle graph
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

  if (loading) {
    return (
      <div className="h-[380px] bg-secondary/5 border border-border/10 rounded-[2rem] animate-pulse" />
    );
  }

  const isLeetCode = name.toLowerCase().includes('leetcode');
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
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col rounded-[2.5rem] border border-border/10 bg-transparent p-7 transition-all duration-700 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] min-h-[440px]"
      style={{ 
        // @ts-ignore
        '--hover-color': color 
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Clipped Background & Border Layer */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        {/* Base White Background */}
        <div className="absolute inset-0 bg-[#ffffff]" />

        {/* Premium Gradient Background - Persistent with hover enhancement */}
        <div 
          className="absolute inset-0 opacity-100 transition-opacity duration-700"
          style={{ 
            background: `radial-gradient(circle at 0% 0%, ${color}18 0%, transparent 80%), 
                         radial-gradient(circle at 100% 100%, ${color}12 0%, transparent 80%)`,
          }}
        />
        
        {/* Base Subtle Color to prevent "white bar" feel */}
        <div className="absolute inset-0 bg-secondary/[0.01]" />
        
        {/* Dynamic Hover Border */}
        <div className="absolute inset-0 border border-transparent transition-colors duration-700 group-hover:border-[var(--hover-color)]/30 z-20" />
      </div>

      {/* Header Row */}
      <div className="flex items-start justify-between relative z-10 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-secondary/10 p-3 border border-border/5 shadow-sm transition-transform duration-500 group-hover:scale-110">
            <Image 
              src={iconPath} 
              alt={name} 
              fill 
              className="object-contain p-1"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold tracking-tight text-foreground leading-none mb-1.5">{name}</h3>
            <div className="flex items-center gap-1.5 group/copy relative z-30">
              <span className="text-[10px] font-mono font-bold text-muted-foreground/30 uppercase tracking-widest">{username}</span>
              <button 
                onClick={copyUsername}
                className="relative p-1 rounded-md bg-secondary/0 hover:bg-secondary/50 transition-colors duration-300 cursor-pointer"
                title="Copy Username"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Check className="size-2.5 text-green-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="opacity-0 group-hover/copy:opacity-100 transition-opacity"
                    >
                      <Copy className="size-2.5 text-muted-foreground/80" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end text-right">
          <div className="mb-2">
            {isLeetCode && percentageDisplay ? (
               <div className="flex flex-col items-end">
                  <span className="text-xl font-black leading-none" style={{ color: color }}>{percentageDisplay}</span>
                  <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mt-1.5">in global</span>
               </div>
            ) : (
              <span className="text-xl font-black leading-none block" style={{ color: color }}>
                {rankDisplay}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Peak</span>
            <span className="text-sm font-black tabular-nums" style={{ color: color }}>
              <Counter value={maxRating} />
            </span>
          </div>
        </div>
      </div>

      {/* Body Stats Area - flex-1 to push footer down */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="flex items-center justify-between gap-6">
          {isLeetCode && solvedStats ? (
            <div className="flex items-center gap-6 flex-1">
               {/* LeetCode Donut Chart */}
               <div className="relative h-28 w-28 transition-transform duration-700 group-hover:scale-105">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-muted-foreground/5" />
                    <motion.circle 
                      cx="50" cy="50" r="42" fill="transparent" stroke="#00b8a3" strokeWidth="10"
                      strokeDasharray="263.89"
                      initial={{ strokeDashoffset: 263.89 }}
                      whileInView={{ strokeDashoffset: 263.89 - (solvedStats.easy / totalSolved) * 263.89 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      strokeLinecap="round"
                    />
                    <motion.circle 
                      cx="50" cy="50" r="42" fill="transparent" stroke="#ffc01e" strokeWidth="10"
                      strokeDasharray="263.89"
                      initial={{ strokeDashoffset: 263.89 }}
                      whileInView={{ strokeDashoffset: 263.89 - (solvedStats.medium / totalSolved) * 263.89 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.2, ease: "circOut" }}
                      strokeLinecap="round"
                      transform={`rotate(${(solvedStats.easy / totalSolved) * 360} 50 50)`}
                    />
                    <motion.circle 
                      cx="50" cy="50" r="42" fill="transparent" stroke="#ff375f" strokeWidth="10"
                      strokeDasharray="263.89"
                      initial={{ strokeDashoffset: 263.89 }}
                      whileInView={{ strokeDashoffset: 263.89 - (solvedStats.hard / totalSolved) * 263.89 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.4, ease: "circOut" }}
                      strokeLinecap="round"
                      transform={`rotate(${((solvedStats.easy + solvedStats.medium) / totalSolved) * 360} 50 50)`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-xl font-black text-foreground leading-none"><Counter value={totalSolved} /></span>
                     <span className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-widest mt-1.5">Solved</span>
                  </div>
               </div>
               
               <div className="flex flex-1 justify-between items-center ml-2">
                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00b8a3]" />
                        <span className="text-[10px] font-bold text-muted-foreground/60 w-12">Easy</span>
                        <span className="text-xs font-black text-foreground tabular-nums">{solvedStats.easy}</span>
                     </div>
                     <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ffc01e]" />
                        <span className="text-[10px] font-bold text-muted-foreground/60 w-12">Medium</span>
                        <span className="text-xs font-black text-foreground tabular-nums">{solvedStats.medium}</span>
                     </div>
                     <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff375f]" />
                        <span className="text-[10px] font-bold text-muted-foreground/60 w-12">Hard</span>
                        <span className="text-xs font-black text-foreground tabular-nums">{solvedStats.hard}</span>
                     </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Contests</span>
                     <div className="text-4xl font-black text-foreground/90 tracking-tighter tabular-nums">
                        <Counter value={contestCount} />
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="flex flex-1 justify-between items-center">
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Solved</span>
                <div className="text-5xl font-black text-foreground/80 tracking-tighter tabular-nums">
                  <Counter value={solveCount} />
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Contests</span>
                <div className="text-5xl font-black text-foreground/80 tracking-tighter tabular-nums">
                  <Counter value={contestCount} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sparkline Graph Area - Full Width at bottom */}
      <div className="mt-auto pt-6 -mx-7 -mb-7 relative z-10 rounded-b-[2.5rem]">
        <div className="h-24 w-full transition-all duration-700">
           <MiniSparkline data={ratingGraph} color={color} width={500} height={100} strokeWidth={3} />
        </div>
      </div>
    </motion.a>
  );
}
