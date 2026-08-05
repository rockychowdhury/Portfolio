import { Schema, model, models } from "mongoose";
import type { IGitHubProfile } from "@/types/github";

export type { IGitHubProfile };

const GitHubProfileSchema = new Schema<IGitHubProfile>(
  {
    handle: { type: String, required: true },
    metrics: {
      repos: { type: Number, default: 0 },
      stars: { type: Number, default: 0 },
      commits: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },
      prs: { type: Number, default: 0 },
      allTimeContributions: { type: Number, default: 0 },
      currentYearContributions: { type: Number, default: 0 },
      previousYearContributions: { type: Number, default: 0 },
      productivity: {
        mostActiveDay: { type: String, default: "Monday" },
        activePercentage: { type: Number, default: 0 },
      },
    },
    heatmap: [
      {
        date: { type: String },
        count: { type: Number },
      },
    ],
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
    },
    languages: [
      {
        name: { type: String },
        color: { type: String },
        size: { type: Number },
        percentage: { type: Number },
        repoCount: { type: Number, default: 0 },
      },
    ],
    pinned: [
      {
        name: { type: String },
        description: { type: String },
        url: { type: String },
        stars: { type: Number },
        forks: { type: Number },
        language: {
          name: { type: String },
          color: { type: String },
        },
        topics: [String],
        pushedAt: { type: String },
        sparkline: [Number],
      },
    ],
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const GitHubProfile =
  models.GitHubProfile || model<IGitHubProfile>("GitHubProfile", GitHubProfileSchema);

export default GitHubProfile;
