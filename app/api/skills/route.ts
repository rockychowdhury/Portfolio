import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Skill from "@/lib/db/models/Skill";

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  try {
    await dbConnect();
    const skills = await Skill.find().sort({ order: 1 }).lean();
    return NextResponse.json(skills);
  } catch (error) {
    console.error("Skills API error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
