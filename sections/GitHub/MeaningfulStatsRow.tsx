"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface MeaningfulStatsRowProps {
  metrics: {
    repos: number;
    stars: number;
    commits: number;
    followers: number;
    prs: number;
    allTimeContributions: number;
    currentYearContributions: number;
    previousYearContributions: number;
    productivity?: {
      mostActiveDay: string;
      activePercentage: number;
    };
  };
  streak: {
    current: number;
    longest: number;
  };
  heatmap: { date: string; count: number }[];
}

function Counter({ value }: { value: number }) {
  const count = useSpring(0, { stiffness: 30, damping: 15 });
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    count.set(value);
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

/* 1. Activity Pulse (Fixed & Compact) */
function ActivityPulse({ data }: { data: number[] }) {
  const points = useMemo(() => {
    if (!data || data.length === 0) return "";
    const max = Math.max(...data, 1);
    const width = 140;
    const height = 16;
    const step = width / (data.length - 1);

    return data.map((val, i) => {
      const x = i * step;
      const y = height - (val / max) * height;
      return `${x},${y}`;
    }).join(" ");
  }, [data]);

  return (
    <div className="flex flex-col gap-1.5 mt-2 overflow-hidden">
      <svg viewBox="0 0 140 16" className="w-full h-4 overflow-visible" preserveAspectRatio="none">
        <motion.polyline
          points={points}
          fill="none"
          stroke="#39d353"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />
      </svg>
      <div className="flex items-center gap-1 opacity-60 transition-opacity hover:opacity-100">
        <span className="text-[9px] font-bold uppercase tracking-widest italic flex items-center gap-1 text-green-500/80">
          Annual Activity Momentum (12m)
        </span>
      </div>
    </div>
  );
}

/* 2. Weekly Velocity (Visual Gauge) */
function VelocityGauge({ current, target = 30 }: { current: number; target?: number }) {
  const percentage = Math.min(100, (current / target) * 100);
  return (
    <div className="flex flex-col gap-2 mt-2 pt-1">
      <div className="h-1.5 w-full bg-foreground/[0.03] rounded-full overflow-hidden border border-border/30">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="h-full bg-gradient-to-r from-emerald-500/40 to-emerald-400"
        />
      </div>
      <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-foreground/60 italic">
        <span>Year-over-Year Momentum</span>
        <span className="text-primary/60">{current}/{target}</span>
      </div>
    </div>
  );
}

/* 3. Merge Impact (Visual Dots) */
function MergeImpact({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-2.5 mt-2 pt-2">
      <div className="flex gap-1.5 flex-wrap">
        {[...Array(Math.min(count, 12))].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.05 }}
            className="w-1.5 h-1.5 rounded-full bg-blue-500/60 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
          />
        ))}
        {count > 12 && <span className="text-[9px] font-bold text-blue-500/60">+{count - 12}</span>}
      </div>
      <div className="text-[9px] font-bold uppercase tracking-widest text-foreground/60 italic">
        Collaborative Units
      </div>
    </div>
  );
}

/* 4. Resilience Track (Streaks) */
function ResilienceTrack({ current, longest }: { current: number; longest: number }) {
  const percentage = Math.min(100, (current / Math.max(longest, 1)) * 100);
  return (
    <div className="flex flex-col gap-2.5 mt-2 pt-1">
      <div className="relative h-2 w-full bg-foreground/[0.03] rounded-sm border border-border/30">
        <div className="absolute inset-0 flex items-center justify-between px-1">
          <div className="h-px w-full border-t border-dashed border-border/40" />
        </div>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="absolute top-0 left-0 h-full bg-orange-500/60 shadow-[0_0_12px_rgba(249,115,22,0.2)] rounded-sm"
        />
      </div>
      <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-foreground/60 italic">
        <span>Current vs Best Consistency</span>
      </div>
    </div>
  );
}

/* 5. Peak Histogram (Weekly Activity) */
function PeakHistogram({ heatmap }: { heatmap: { date: string; count: number }[] }) {
  const { dayData, dayLabels } = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
    heatmap.forEach(d => {
      counts[new Date(d.date).getDay()] += d.count;
    });
    const max = Math.max(...counts, 1);
    return {
      dayData: counts.map(c => ({ count: c, height: (c / max) * 100 })),
      dayLabels: ["S", "M", "T", "W", "T", "F", "S"]
    };
  }, [heatmap]);

  return (
    <div className="flex flex-col gap-2 mt-0 pt-1">
      <div className="flex items-end gap-1.5 h-10">
        {dayData.map((d, i) => (
          <div key={i} className="flex-grow flex flex-col items-center gap-1.5">
            <span className={`text-[8px] font-bold transition-all ${d.height === 100 ? 'text-primary' : 'text-foreground/40'}`}>
              {d.count}
            </span>
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${d.height}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 + i * 0.05 }}
              className={`w-full rounded-t-[1px] transition-colors ${d.height === 100 ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]' : 'bg-foreground/20'}`}
            />
            <span className={`text-[8px] font-bold ${d.height === 100 ? 'text-primary' : 'text-foreground/40'}`}>{dayLabels[i]}</span>
          </div>
        ))}
      </div>
      <div className="text-[9px] font-bold uppercase tracking-widest text-foreground/60 italic">
        Weekly Distribution (last 12m)
      </div>
    </div>
  );
}

export default function MeaningfulStatsRow({ metrics, streak, heatmap }: MeaningfulStatsRowProps) {
  const currentYear = new Date().getFullYear();
  const weeksElapsed = Math.max(1, Math.ceil((new Date().getTime() - new Date(currentYear, 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7)));
  const avgPerWeek = Math.round(metrics.currentYearContributions / weeksElapsed);

  const annualActivity = useMemo(() => {
    return heatmap.map(day => day.count);
  }, [heatmap]);

  const peakDayInfo = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    heatmap.forEach(d => {
      counts[new Date(d.date).getDay()] += d.count;
    });
    const maxCount = Math.max(...counts, 0);
    const dayIdx = counts.indexOf(maxCount);
    return { name: days[dayIdx], count: maxCount };
  }, [heatmap]);

  const stats = [
    {
      value: metrics.allTimeContributions,
      label: "Global Contributions",
      visual: <ActivityPulse data={annualActivity} />,
    },
    {
      value: metrics.currentYearContributions,
      label: `Annual Momentum (${currentYear})`,
      visual: <VelocityGauge current={metrics.currentYearContributions} target={metrics.previousYearContributions} />,
    },
    {
      value: metrics.prs,
      label: "Merged Pull Requests",
      visual: <MergeImpact count={metrics.prs} />,
    },
    {
      value: streak.current,
      label: "Persistence Streak",
      visual: <ResilienceTrack current={streak.current} longest={streak.longest} />,
      suffix: " days"
    },
    {
      isText: true,
      value: 0,
      textValue: peakDayInfo.name,
      textSuffix: "peak",
      label: "",
      visual: <PeakHistogram heatmap={heatmap} />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: idx * 0.1 }}
          className="flex flex-col gap-1.5"
        >
          <div className="text-3xl xs:text-4xl md:text-5xl font-medium tracking-tighter text-foreground leading-tight">
            {stat.isText ? (
              <div className="flex items-baseline gap-2">
                <span className="truncate">{stat.textValue}</span>
                {stat.textSuffix && (
                  <span className="text-sm xs:text-base md:text-lg font-light text-foreground/40 lowercase">{stat.textSuffix}</span>
                )}
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <Counter value={stat.value} />
                <span className="text-sm xs:text-base md:text-lg font-light text-foreground/40 lowercase">{stat.suffix}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {stat.label && (
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/50 italic">
                {stat.label}
              </span>
            )}
            {stat.visual}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
