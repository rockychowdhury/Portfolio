import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Certification from "@/lib/db/models/Certification";

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    
    await dbConnect();

    let query = Certification.find().sort({ order: 1 });

    if (limitParam && limitParam !== "all") {
      const limit = parseInt(limitParam);
      if (!isNaN(limit)) {
        query = query.limit(limit);
      }
    }

    const education = await query.lean();
    return NextResponse.json(education);
  } catch (error) {
    console.error("Education API error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
