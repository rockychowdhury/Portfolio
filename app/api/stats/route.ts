import { NextRequest, NextResponse } from "next/server";
import {
  getLeetCodeStats,
  getCodeforcesSolvedCount,
  getCodechefStats,
} from "@/lib/api/competitive";
import dbConnect from "@/lib/db/connect";
import Project from "@/lib/db/models/Project";
import StatsCache from "@/lib/db/models/StatsCache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const refresh = request.nextUrl.searchParams.get("refresh") === "true";

  try {
    await dbConnect();

    if (refresh) {
      // Fetch fresh data from all platforms in parallel
      const leetcodeUsername = process.env.LEETCODE_USERNAME || "";
      const codeforcesUsername = process.env.CODEFORCES_USERNAME || "";
      const codechefUsername = process.env.CODECHEF_USERNAME || "";

      const [leetcode, cfSolved, codechef, projectCount] = await Promise.all([
        getLeetCodeStats(leetcodeUsername),
        getCodeforcesSolvedCount(codeforcesUsername),
        getCodechefStats(codechefUsername),
        Project.countDocuments(),
      ]);

      const leetcodeSolved = leetcode?.totalSolved ?? 0;
      const codechefSolved =
        codechef?.fullyUniqueSourceCodeAcceptedProblems ??
        codechef?.problemsSolved ??
        0;
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

      // Upsert the singleton cache document
      await StatsCache.findOneAndUpdate({}, stats, {
        upsert: true,
        new: true,
      });

      return NextResponse.json(stats);
    }

    // Return cached data from MongoDB
    const cached = await StatsCache.findOne();
    if (cached) {
      return NextResponse.json({
        totalSolved: cached.totalSolved,
        projectCount: cached.projectCount,
        breakdown: cached.breakdown,
      });
    }

    // No cache yet — return sensible defaults
    return NextResponse.json({
      totalSolved: 0,
      projectCount: 0,
      breakdown: { leetcode: 0, codeforces: 0, codechef: 0 },
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { totalSolved: 0, projectCount: 0, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
