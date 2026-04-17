import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Journey from "@/lib/db/models/Journey";

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  try {
    await dbConnect();
    const journey = await Journey.find({}).sort({ startDate: -1 }).lean();
    
    return NextResponse.json(journey);
  } catch (error) {
    console.error("Error fetching journey data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
