import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Models (Importing them ensures they are registered with Mongoose)
import Achievement from "../lib/db/models/Achievement";
import Blog from "../lib/db/models/Blog";
import Certification from "../lib/db/models/Certification";
import GitHubProfile from "../lib/db/models/GitHubProfile";
import Journey from "../lib/db/models/Journey";
import ProblemSolvingProfile from "../lib/db/models/ProblemSolvingProfile";
import Project from "../lib/db/models/Project";
import Skill from "../lib/db/models/Skill";
import StatsCache from "../lib/db/models/StatsCache";
import Testimonial from "../lib/db/models/Testimonial";

const OLD_URI = process.env.MONGODB_URI;
const NEW_URI = process.env.NEW_MONGODB_URI;

const collections = [
  { name: "Achievement", model: Achievement },
  { name: "Blog", model: Blog },
  { name: "Certification", model: Certification },
  { name: "GitHubProfile", model: GitHubProfile },
  { name: "Journey", model: Journey },
  { name: "ProblemSolvingProfile", model: ProblemSolvingProfile },
  { name: "Project", model: Project },
  { name: "Skill", model: Skill },
  { name: "StatsCache", model: StatsCache },
  { name: "Testimonial", model: Testimonial },
];

async function migrate() {
  if (!OLD_URI || !NEW_URI) {
    console.error("❌ MONGODB_URI or NEW_MONGODB_URI is missing in .env.local");
    process.exit(1);
  }

  try {
    // 1. Fetch data from OLD database
    console.log("🔗 Connecting to OLD database...");
    await mongoose.connect(OLD_URI);
    console.log("✅ Connected to OLD database");

    const backupData: Record<string, any[]> = {};
    for (const item of collections) {
      console.log(`📥 Fetching ${item.name}...`);
      backupData[item.name] = await item.model.find({}).lean();
      console.log(`   Found ${backupData[item.name].length} documents`);
    }

    await mongoose.disconnect();
    console.log("🔌 Disconnected from OLD database");

    // 2. Insert data into NEW database
    console.log("\n🔗 Connecting to NEW database...");
    await mongoose.connect(NEW_URI);
    console.log("✅ Connected to NEW database");

    for (const item of collections) {
      console.log(`📤 Migrating ${item.name}...`);
      const data = backupData[item.name];
      if (data && data.length > 0) {
        // Clear new DB first to avoid duplicates if re-running
        await item.model.deleteMany({});
        await item.model.insertMany(data);
        console.log(`   Migrated ${data.length} documents`);
      } else {
        console.log(`   No documents found for ${item.name}, skipping.`);
      }
    }

    await mongoose.disconnect();
    console.log("\n✨ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
