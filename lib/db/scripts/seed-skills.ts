import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import connectDB from "../connect";
import Skill from "../models/Skill";

const skills = [
  // --- Frontend (Circle - 8 Icons + 4 TBA) ---
  { name: "React", icon: "SiReact", icon_group: "si", icon_type: "icon", description: "Component-based UI library", group: "frontend", is_top_skill: true, order: 1, color: "#61DAFB" },
  { name: "Next.js", icon: "SiNextdotjs", icon_group: "si", icon_type: "icon", description: "React framework for production", group: "frontend", is_top_skill: true, order: 2, color: "#000000" },
  { name: "TypeScript", icon: "SiTypescript", icon_group: "si", icon_type: "icon", description: "Typed JavaScript for scale", group: "frontend", is_top_skill: true, order: 3, color: "#3178C6" },
  { name: "Tailwind CSS", icon: "SiTailwindcss", icon_group: "si", icon_type: "icon", description: "Utility-first CSS framework", group: "frontend", is_top_skill: false, order: 4, color: "#06B6D4" },
  { name: "Framer Motion", icon: "SiFramer", icon_group: "si", icon_type: "icon", description: "Production-ready motion library", group: "frontend", is_top_skill: false, order: 5, color: "#0055FF" },
  { name: "Redux", icon: "SiRedux", icon_group: "si", icon_type: "icon", description: "State management container", group: "frontend", is_top_skill: false, order: 6, color: "#764ABC" },
  { name: "HTML5", icon: "SiHtml5", icon_group: "si", icon_type: "icon", description: "Core web structure", group: "frontend", is_top_skill: false, order: 7, color: "#E34F26" },
  { name: "CSS3", icon: "SiCss", icon_group: "si", icon_type: "icon", description: "Advanced styling", group: "frontend", is_top_skill: false, order: 8, color: "#1572B6" },
  { name: "TBA", icon: "Circle", icon_group: "lu", icon_type: "icon", description: "Learning and Improving", group: "frontend", is_top_skill: false, order: 999, color: "#808080" },
  { name: "TBA", icon: "Circle", icon_group: "lu", icon_type: "icon", description: "Learning and Improving", group: "frontend", is_top_skill: false, order: 999, color: "#808080" },
  { name: "TBA", icon: "Circle", icon_group: "lu", icon_type: "icon", description: "Learning and Improving", group: "frontend", is_top_skill: false, order: 999, color: "#808080" },
  { name: "TBA", icon: "Circle", icon_group: "lu", icon_type: "icon", description: "Learning and Improving", group: "frontend", is_top_skill: false, order: 999, color: "#808080" },

  // --- Backend (Triangle - 8 Icons + 4 TBA) ---
  { name: "Node.js", icon: "SiNodedotjs", icon_group: "si", icon_type: "icon", description: "JavaScript runtime", group: "backend", is_top_skill: true, order: 1, color: "#339933" },
  { name: "Python", icon: "SiPython", icon_group: "si", icon_type: "icon", description: "Versatile programming", group: "backend", is_top_skill: true, order: 2, color: "#3776AB" },
  { name: "Django", icon: "SiDjango", icon_group: "si", icon_type: "icon", description: "High-level Python framework", group: "backend", is_top_skill: true, order: 3, color: "#092E20" },
  { name: "FastAPI", icon: "SiFastapi", icon_group: "si", icon_type: "icon", description: "Modern Python API framework", group: "backend", is_top_skill: true, order: 4, color: "#05998B" },
  { name: "PostgreSQL", icon: "SiPostgresql", icon_group: "si", icon_type: "icon", description: "Advanced relational DB", group: "backend", is_top_skill: true, order: 5, color: "#4169E1" },
  { name: "MongoDB", icon: "SiMongodb", icon_group: "si", icon_type: "icon", description: "NoSQL document database", group: "backend", is_top_skill: false, order: 6, color: "#47A248" },
  { name: "Redis", icon: "SiRedis", icon_group: "si", icon_type: "icon", description: "In-memory data store", group: "backend", is_top_skill: false, order: 7, color: "#DC382D" },
  { name: "Go", icon: "SiGo", icon_group: "si", icon_type: "icon", description: "Concurrent systems language", group: "backend", is_top_skill: false, order: 8, color: "#00ADD8" },
  { name: "TBA", icon: "Circle", icon_group: "lu", icon_type: "icon", description: "Learning and Improving", group: "backend", is_top_skill: false, order: 999, color: "#808080" },
  { name: "TBA", icon: "Circle", icon_group: "lu", icon_type: "icon", description: "Learning and Improving", group: "backend", is_top_skill: false, order: 999, color: "#808080" },
  { name: "TBA", icon: "Circle", icon_group: "lu", icon_type: "icon", description: "Learning and Improving", group: "backend", is_top_skill: false, order: 999, color: "#808080" },
  { name: "TBA", icon: "Circle", icon_group: "lu", icon_type: "icon", description: "Learning and Improving", group: "backend", is_top_skill: false, order: 999, color: "#808080" },

  // --- DevOps (Square - 6 Icons + 4 TBA) ---
  { name: "Docker", icon: "SiDocker", icon_group: "si", icon_type: "icon", description: "Containerization platform", group: "devops", is_top_skill: true, order: 1, color: "#2496ED" },
  { name: "Kubernetes", icon: "SiKubernetes", icon_group: "si", icon_type: "icon", description: "Container orchestration", group: "devops", is_top_skill: false, order: 2, color: "#326CE5" },
  { name: "AWS", icon: "FaAws", icon_group: "fa", icon_type: "icon", description: "Cloud infrastructure", group: "devops", is_top_skill: true, order: 3, color: "#FF9900" },
  { name: "Git", icon: "SiGit", icon_group: "si", icon_type: "icon", description: "Version control", group: "devops", is_top_skill: false, order: 4, color: "#F05032" },
  { name: "GitHub Actions", icon: "SiGithubactions", icon_group: "si", icon_type: "icon", description: "CI/CD automation", group: "devops", is_top_skill: false, order: 5, color: "#2088FF" },
  { name: "Terraform", icon: "SiTerraform", icon_group: "si", icon_type: "icon", description: "Infrastructure as code", group: "devops", is_top_skill: false, order: 6, color: "#7B42BC" },
  { name: "TBA", icon: "Circle", icon_group: "lu", icon_type: "icon", description: "Learning and Improving", group: "devops", is_top_skill: false, order: 999, color: "#808080" },
  { name: "TBA", icon: "Circle", icon_group: "lu", icon_type: "icon", description: "Learning and Improving", group: "devops", is_top_skill: false, order: 999, color: "#808080" },
  { name: "TBA", icon: "Circle", icon_group: "lu", icon_type: "icon", description: "Learning and Improving", group: "devops", is_top_skill: false, order: 999, color: "#808080" },
  { name: "TBA", icon: "Circle", icon_group: "lu", icon_type: "icon", description: "Learning and Improving", group: "devops", is_top_skill: false, order: 999, color: "#808080" },

  // --- Database (Ticker) ---
  { name: "PostgreSQL", icon: "SiPostgresql", icon_group: "si", icon_type: "icon", description: "Advanced relational DB", group: "database", is_top_skill: true, order: 1, color: "#4169E1" },
  { name: "MongoDB", icon: "SiMongodb", icon_group: "si", icon_type: "icon", description: "NoSQL document database", group: "database", is_top_skill: false, order: 2, color: "#47A248" },
  { name: "SQLite", icon: "SiSqlite", icon_group_: "si", icon_type: "icon", description: "Lightweight SQL", group: "database", is_top_skill: false, order: 3, color: "#003B57" },

  // --- Tools (Ticker) ---
  { name: "VS Code", icon: "SiVisualstudiocode", icon_group: "si", icon_type: "icon", description: "Code editor", group: "tools", is_top_skill: false, order: 1, color: "#007ACC" },
  { name: "Postman", icon: "SiPostman", icon_group: "si", icon_type: "icon", description: "API platform", group: "tools", is_top_skill: false, order: 2, color: "#FF6C37" },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MONGODB_URI is not defined");

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding skills.");

    await Skill.deleteMany({});
    console.log("Cleared existing skills.");

    await Skill.insertMany(skills);
    console.log(`Successfully seeded ${skills.length} skills.`);

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
