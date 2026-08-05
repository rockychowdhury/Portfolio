/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, model, models } from "mongoose";
import type {
  ILeetCodeProfile,
  ICodeforcesProfile,
  ICodeChefProfile,
  IProblemSolvingGitHubProfile,
  IProblemSolvingProfile,
} from "@/types/problem-solving";

export type { ILeetCodeProfile, ICodeforcesProfile, ICodeChefProfile, IProblemSolvingProfile };
// Re-export with the original name for backward compatibility
export type { IProblemSolvingGitHubProfile as IGitHubProfile };

const ProblemSolvingSchema = new Schema<IProblemSolvingProfile>(
  {
    leetcode: {
      handle: { type: String, required: true },
      solved: {
        all: { type: Number, default: 0 },
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 },
      },
      totalActiveDays: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      contests: {
        attended: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        maxRating: { type: Number, default: 0 },
        globalRanking: { type: Number, default: 0 },
        topPercentage: { type: Number, default: 0 },
      },
      topTags: [{ type: String }],
      heatmap: { type: Schema.Types.Mixed, default: {} },
      ratingGraph: [{ type: Number }],
    },
    codeforces: {
      handle: { type: String, required: true },
      rating: { type: Number, default: 0 },
      maxRating: { type: Number, default: 0 },
      title: { type: String, default: 'Unrated' },
      totalContests: { type: Number, default: 0 },
      bestRank: { type: Number, default: null },
      totalSolved: { type: Number, default: 0 },
      ratingGraph: [{ type: Number }],
    },
    codechef: {
      handle: { type: String, required: true },
      rating: { type: Number, default: 0 },
      maxRating: { type: Number, default: 0 },
      stars: { type: Number, default: 1 },
      totalContests: { type: Number, default: 0 },
      totalSolved: { type: Number, default: 0 },
      ratingGraph: [{ type: Number }],
    },
    github: {
      handle: { type: String, required: true },
      repos: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },
      contributions: { type: Number, default: 0 },
      allTimeContributions: { type: Number, default: 0 },
      currentYearContributions: { type: Number, default: 0 },
      previousYearContributions: { type: Number, default: 0 },
      topLanguage: { type: String, default: "" },
      heatmap: { type: Schema.Types.Mixed, default: {} },
    },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// In development, delete the model from cache to force schema updates
if (process.env.NODE_ENV === "development") {
  delete (mongoose as any).models.ProblemSolvingProfile;
}

const ProblemSolvingProfile =
  models.ProblemSolvingProfile ||
  model<IProblemSolvingProfile>("ProblemSolvingProfile", ProblemSolvingSchema);

export default ProblemSolvingProfile;
