import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Project from "@/lib/db/models/Project";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ order: 1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("[API] Projects fetch failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
