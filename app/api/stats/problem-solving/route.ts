import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import ProblemSolvingProfile from "@/lib/db/models/ProblemSolvingProfile";
import {
  fetchLeetCodeProfile,
  fetchCodeforcesProfile,
  fetchCodeChefProfile,
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
      console.log("Profile is stale, triggering background refresh...");
      // DO NOT await this. Let it run in the background.
      performUpdate(existingProfile).catch((err) =>
        console.error("Background ProblemSolving refresh failed:", err)
      );
    }

    // 4. Always return the cached one immediately
    return NextResponse.json(existingProfile);
  } catch (error) {
    console.error("Problem solving stats API error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

async function performUpdate(existingProfile?: unknown) {
  // Parallel fetch from all platforms
  const [leetcode, codeforces, codechef] = await Promise.all([
    fetchLeetCodeProfile(process.env.LEETCODE_USERNAME || "Rocky20809"),
    fetchCodeforcesProfile(process.env.CODEFORCES_USERNAME || "__Cipher__"),
    fetchCodeChefProfile(process.env.CODECHEF_USERNAME || "rocky20809"),
  ]);

  // SUCCESS-ONLY UPDATE:
  // We only update MongoDB if we got valid responses from ALL major platforms.
  // This prevents "zeroing out" the profile if an API flakes.
  
  if (!leetcode || !codeforces || !codechef) {
    console.warn("One or more platforms failed to fetch. Skipping MongoDB update.", {
      leetcode: !!leetcode,
      codeforces: !!codeforces,
      codechef: !!codechef,
    });
    // Return old profile if we have it, so the UI still has data
    return existingProfile;
  }

  const profileData = {
    leetcode,
    codeforces,
    codechef,
    github: existingProfile?.github || {
        handle: process.env.GITHUB_USERNAME,
        repos: 0, followers: 0, contributions: 0, topLanguage: '', heatmap: {}
    },
    lastUpdated: new Date(),
  };

  // Upsert into DB
  const doc = await ProblemSolvingProfile.findOneAndUpdate(
    {},
    { $set: profileData },
    { new: true, upsert: true }
  );

  console.log("Problem Solving MongoDB cache updated successfully.");
  return doc;
}
