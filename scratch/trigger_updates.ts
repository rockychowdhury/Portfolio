import mongoose from "mongoose";
import dotenv from "dotenv";

// We need to set some env vars before importing the logic
dotenv.config({ path: ".env.local" });

// Dummy request/response for performUpdate if needed, but they are internally self-contained in our new logic
// Actually, performUpdate in our API files are not exported.
// So I will just copy the logic or modify the API file to export it temporarily.
// Or better, I can just simulate the same logic here using the updated fetchers.

import { fetchGitHubStats } from "../lib/api/platforms/fetchers";
import GitHubProfile from "../lib/db/models/GitHubProfile";
import ProblemSolvingProfile from "../lib/db/models/ProblemSolvingProfile";

async function triggerUpdates() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error("MONGODB_URI missing");

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB for update trigger");

  const username = process.env.GITHUB_USERNAME || "rockychowdhury";
  console.log(`Triggering update for ${username}...`);

  const githubRaw = await fetchGitHubStats(username);
  if (!githubRaw) {
    console.error("Fetch failed!");
    return;
  }

  // 1. Update GitHubProfile
  await GitHubProfile.findOneAndUpdate(
    {},
    { $set: githubRaw },
    { new: true, upsert: true }
  );
  console.log("GitHubProfile updated.");
  console.log("All-time Contributions:", githubRaw.metrics.allTimeContributions);
  console.log("Current Year Contributions:", githubRaw.metrics.currentYearContributions);
  console.log("Previous Year Contributions:", githubRaw.metrics.previousYearContributions);

  // 2. Update ProblemSolvingProfile
  const githubHeatmap: Record<string, number> = {};
  githubRaw.heatmap.forEach((day: { date: string; count: number }) => {
    githubHeatmap[day.date] = day.count;
  });

  const githubTransformed = {
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

  await ProblemSolvingProfile.findOneAndUpdate(
    {},
    { $set: { github: githubTransformed, lastUpdated: new Date() } },
    { new: true, upsert: true }
  );
  console.log("ProblemSolvingProfile updated with transformed GitHub stats.");

  await mongoose.connection.close();
}

triggerUpdates().catch(console.error);
