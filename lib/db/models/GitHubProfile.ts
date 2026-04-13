import { Schema, model, models } from "mongoose";

export interface IGitHubProfile {
  handle: string;
  metrics: {
    repos: number;
    stars: number;
    commits: number;
    followers: number;
    prs: number;
  };
  heatmap: {
    date: string;
    count: number;
  }[];
  streak: {
    current: number;
    longest: number;
  };
  languages: {
    name: string;
    color: string;
    size: number;
    percentage: number;
  }[];
  pinned: {
    name: string;
    description: string;
    url: string;
    stars: number;
    forks: number;
    language: { name: string; color: string } | null;
    topics: string[];
    pushedAt: string;
  }[];
  lastUpdated: Date;
}

const GitHubProfileSchema = new Schema<IGitHubProfile>(
  {
    handle: { type: String, required: true },
    metrics: {
      repos: { type: Number, default: 0 },
      stars: { type: Number, default: 0 },
      commits: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },
      prs: { type: Number, default: 0 },
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
      },
    ],
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const GitHubProfile =
  models.GitHubProfile || model<IGitHubProfile>("GitHubProfile", GitHubProfileSchema);

export default GitHubProfile;
