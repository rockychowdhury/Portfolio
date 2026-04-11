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
