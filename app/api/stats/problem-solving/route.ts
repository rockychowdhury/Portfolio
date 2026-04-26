import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import ProblemSolvingProfile from "@/lib/db/models/ProblemSolvingProfile";
import {
  fetchLeetCodeProfile,
  fetchCodeforcesProfile,
  fetchCodeChefProfile,
  fetchGitHubStats,
} from "@/lib/api/platforms/fetchers";

export const revalidate = 0; // Dynamic route

const REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour cache

export async function GET() {
  try {
    await connectDB();

    // 1. Get from MongoDB
    const existingProfile = await ProblemSolvingProfile.findOne({});

    // 2. If no cache exists, MUST fetch and wait
    if (!existingProfile) {
      console.log("No profile found, performing initial fetch...");
      const newProfile = await performUpdate();
      return NextResponse.json(newProfile);
    }

    // 3. Check for staleness
    const now = Date.now();
    const lastUpdated = new Date(existingProfile.lastUpdated).getTime();
    const isStale = now - lastUpdated > REFRESH_INTERVAL_MS;

    if (isStale) {
      console.log("Profile is stale, updating from APIs...");
      // WAIT for the update to ensure the user gets fresh data and DB is synced
      const updatedProfile = await performUpdate(existingProfile);
      return NextResponse.json(updatedProfile);
    }

    // 4. Return cached one if fresh
    return NextResponse.json(existingProfile);
  } catch (error) {
    console.error("Problem solving stats API error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

async function performUpdate(existingProfile?: any) {
  // Parallel fetch from all platforms
  const [leetcode, codeforces, codechef, githubRaw] = await Promise.all([
    fetchLeetCodeProfile(process.env.LEETCODE_USERNAME || "Rocky20809"),
    fetchCodeforcesProfile(process.env.CODEFORCES_USERNAME || "__Cipher__"),
    fetchCodeChefProfile(process.env.CODECHEF_USERNAME || "rocky20809"),
    fetchGitHubStats(process.env.GITHUB_USERNAME || "rockychowdhury"),
  ]);

  // Transform GitHub data if successful
  let githubTransformed = null;
  if (githubRaw) {
    const githubHeatmap: Record<string, number> = {};
    githubRaw.heatmap.forEach((day: { date: string; count: number }) => {
      githubHeatmap[day.date] = day.count;
    });

    githubTransformed = {
      handle: githubRaw.handle,
      repos: githubRaw.metrics.repos,
      followers: githubRaw.metrics.followers,
      contributions: githubRaw.metrics.commits,
      allTimeContributions: githubRaw.metrics.allTimeContributions,
      currentYearContributions: githubRaw.metrics.currentYearContributions,
      previousYearContributions: githubRaw.metrics.previousYearContributions,
      topLanguage: githubRaw.languages[0]?.name || "",
      heatmap: githubHeatmap,
    };
  }

  // Merge logic: use new data if available, otherwise keep existing
  const profileData: any = {
    lastUpdated: new Date(),
  };

  if (leetcode) profileData.leetcode = leetcode;
  else if (existingProfile?.leetcode) profileData.leetcode = existingProfile.leetcode;

  if (codeforces) profileData.codeforces = codeforces;
  else if (existingProfile?.codeforces) profileData.codeforces = existingProfile.codeforces;

  if (codechef) profileData.codechef = codechef;
  else if (existingProfile?.codechef) profileData.codechef = existingProfile.codechef;

  if (githubTransformed) profileData.github = githubTransformed;
  else if (existingProfile?.github) profileData.github = existingProfile.github;

  // Final check: if we still don't have mandatory fields (like handles), we can't save.
  // This would only happen if it's the very first fetch and it fails.
  if (!profileData.leetcode || !profileData.codeforces || !profileData.codechef || !profileData.github) {
    console.warn("One or more platforms missing required data. Update might be incomplete.", {
      hasLeetcode: !!profileData.leetcode,
      hasCodeforces: !!profileData.codeforces,
      hasCodechef: !!profileData.codechef,
      hasGithub: !!profileData.github,
    });
    
    // If we have nothing at all, return existing
    if (!profileData.leetcode && !profileData.codeforces && !profileData.codechef && !profileData.github) {
        return existingProfile;
    }
  }

  // Upsert into DB
  const doc = await ProblemSolvingProfile.findOneAndUpdate(
    {},
    { $set: profileData },
    { new: true, upsert: true }
  );

  console.log("Problem Solving MongoDB cache updated successfully.");
  return doc;
}

