import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface NarrativeBarProps {
  totalSolved: number;
  totalContests: number;
  peakRating: number;
  leetcodePercentage: string; // e.g. "Top 30%"
}

function Counter({ value }: { value: number }) {
  const count = useSpring(0, { stiffness: 30, damping: 15 });
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    count.set(value);
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default function NarrativeBar({
  totalSolved,
  totalContests,
  peakRating,
  leetcodePercentage,
}: NarrativeBarProps) {
  const stats = [
    { label: "Problems Solved", value: totalSolved, suffix: "+" },
    { label: "Contests", value: totalContests, suffix: "+" },
    { label: "Peak Rating", value: peakRating, suffix: "" },
    { label: "LeetCode Status", value: null, text: leetcodePercentage, suffix: "" },
  ];

  return (
    <div className="flex justify-start w-full mb-16 px-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 w-full max-w-5xl">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            className="flex flex-col items-start justify-center text-left p-8 rounded-[2.5rem] bg-secondary/5 border border-border/5 hover:bg-secondary/10 transition-all duration-700 group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex flex-col items-start gap-1 mb-4">
              <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter text-foreground tabular-nums flex items-baseline gap-0.5">
                {stat.value !== null ? (
                  <>
                    <Counter value={stat.value} />
                    <span className="text-lg md:text-xl font-bold text-muted-foreground/30">{stat.suffix}</span>
                  </>
                ) : (
                  <span className="text-xl md:text-2xl lg:text-3xl">{stat.text}</span>
                )}
              </div>
              <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 mt-2">
                {stat.label}
              </span>
            </div>
            
            {/* Minimal accent line */}
            <div className="w-12 h-[2px] bg-foreground/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ scaleX: 0 }}
                 whileInView={{ scaleX: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, delay: 0.6 + i * 0.1, ease: "circOut" }}
                 className="h-full w-full bg-foreground/20 origin-left"
               />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
