import connectDB from '../connect';
import Blog from '../models/Blog';
import { IBlog } from '@/types/blog';

export async function getBlogs(): Promise<IBlog[]> {
  await connectDB();
  const blogs = await Blog.find().sort({ published_at: -1 }).lean();
  return JSON.parse(JSON.stringify(blogs));
}
