import dotenv from "dotenv";
import dbConnect from "../lib/db/connect";
import Journey from "../lib/db/models/Journey";
import Achievement from "../lib/db/models/Achievement";

dotenv.config({ path: ".env.local" });

const journeyData = [
  {
    title: "Backend Developer (Learning & Projects)",
    organization: "Personal Projects & Learning",
    duration: "2024 – Present",
    startDate: new Date("2024-01-01"),
    icon: "💻",
    type: "work",
    description: [
      "Building full-stack applications using Django, DRF, React",
      "Implemented JWT authentication system with cookies",
      "Developing production-level projects (QuickFood, PetCarePlus)",
      "Learning API design, system design basics, and deployment",
    ],
  },
  {
    title: "BSc in CSE",
    organization: "Prime University",
    duration: "2021 – 2026",
    startDate: new Date("2021-01-01"),
    icon: "🎓",
    type: "education",
    description: [
      "Focus: Data Structures, Algorithms, CS fundamentals, Software Development Life Cycle",
      "Activities: Competitive Programming, Problem Solving, Project Building",
    ],
  },
  {
    title: "Vice President",
    organization: "PUCPC (Programming Club)",
    duration: "2023 – 2024",
    startDate: new Date("2023-01-01"),
    icon: "🏆",
    type: "leadership",
    description: [
      "Organized programming contests and workshops",
      "Mentored junior students in problem solving",
      "Active participation in competitive programming",
    ],
  },
];

async function seed() {
  try {
    await dbConnect();

    console.log("Clearing old journey data (Achievements collection)...");
    await Achievement.deleteMany({});
    
    console.log("Clearing new Journey collection...");
    await Journey.deleteMany({});

    console.log("Seeding new journey data...");
    await Journey.insertMany(journeyData);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding journey:", error);
    process.exit(1);
  }
}

seed();

