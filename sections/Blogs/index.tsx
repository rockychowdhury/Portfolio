import { getBlogs } from "@/lib/db/data/blogs";
import BlogsClient from "./BlogsClient";

export default async function BlogsSection() {
  const blogs = await getBlogs();
  const featuredBlogs = blogs.filter(b => b.is_featured === true);
  return <BlogsClient initialData={featuredBlogs} />;
}
