import dotenv from "dotenv";
import { fetchGitHubStats } from "../lib/api/platforms/fetchers";

dotenv.config({ path: ".env.local" });

async function testFetch() {
  const username = process.env.GITHUB_USERNAME || "rockychowdhury";
  console.log(`Testing GitHub fetch for user: ${username}`);
  
  if (!process.env.GITHUB_TOKEN) {
    console.error("ERROR: GITHUB_TOKEN is not set in .env.local");
    return;
  }

  try {
    const stats = await fetchGitHubStats(username);
    if (stats) {
      console.log("Fetch Successful!");
      console.log("Metrics:", JSON.stringify(stats.metrics, null, 2));
      console.log("Last Updated:", stats.lastUpdated);
    } else {
      console.log("Fetch failed (returned null).");
    }
  } catch (error) {
    console.error("An error occurred during test fetch:", error);
  }
}

testFetch();
