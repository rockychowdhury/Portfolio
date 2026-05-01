import dotenv from "dotenv";
import { fetchWithTimeout } from "../lib/api/utils";

dotenv.config({ path: ".env.local" });

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

async function testPRSearch() {
  const username = process.env.GITHUB_USERNAME || "rockychowdhury";
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.error("ERROR: GITHUB_TOKEN is not set in .env.local");
    return;
  }

  const query = `
    query($searchQuery: String!) {
      search(query: $searchQuery, type: ISSUE, first: 0) {
        issueCount
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
      body: JSON.stringify({ query, variables: { searchQuery: `author:${username} type:pr is:merged` } }),
      timeout: 10000,
    });

    const json = await res.json();
    console.log(`Search result for merged PRs by ${username}:`, json.data?.search?.issueCount);
  } catch (error) {
    console.error("Error:", error);
  }
}

testPRSearch();
