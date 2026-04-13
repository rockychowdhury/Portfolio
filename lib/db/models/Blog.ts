import mongoose, { Schema, model, models } from "mongoose";

export interface IBlog {
  _id: string;
  title: string;
  subtitle: string;
  handle: string;
  platform: "LinkedIn" | "YouTube" | "Medium" | "Dev.to" | "Hashnode";
  thumbnail_url?: string;
  tags: string[];
  etr: number;
  is_featured: boolean;
  is_approved: boolean; // For manual review
  date_added: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    handle: { type: String, required: true },
    platform: { 
      type: String, 
      required: true, 
      enum: ["LinkedIn", "YouTube", "Medium", "Dev.to", "Hashnode"] 
    },
    thumbnail_url: { type: String },
    tags: [{ type: String }],
    etr: { type: Number, default: 5 },
    is_featured: { type: Boolean, default: false },
    is_approved: { type: Boolean, default: true },
    date_added: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Blog = models.Blog || model<IBlog>("Blog", BlogSchema);

export default Blog;
