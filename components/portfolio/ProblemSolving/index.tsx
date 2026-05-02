import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import SectionWrapper from "../SectionWrapper";
import PlatformCard from "./PlatformCard";
import NarrativeBar from "./NarrativeBar";
import { IProblemSolvingProfile } from "@/lib/db/models/ProblemSolvingProfile";
import { DotPattern } from "@/components/ui/BackgroundPatterns";

// Premium easing for sections
const premiumEase: [number, number, number, number] = [0.25, 0.4, 0.25, 1] as const;

const letterAnimation = {
  hidden: { opacity: 0, y: 80, rotateX: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: 0.1 + i * 0.05,
      ease: premiumEase,
    },
  }),
};

export default function ProblemSolvingSection() {
  const [data, setData] = useState<IProblemSolvingProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-10%" });

  useEffect(() => {
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

    fetchStats();
  }, []);

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

  const titleWords = "Algorithmic".split(" ");
  const thinkingWords = "Thinking".split("");

  // Helper for Codeforces Rank & Color
  const getCodeforcesRank = (rating: number) => {
    if (rating >= 3000) return { title: "Legendary Grandmaster", color: "#ff0000" };
    if (rating >= 2600) return { title: "International Grandmaster", color: "#ff0000" };
    if (rating >= 2400) return { title: "Grandmaster", color: "#ff0000" };
    if (rating >= 2300) return { title: "International Master", color: "#ff8c00" };
    if (rating >= 2100) return { title: "Master", color: "#ff8c00" };
    if (rating >= 1900) return { title: "Candidate Master", color: "#aa00aa" };
    if (rating >= 1600) return { title: "Expert", color: "#0000ff" };
    if (rating >= 1400) return { title: "Specialist", color: "#03a89e" };
    if (rating >= 1200) return { title: "Pupil", color: "#008000" };
    return { title: "Newbie", color: "#808080" };
  };

  const cfMaxRank = getCodeforcesRank(data?.codeforces?.maxRating || 0);

  return (
    <SectionWrapper id="problem-solving" className="relative min-h-screen w-full overflow-hidden bg-background py-24 text-foreground">
      <DotPattern />

      <div className="relative container-main">
        {/* Section Headline */}
        <div className="mb-12 md:mb-24 text-left" ref={titleRef}>
          <div className="flex flex-col gap-2">
            <h2 className="flex flex-wrap items-end text-[clamp(3.5rem,10vw,8.5rem)] font-medium leading-[1.1] tracking-tighter text-foreground">
              {titleWords.map((word, wordIdx) => (
                <div key={wordIdx} className="flex overflow-hidden mr-4 pb-4 -mb-4">
                  {word.split("").map((letter, i) => (
                    <motion.span
                      key={i}
                      custom={i + (wordIdx * 5)}
                      variants={letterAnimation}
                      initial="hidden"
                      animate={isTitleInView ? "visible" : "hidden"}
                      className="inline-block origin-bottom"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
              ))}
              <div className="flex overflow-hidden pb-4 -mb-4">
                {thinkingWords.map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i + 15}
                    variants={letterAnimation}
                    initial="hidden"
                    animate={isTitleInView ? "visible" : "hidden"}
                    className="inline-block origin-bottom text-muted-foreground/20"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isTitleInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.8, ease: premiumEase }}
            className="mt-12 flex items-center gap-4"
          >
            <div className="h-px w-8 bg-foreground/40" />
            <p className="text-xs md:text-sm font-medium italic tracking-[0.1em] text-muted-foreground/40">
              {loading
                ? "Synchronizing Live Telemetry..."
                : `${totalSolved} problems solved · ${totalContests} contests · Max Rating: ${peakRating}`}
            </p>
          </motion.div>
        </div>

        {/* Narrative Stats Bar */}
        <div className="mb-16">
          <NarrativeBar 
            totalSolved={totalSolved} 
            totalContests={totalContests} 
            peakRating={peakRating} 
            leetcodePercentage={data?.leetcode?.contests?.topPercentage ? `Top ${data.leetcode.contests.topPercentage}%` : "Top 30%"} 
          />
        </div>

        {/* Main Grid for Cards - Premium 3-Column Layout */}
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
            {/* LeetCode Card */}
            <PlatformCard 
              name="LeetCode"
              username={data?.leetcode?.handle || "Loading..."}
              iconPath="/assets/problemsolving/lettcode.png"
              rankDisplay={data?.leetcode?.contests?.globalRanking ? `#${data.leetcode.contests.globalRanking.toLocaleString()}` : "Ranked"}
              maxRating={data?.leetcode?.contests?.maxRating || 0}
              solveCount={data?.leetcode?.solved?.all || 0}
              contestCount={data?.leetcode?.contests?.attended || 0}
              ratingGraph={data?.leetcode?.ratingGraph || []}
              color="#ffa116"
              profileUrl={`https://leetcode.com/${data?.leetcode?.handle || ""}`}
              loading={loading}
              solvedStats={{
                easy: data?.leetcode?.solved?.easy || 0,
                medium: data?.leetcode?.solved?.medium || 0,
                hard: data?.leetcode?.solved?.hard || 0,
              }}
              percentageDisplay={data?.leetcode?.contests?.topPercentage ? `Top ${data.leetcode.contests.topPercentage}%` : undefined}
            />

            {/* Codeforces Card */}
            <PlatformCard 
              name="Codeforces"
              username={data?.codeforces?.handle || "Loading..."}
              iconPath="/assets/problemsolving/codeforces.png"
              rankDisplay={cfMaxRank.title}
              maxRating={data?.codeforces?.maxRating || 0}
              solveCount={data?.codeforces?.totalSolved || 0}
              contestCount={data?.codeforces?.totalContests || 0}
              ratingGraph={data?.codeforces?.ratingGraph || []}
              color={cfMaxRank.color}
              profileUrl={`https://codeforces.com/profile/${data?.codeforces?.handle || ""}`}
              loading={loading}
            />

            {/* CodeChef Card */}
            <PlatformCard 
              name="CodeChef"
              username={data?.codechef?.handle || "Loading..."}
              iconPath="/assets/problemsolving/codechef.png"
              rankDisplay={data?.codechef?.stars ? `${data.codechef.stars}★ Division` : "Star Participant"}
              maxRating={data?.codechef?.maxRating || 0}
              solveCount={data?.codechef?.totalSolved || 0}
              contestCount={data?.codechef?.totalContests || 0}
              ratingGraph={data?.codechef?.ratingGraph || []}
              color="#008000" // Green as requested (matching Pupil)
              profileUrl={`https://www.codechef.com/users/${data?.codechef?.handle || ""}`}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
