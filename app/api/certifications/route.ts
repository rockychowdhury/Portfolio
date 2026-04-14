import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Certification from "@/lib/db/models/Certification";

export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();
    const certifications = await Certification.find().sort({ order: 1 }).lean();
    return NextResponse.json(certifications);
  } catch (error) {
    console.error("Certifications API error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
