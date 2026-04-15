/**
 * Formats weekly commit activity stats into a numeric array.
 * @param stats Array of { weeks: { days: number[], total: number, week: number }[] }
 */
export function buildSparkline(stats: any) {
  if (!Array.isArray(stats)) return Array(52).fill(0);

  // GitHub commit_activity returns 52 weeks
  // We want a simple array of total commits per week
  return stats.map((weekData: any) => weekData.total || 0);
}
