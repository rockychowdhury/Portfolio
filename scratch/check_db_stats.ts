import mongoose from "mongoose";
import dotenv from "dotenv";
import GitHubProfile from "../lib/db/models/GitHubProfile";
import ProblemSolvingProfile from "../lib/db/models/ProblemSolvingProfile";

dotenv.config({ path: ".env.local" });

async function checkDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const githubProfile = await GitHubProfile.findOne({});
    if (githubProfile) {
      console.log("--- GitHubProfile ---");
      console.log("Handle:", githubProfile.handle);
      console.log("Last Updated:", githubProfile.lastUpdated);
      console.log("Updated At:", githubProfile.updatedAt);
      console.log("Metrics:", JSON.stringify(githubProfile.metrics));
    } else {
      console.log("No GitHubProfile found");
    }

    const psProfile = await ProblemSolvingProfile.findOne({});
    if (psProfile) {
      console.log("\n--- ProblemSolvingProfile ---");
      console.log("Last Updated:", psProfile.lastUpdated);
      console.log("GitHub Handle:", psProfile.github?.handle);
      console.log("GitHub Repos:", psProfile.github?.repos);
      console.log("GitHub Contributions:", psProfile.github?.contributions);
    } else {
      console.log("No ProblemSolvingProfile found");
    }

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkDB();
