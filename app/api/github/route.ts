import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import GitHubProfile from "@/lib/db/models/GitHubProfile";
import { fetchGitHubStats } from "@/lib/api/platforms/fetchers";

export const revalidate = 0; // Dynamic route

const REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

export async function GET() {
  try {
    await connectDB();

    // 1. Get from MongoDB Cache
    const existingProfile = await GitHubProfile.findOne({});

    // 2. If no cache exists, MUST fetch and wait
    if (!existingProfile) {
      console.log("No GitHub profile found, performing initial fetch...");
      const newProfile = await performUpdate();
      return NextResponse.json(newProfile);
    }

    // 3. Check for staleness
    const now = Date.now();
    const lastUpdated = new Date(existingProfile.lastUpdated).getTime();
    if (now - lastUpdated > REFRESH_INTERVAL_MS) {
      console.log("GitHub profile is stale, triggering background refresh...");
      performUpdate(existingProfile).catch((err) =>
        console.error("Background GitHub refresh failed:", err)
      );
    }

    // 4. Return cached immediately
    return NextResponse.json(existingProfile);
  } catch (error) {
    console.error("[API] GitHub fetch failed:", error);
    return NextResponse.json(
      { error: "Internal server error during GitHub sync" },
      { status: 500 }
    );
  }
}

async function performUpdate(existingProfile?: unknown) {
  const data = await fetchGitHubStats(process.env.GITHUB_USERNAME || "rockychowdhury");

  // SUCCESS-ONLY UPDATE:
  // Only update if we actually got a response from the GitHub GraphQL API.
  if (!data) {
    console.warn("GitHub fetch failed. Skipping MongoDB update.");
    return existingProfile;
  }

  // Upsert into DB
  const doc = await GitHubProfile.findOneAndUpdate(
    {},
    { $set: data },
    { new: true, upsert: true }
  );

  console.log("GitHub MongoDB cache updated successfully.");
  return doc;
}
