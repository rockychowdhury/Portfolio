import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Project from "@/lib/db/models/Project";
import StatsCache from "@/lib/db/models/StatsCache";
import {
  fetchLeetCodeProfile,
  fetchCodeforcesProfile,
  fetchCodeChefProfile,
} from "@/lib/api/platforms/fetchers";

export const dynamic = "force-dynamic";

const STALE_INTERVAL = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const refresh = request.nextUrl.searchParams.get("refresh") === "true";

  try {
    await dbConnect();

    // 1. Get cached
    const cached = await StatsCache.findOne();
    const isStale = cached && Date.now() - new Date(cached.updatedAt).getTime() > STALE_INTERVAL;

    // 2. Immediate response if cached and not forced refresh
    if (cached && !refresh) {
      if (isStale) {
        // Trigger background refresh
        performUpdate().catch((e) => console.error("Background Stats update failed:", e));
      }
      return NextResponse.json(cached);
    }

    // 3. If forced refresh or no cache, perform update and wait
    const stats = await performUpdate();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { totalSolved: 0, projectCount: 0, error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function performUpdate() {
  const leetcodeUsername = process.env.LEETCODE_USERNAME || "Rocky20809";
  const codeforcesUsername = process.env.CODEFORCES_USERNAME || "__Cipher__";
  const codechefUsername = process.env.CODECHEF_USERNAME || "rocky20809";

  const [leetcode, codeforces, codechef, projectCount] = await Promise.all([
    fetchLeetCodeProfile(leetcodeUsername),
    fetchCodeforcesProfile(codeforcesUsername),
    fetchCodeChefProfile(codechefUsername),
    Project.countDocuments(),
  ]);

  // SUCCESS-ONLY UPDATE
  if (!leetcode || !codeforces || !codechef) {
    console.warn("One or more platform fetches failed for Stats update. Skipping DB write.");
    // Return last cache if available or defaults
    const lastCache = await StatsCache.findOne();
    if (lastCache) return lastCache;
    
    return {
      totalSolved: 0,
      projectCount,
      breakdown: { leetcode: 0, codeforces: 0, codechef: 0 },
    };
  }

  const leetcodeSolved = leetcode.solved.all;
  const cfSolved = codeforces.totalSolved;
  const codechefSolved = codechef.totalSolved;
  const totalSolved = leetcodeSolved + cfSolved + codechefSolved;

  const stats = {
    totalSolved,
    projectCount,
    breakdown: {
      leetcode: leetcodeSolved,
      codeforces: cfSolved,
      codechef: codechefSolved,
    },
  };

  const doc = await StatsCache.findOneAndUpdate({}, stats, {
    upsert: true,
    new: true,
  });

  return doc;
}
