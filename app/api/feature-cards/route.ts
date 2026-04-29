import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import FeatureCard from "@/lib/db/models/FeatureCard";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    await connectDB();

    const featureCards = await FeatureCard.find({}).sort({ order: 1 });

    return NextResponse.json(featureCards);
  } catch (error: any) {
    console.error("[API] Feature cards error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
