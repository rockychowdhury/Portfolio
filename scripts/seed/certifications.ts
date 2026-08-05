import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI not set in .env.local");
}

const CertificationSchema = new mongoose.Schema(
  {
    ins_name: { type: String, required: true },
    certificate_name: { type: String, required: true },
    certificate_link: { type: String },
    preview_link: { type: String },
    type: { type: String, enum: ["education", "certification"], required: true },
    start_date: { type: String },
    end_date: { type: String },
    issue_date: { type: String },
    cgpa: { type: String },
    description: { type: String },
    ins_web: { type: String },
    ins_logo: { type: String },
    order: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

const Certification = mongoose.models.Certification || mongoose.model("Certification", CertificationSchema);

const certifications = [
  {
    ins_name: "Prime University - Dhaka, Bangladesh",
    certificate_name: "Bachelor of Science in Computer Science and Engineering",
    certificate_link: "N/A",
    type: "education",
    start_date: "2022",
    end_date: "2026",
    cgpa: "3.60",
    description: "N/A",
    ins_web: "https://www.primeuniversity.edu.bd/",
    ins_logo: "https://i.ibb.co.com/qfTyBSs/uni-Dsw-Bgspq.png",
    order: 1
  },
  {
    ins_name: "Phitron",
    certificate_name: "CSE Fundamentals with Phitron",
    certificate_link: "https://www.phitron.io/verification?validationNumber=PHBATCH32834331114",
    preview_link: "https://i.ibb.co.com/VczJkHHV/ph-b3.jpg",
    type: "certification",
    issue_date: "JUNE 2024",
    cgpa: "4.0",
    description: "Problem Solving · Databases · Django · C (Programming Language) · GitHub · MySQL · C++ · REST APIs · Version Control · Object-Oriented Programming (OOP) · Python (Programming Language) · Git · Algorithms · Data Structures · PostgreSQL · Django REST Framework · SQL · JSON Web Token (JWT) · Programming",
    ins_web: "https://www.phitron.io/",
    ins_logo: "https://i.ibb.co.com/S7fMfxbL/image.png",
    order: 2
  },
  {
    ins_name: "Anthropic",
    certificate_name: "Claude Code in Action",
    certificate_link: "https://verify.skilljar.com/c/udvjbif9ym59",
    preview_link: "https://i.ibb.co.com/FqNP4ZR5/claudecode.jpg",
    type: "certification",
    issue_date: "APRIL 2026",
    description: "This certification validates my ability to use Claude Code effectively for software development tasks, including code generation, debugging, and optimization.",
    ins_web: "https://www.anthropic.com/",
    ins_logo: "https://i.ibb.co.com/qLMMtvY2/anthropicresearch-logo-e-1777507200-v-beta-t-6o-IDF6-LE6-Vva-XMCDN-Xpt-ICBwa-H7-HCGumvj6-Ys3embg.jpg",
    order: 3
  },
  {
    ins_name: "Programming Hero",
    certificate_name: "Complete Web Development With Programming Hero",
    certificate_link: "https://drive.google.com/file/d/1c2Z2rrYZVtsvJH7rG7zYIjJRI_ut6bAo/view?usp=sharing",
    preview_link: "https://i.ibb.co.com/35T0N0xn/ph-web10.jpg",
    type: "certification",
    issue_date: "FEBRUARY 2025",
    description: "MongoDB · Databases · Tailwind CSS · GitHub · Node.js · Firebase · Cascading Style Sheets (CSS) · JavaScript · Version Control · HTML5 · Git · JSON Web Token (JWT) · CSS3 · Express.js · React.js",
    ins_web: "https://www.programming-hero.com/",
    ins_logo: "https://i.ibb.co.com/FLx8sgfS/image.png",
    order: 4
  },
  {
    ins_name: "Anthropic",
    certificate_name: "Model Context Protocol",
    certificate_link: "https://i.ibb.co.com/ks2x9qTn/image.png",
    preview_link: "https://i.ibb.co.com/ks2x9qTn/image.png",
    type: "certification",
    issue_date: "MAY 2025",
    description: "Deep dive into MCP's advanced features including sampling, notifications, and transport implementations",
    ins_web: "https://www.anthropic.com/",
    ins_logo: "https://i.ibb.co.com/qLMMtvY2/anthropicresearch-logo-e-1777507200-v-beta-t-6o-IDF6-LE6-Vva-XMCDN-Xpt-ICBwa-H7-HCGumvj6-Ys3embg.jpg",
    order: 5
  },
  {
    ins_name: "Programming Hero",
    certificate_name: "AI-Driven Software Engineer",
    certificate_link: "https://drive.google.com/file/d/1c2Z2rrYZVtsvJH7rG7zYIjJRI_ut6bAo/view?usp=sharing",
    preview_link: "https://i.ibb.co.com/35T0N0xn/ph-web10.jpg",
    type: "certification",
    issue_date: "FEBRUARY 2024",
    description: "MongoDB · Databases · Tailwind CSS · GitHub · Node.js · Firebase · Cascading Style Sheets (CSS) · JavaScript · Version Control · HTML5 · Git · JSON Web Token (JWT) · CSS3 · Express.js · React.js",
    ins_web: "https://www.programming-hero.com/",
    ins_logo: "https://i.ibb.co.com/FLx8sgfS/image.png",
    order: 6
  }
];

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB");

  await Certification.deleteMany({});
  console.log("Cleared existing certifications");

  await Certification.insertMany(certifications);
  console.log(`Inserted ${certifications.length} certifications`);

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
