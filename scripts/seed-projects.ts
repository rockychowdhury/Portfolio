import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "../lib/db/models/Project";

dotenv.config({ path: ".env.local" });

const projects = [
  {
    title: "PetCare Platform",
    description: "A comprehensive health and wellness portal for pet owners.",
    longDescription: "PetCare is a centralized platform allowing pet owners to track medical records, schedule appointments, and connect with veterinary specialists. Designed for maximum usability and care.",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1200&auto=format&fit=crop",
    techStack: ["Next.js", "Firebase", "Tailwind CSS"],
    githubUrl: "https://github.com/rockychowdhury",
    liveUrl: "https://petcarepp.netlify.app/",
    isFeatured: true,
    order: 1,
  },
  {
    title: "Employee Hub",
    description: "Modern employee management and coordination system.",
    longDescription: "A robust enterprise-grade system for managing payroll, department transitions, and performance metrics. Built with a focus on administrative efficiency.",
    image: "https://images.unsplash.com/photo-1454165833767-131ff73a2a7a?q=80&w=1200&auto=format&fit=crop",
    techStack: ["React", "Express.js", "MongoDB"],
    githubUrl: "https://github.com/rockychowdhury",
    liveUrl: "https://employeemangement-2e41e.web.app/",
    isFeatured: true,
    order: 2,
  },
  {
    title: "NeuroFlux AI",
    description: "Real-time neural network visualization platform.",
    longDescription: "NeuroFlux is a state-of-the-art dashboard designed for researchers to monitor and optimize large-scale neural networks in real-time.",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200&auto=format&fit=crop",
    techStack: ["Next.js", "Three.js", "Python"],
    githubUrl: "https://github.com",
    liveUrl: "https://neuroflux.ai",
    isFeatured: false,
    order: 3,
  },
  {
    title: "Stellar Analytics",
    description: "High-performance data warehouse for real-time telemetry.",
    image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=800&auto=format&fit=crop",
    techStack: ["PostgreSQL", "Next.js", "Redis"],
    isFeatured: false,
    order: 4,
  },
  {
    title: "Nexus CMS",
    description: "Headless content management system with edge-delivery.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    techStack: ["TypeScript", "MongoDB", "Vercel"],
    isFeatured: false,
    order: 5,
  },
  {
    title: "Eon Wallet",
    description: "Modern digital asset manager for cross-chain liquidity.",
    image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=800&auto=format&fit=crop",
    techStack: ["React Native", "Ethereum", "Node.js"],
    isFeatured: false,
    order: 6,
  }
];

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for seeding projects...");

    // Clear existing projects
    await Project.deleteMany({});
    console.log("Cleared existing projects.");

    // Insert new projects
    await Project.insertMany(projects);
    console.log(`Successfully seeded ${projects.length} projects.`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
