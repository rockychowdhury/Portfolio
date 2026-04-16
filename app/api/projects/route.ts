import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Project from "@/lib/db/models/Project";
import "@/lib/db/models/Skill"; // Ensure Skill model is registered for population

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    console.log("[API] Connecting to database...");
    await connectDB();
    
    console.log("[API] Querying projects...");
    const projects = await Project.find({})
      .populate("skills")
      .sort({ order: 1 });
    
    console.log(`[API] Found ${projects.length} projects`);
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("[API] Error occurred:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

