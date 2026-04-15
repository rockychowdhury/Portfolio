/**
 * Reshapes GraphQL contribution data into a 2D [week][day] array.
 * Also calculates productivity stats (most active day).
 */
export function processHeatmap(weeks: any[]) {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayCounts: Record<string, number> = {
    Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0
  };
  
  let totalContributions = 0;
  let totalDaysWithContributions = 0;

  const processedWeeks = weeks.map((week: any) => {
    return week.contributionDays.map((day: any) => {
      const date = new Date(day.date);
      const dayName = dayNames[date.getUTCDay()];
      
      if (day.contributionCount > 0) {
        dayCounts[dayName] += day.contributionCount;
        totalContributions += day.contributionCount;
        totalDaysWithContributions++;
      }
      
      return {
        date: day.date,
        count: day.contributionCount,
        dayName: dayName
      };
    });
  });

  // Calculate Productivity
  let mostActiveDay = "Tuesday";
  let maxContributions = 0;
  
  Object.entries(dayCounts).forEach(([day, count]) => {
    if (count > maxContributions) {
      maxContributions = count;
      mostActiveDay = day;
    }
  });

  const activePercentage = totalContributions > 0 
    ? Math.round((maxContributions / totalContributions) * 100) 
    : 0;

  return {
    grid: processedWeeks, // 2D array [week][day]
    productivity: {
      mostActiveDay,
      activePercentage
    }
  };
}
