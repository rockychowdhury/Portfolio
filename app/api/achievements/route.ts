import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Achievement from "@/lib/db/models/Achievement";

export async function GET() {
  try {
    await dbConnect();
    
    const achievements = await Achievement.find({})
      .sort({ date_sortable: -1 }) // Newest first
      .lean();

    return NextResponse.json(achievements);
  } catch (error) {
    console.error("Failed to fetch achievements:", error);
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}
