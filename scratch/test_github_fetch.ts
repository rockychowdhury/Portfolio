import { fetchGitHubStats } from "./lib/api/platforms/fetchers";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

async function testFetch() {
  const username = process.env.GITHUB_USERNAME || "rockychowdhury";
  console.log(`Testing fetch for username: ${username}`);
  console.log(`Token present: ${!!process.env.GITHUB_TOKEN}`);

  const data = await fetchGitHubStats(username);
  if (data) {
    console.log("Fetch successful!");
    console.log("Metrics:", data.metrics);
    console.log("Last Updated:", data.lastUpdated);
  } else {
    console.log("Fetch failed (returned null).");
  }
}

testFetch();
