import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import SectionWrapper from "../SectionWrapper";
import NarrativeBar from "./NarrativeBar";
import LeetCodeCard from "./LeetCodeCard";
import CodeforcesCard from "./CodeforcesCard";
import CodeChefCard from "./CodeChefCard";
import { IProblemSolvingProfile } from "@/lib/db/models/ProblemSolvingProfile";

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

  return (
    <SectionWrapper id="problem-solving" className="relative min-h-screen w-full overflow-hidden bg-background py-24 px-6 md:px-12 lg:px-20 text-foreground">
      {/* ── Background & Guidelines ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="mx-auto h-full max-w-[1400px] border-x border-dashed border-border/10">
          <div className="absolute top-0 right-12 h-full w-px border-l border-dashed border-border/10 hidden lg:block" />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Section Headline */}
        <div className="mb-12 md:mb-24 lg:pl-16 text-left" ref={titleRef}>
          <div className="flex flex-col gap-2">
            <h2 className="flex flex-wrap items-end text-[4.5rem] font-medium leading-[1.1] tracking-tighter text-foreground sm:text-[6rem] md:text-[8rem] lg:text-[10rem]">
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
        <div className="lg:pl-16">
          <NarrativeBar 
            totalSolved={totalSolved} 
            totalContests={totalContests} 
            peakRating={peakRating} 
            leetcodePercentage="Top 30%" 
          />

          {/* Main Grid for Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
            {/* LeetCode Hero Card */}
            <LeetCodeCard data={data?.leetcode || null} loading={loading} />

            {/* Codeforces & CodeChef Cards Container */}
            <div className="col-span-1 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-12 w-full">
              <CodeforcesCard data={data?.codeforces || null} loading={loading} />
              <CodeChefCard data={data?.codechef || null} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
