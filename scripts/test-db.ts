import dbConnect from "../lib/db/connect";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testConnection() {
  console.log("Attempting to connect to MongoDB...");
  console.log("URI:", process.env.MONGODB_URI?.replace(/:([^@]+)@/, ":****@")); // Mask password

  try {
    await dbConnect();
    console.log("✅ Successfully connected to MongoDB via Mongoose!");
    
    // Check connection state
    const admin = mongoose.connection.db?.admin();
    const result = await admin?.command({ ping: 1 });
    console.log("🏓 Ping result:", result);

  } catch (error) {
    console.error("❌ Connection failed:");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

testConnection();
