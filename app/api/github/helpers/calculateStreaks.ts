/**
 * Derives current and peak streaks from historical heatmap data.
 * @param heatmap Array of { date: string, count: number }
 */
export function calculateStreaks(heatmap: { date: string; count: number }[]) {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Walk all-time data to find longest streak
  heatmap.forEach((day) => {
    if (day.count > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });

  // Walk backward from today to find current streak
  // We start from the last item in the heatmap
  for (let i = heatmap.length - 1; i >= 0; i--) {
    if (heatmap[i].count > 0) {
      currentStreak++;
    } else {
      // If today has 0, we check if yesterday had a streak
      // If today is the last index and it's 0, current streak might be active if it's only 1 day gap
      // But standard GitHub logic says current streak breaks on first 0.
      if (i === heatmap.length - 1) continue; // Skip today if it's 0 to check previous run? 
      // Actually GitHub current streak ends if today is 0 and it's late in the day.
      // We'll be literal: current streak is consecutive active days ending at the last active day close to today.
      break;
    }
  }

  return { current: currentStreak, longest: longestStreak };
}
