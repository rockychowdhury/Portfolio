"use client";

import { motion } from "framer-motion";
import CountUp from "./CountUp";
import MiniSparkline from "./MiniSparkline";
import { ICodeChefProfile } from "@/lib/db/models/ProblemSolvingProfile";

interface CodeChefCardProps {
  data: ICodeChefProfile | null;
  loading?: boolean;
}

export default function CodeChefCard({ data, loading }: CodeChefCardProps) {
  if (loading || !data) {
    return (
      <div className="h-[250px] bg-secondary/5 border border-border/10 rounded-2xl animate-pulse"></div>
    );
  }

  const { handle, rating, maxRating, stars, totalContests, totalSolved, ratingGraph } = data;
  
  const badgeColor = "#8B4513"; // brownish orange for CodeChef
  
  // Render real stars
  const renderStars = () => {
    const starElements = [];
    for (let i = 1; i <= 7; i++) {
      starElements.push(
        <span key={i} className={`text-[10px] ${i <= stars ? "text-yellow-500" : "text-muted-foreground/20"}`}>
          ★
        </span>
      );
    }
    return starElements;
  };

  return (
    <motion.div
      className="col-span-1 md:col-span-1 lg:col-span-6 bg-secondary/10 border border-border/10 rounded-2xl p-6 relative overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex justify-between items-start mb-6 border-b border-border/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-secondary/20 flex items-center justify-center font-bold text-sm text-foreground">
            CC
          </div>
          <div>
            <h3 className="font-bold text-foreground">CodeChef</h3>
            <p className="text-xs text-muted-foreground/60">{handle}</p>
          </div>
        </div>
        <motion.div 
          className="flex flex-col items-end"
          initial={{ scale: 1 }}
          whileInView={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="text-xs font-bold text-foreground tracking-wider mb-1">{stars}★</span>
          <div className="flex">{renderStars()}</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest mb-1">Rating</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-foreground">
               <CountUp to={rating} />
            </span>
            <span className="text-[10px] font-bold text-muted-foreground/30 mb-1">(↑ {maxRating})</span>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest mb-1">Contests</p>
          <span className="text-xl font-medium text-foreground/80">
             <CountUp to={totalContests} />
          </span>
        </div>
        <div>
          <p className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest mb-1">Problems</p>
          <span className="text-xl font-medium text-foreground/80">
            <CountUp to={totalSolved} />
          </span>
        </div>
      </div>

      {ratingGraph && ratingGraph.length > 0 && (
        <div className="mt-auto pt-4 relative w-full h-12">
           <MiniSparkline data={ratingGraph} color={badgeColor} width={280} height={48} />
        </div>
      )}
    </motion.div>
  );
}
