import { NextRequest, NextResponse, after } from "next/server";
import dbConnect from "@/lib/db/connect";
import Project from "@/lib/db/models/Project";
import StatsCache from "@/lib/db/models/StatsCache";
import {
  fetchLeetCodeProfile,
  fetchCodeforcesProfile,
  fetchCodeChefProfile,
} from "@/lib/api/platforms/fetchers";

// Always run on request so the `?refresh=true` branch is never served from
// Next.js's route cache; staleness is handled inside MongoDB (stale-while-revalidate).
export const dynamic = "force-dynamic";

const STALE_INTERVAL = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const refresh = request.nextUrl.searchParams.get("refresh") === "true";

  try {
    await dbConnect();

    // 1. Get cached
    const cached = await StatsCache.findOne();

    // 2. No cache yet — must block on the first fetch
    if (!cached) {
      const stats = await performUpdate();
      return NextResponse.json(stats);
    }

    const isStale = Date.now() - new Date(cached.updatedAt).getTime() > STALE_INTERVAL;

    // 3. Fresh and not forced — return cached immediately
    if (!isStale && !refresh) {
      return NextResponse.json(cached);
    }

    // 4. Stale or forced — return the cached doc now, refresh MongoDB in the
    //    background via after(), so the UI is never blocked on platform APIs.
    const response = NextResponse.json(cached);
    response.headers.set("x-refresh-scheduled", "1");
    after(async () => {
      try {
        await performUpdate();
      } catch (e) {
        console.error("Background Stats update failed:", e);
      }
    });
    return response;
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
