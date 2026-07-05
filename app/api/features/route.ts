import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";

export const dynamic = "force-dynamic";
import { Feature } from "@/lib/db/models/Feature";

const DEFAULT_FEATURES = [
  { name: "Skills", componentId: "skills", order: 1, isActive: true },
  { name: "Projects", componentId: "projects", order: 2, isActive: true },
  { name: "Problem Solving", componentId: "problemsolving", order: 3, isActive: true },
  { name: "GitHub", componentId: "github", order: 4, isActive: true },
  { name: "Education", componentId: "education", order: 5, isActive: true },
  { name: "Blogs", componentId: "blogs", order: 6, isActive: true },
  { name: "Achievements", componentId: "achievements", order: 7, isActive: true },
  { name: "Journey", componentId: "journey", order: 8, isActive: true },
  { name: "Testimonials", componentId: "testimonials", order: 9, isActive: true },
  { name: "Contact", componentId: "contact", order: 10, isActive: true },
];

export async function GET() {
  try {
    await connectDB();

    let features = await Feature.find({}).sort({ order: 1 });

    // Seed if empty
    if (features.length === 0) {
      await Feature.insertMany(DEFAULT_FEATURES);
      features = await Feature.find({}).sort({ order: 1 });
    }

    // Deduplicate on the fly in case hot-reloading caused multiple seeds
    const seen = new Set();
    const uniqueFeatures = [];
    const duplicates = [];

    for (const f of features) {
      if (!seen.has(f.componentId)) {
        seen.add(f.componentId);
        uniqueFeatures.push(f);
      } else {
        duplicates.push(f._id);
      }
    }

    // Cleanup any duplicates in the background
    if (duplicates.length > 0) {
      await Feature.deleteMany({ _id: { $in: duplicates } }).catch(console.error);
    }

    return NextResponse.json(uniqueFeatures);
  } catch (error: any) {
    console.error("Error fetching features:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Support bulk update for reordering/toggling
    if (Array.isArray(body)) {
      const updates = body.map((feature) =>
        Feature.findByIdAndUpdate(feature._id, {
          order: feature.order,
          isActive: feature.isActive,
        })
      );
      await Promise.all(updates);
      return NextResponse.json({ message: "Features updated successfully" });
    }

    return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
  } catch (error: any) {
    console.error("Error updating features:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
