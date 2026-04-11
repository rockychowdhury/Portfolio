import mongoose, { Schema, model, models } from "mongoose";

export interface IBlog {
  title: string;
  excerpt: string;
  content?: string;
  slug: string;
  image?: string;
  tags: string[];
  externalUrl?: string; // If blog is on Medium/Dev.to
  isInternal: boolean;
  publishedAt: Date;
  isFeatured: boolean;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    tags: [{ type: String }],
    externalUrl: { type: String },
    isInternal: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Blog = models.Blog || model<IBlog>("Blog", BlogSchema);

export default Blog;
