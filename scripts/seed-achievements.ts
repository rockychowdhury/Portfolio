import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import dbConnect from "../lib/db/connect";
import Achievement from "../lib/db/models/Achievement";

dotenv.config({ path: ".env.local" });

const achievements = [
  // ── Education ──────────────────────────────────────────────
  {
    category: "education",
    title: "BSc in Computer Science & Engineering",
    organization: "Prime University",
    date: new Date("2026-07-01"),
    details: { cgpa: 3.60, scale: 4.00 },
    tags: ["degree", "cse"]
  },

  // ── Certifications ─────────────────────────────────────────
  {
    category: "certification",
    title: "CS Fundamentals",
    organization: "Phitron",
    date: new Date("2024-06-01"),
    details: { score: "4/4" },
    tags: ["cs", "fundamentals"]
  },
  {
    category: "certification",
    title: "Complete Web Development",
    organization: "Programming Hero",
    date: new Date("2025-02-01"),
    tags: ["web", "fullstack"]
  },
  {
    category: "certification",
    title: "Claude Code in Action",
    organization: "Anthropic",
    date: new Date("2026-04-01"),
    tags: ["ai", "claude", "anthropic"]
  },
  {
    category: "certification",
    title: "Model Context Protocol (MCP)",
    organization: "Anthropic",
    date: new Date("2026-05-01"),
    tags: ["ai", "mcp", "anthropic"]
  },
  {
    category: "certification",
    title: "Generative AI",
    organization: "Google",
    date: new Date("2026-06-01"),
    tags: ["ai", "genai", "google"]
  },
  {
    category: "certification",
    title: "AI-Driven Software Engineering",
    organization: "Programming Hero",
    date: new Date("2026-11-01"),
    tags: ["ai", "software-engineering"]
  },
  {
    category: "certification",
    title: "Japanese Language Course",
    organization: "University of Dhaka",
    date: new Date("2025-04-01"),
    tags: ["language", "japanese"]
  },

  // ── Competitive Programming ────────────────────────────────
  {
    category: "competitive_programming",
    title: "Pupil Rank — Codeforces",
    organization: "Codeforces",
    date: new Date("2025-05-01"),
    tags: ["codeforces", "rating"]
  },
  {
    category: "competitive_programming",
    title: "2-Star Coder — CodeChef",
    organization: "CodeChef",
    date: new Date("2023-10-01"),
    tags: ["codechef", "rating"]
  },
  {
    category: "competitive_programming",
    title: "30-Day Activity Streak — Codeforces",
    organization: "Codeforces",
    date: new Date("2025-03-01"),
    tags: ["codeforces", "streak", "consistency"]
  },
  {
    category: "competitive_programming",
    title: "Solved 100+ DSA Problems — LeetCode",
    organization: "LeetCode",
    date: new Date("2026-04-01"),
    details: { problemsSolved: 100 },
    tags: ["leetcode", "dsa"]
  },
  {
    category: "competitive_programming",
    title: "Runner-Up — IUPC, Prime University CSE Fest",
    organization: "Prime University",
    date: new Date("2025-05-01"),
    details: { position: "Runner-Up" },
    tags: ["iupc", "contest"]
  },
  {
    category: "competitive_programming",
    title: "1st Runner-Up — IUPC, Prime University",
    organization: "Prime University",
    date: new Date("2022-12-01"),
    details: { position: "1st Runner-Up" },
    tags: ["iupc", "contest"]
  },
  {
    category: "competitive_programming",
    title: "Participated in ICPC Dhaka Regional Preliminary Contest",
    organization: "ICPC",
    date: new Date("2025-01-01"),
    tags: ["icpc", "dhaka", "regional"]
  },

  // ── Projects ───────────────────────────────────────────────
  {
    category: "project",
    title: "PetCarePlus — Pet Services & Rehoming Platform",
    organization: "Personal Project",
    date: new Date("2026-02-01"),
    tags: ["web", "fullstack", "pet-services"]
  },
  {
    category: "project",
    title: "MediSync — Smart Queue Management System for Clinical Appointments",
    organization: "Personal Project",
    date: new Date("2026-04-01"),
    tags: ["web", "healthcare", "queue-management"]
  },

  // ── Academic Honors ────────────────────────────────────────
  {
    category: "academic_honor",
    title: "Ranked 1st in Semester — Highest GPA",
    organization: "Prime University",
    date: new Date("2022-11-01"),
    details: { gpa: 3.97 },
    tags: ["academic", "top-rank"]
  },
  {
    category: "academic_honor",
    title: "Runner-Up — Project Showcase, Prime University CSE Fest",
    organization: "Prime University",
    date: new Date("2022-12-01"),
    details: { position: "Runner-Up" },
    tags: ["project", "showcase"]
  },

  // ── Leadership & Community ─────────────────────────────────
  {
    category: "leadership",
    title: "Elected Vice President — Prime University Programming Club (PUPC)",
    organization: "PUPC",
    date: new Date("2023-05-01"),
    tags: ["leadership", "club", "programming"]
  },
  {
    category: "leadership",
    title: "Core Organizer — Prime University CSE Fest",
    organization: "Prime University",
    date: new Date("2024-03-01"),
    tags: ["event", "organizing"]
  },
  {
    category: "leadership",
    title: "Delivered Inaugural Lecture on Programming Languages",
    organization: "Prime University",
    date: new Date("2023-04-01"),
    tags: ["teaching", "lecture"]
  },
  {
    category: "leadership",
    title: "Co-organized Seminar: \"Let's Code Your Career Through Problem Solving\"",
    organization: "Phitron",
    date: new Date("2024-06-01"),
    tags: ["seminar", "community", "phitron"]
  }
];

const STRENGTH_KEYWORDS: Record<string, number> = {
  "BSc": 5,
  "Crown": 5,
  "Trophy": 4,
  "Winner": 4,
  "Rank": 3,
  "Runner-Up": 3,
  "Selected": 3,
  "Organized": 3,
  "Conducted": 3,
  "Completion": 2,
  "Pupil": 2,
  "2*": 2,
  "30 days": 2,
  "Solved": 2,
  "Participated": 2,
};

function getStrengthFromTitle(title: string): number {
  for (const [keyword, strength] of Object.entries(STRENGTH_KEYWORDS)) {
    if (title.toLowerCase().includes(keyword.toLowerCase())) {
      return strength;
    }
  }
  return 2; // Default
}

function formatDate(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

async function seed() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB for seeding achievements.");

    const formattedAchievements = achievements.map(ach => ({
      ...ach,
      date_sortable: ach.date,
      date: formatDate(ach.date),
      strength: getStrengthFromTitle(ach.title)
    }));

    console.log(`Clearing existing achievements...`);
    await Achievement.deleteMany({});

    console.log(`Inserting ${formattedAchievements.length} new achievements...`);
    await Achievement.insertMany(formattedAchievements);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
