"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import NarrativeBar from "./NarrativeBar";
import LeetCodeCard from "./LeetCodeCard";
import CodeforcesCard from "./CodeforcesCard";
import CodeChefCard from "./CodeChefCard";
import { IProblemSolvingProfile } from "@/lib/db/models/ProblemSolvingProfile";

export default function ProblemSolvingSection() {
  const [data, setData] = useState<IProblemSolvingProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    // Only fetch when scrolled into view roughly, or on mount if preferred.
    // Fetching on mount is usually safer for smooth UX.
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/stats/problem-solving?_=${new Date().getTime()}`, {
          cache: 'no-store'
        });
        if (res.ok) {
          const profile = await res.json();
          setData(profile);
        }
      } catch (err) {
        console.error("Failed to load problem solving stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (inView) {
      fetchStats();
    }
  }, [inView]);

  // Aggregate metrics
  const leetcodeCount = data?.leetcode?.solved?.all || 0;
  const cfCount = data?.codeforces?.totalSolved || 0;
  const ccCount = data?.codechef?.totalSolved || 0;
  const totalSolved = leetcodeCount + cfCount + ccCount;

  const totalContests = (data?.codeforces?.totalContests || 0) + (data?.codechef?.totalContests || 0) + (data?.leetcode?.contests?.attended || 0);
  const peakRating = Math.max(
    data?.codeforces?.maxRating || 0, 
    data?.codechef?.maxRating || 0,
    data?.leetcode?.contests?.maxRating || 0
  );

  // Fallback to initial placeholders while loading to prevent layout shift
  return (
    <section id="problem-solving" className="py-24 relative z-10 w-full" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          className="text-center md:text-left mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Algorithmic Thinking
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A deep dive into complex data structures and algorithms across key benchmarks,
            fostering strong problem-solving skills and a competitive mindset.
          </p>
        </motion.div>

        {/* Narrative Stats Bar */}
        <NarrativeBar 
          totalSolved={totalSolved} 
          totalContests={totalContests} 
          peakRating={peakRating} 
          leetcodePercentage="Top 30%" 
        />

        {/* Main Grid for Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
           
           {/* LeetCode Hero Card */}
           <LeetCodeCard data={data?.leetcode || null} loading={loading} />

           {/* Codeforces & CodeChef Cards Container */}
           <div className="col-span-1 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 w-full">
             <CodeforcesCard data={data?.codeforces || null} loading={loading} />
             <CodeChefCard data={data?.codechef || null} loading={loading} />
           </div>

        </div>

      </div>
    </section>
  );
}
