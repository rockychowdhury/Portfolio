/**
 * Aggregates byte counts and repo counts across repositories.
 */
export function aggregateLanguages(repos: any[]) {
  const langMap: Record<string, { size: number; color: string; repoCount: number }> = {};
  let totalBytes = 0;

  repos.forEach((repo: any) => {
    if (!repo.languages?.edges) return;

    repo.languages.edges.forEach((edge: any) => {
      const name = edge.node.name;
      const color = edge.node.color;
      const size = edge.size;

      if (!langMap[name]) {
        langMap[name] = { size: 0, color, repoCount: 0 };
      }

      langMap[name].size += size;
      langMap[name].repoCount += 1;
      totalBytes += size;
    });
  });

  const languages = Object.entries(langMap)
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 8) // Get top 8
    .map(([name, data]) => ({
      name,
      color: data.color,
      size: data.size,
      repoCount: data.repoCount,
      percentage: totalBytes > 0 ? Math.round((data.size / totalBytes) * 100) : 0,
    }));

  return languages;
}
