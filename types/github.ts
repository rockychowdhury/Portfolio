export interface IGitHubProfile {
  handle: string;
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
    repoCount?: number;
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
    sparkline?: number[];
  }[];
  lastUpdated: Date;
}
