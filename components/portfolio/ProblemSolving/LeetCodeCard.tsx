"use client";

import { motion } from "framer-motion";
import CountUp from "./CountUp";
import MiniSparkline from "./MiniSparkline";
import { ILeetCodeProfile } from "@/lib/db/models/ProblemSolvingProfile";

interface LeetCodeCardProps {
  data: ILeetCodeProfile | null;
  loading?: boolean;
}

export default function LeetCodeCard({ data, loading }: LeetCodeCardProps) {
  if (loading || !data) {
    return (
      <div className="h-full min-h-[400px] bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse"></div>
    );
  }

  const { handle, solved, totalActiveDays, longestStreak, contests, topTags, ratingGraph } = data;
  const total = solved.all || 1; // avoid zero div

  const bars = [
    { label: "Easy", count: solved.easy, color: "#00b8a3" },
    { label: "Medium", count: solved.medium, color: "#ffc01e" },
    { label: "Hard", count: solved.hard, color: "#ff375f" },
  ];

  return (
    <motion.div
      className="col-span-1 lg:col-span-7 w-full bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-6 lg:p-8 hover:shadow-[0_8px_30px_rgba(255,192,30,0.05)] transition-shadow duration-500 relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffc01e]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ffc01e]/10 flex items-center justify-center">
            {/* LeetCode SVG Icon approx */}
            <svg viewBox="0 0 24 24" fill="#ffc01e" className="w-6 h-6">
              <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.536-.536.554-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-7.015 0l-4.32 4.363C3.418 11.235 3 12.186 3 13.1c0 1.042.418 1.954 1.151 2.686l4.32 4.362c.94.94 2.193 1.411 3.447 1.411 1.253 0 2.506-.471 3.447-1.411l2.61-2.636c.514-.515.496-1.366-.039-1.901a1.328 1.328 0 0 0-1.834-.031z"/>
              <path d="M18.666 4.6l-5.636 5.636c-.467.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-1.045-1.045c-.515-.514-.497-1.365.038-1.901.536-.536 1.387-.554 1.901-.039l1.045 1.045a5.055 5.055 0 0 0 7.015 0l5.636-5.636C24.438 2.193 25.389 1.775 26.303 1.775c1.041 0 1.953.418 2.685 1.151l-10.322 1.674z" transform="translate(-3 -1.775)"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">LeetCode</h3>
            <p className="text-sm text-[#7B7B7B]">{handle}</p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="text-sm text-[#7B7B7B]">
            {contests?.topPercentage ? `Top ${contests.topPercentage}% globally` : `Top ${Math.max(1, Math.floor(1000 / total))}% globally`}
          </div>
          {contests?.globalRanking > 0 && (
            <div className="text-xs text-[#7B7B7B] mt-1 font-medium">
              Rank: <CountUp to={contests.globalRanking} />
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        
        {/* Solved Donut */}
        <div className="md:col-span-4 flex flex-col justify-center relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#7B7B7B]">Solved</span>
          </div>
          <div className="text-5xl font-extrabold text-white tracking-tighter shadow-sm mb-4">
            <CountUp to={solved.all} />
          </div>
          
          {/* Circular Donut Chart SVG */}
          <div className="flex justify-center md:justify-start w-full mt-4">
            <div className="relative w-24 h-24">
              <svg width="96" height="96" viewBox="0 0 100 100" className="-rotate-90 origin-center filter drop-shadow-md">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                
                {/* Easy */}
                <motion.circle 
                  cx="50" cy="50" r="40" fill="transparent" stroke="#00b8a3" strokeWidth="12"
                  strokeDasharray="251.3"
                  initial={{ strokeDashoffset: 251.3 }}
                  whileInView={{ strokeDashoffset: 251.3 - (solved.easy / total) * 251.3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  strokeLinecap="round"
                />
                
                {/* Medium */}
                <motion.circle 
                  cx="50" cy="50" r="40" fill="transparent" stroke="#ffc01e" strokeWidth="12"
                  strokeDasharray="251.3"
                  initial={{ strokeDashoffset: 251.3 }}
                  whileInView={{ strokeDashoffset: 251.3 - (solved.medium / total) * 251.3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  strokeLinecap="round"
                  transform={`rotate(${(solved.easy / total) * 360} 50 50)`}
                />
                
                {/* Hard */}
                <motion.circle 
                  cx="50" cy="50" r="40" fill="transparent" stroke="#ff375f" strokeWidth="12"
                  strokeDasharray="251.3"
                  initial={{ strokeDashoffset: 251.3 }}
                  whileInView={{ strokeDashoffset: 251.3 - (solved.hard / total) * 251.3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                  strokeLinecap="round"
                  transform={`rotate(${((solved.easy + solved.medium) / total) * 360} 50 50)`}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-4">
          {bars.map((bar, i) => (
            <div key={bar.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#7B7B7B] uppercase tracking-wider">{bar.label}</span>
                <span className="text-white font-medium">
                  <CountUp to={bar.count} delay={0.3 + i * 0.1} />
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full relative"
                  style={{ backgroundColor: bar.color }}
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: bar.count / (Math.max(solved.easy, solved.medium, solved.hard) || 1) }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Header and Flex Container for Streak & Contests */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Streak Pill */}
        <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
          <div className="flex items-center gap-2">
            <motion.span 
              className="text-lg"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🔥
            </motion.span>
            <span className="text-sm font-medium text-white/90 hidden sm:inline">
              Current: <CountUp to={totalActiveDays} className="text-white font-bold" /> days
            </span>
            <span className="text-sm font-medium text-white/90 sm:hidden">
              <CountUp to={totalActiveDays} className="text-white font-bold" /> d
            </span>
            <span className="mx-2 text-white/20">|</span>
            <span className="text-lg">🏆</span>
            <span className="text-sm font-medium text-white/90 hidden sm:inline">
              Longest: <CountUp to={longestStreak || totalActiveDays} className="text-white font-bold" /> days
            </span>
            <span className="text-sm font-medium text-white/90 sm:hidden">
              <CountUp to={longestStreak || totalActiveDays} className="text-white font-bold" /> d
            </span>
          </div>
        </div>

        {/* Contest Pill */}
        {contests && contests.attended > 0 && (
          <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
            <div className="flex items-center gap-2">
               <span className="text-xl">⚔️</span>
               <span className="text-sm font-medium text-white/90">
                 Rating: <CountUp to={contests.rating} className="text-white font-bold" /> 
                 {contests.maxRating > contests.rating && (
                   <span className="text-white/40 text-xs ml-1 font-normal">
                     (↑ {contests.maxRating})
                   </span>
                 )}
               </span>
               <span className="mx-2 text-white/20">|</span>
               <span className="text-sm font-medium text-white/90">
                 Contests: <CountUp to={contests.attended} className="text-white font-bold" />
               </span>
            </div>
          </div>
        )}
      </div>

      {/* Rating Curve */}
      {ratingGraph && ratingGraph.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs text-[#7B7B7B] uppercase tracking-wider mb-3">Contest Rating Curve</h4>
          <div className="p-4 pt-6 w-full bg-black/20 rounded-xl border border-white/5 relative h-28 flex items-center justify-center translate-x-[-1rem]">
             <MiniSparkline data={ratingGraph} color="#ffc01e" width={300} height={60} strokeWidth={3} />
          </div>
        </div>
      )}

      {/* Top Tags */}
      {topTags && topTags.length > 0 && (
        <div>
          <h4 className="text-xs text-[#7B7B7B] uppercase tracking-wider mb-3">Top Skills</h4>
          <div className="flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-white/80 cursor-default"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
