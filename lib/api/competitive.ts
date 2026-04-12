export async function getLeetCodeStats(username: string) {
  try {
    const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
    if (!res.ok) throw new Error("LeetCode stats fetch failed");
    return await res.json();
  } catch (error) {
    console.error("LeetCode fetch error:", error);
    return null;
  }
}

export async function getCodeforcesStats(username: string) {
  try {
    const res = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    if (!res.ok) throw new Error("Codeforces stats fetch failed");
    const data = await res.json();
    return data.status === "OK" ? data.result[0] : null;
  } catch (error) {
    console.error("Codeforces fetch error:", error);
    return null;
  }
}

export async function getCodeforcesSolvedCount(username: string): Promise<number> {
  try {
    const res = await fetch(
      `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`
    );
    if (!res.ok) throw new Error("Codeforces submissions fetch failed");
    const data = await res.json();
    if (data.status !== "OK") return 0;

    // Count unique problems with verdict "OK"
    const solvedSet = new Set<string>();
    for (const sub of data.result) {
      if (sub.verdict === "OK") {
        solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
      }
    }
    return solvedSet.size;
  } catch (error) {
    console.error("Codeforces solved count error:", error);
    return 0;
  }
}

export async function getCodechefStats(username: string) {
  try {
    // Using a community-maintained wrapper
    const res = await fetch(`https://codechef-api.vercel.app/${username}`);
    if (!res.ok) throw new Error("Codechef stats fetch failed");
    return await res.json();
  } catch (error) {
    console.error("Codechef fetch error:", error);
    return null;
  }
}
