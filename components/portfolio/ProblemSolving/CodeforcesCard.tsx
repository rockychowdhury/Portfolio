"use client";

import { motion } from "framer-motion";
import CountUp from "./CountUp";
import MiniSparkline from "./MiniSparkline";
import { ICodeforcesProfile } from "@/lib/db/models/ProblemSolvingProfile";

interface CodeforcesCardProps {
  data: ICodeforcesProfile | null;
  loading?: boolean;
}

export default function CodeforcesCard({ data, loading }: CodeforcesCardProps) {
  if (loading || !data) {
    return (
      <div className="h-[250px] bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse"></div>
    );
  }

  const { handle, rating, maxRating, title, totalContests, bestRank, totalSolved, ratingGraph } = data;

  // Codeforces color mapping approximately
  let badgeColor = "#7B7B7B"; // default grey
  let titleDisplay = title.toLowerCase();
  
  if (titleDisplay.includes('grandmaster')) badgeColor = "#ff0000"; // red
  else if (titleDisplay.includes('master')) badgeColor = "#ff8c00"; // orange
  else if (titleDisplay.includes('candidate master')) badgeColor = "#a0a"; // violet
  else if (titleDisplay.includes('expert')) badgeColor = "#0000ff"; // blue
  else if (titleDisplay.includes('specialist')) badgeColor = "#03a89e"; // cyan
  else if (titleDisplay.includes('pupil')) badgeColor = "#008000"; // green
  
  // Actually standard CF colors:
  // Pupil: green
  if (titleDisplay.includes('pupil')) badgeColor = "#008000";

  return (
    <motion.div
      className="col-span-1 md:col-span-1 lg:col-span-6 bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.15 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center font-bold text-lg text-white">
            CF
          </div>
          <div>
            <h3 className="font-bold text-white">Codeforces</h3>
            <p className="text-xs text-[#7B7B7B]">{handle}</p>
          </div>
        </div>
        <motion.div 
          className="text-xs font-bold px-2 py-1 rounded capitalize"
          style={{ backgroundColor: `${badgeColor}20`, color: badgeColor }}
          initial={{ scale: 1 }}
          whileInView={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {title}
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-[#7B7B7B] text-xs uppercase tracking-wider mb-1">Rating</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white flex gap-1">
               <CountUp to={rating} />
            </span>
            <span className="text-xs text-[#7B7B7B] mb-1">(↑ {maxRating})</span>
          </div>
        </div>
        <div>
          <p className="text-[#7B7B7B] text-xs uppercase tracking-wider mb-1">Contests</p>
          <span className="text-xl font-medium text-white/90">
             <CountUp to={totalContests} />
          </span>
        </div>
        <div>
          <p className="text-[#7B7B7B] text-xs uppercase tracking-wider mb-1">Best Rank</p>
          <span className="text-xl font-medium text-white/90">
             {bestRank !== null ? <CountUp to={bestRank} /> : 'N/A'}
          </span>
        </div>
        <div>
          <p className="text-[#7B7B7B] text-xs uppercase tracking-wider mb-1">Problems</p>
          <span className="text-xl font-medium text-white/90">
            <CountUp to={totalSolved || 0} />
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
