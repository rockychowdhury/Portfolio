import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import connectDB from "../lib/db/connect";
import Project from "../lib/db/models/Project";
import FeatureCard from "../lib/db/models/FeatureCard";

async function seed() {
  try {
    console.log("Connecting to DB...");
    await connectDB();
    console.log("Connected!");

    // 1. Clear existing data
    console.log("Clearing existing projects and feature cards...");
    await Project.deleteMany({});
    await FeatureCard.deleteMany({});
    console.log("Data cleared.");

    // 2. Seed Projects (5 projects)
    const projectsData = [
      {
        title: "Petcareplus",
        description: "A comprehensive pet care platform connecting pet owners with sitters and groomers, featuring AI-driven suggestions and secure payment processing.",
        readmeLink: "https://raw.githubusercontent.com/rockychowdhury/PetCarePlus-Django-React/main/README.md",
        thumbnail: "https://i.ibb.co.com/h1WL7WLb/petcareplus.png",
        githubLink: "https://github.com/rockychowdhury/PetCarePlus-Django-React",
        liveLink: "https://petcarepp.netlify.app/",
        videoPreviewLink: "/assets/projectpreview/petcarepreview.webm",
        youtubeLink: "https://youtu.be/rkMJ0rzXjfA",
        order: 1,
      },
      {
        title: "Employee Management System",
        description: "Role-based employee and payroll management dashboard with Firebase Auth, real-time CRUD dashboards, and responsive Tailwind UI.",
        readmeLink: "https://raw.githubusercontent.com/rockychowdhury/Employee-Management-System/main/README.md",
        thumbnail: "https://i.ibb.co.com/WWgG8LdT/employeemanagement.png",
        githubLink: "https://github.com/rockychowdhury/Employee-Management-System",
        liveLink: "https://employeemangement-2e41e.web.app/",
        videoPreviewLink: "/assets/projectpreview/employeepreview.webm",
        youtubeLink: "https://youtu.be/rkMJ0rzXjfA",
        order: 2,
      },
      {
        title: "AltRec",
        description: "Q&A-based personalized product recommendation platform with secure auth, RBAC, and a structured recommendation workflow.",
        readmeLink: "https://raw.githubusercontent.com/rockychowdhury/Alternative-Product-Recommendation-Platform/main/README.md",
        thumbnail: "https://i.ibb.co.com/Kx2sNJsL/altrec.png",
        githubLink: "https://github.com/rockychowdhury/Alternative-Product-Recommendation-Platform",
        liveLink: "https://altrec-project.web.app/",
        videoPreviewLink: "/assets/projectpreview/employeepreview.webm",
        youtubeLink: "https://youtu.be/rkMJ0rzXjfA",
        order: 3,
      },
      {
        title: "MediSync",
        description: "Healthcare scheduling platform with real-time queue management, role-based dashboards, and WebSocket-driven live updates.",
        readmeLink: "https://raw.githubusercontent.com/rockychowdhury/MediSync/main/README.md",
        thumbnail: "https://i.ibb.co.com/h1WL7WLb/petcareplus.png",
        githubLink: "https://github.com/rockychowdhury/MediSync",
        liveLink: "https://medisync-app.vercel.app/",
        videoPreviewLink: "/assets/projectpreview/petcarepreview.webm",
        youtubeLink: "https://youtu.be/rkMJ0rzXjfA",
        order: 4,
      },
      {
        title: "DevConnect",
        description: "Developer networking platform with real-time messaging, project collaboration boards, and skills-based matching.",
        readmeLink: "https://raw.githubusercontent.com/rockychowdhury/PetCarePlus-Django-React/main/README.md",
        thumbnail: "https://i.ibb.co.com/WWgG8LdT/employeemanagement.png",
        githubLink: "https://github.com/rockychowdhury/PetCarePlus-Django-React",
        liveLink: "https://petcarepp.netlify.app/",
        videoPreviewLink: "/assets/projectpreview/employeepreview.webm",
        youtubeLink: "https://youtu.be/rkMJ0rzXjfA",
        order: 5,
      },
    ];

    console.log("Saving projects...");
    const savedProjects = [];
    for (const data of projectsData) {
      const project = new Project(data);
      const saved = await project.save();
      savedProjects.push(saved);
      console.log(`  ✓ Saved project: ${data.title} (ID: ${saved._id})`);
    }

    // 3. Seed Feature Cards (8 cards)
    const featureCardsData = [
      {
        projectId: savedProjects[0]._id.toString(),
        headline: "AI-Powered Pet Recommendations",
        subtext: "Google GenAI integration delivers personalized grooming and feeding suggestions based on pet profiles.",
        image: "https://i.ibb.co.com/h1WL7WLb/petcareplus.png",
        ctaLabel: "See how →",
        ctaLink: `/projects/${savedProjects[0]._id}#features`,
        order: 1,
      },
      {
        projectId: savedProjects[0]._id.toString(),
        headline: "Background Task Queue",
        subtext: "Django-Q handles async operations like email notifications and report generation without blocking the main thread.",
        image: "https://i.ibb.co.com/h1WL7WLb/petcareplus.png",
        ctaLabel: "Read more →",
        ctaLink: `/projects/${savedProjects[0]._id}#architecture`,
        order: 2,
      },
      {
        projectId: savedProjects[1]._id.toString(),
        headline: "Role-Based Access Control",
        subtext: "Firebase Auth + JWT provides granular admin, manager, and employee permissions across all dashboard views.",
        image: "https://i.ibb.co.com/WWgG8LdT/employeemanagement.png",
        ctaLabel: "See how →",
        ctaLink: `/projects/${savedProjects[1]._id}#authentication`,
        order: 3,
      },
      {
        projectId: savedProjects[1]._id.toString(),
        headline: "Real-Time Payroll Dashboard",
        subtext: "TanStack Table powers sortable, filterable payroll views with instant data updates via TanStack Query.",
        image: "https://i.ibb.co.com/WWgG8LdT/employeemanagement.png",
        ctaLabel: "See how →",
        ctaLink: `/projects/${savedProjects[1]._id}#payroll`,
        order: 4,
      },
      {
        projectId: savedProjects[2]._id.toString(),
        headline: "Personalized Recommendation Engine",
        subtext: "Smart query matching system delivers tailored product alternatives based on user preferences and community votes.",
        image: "https://i.ibb.co.com/Kx2sNJsL/altrec.png",
        ctaLabel: "Read more →",
        ctaLink: `/projects/${savedProjects[2]._id}#recommendations`,
        order: 5,
      },
      {
        projectId: savedProjects[3]._id.toString(),
        headline: "WebSocket Live Queue",
        subtext: "Real-time patient queue updates via WebSocket connections eliminate the need for manual page refreshes.",
        image: "https://i.ibb.co.com/h1WL7WLb/petcareplus.png",
        ctaLabel: "See how →",
        ctaLink: `/projects/${savedProjects[3]._id}#real-time`,
        order: 6,
      },
      {
        projectId: savedProjects[3]._id.toString(),
        headline: "Healthcare RBAC Dashboard",
        subtext: "Doctor, receptionist, and admin roles each see customized dashboards with appropriate data access levels.",
        image: "https://i.ibb.co.com/h1WL7WLb/petcareplus.png",
        ctaLabel: "Read more →",
        ctaLink: `/projects/${savedProjects[3]._id}#dashboard`,
        order: 7,
      },
      {
        projectId: savedProjects[4]._id.toString(),
        headline: "Skills-Based Matching",
        subtext: "Intelligent matching algorithm connects developers based on complementary skill sets and project interests.",
        image: "https://i.ibb.co.com/WWgG8LdT/employeemanagement.png",
        ctaLabel: "See how →",
        ctaLink: `/projects/${savedProjects[4]._id}#matching`,
        order: 8,
      },
    ];

    console.log("Saving feature cards...");
    for (const data of featureCardsData) {
      const card = new FeatureCard(data);
      await card.save();
      console.log(`  ✓ Saved feature card: ${data.headline}`);
    }

    console.log("\n✅ Seeding complete!");
    console.log(`   ${savedProjects.length} projects seeded`);
    console.log(`   ${featureCardsData.length} feature cards seeded`);
  } catch (error) {
    console.error("SEEDING ERROR:", error);
  } finally {
    process.exit(0);
  }
}

seed();
