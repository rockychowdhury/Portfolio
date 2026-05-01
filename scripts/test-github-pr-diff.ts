import dotenv from "dotenv";
import { fetchWithTimeout } from "../lib/api/utils";

dotenv.config({ path: ".env.local" });

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

async function testPRDiff() {
  const username = process.env.GITHUB_USERNAME || "rockychowdhury";
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.error("ERROR: GITHUB_TOKEN is not set in .env.local");
    return;
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        authoredMerged: pullRequests(states: MERGED) { totalCount }
        contributionsCollection {
          totalPullRequestContributions
        }
      }
    }
  `;

  try {
    const res = await fetchWithTimeout(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { username } }),
      timeout: 10000,
    });

    const json = await res.json();
    if (json.data?.user) {
      console.log(`PR Stats for ${username}:`);
      console.log("Authored & Merged:", json.data.user.authoredMerged.totalCount);
      console.log("Total PR Contributions (Last 365d):", json.data.user.contributionsCollection.totalPullRequestContributions);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testPRDiff();
