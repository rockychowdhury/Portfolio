import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Project from "@/lib/db/models/Project";
import Skill from "@/lib/db/models/Skill";
import Blog from "@/lib/db/models/Blog";
import Testimonial from "@/lib/db/models/Testimonial";
import Achievement from "@/lib/db/models/Achievement";
import Journey from "@/lib/db/models/Journey";
import Certification from "@/lib/db/models/Certification";

const models: Record<string, any> = {
  projects: Project,
  skills: Skill,
  blogs: Blog,
  testimonials: Testimonial,
  achievements: Achievement,
  journey: Journey,
  certifications: Certification,
};

export async function DELETE(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  try {
    await connectDB();
    const { collection } = await params;
    const model = models[collection];
    if (!model) return NextResponse.json({ error: "Invalid collection" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await model.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  try {
    await connectDB();
    const { collection } = await params;
    const model = models[collection];
    if (!model) return NextResponse.json({ error: "Invalid collection" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const body = await req.json();
    const updated = await model.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
