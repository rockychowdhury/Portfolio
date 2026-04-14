import dbConnect from "../lib/db/connect";
import GitHubProfile from "../lib/db/models/GitHubProfile";

async function check() {
  await dbConnect();
  const profile = await GitHubProfile.findOne({});
  if (profile) {
    console.log("GitHub Profile found:");
    console.log("Handle:", profile.handle);
    console.log("Last Updated:", profile.lastUpdated);
    console.log("Updated At (timestamp):", profile.updatedAt);
    console.log("Metrics:", profile.metrics);
  } else {
    console.log("No GitHub Profile found in database.");
  }
  process.exit(0);
}

check();
