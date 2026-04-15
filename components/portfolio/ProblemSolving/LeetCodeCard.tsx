import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import MiniSparkline from "./MiniSparkline";
import { ILeetCodeProfile } from "@/lib/db/models/ProblemSolvingProfile";

interface LeetCodeCardProps {
  data: ILeetCodeProfile | null;
  loading?: boolean;
}

function Counter({ value }: { value: number }) {
  const count = useSpring(0, { stiffness: 30, damping: 15 });
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    count.set(value);
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default function LeetCodeCard({ data, loading }: LeetCodeCardProps) {
  if (loading || !data) {
    return (
      <div className="h-full min-h-[400px] bg-secondary/5 border border-border/10 rounded-3xl animate-pulse col-span-1 lg:col-span-7"></div>
    );
  }

  const { handle, solved, totalActiveDays, longestStreak, contests, topTags, ratingGraph } = data;
  const total = solved.all || 1;

  const bars = [
    { label: "Easy", count: solved.easy, color: "#00b8a3" },
    { label: "Medium", count: solved.medium, color: "#ffc01e" },
    { label: "Hard", count: solved.hard, color: "#ff375f" },
  ];

  return (
    <motion.div
      className="col-span-1 lg:col-span-7 w-full bg-secondary/10 border border-border/10 rounded-3xl p-8 lg:p-12 hover:shadow-[0_8px_30px_rgba(255,192,30,0.03)] transition-shadow duration-500 relative overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Background glow highlights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffc01e]/5 rounded-full blur-[100px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#00b8a3]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#ffc01e]/5 border border-[#ffc01e]/20 flex items-center justify-center p-3">
            <svg viewBox="0 0 24 24" fill="#ffc01e" className="w-8 h-8">
              <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.536-.536.554-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-7.015 0l-4.32 4.363C3.418 11.235 3 12.186 3 13.1c0 1.042.418 1.954 1.151 2.686l4.32 4.362c.94.94 2.193 1.411 3.447 1.411 1.253 0 2.506-.471 3.447-1.411l2.61-2.636c.514-.515.496-1.366-.039-1.901a1.328 1.328 0 0 0-1.834-.031z"/>
              <path d="M18.666 4.6l-5.636 5.636c-.467.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-1.045-1.045c-.515-.514-.497-1.365.038-1.901.536-.536 1.387-.554 1.901-.039l1.045 1.045a5.055 5.055 0 0 0 7.015 0l5.636-5.636C24.438 2.193 25.389 1.775 26.303 1.775c1.041 0 1.953.418 2.685 1.151l-10.322 1.674z" transform="translate(-3 -1.775)"/>
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">LeetCode</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground/40">{handle}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/40 animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end gap-1">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffc01e]/60">
            {contests?.topPercentage ? `Top ${contests.topPercentage}% Globally` : "Ranked Contender"}
          </div>
          {contests?.globalRanking > 0 && (
            <div className="text-3xl font-light tracking-tighter text-foreground/40">
              #<Counter value={contests.globalRanking} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-16">
        {/* Left Col: Main Stat & Donut */}
        <div className="md:col-span-5 flex flex-col items-center md:items-start">
           <div className="flex flex-col gap-1 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Total Persistence</span>
              <div className="text-7xl lg:text-8xl font-medium tracking-tighter text-foreground">
                <Counter value={solved.all} />
              </div>
           </div>
           
           <div className="relative w-40 h-40">
              <svg width="160" height="160" viewBox="0 0 100 100" className="-rotate-90 origin-center">
                <circle cx="50" cy="50" r="44" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-foreground/[0.03]" />
                
                {/* Easy Segment */}
                <motion.circle 
                  cx="50" cy="50" r="44" fill="transparent" stroke="#00b8a3" strokeWidth="6"
                  strokeDasharray="276.46"
                  initial={{ strokeDashoffset: 276.46 }}
                  whileInView={{ strokeDashoffset: 276.46 - (solved.easy / total) * 276.46 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: [0.25, 0.4, 0.25, 1] }}
                  strokeLinecap="round"
                />
                
                {/* Medium Segment */}
                <motion.circle 
                  cx="50" cy="50" r="44" fill="transparent" stroke="#ffc01e" strokeWidth="6"
                  strokeDasharray="276.46"
                  initial={{ strokeDashoffset: 276.46 }}
                  whileInView={{ strokeDashoffset: 276.46 - (solved.medium / total) * 276.46 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                  strokeLinecap="round"
                  transform={`rotate(${(solved.easy / total) * 360} 50 50)`}
                />
                
                {/* Hard Segment */}
                <motion.circle 
                  cx="50" cy="50" r="44" fill="transparent" stroke="#ff375f" strokeWidth="6"
                  strokeDasharray="276.46"
                  initial={{ strokeDashoffset: 276.46 }}
                  whileInView={{ strokeDashoffset: 276.46 - (solved.hard / total) * 276.46 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                  strokeLinecap="round"
                  transform={`rotate(${((solved.easy + solved.medium) / total) * 360} 50 50)`}
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">Ratio</span>
                 <span className="text-xl font-bold text-foreground/80">{Math.round((solved.all / 3300) * 100)}%</span>
              </div>
           </div>
        </div>

        {/* Right Col: Difficulty Tracks */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-8">
          {bars.map((bar, i) => (
            <div key={bar.label} className="group/bar">
              <div className="flex justify-between items-end mb-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{bar.label}</span>
                  <div className="text-2xl font-medium tracking-tight text-foreground">
                    <Counter value={bar.count} />
                  </div>
                </div>
                <div className="text-[10px] font-bold text-muted-foreground/20 italic pb-1">
                  {Math.round((bar.count / total) * 100)}% Capacity
                </div>
              </div>
              
              <div className="relative h-2 w-full bg-foreground/[0.03] rounded-full overflow-hidden border border-border/5">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: bar.color, opacity: 0.8 }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(bar.count / total) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: "circOut" }}
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: i * 0.5 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Connectivity Bar */}
      <div className="flex flex-wrap items-center gap-6 pt-10 border-t border-border/10">
        <div className="flex flex-col gap-1">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">Persistence Track</span>
           <div className="px-5 py-2.5 rounded-2xl bg-foreground/[0.03] border border-border/10 flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <span className="text-orange-500 text-sm">🔥</span>
                 <span className="text-xs font-bold text-foreground/60 tracking-tight">
                   Streak: <span className="text-foreground"><Counter value={totalActiveDays} /> days</span>
                 </span>
              </div>
              <div className="w-px h-3 bg-border/20" />
              <div className="flex items-center gap-2">
                 <span className="text-yellow-500 text-sm">🏆</span>
                 <span className="text-xs font-bold text-foreground/60 tracking-tight">
                   Peak: <span className="text-foreground"><Counter value={longestStreak || totalActiveDays} /> days</span>
                 </span>
              </div>
           </div>
        </div>

        {ratingGraph && ratingGraph.length > 0 && (
          <div className="flex-1 min-w-[240px]">
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">Competitive Momentum</span>
              {contests && (
                <span className="text-[10px] font-bold text-[#ffc01e]">Rating: {contests.rating}</span>
              )}
            </div>
            <div className="h-14 w-full bg-foreground/[0.02] rounded-xl border border-border/5 p-2 flex items-center justify-center overflow-hidden">
               <MiniSparkline data={ratingGraph} color="#ffc01e" width={500} height={40} strokeWidth={2} />
            </div>
          </div>
        )}
      </div>

      {/* Top Skills Tags */}
      {topTags && topTags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {topTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-lg bg-foreground/[0.03] border border-border/10 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 transition-colors hover:bg-[#ffc01e]/10 hover:text-[#ffc01e] hover:border-[#ffc01e]/20 cursor-default"
            >
              # {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
