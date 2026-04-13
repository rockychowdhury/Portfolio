import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Blog from "@/lib/db/models/Blog";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const platform = searchParams.get("platform");
    const tag = searchParams.get("tag");
    const limit = parseInt(searchParams.get("limit") || "100");
    const featuredOnly = searchParams.get("featured") === "true";

    let query: any = { is_approved: true };

    if (platform && platform !== "All") {
      query.platform = platform;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (featuredOnly) {
      query.is_featured = true;
    }

    const blogs = await Blog.find(query)
      .sort({ date_added: -1 })
      .limit(limit);

    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error("Blogs list fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
