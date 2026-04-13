import { fetchGitHubStats } from "./lib/api/platforms/fetchers";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function test() {
    console.log("Testing GitHub Fetcher...");
    try {
        const stats = await fetchGitHubStats("rockychowdhury");
        if (stats) {
            console.log("SUCCESS: Fetched GitHub stats");
            console.log("Languages:", stats.languages.length);
            console.log("Metrics:", stats.metrics);
        } else {
            console.log("FAILURE: fetchGitHubStats returned null");
        }
    } catch (e) {
        console.error("ERROR during fetch:", e);
    }
    process.exit(0);
}

test();
