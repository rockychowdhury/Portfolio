import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import connectDB from "../connect";
import Blog from "../models/Blog";

const seedBlogs = [
  {
    title: "Mastering Real-Time Queue Systems with Redis and FastAPI",
    subtitle: "A deep dive into building scalable message brokers for modern backend architectures.",
    handle: "https://medium.com/@rocky/redis-fastapi-queues",
    platform: "Medium",
    thumbnail_url: "https://i.ibb.co.com/TDPhggjC/p12.jpg",
    tags: ["FastAPI", "Redis", "Backend"],
    etr: 8,
    is_featured: true,
    is_approved: true,
    date_added: new Date("2025-01-15"),
  },
  {
    title: "The most underrated skill in backend development is knowing when NOT to add a new service.",
    subtitle: "Complexity is a debt that many engineers pay for too early. Let's talk about monolithic vs microservices pragmatism.",
    handle: "https://www.linkedin.com/posts/rocky-chowdhury-backend-monolith",
    platform: "LinkedIn",
    thumbnail_url: "https://i.ibb.co.com/Qk24w8f/istockphoto-1610418898-2048x2048.jpg",
    tags: ["Engineering", "Architecture"],
    etr: 3,
    is_featured: true,
    is_approved: true,
    date_added: new Date("2025-01-20"),
  },
  {
    title: "Building a Distributed Task Scheduler From Scratch",
    subtitle: "How to handle concurrency, retries, and dead-letter queues in a distributed environment.",
    handle: "https://www.youtube.com/watch?v=distributed-scheduler",
    platform: "YouTube",
    thumbnail_url: "https://i.ibb.co.com/bh9X2y0/p11.jpg",
    tags: ["System Design", "Python"],
    etr: 12,
    is_featured: true,
    is_approved: true,
    date_added: new Date("2025-02-01"),
  },
  {
    title: "Understanding FastAPI Dependency Injection",
    subtitle: "A concise breakdown of how DI works in FastAPI and why it matters for clean, testable code.",
    handle: "https://dev.to/rocky/fastapi-di",
    platform: "Dev.to",
    thumbnail_url: "https://i.ibb.co.com/S4KX8Dh4/p10.jpg",
    tags: ["FastAPI", "Clean Code"],
    etr: 5,
    is_featured: false,
    is_approved: true,
    date_added: new Date("2025-02-10"),
  },
  {
    title: "Advanced SQL Optimization for Postgres",
    subtitle: "Indexes, query planning, and performance tuning for high-traffic applications.",
    handle: "https://hashnode.com/rocky/postgres-scaling",
    platform: "Hashnode",
    thumbnail_url: "https://i.ibb.co.com/1t7ndmsp/p9.jpg",
    tags: ["Postgres", "SQL", "Database"],
    etr: 10,
    is_featured: false,
    is_approved: true,
    date_added: new Date("2025-02-15"),
  },
  {
    title: "Why your API response time is slow (and how to fix it).",
    subtitle: "Common bottlenecks in Python backends and the profiling tools you need to find them.",
    handle: "https://www.linkedin.com/posts/rocky-api-performance",
    platform: "LinkedIn",
    thumbnail_url: "https://i.ibb.co.com/F4W11C65/p4.jpg",
    tags: ["Performance", "Python"],
    etr: 4,
    is_featured: false,
    is_approved: true,
    date_added: new Date("2025-02-20"),
  },
  {
    title: "Dynamic Programming: Zero to Hero",
    subtitle: "Breaking down the hardest DSA topic into manageable patterns.",
    handle: "https://www.youtube.com/watch?v=dp-zero-to-hero",
    platform: "YouTube",
    thumbnail_url: "https://i.ibb.co.com/gMLWJQn2/p3.jpg",
    tags: ["DSA", "Tutorial"],
    etr: 45,
    is_featured: true,
    is_approved: true,
    date_added: new Date("2025-03-01"),
  },
  {
    title: "Clean Code is not just about formatting.",
    subtitle: "It's about reducing the cognitive load for the next developer (which might be you).",
    handle: "https://www.linkedin.com/posts/rocky-clean-code",
    platform: "LinkedIn",
    thumbnail_url: "https://i.ibb.co.com/KxsnVTc/1733070659155.jpg",
    tags: ["Software Engineering"],
    etr: 2,
    is_featured: false,
    is_approved: true,
    date_added: new Date("2025-03-05"),
  },
  {
    title: "Unit Testing Best Practices for Async Backends",
    subtitle: "How to mock external services and avoid flakiness in your CI/CD pipeline.",
    handle: "https://medium.com/@rocky/async-testing",
    platform: "Medium",
    thumbnail_url: "https://i.ibb.co.com/Z6PT0VCv/p2.jpg",
    tags: ["Testing", "DevOps"],
    etr: 7,
    is_featured: false,
    is_approved: true,
    date_added: new Date("2025-03-10"),
  },
  {
    title: "Scaling Websockets for 100k Concurrent Users",
    subtitle: "Architecture patterns for real-time applications using Redis PubSub.",
    handle: "https://dev.to/rocky/scaling-websockets",
    platform: "Dev.to",
    thumbnail_url: "https://i.ibb.co.com/ZpqQzNsQ/cristofer-maximilian-PP1y-Kpf-A4-HY-unsplash.jpg",
    tags: ["Websockets", "Redis", "Scaling"],
    etr: 15,
    is_featured: false,
    is_approved: true,
    date_added: new Date("2025-03-12"),
  },
  {
    title: "Collaborative Engineering: Beyond the Code",
    subtitle: "How we managed to scale our team and maintain velocity during the transition to remote work.",
    handle: "https://hashnode.com/rocky/collaborative-work",
    platform: "Hashnode",
    thumbnail_url: "https://i.ibb.co.com/jLXgY33/Collaborative-Work-Session.jpg",
    tags: ["Teamwork", "Management"],
    etr: 6,
    is_featured: false,
    is_approved: true,
    date_added: new Date("2025-03-15"),
  },
  {
    title: "Designing for Scale: Planning Board Strategies",
    subtitle: "Visualizing complex system architectures before the first line of code is written.",
    handle: "https://medium.com/@rocky/planning-strategies",
    platform: "Medium",
    thumbnail_url: "https://i.ibb.co.com/mBGn1z4/Professional-Woman-at-Planning-Board.jpg",
    tags: ["System Design", "Architecture"],
    etr: 9,
    is_featured: false,
    is_approved: true,
    date_added: new Date("2025-03-18"),
  },
  {
    title: "Next-Gen Video Conferences: A Technical Review",
    subtitle: "Comparing WebRTC implementations across top platforms for low-latency communication.",
    handle: "https://dev.to/rocky/video-conference-tech",
    platform: "Dev.to",
    thumbnail_url: "https://i.ibb.co.com/ydc7w93/Online-Video-Conference.jpg",
    tags: ["WebRTC", "Networking"],
    etr: 11,
    is_featured: false,
    is_approved: true,
    date_added: new Date("2025-03-20"),
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MONGODB_URI is not defined");

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding.");

    // Clear existing blogs
    await Blog.deleteMany({});
    console.log("Cleared existing blogs.");

    // Insert seed data
    await Blog.insertMany(seedBlogs);
    console.log(`Successfully seeded ${seedBlogs.length} blogs.`);

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
