import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Achievement from "@/lib/db/models/Achievement";

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  try {
    await dbConnect();
    const achievements = await Achievement.find({}).sort({ date_sortable: 1 }).lean();
    
    return NextResponse.json(achievements);
  } catch (error) {
    console.error("Error fetching journey achievements:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
