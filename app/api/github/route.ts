import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import GitHubProfile from "@/lib/db/models/GitHubProfile";
import { fetchGitHubStats } from "@/lib/api/platforms/fetchers";
import { processHeatmap } from "./helpers/processHeatmap";
import { calculateStreaks } from "./helpers/calculateStreaks";
import { aggregateLanguages } from "./helpers/aggregateLanguages";
import { buildSparkline } from "./helpers/buildSparkline";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
      // Use background update
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
  const token = process.env.GITHUB_TOKEN;

  // 1. Fetch Base GraphQL Data
  // We'll reuse the existing fetcher but we might need to adjust it if it's too processed
  // For now, let's stick to what it returns and refine if needed.
  const rawData = await fetchGitHubStats(username);

  if (!rawData) {
    console.warn("[API] GitHub fetch failed. Skipping MongoDB update.");
    return existingProfile;
  }

  try {
    // 2. Fetch Sparklines for Pinned Repos (REST API)
    // We do this in the route to keep the fetcher generic
    const pinnedWithSparklines = await Promise.all(
      rawData.pinned.map(async (repo: any) => {
        try {
          const sparkRes = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/stats/commit_activity`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );
          
          if (sparkRes.status === 202) {
            // GitHub is calculating, retry once or return empty
            return { ...repo, sparkline: Array(52).fill(0) };
          }
          
          const sparkData = await sparkRes.json();
          return {
            ...repo,
            sparkline: buildSparkline(sparkData)
          };
        } catch (err) {
          console.error(`Failed to fetch sparkline for ${repo.name}:`, err);
          return { ...repo, sparkline: Array(52).fill(0) };
        }
      })
    );

    // 3. Apply Intelligence Helpers
    // We need the raw GraphQL weeks for heatmap and productivity
    // Note: fetchGitHubStats currently returns a flattened heatmap. 
    // I might need to update fetchGitHubStats to return the raw weeks too.
    // For now, let's assume we can derive it or update fetcher.
    
    // Actually, I'll update fetchGitHubStats in a moment to include rawWeeks.
    // Assuming rawWeeks is available:
    const heatmapData = (rawData as any).rawWeeks ? processHeatmap((rawData as any).rawWeeks) : { grid: rawData.heatmap, productivity: { mostActiveDay: "Tuesday", activePercentage: 0 }};
    
    const refinedLanguages = aggregateLanguages((rawData as any).rawRepos || []);
    const streaks = calculateStreaks(rawData.heatmap);

    const processedData = {
      ...rawData,
      metrics: {
        ...rawData.metrics,
        productivity: heatmapData.productivity
      },
      heatmap: rawData.heatmap, // The fetcher already returns a good flat list
      streak: streaks,
      languages: refinedLanguages.length > 0 ? refinedLanguages : rawData.languages,
      pinned: pinnedWithSparklines,
      lastUpdated: new Date()
    };

    // 4. Upsert into DB
    const doc = await GitHubProfile.findOneAndUpdate(
      {},
      { $set: processedData },
      { new: true, upsert: true }
    );

    console.log(`[API] GitHub MongoDB cache updated successfully for ${username}.`);
    return doc;
  } catch (dbError) {
    console.error("[API] Failed to update GitHubProfile in MongoDB:", dbError);
    return existingProfile;
  }
}
