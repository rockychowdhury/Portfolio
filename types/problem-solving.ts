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
  heatmap: { [timestamp: string]: number };
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
  ratingGraph: number[];
}

export interface ICodeChefProfile {
  handle: string;
  rating: number;
  maxRating: number;
  stars: number;
  totalContests: number;
  totalSolved: number;
  ratingGraph: number[];
}

/**
 * GitHub profile as used in the ProblemSolving section.
 * This is a simplified view — the full GitHub section uses
 * IGitHubProfile from "@/types/github" instead.
 */
export interface IProblemSolvingGitHubProfile {
  handle: string;
  repos: number;
  followers: number;
  contributions: number;
  allTimeContributions: number;
  currentYearContributions: number;
  previousYearContributions: number;
  topLanguage: string;
  heatmap: { [date: string]: number };
}

export interface IProblemSolvingProfile {
  leetcode: ILeetCodeProfile;
  codeforces: ICodeforcesProfile;
  codechef: ICodeChefProfile;
  github: IProblemSolvingGitHubProfile;
  lastUpdated: Date;
}
