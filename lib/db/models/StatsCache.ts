import mongoose, { Schema, model, models } from "mongoose";
import type { IStatsCache } from "@/types/stats-cache";

export type { IStatsCache };

const StatsCacheSchema = new Schema<IStatsCache>(
  {
    totalSolved: { type: Number, default: 0 },
    projectCount: { type: Number, default: 0 },
    breakdown: {
      leetcode: { type: Number, default: 0 },
      codeforces: { type: Number, default: 0 },
      codechef: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Singleton document — only one stats cache entry
const StatsCache =
  models.StatsCache || model<IStatsCache>("StatsCache", StatsCacheSchema);

export default StatsCache;
