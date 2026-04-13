import mongoose, { Schema, model, models } from "mongoose";

export interface ILeetCodeProfile {
  handle: string;
  solved: {
    all: number;
    easy: number;
    medium: number;
    hard: number;
  };
  totalActiveDays: number;
  longestStreak: number;
  contests: {
    attended: number;
    rating: number;
    maxRating: number;
    globalRanking: number;
    topPercentage: number;
  };
  topTags: string[];
  heatmap: { [timestamp: string]: number }; // Maps Unix timestamp to submission count
  ratingGraph: number[];
}

export interface ICodeforcesProfile {
  handle: string;
  rating: number;
  maxRating: number;
  title: string;
  totalContests: number;
  bestRank: number | null;
  totalSolved: number;
  ratingGraph: number[]; // Array of ratings across contest history
}

export interface ICodeChefProfile {
  handle: string;
  rating: number;
  maxRating: number;
  stars: number;
  totalContests: number;
  totalSolved: number;
  ratingGraph: number[]; // Array of ratings across contest history
}

export interface IGitHubProfile {
  handle: string;
  repos: number;
  followers: number;
  contributions: number;
  topLanguage: string;
  heatmap: { [date: string]: number }; // Maps YYYY-MM-DD to contribution count
}

export interface IProblemSolvingProfile {
  leetcode: ILeetCodeProfile;
  codeforces: ICodeforcesProfile;
  codechef: ICodeChefProfile;
  github: IGitHubProfile;
  lastUpdated: Date;
}

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
