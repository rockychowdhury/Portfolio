"use client";

import { motion } from "framer-motion";
import CountUp from "./CountUp";
import ActivityHeatmap from "./ActivityHeatmap";
import { IGitHubProfile } from "@/lib/db/models/ProblemSolvingProfile";

interface GitHubStripProps {
  data: IGitHubProfile | null;
  loading?: boolean;
}

export default function GitHubStrip({ data, loading }: GitHubStripProps) {
  if (loading || !data) {
    return (
      <div className="h-24 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse mt-8"></div>
    );
  }

  const { handle, repos, followers, contributions, topLanguage, heatmap } = data;

  return (
    <motion.div
      className="col-span-1 lg:col-span-12 w-full mt-8 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex-shrink-0 flex flex-col md:flex-row gap-6 md:gap-8 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-8 w-full md:w-auto">
        <div className="flex items-center gap-3">
          {/* GitHub Icon */}
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <div>
            <h3 className="font-bold text-white text-sm">GitHub</h3>
            <p className="text-xs text-[#7B7B7B]">{handle}</p>
          </div>
        </div>

        <div className="flex gap-6">
          <div>
            <p className="text-[10px] text-[#7B7B7B] uppercase tracking-wider mb-1">Repos</p>
            <span className="font-semibold text-white/90"><CountUp to={repos} /></span>
          </div>
          <div>
             <p className="text-[10px] text-[#7B7B7B] uppercase tracking-wider mb-1">Contributions ({new Date().getFullYear()})</p>
             <span className="font-semibold text-white/90"><CountUp to={contributions} /></span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full overflow-hidden flex flex-col justify-center">
         <p className="text-[10px] text-[#7B7B7B] uppercase tracking-wider mb-2">Contribution Activity</p>
         <div className="mask-image-linear-right pointer-events-none md:pointer-events-auto overflow-hidden">
           {/* If heatmap data exists, render the GitHub activity heatmap. Otherwise placeholder. */}
           {Object.keys(heatmap).length > 0 ? (
             <ActivityHeatmap data={heatmap} accentColor="#2ea043" weeks={32} isTimestamp={false} />
           ) : (
             <div className="text-xs text-white/30 italic">No contribution data mapped.</div>
           )}
         </div>
      </div>
    </motion.div>
  );
}
