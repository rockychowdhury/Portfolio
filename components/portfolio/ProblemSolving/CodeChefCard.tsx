import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import MiniSparkline from "./MiniSparkline";
import { ICodeChefProfile } from "@/lib/db/models/ProblemSolvingProfile";

interface CodeChefCardProps {
  data: ICodeChefProfile | null;
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

export default function CodeChefCard({ data, loading }: CodeChefCardProps) {
  if (loading || !data) {
    return (
      <div className="h-[280px] bg-secondary/5 border border-border/10 rounded-3xl animate-pulse"></div>
    );
  }

  const { handle, rating, maxRating, stars, totalContests, totalSolved, ratingGraph } = data;
  
  const badgeColor = "#D97706"; // Amber-600
  
  const renderStars = () => {
    return Array.from({ length: 7 }).map((_, i) => (
      <div 
        key={i} 
        className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
          i < stars ? "bg-[#D97706] shadow-[0_0_8px_rgba(217,119,6,0.5)]" : "bg-foreground/[0.05]"
        }`}
      />
    ));
  };

  return (
    <motion.div
      className="bg-secondary/10 border border-border/10 rounded-3xl p-8 relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(var(--primary-rgb),0.02)] transition-shadow duration-500"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-foreground/[0.03] border border-border/10 flex items-center justify-center font-black text-xs text-foreground/40 tracking-tighter">
            CC
          </div>
          <div>
            <h3 className="font-bold text-foreground">CodeChef</h3>
            <p className="text-[10px] font-mono text-muted-foreground/40">{handle}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{stars} Star Division</span>
          <div className="flex gap-1">{renderStars()}</div>
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
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 text-left">Contests</span>
          <div className="text-3xl font-medium tracking-tighter text-foreground text-left">
             <Counter value={totalContests} />
          </div>
        </div>
        <div className="flex flex-col gap-1 col-span-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 text-left">Solutions Shipped</span>
          <div className="text-3xl font-medium tracking-tighter text-foreground text-left">
            <Counter value={totalSolved} />
            <span className="text-sm font-light text-foreground/20 ml-1 lowercase">Algorithms</span>
          </div>
        </div>
      </div>

      {ratingGraph && ratingGraph.length > 0 && (
        <div className="mt-4 pt-6 border-t border-border/5 relative w-full h-16 flex items-center justify-center">
           <div className="absolute top-2 left-0 text-[8px] font-black uppercase tracking-widest text-muted-foreground/20 italic">Historical Rating Performance</div>
           <MiniSparkline data={ratingGraph} color={badgeColor} width={400} height={40} strokeWidth={2} />
        </div>
      )}
    </motion.div>
  );
}
