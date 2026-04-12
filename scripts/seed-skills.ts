import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI not set in .env.local");
}

// Define schema inline to avoid model compilation issues in scripts
const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    group: { type: String, required: true },
    is_top_skill: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Skill = mongoose.model("Skill", SkillSchema);

const skills = [
  // ── Frontend (Circle shape — 8 icons) ──
  { name: "React", icon: "SiReact", description: "Component-based UI library for building interactive interfaces", group: "frontend", is_top_skill: true, order: 1 },
  { name: "Next.js", icon: "SiNextdotjs", description: "Full-stack React framework with SSR and API routes", group: "frontend", is_top_skill: false, order: 2 },
  { name: "TypeScript", icon: "SiTypescript", description: "Typed superset of JavaScript for scalable applications", group: "frontend", is_top_skill: false, order: 3 },
  { name: "JavaScript", icon: "SiJavascript", description: "Core language of the web — dynamic and versatile", group: "frontend", is_top_skill: true, order: 4 },
  { name: "Tailwind CSS", icon: "SiTailwindcss", description: "Utility-first CSS framework for rapid UI development", group: "frontend", is_top_skill: false, order: 5 },
  { name: "HTML5", icon: "SiHtml5", description: "Semantic markup language for structuring web content", group: "frontend", is_top_skill: false, order: 6 },
  { name: "CSS3", icon: "SiCss3", description: "Styling language for layout, animation, and responsive design", group: "frontend", is_top_skill: false, order: 7 },
  { name: "TanStack Query", icon: "SiReactquery", description: "Powerful data-fetching and caching library for React", group: "frontend", is_top_skill: false, order: 8 },

  // ── Backend (Triangle shape — 8 icons) ──
  { name: "Python", icon: "SiPython", description: "Versatile language for backend, scripting, and data science", group: "backend", is_top_skill: true, order: 1 },
  { name: "Django", icon: "SiDjango", description: "High-level Python web framework with batteries included", group: "backend", is_top_skill: false, order: 2 },
  { name: "Django REST", icon: "SiDjango", description: "Toolkit for building Web APIs with Django", group: "backend", is_top_skill: true, order: 3 },
  { name: "FastAPI", icon: "SiFastapi", description: "Modern, high-performance Python API framework", group: "backend", is_top_skill: false, order: 4 },
  { name: "Node.js", icon: "SiNodedotjs", description: "JavaScript runtime for building server-side applications", group: "backend", is_top_skill: false, order: 5 },
  { name: "Express.js", icon: "SiExpress", description: "Minimalist web framework for Node.js backends", group: "backend", is_top_skill: false, order: 6 },
  { name: "Redis", icon: "SiRedis", description: "In-memory data store for caching and message brokering", group: "backend", is_top_skill: false, order: 7 },
  { name: "Celery", icon: "SiCelery", description: "Distributed task queue for asynchronous processing", group: "backend", is_top_skill: false, order: 8 },

  // ── DevOps (Square shape — 6 icons) ──
  { name: "Docker", icon: "SiDocker", description: "Containerization platform for consistent deployments", group: "devops", is_top_skill: true, order: 1 },
  { name: "Git", icon: "SiGit", description: "Version control system for tracking code changes", group: "devops", is_top_skill: false, order: 2 },
  { name: "GitHub", icon: "SiGithub", description: "Platform for code hosting, CI/CD, and collaboration", group: "devops", is_top_skill: false, order: 3 },
  { name: "Firebase", icon: "SiFirebase", description: "Google's platform for auth, hosting, and real-time data", group: "devops", is_top_skill: false, order: 4 },
  { name: "Postman", icon: "SiPostman", description: "API development and testing tool", group: "devops", is_top_skill: false, order: 5 },
  { name: "Vercel", icon: "SiVercel", description: "Edge-first deployment platform for frontend frameworks", group: "devops", is_top_skill: false, order: 6 },

  // ── Database (Ticker) ──
  { name: "PostgreSQL", icon: "SiPostgresql", description: "Advanced open-source relational database", group: "database", is_top_skill: true, order: 1 },
  { name: "MongoDB", icon: "SiMongodb", description: "NoSQL document database for flexible data models", group: "database", is_top_skill: false, order: 2 },
  { name: "SQLite", icon: "SiSqlite", description: "Lightweight embedded relational database", group: "database", is_top_skill: false, order: 3 },

  // ── CS Fundamentals (Ticker) ──
  { name: "Data Structures", icon: "SiLeetcode", description: "Arrays, trees, graphs, heaps — the building blocks of efficient code", group: "cs-fundamentals", is_top_skill: false, order: 1 },
  { name: "Algorithms", icon: "SiLeetcode", description: "Sorting, searching, DP, greedy — solving problems efficiently", group: "cs-fundamentals", is_top_skill: false, order: 2 },
  { name: "OOP", icon: "SiCplusplus", description: "Object-Oriented Programming principles and design patterns", group: "cs-fundamentals", is_top_skill: false, order: 3 },
  { name: "C++", icon: "SiCplusplus", description: "Systems-level language used for competitive programming", group: "cs-fundamentals", is_top_skill: false, order: 4 },

  // ── Tools (Ticker) ──
  { name: "VS Code", icon: "SiVisualstudiocode", description: "Primary code editor with extensive extension ecosystem", group: "tools", is_top_skill: false, order: 1 },
  { name: "Linux", icon: "SiLinux", description: "Unix-based OS for development and server environments", group: "tools", is_top_skill: false, order: 2 },
  { name: "Figma", icon: "SiFigma", description: "Collaborative interface design tool", group: "tools", is_top_skill: false, order: 3 },
];

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB");

  // Clear existing skills
  await Skill.deleteMany({});
  console.log("Cleared existing skills");

  // Insert new skills
  await Skill.insertMany(skills);
  console.log(`Inserted ${skills.length} skills`);

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
