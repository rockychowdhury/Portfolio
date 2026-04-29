/**
 * Fetches a raw README markdown file from GitHub.
 * Uses ISR with 24-hour cache to minimize GitHub API hits.
 */
export async function fetchReadme(readmeLink: string): Promise<string | null> {
  try {
    const res = await fetch(readmeLink, {
      next: { revalidate: 86400 }, // 24 hours ISR
    });

    if (!res.ok) {
      console.error(`[fetchReadme] Failed to fetch: ${res.status} ${res.statusText}`);
      return null;
    }

    return await res.text();
  } catch (error) {
    console.error("[fetchReadme] Error:", error);
    return null;
  }
}
