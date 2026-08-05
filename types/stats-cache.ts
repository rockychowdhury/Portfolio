export interface IStatsCache {
  _id?: string;
  totalSolved: number;
  projectCount: number;
  breakdown: {
    leetcode: number;
    codeforces: number;
    codechef: number;
  };
}
