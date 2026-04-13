import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Testimonial from "@/lib/db/models/Testimonial";

export const revalidate = 0; // Fresh data is better for reviews

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch all approved testimonials
    const allApproved = await Testimonial.find({ is_approved: true })
      .sort({ approved_at: -1, submitted_at: -1 })
      .lean();

    return NextResponse.json(allApproved);
  } catch (error) {
    console.error("Testimonials list error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
