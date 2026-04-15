import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import MiniSparkline from "./MiniSparkline";
import { ICodeforcesProfile } from "@/lib/db/models/ProblemSolvingProfile";

interface CodeforcesCardProps {
  data: ICodeforcesProfile | null;
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

export default function CodeforcesCard({ data, loading }: CodeforcesCardProps) {
  if (loading || !data) {
    return (
      <div className="h-[280px] bg-secondary/5 border border-border/10 rounded-3xl animate-pulse"></div>
    );
  }

  const { handle, rating, maxRating, title, totalContests, bestRank, totalSolved, ratingGraph } = data;

  // Codeforces color mapping
  const titleDisplay = title.toLowerCase();
  let badgeColor = "#7B7B7B"; // Default
  if (titleDisplay.includes('grandmaster')) badgeColor = "#ff0000";
  else if (titleDisplay.includes('master')) badgeColor = "#ff8e00";
  else if (titleDisplay.includes('candidate master')) badgeColor = "#a0a";
  else if (titleDisplay.includes('expert')) badgeColor = "#0000ff";
  else if (titleDisplay.includes('specialist')) badgeColor = "#03a89e";
  else if (titleDisplay.includes('pupil')) badgeColor = "#008000";

  return (
    <motion.div
      className="bg-secondary/10 border border-border/10 rounded-3xl p-8 relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(var(--primary-rgb),0.02)] transition-shadow duration-500"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: 0.1 }}
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-foreground/[0.03] border border-border/10 flex items-center justify-center font-black text-xs text-foreground/40 tracking-tighter">
            CF
          </div>
          <div>
            <h3 className="font-bold text-foreground">Codeforces</h3>
            <p className="text-[10px] font-mono text-muted-foreground/40">{handle}</p>
          </div>
        </div>
        <div 
          className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-current opacity-80"
          style={{ color: badgeColor, backgroundColor: `${badgeColor}10` }}
        >
          {title}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 text-left">Current Rating</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-medium tracking-tighter text-foreground">
               <Counter value={rating} />
            </span>
            <span className="text-[10px] font-bold text-muted-foreground/20 italic">(Peak: {maxRating})</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 text-left">Consistency</span>
          <div className="text-3xl font-medium tracking-tighter text-foreground">
             <Counter value={totalContests} />
             <span className="text-sm font-light text-foreground/20 ml-1 lowercase">contests</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 text-left">Best Rank</span>
          <div className="text-3xl font-medium tracking-tighter text-foreground text-left">
             {bestRank !== null ? <div className="flex items-baseline gap-1"><span>#</span><Counter value={bestRank} /></div> : '—'}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 text-left">Solutions</span>
          <div className="text-3xl font-medium tracking-tighter text-foreground text-left">
            <Counter value={totalSolved || 0} />
            <span className="text-sm font-light text-foreground/20 ml-1 lowercase">solved</span>
          </div>
        </div>
      </div>

      {ratingGraph && ratingGraph.length > 0 && (
        <div className="mt-4 pt-6 border-t border-border/5 relative w-full h-16 flex items-center justify-center">
           <div className="absolute top-2 left-0 text-[8px] font-black uppercase tracking-widest text-muted-foreground/20 italic">Rating Velocity Graph</div>
           <MiniSparkline data={ratingGraph} color={badgeColor} width={400} height={40} strokeWidth={2} />
        </div>
      )}
    </motion.div>
  );
}
