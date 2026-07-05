import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import GitHubProfile from "@/lib/db/models/GitHubProfile";
import ProblemSolvingProfile from "@/lib/db/models/ProblemSolvingProfile";

export async function GET() {
  try {
    await connectDB();

    const githubDoc = await GitHubProfile.findOne({});
    const psDoc = await ProblemSolvingProfile.findOne({});

    return NextResponse.json({
      github: githubDoc?.handle || "",
      leetcode: psDoc?.leetcode?.handle || "",
      codeforces: psDoc?.codeforces?.handle || "",
      codechef: psDoc?.codechef?.handle || "",
    });
  } catch (error: any) {
    console.error("Error fetching stats config:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { github, leetcode, codeforces, codechef } = body;

    // Update GitHub Profile Handle
    if (github) {
      await GitHubProfile.findOneAndUpdate({}, { handle: github }, { upsert: true, new: true, setDefaultsOnInsert: true });
    }

    // Update Problem Solving Handles
    if (leetcode || codeforces || codechef || github) {
        // Because ProblemSolving schema has nested fields, we update handles directly
        const psUpdate: any = {};
        if (leetcode) psUpdate["leetcode.handle"] = leetcode;
        if (codeforces) psUpdate["codeforces.handle"] = codeforces;
        if (codechef) psUpdate["codechef.handle"] = codechef;
        if (github) psUpdate["github.handle"] = github;
        
        await ProblemSolvingProfile.findOneAndUpdate({}, { $set: psUpdate }, { upsert: true, new: true, setDefaultsOnInsert: true });
    }

    return NextResponse.json({ message: "Handles updated successfully. Note: Real stats will update on the next cron/background sync." });
  } catch (error: any) {
    console.error("Error updating stats config:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
