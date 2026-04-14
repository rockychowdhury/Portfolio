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
    const lastUpdatedRaw = existingProfile.lastUpdated || existingProfile.updatedAt;
    const lastUpdated = new Date(lastUpdatedRaw).getTime();
    const isStale = now - lastUpdated > REFRESH_INTERVAL_MS;

    if (isStale) {
      console.log(`[API] GitHub profile is stale (${((now - lastUpdated) / 1000 / 60).toFixed(1)}m old), triggering background refresh...`);
      // Use background update but ensure errors are logged
      performUpdate(existingProfile).catch((err) =>
        console.error("[API] Background GitHub refresh failed:", err)
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

async function performUpdate(existingProfile?: any) {
  const username = process.env.GITHUB_USERNAME || "rockychowdhury";
  const data = await fetchGitHubStats(username);

  // SUCCESS-ONLY UPDATE:
  // Only update if we actually got a response from the GitHub GraphQL API.
  if (!data) {
    console.warn("[API] GitHub fetch failed. Skipping MongoDB update.");
    return existingProfile;
  }

  try {
    // Upsert into DB
    const doc = await GitHubProfile.findOneAndUpdate(
      {},
      { $set: data },
      { new: true, upsert: true }
    );

    console.log(`[API] GitHub MongoDB cache updated successfully for ${username}.`);
    return doc;
  } catch (dbError) {
    console.error("[API] Failed to update GitHubProfile in MongoDB:", dbError);
    return existingProfile;
  }
}
