import dotenv from "dotenv";
import { fetchWithTimeout } from "../lib/api/utils";

dotenv.config({ path: ".env.local" });

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

async function testPRStates() {
  const username = process.env.GITHUB_USERNAME || "rockychowdhury";
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.error("ERROR: GITHUB_TOKEN is not set in .env.local");
    return;
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        merged: pullRequests(states: MERGED) { totalCount }
        open: pullRequests(states: OPEN) { totalCount }
        closed: pullRequests(states: CLOSED) { totalCount }
        all: pullRequests { totalCount }
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
      console.log("Merged:", json.data.user.merged.totalCount);
      console.log("Open:", json.data.user.open.totalCount);
      console.log("Closed:", json.data.user.closed.totalCount);
      console.log("Total (all states):", json.data.user.all.totalCount);
    } else {
      console.log("Failed to fetch data:", json.errors);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testPRStates();
