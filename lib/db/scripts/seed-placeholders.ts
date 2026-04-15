import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import connectDB from "../connect";
import Skill from "../models/Skill";

const TARGETS: Record<string, number> = {
  frontend: 18,
  backend: 21,
  devops: 16,
};

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MONGODB_URI is not defined");

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding placeholders.");

    for (const [group, target] of Object.entries(TARGETS)) {
      const currentCount = await Skill.countDocuments({ group });
      const missing = target - currentCount;

      if (missing > 0) {
        console.log(`Adding ${missing} placeholders to ${group}...`);
        const placeholders = Array.from({ length: missing }, (_, i) => ({
          name: "TBA",
          icon: "Circle",
          icon_group: "lu",
          icon_type: "icon",
          description: "Learning and Improving",
          group,
          is_top_skill: false,
          order: 999, // Ensure they appear last
          color: "#808080", // Natural grey
        }));

        await Skill.insertMany(placeholders);
      } else {
        console.log(`${group} already has enough items (${currentCount}/${target}).`);
      }
    }

    console.log("Successfully seeded placeholders.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
