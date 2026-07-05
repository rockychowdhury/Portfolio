import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Project from "@/lib/db/models/Project";
import Skill from "@/lib/db/models/Skill";
import Blog from "@/lib/db/models/Blog";
import Testimonial from "@/lib/db/models/Testimonial";

const models: Record<string, any> = {
  projects: Project,
  skills: Skill,
  blogs: Blog,
  testimonials: Testimonial,
};

export async function GET(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  try {
    await connectDB();
    const { collection } = await params;
    const model = models[collection];
    if (!model) return NextResponse.json({ error: "Invalid collection" }, { status: 400 });

    const data = await model.find({}).sort({ createdAt: -1 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  try {
    await connectDB();
    const { collection } = await params;
    const model = models[collection];
    if (!model) return NextResponse.json({ error: "Invalid collection" }, { status: 400 });

    const body = await req.json();
    const newItem = await model.create(body);
    return NextResponse.json(newItem);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
