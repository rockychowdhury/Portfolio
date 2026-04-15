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
    { label: "Platforms", value: 3, suffix: "" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
      {stats.map((stat, i) => (
        <motion.div 
          key={i} 
          className="flex flex-col gap-1.5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
        >
          <div className="text-3xl md:text-5xl font-medium tracking-tighter text-foreground leading-tight flex items-baseline gap-1">
            {stat.value !== null ? (
              <>
                <Counter value={stat.value} />
                <span className="text-base md:text-lg font-light text-foreground/40 lowercase">{stat.suffix}</span>
              </>
            ) : (
              <span className="truncate">{stat.text}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/50 italic">
              {stat.label}
            </span>
            
            {/* Visual indicator line - matching GitHub metrics style */}
            <div className="h-[2px] w-full bg-foreground/[0.03] rounded-full overflow-hidden mt-2">
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: "40%" }}
                 viewport={{ once: true }}
                 transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                 className="h-full bg-foreground/10"
               />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
