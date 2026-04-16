import mongoose from "mongoose";
import connectDB from "../lib/db/connect";
import Project from "../lib/db/models/Project";
import Skill from "../lib/db/models/Skill";

async function seed() {
  try {
    console.log("Connecting to DB...");
    await connectDB();
    console.log("Connected!");

    // 1. Clear existing projects
    console.log("Clearing existing projects...");
    await Project.deleteMany({});
    console.log("Projects cleared.");

    // 2. Fetch all skills for mapping
    const allSkills = await Skill.find({});
    const skillMap = new Map(allSkills.map(s => [s.name.toLowerCase().trim(), s._id]));

    // Helper to find skill ID or a fallback
    const findSkillId = (name: string) => {
      const normalized = name.toLowerCase().trim();
      // Try exact match
      if (skillMap.has(normalized)) return skillMap.get(normalized);
      // Try common variations
      if (normalized === "tailwind") return skillMap.get("tailwind css");
      if (normalized === "express.js") return skillMap.get("express");
      if (normalized === "express") return skillMap.get("express");
      return null;
    };

    // 3. Define projects from user request
    const projectsData = [
      {
        title: "Petcareplus",
        description: "A comprehensive pet care platform that connects pet owners with pet sitters and groomers.",
        longDescription: "Petcareplus is a comprehensive pet care platform that connects pet owners with pet sitters and groomers. It provides a seamless experience for pet owners to find and book pet care services, as well as for pet sitters and groomers to manage their businesses. The platform features a user-friendly interface, secure payment processing, and a rating system to ensure quality service. Petcareplus is designed to make pet care easier and more accessible for everyone.",
        thumbnail: "https://i.ibb.co.com/h1WL7WLb/petcareplus.png",
        skills: ["Django DRF", "Django-Q", "Google GenAI", "React", "PostgreSQL", "JWT", "Tailwind", "Docker"],
        githubLink: "https://github.com/rockychowdhury/PetCarePlus-Django-React",
        liveLink: "https://petcarepp.netlify.app/",
        previewLink: "/assets/projectpreview/petcarepreview.webm",
        videoLink: "https://youtu.be/rkMJ0rzXjfA",
        isFeatured: true,
        order: 1
      },
      {
        title: "Employee Management System",
        description: "Role-based employee and payroll management dashboard.",
        longDescription: "Role-based authentication and authorization using Firebase Auth and JWT. Real-time dashboards with full CRUD functionality for payroll and employee management. Responsive UI built with Tailwind CSS and React hooks for efficient state management",
        thumbnail: "https://i.ibb.co.com/WWgG8LdT/employeemanagement.png",
        skills: ["React", "MongoDB", "JWT", "Express.js", "Firebase Auth", "Tailwind", "TanStack Query", "TanStack Table"],
        githubLink: "https://github.com/rockychowdhury/Employee-Management-System",
        liveLink: "https://employeemangement-2e41e.web.app/",
        previewLink: "/assets/projectpreview/employeepreview.webm",
        videoLink: "https://youtu.be/rkMJ0rzXjfA",
        isFeatured: true,
        order: 3
      },
      {
        title: "AltRec",
        description: "Q&A-based personalized product recommendation platform.",
        longDescription: "Secure product recommendation platform with Firebase Auth, JWT, and RBAC. Product query submission, tracking, and personalized recommendation workflow. Responsive dashboards powered by Express and MongoDB backend",
        thumbnail: "https://i.ibb.co.com/Kx2sNJsL/altrec.png",
        skills: ["React", "Tailwind", "Node.js", "Express", "MongoDB", "Firebase Auth", "JWT"],
        githubLink: "https://github.com/rockychowdhury/Alternative-Product-Recommendation-Platform",
        liveLink: "https://employeemangement-2e41e.web.app/",
        previewLink: "/assets/projectpreview/employeepreview.webm",
        videoLink: "https://youtu.be/rkMJ0rzXjfA",
        isFeatured: false,
        order: 2
      },
      {
        title: "Smart Pet Assistant",
        description: "AI-powered assistant for managing pet care and services.",
        longDescription: "Smart Pet Assistant enhances pet care management by integrating AI-driven suggestions for grooming, feeding, and health routines. It allows pet owners to book services, track pet activities, and receive smart recommendations using Google GenAI. Built with a scalable Django backend and modern React frontend, ensuring secure authentication and smooth user experience.",
        thumbnail: "https://i.ibb.co.com/h1WL7WLb/petcareplus.png",
        skills: ["Django DRF", "Django-Q", "Google GenAI", "React", "PostgreSQL", "JWT", "Tailwind", "Docker"],
        githubLink: "https://github.com/rockychowdhury/PetCarePlus-Django-React",
        liveLink: "https://petcarepp.netlify.app/",
        previewLink: "/assets/projectpreview/petcarepreview.webm",
        videoLink: "https://youtu.be/rkMJ0rzXjfA",
        isFeatured: false,
        order: 4
      },
      {
        title: "HR Analytics Dashboard",
        description: "Data-driven employee performance and payroll insights system.",
        longDescription: "HR Analytics Dashboard provides insights into employee performance, salary distribution, and organizational growth trends. It includes role-based dashboards, payroll automation, and advanced filtering with real-time updates. Designed with scalable architecture using React and efficient backend APIs for enterprise-level usage.",
        thumbnail: "https://i.ibb.co.com/WWgG8LdT/employeemanagement.png",
        skills: ["React", "MongoDB", "JWT", "Express.js", "Firebase Auth", "Tailwind", "TanStack Query", "TanStack Table"],
        githubLink: "https://github.com/rockychowdhury/Employee-Management-System",
        liveLink: "https://employeemangement-2e41e.web.app/",
        previewLink: "/assets/projectpreview/employeepreview.webm",
        videoLink: "https://youtu.be/rkMJ0rzXjfA",
        isFeatured: false,
        order: 5
      },
      {
        title: "Product Insight Hub",
        description: "Platform for collecting and analyzing product recommendations.",
        longDescription: "Product Insight Hub allows users to ask for product suggestions and receive personalized recommendations from the community. It includes secure authentication, query tracking, and a structured recommendation workflow. Built with a responsive UI and scalable backend APIs for handling multiple user interactions efficiently.",
        thumbnail: "https://i.ibb.co.com/Kx2sNJsL/altrec.png",
        skills: ["React", "Tailwind", "Node.js", "Express", "MongoDB", "Firebase Auth", "JWT"],
        githubLink: "https://github.com/rockychowdhury/Alternative-Product-Recommendation-Platform",
        liveLink: "https://employeemangement-2e41e.web.app/",
        previewLink: "/assets/projectpreview/employeepreview.webm",
        videoLink: "https://youtu.be/rkMJ0rzXjfA",
        isFeatured: false,
        order: 6
      },
      {
        title: "Workforce Manager Pro",
        description: "Advanced workforce and payroll management solution.",
        longDescription: "Workforce Manager Pro is a full-featured employee management system with role-based access, payroll automation, and real-time updates. It provides intuitive dashboards for admins and employees, ensuring efficient workforce management and seamless data handling.",
        thumbnail: "https://i.ibb.co.com/WWgG8LdT/employeemanagement.png",
        skills: ["React", "MongoDB", "JWT", "Express.js", "Firebase Auth", "Tailwind", "TanStack Query", "TanStack Table"],
        githubLink: "https://github.com/rockychowdhury/Employee-Management-System",
        liveLink: "https://employeemangement-2e41e.web.app/",
        previewLink: "/assets/projectpreview/employeepreview.webm",
        videoLink: "https://youtu.be/rkMJ0rzXjfA",
        isFeatured: false,
        order: 7
      },
      {
        title: "Smart Recommendation Engine",
        description: "Personalized recommendation system using user queries.",
        longDescription: "Smart Recommendation Engine processes user queries to deliver tailored product suggestions. It features authentication, role-based access, and efficient query handling. Designed for scalability and performance with modern backend technologies and optimized frontend rendering.",
        thumbnail: "https://i.ibb.co.com/Kx2sNJsL/altrec.png",
        skills: ["React", "Tailwind", "Node.js", "Express", "MongoDB", "Firebase Auth", "JWT"],
        githubLink: "https://github.com/rockychowdhury/Alternative-Product-Recommendation-Platform",
        liveLink: "https://employeemangement-2e41e.web.app/",
        previewLink: "/assets/projectpreview/employeepreview.webm",
        videoLink: "https://youtu.be/rkMJ0rzXjfA",
        isFeatured: false,
        order: 8
      }
    ];

    // 4. Map and save projects
    console.log("Saving new projects...");
    for (const data of projectsData) {
      const skillsIds = data.skills
        .map(name => findSkillId(name))
        .filter(id => !!id);

      const project = new Project({
        ...data,
        skills: skillsIds
      });

      await project.save();
      console.log(`Saved: ${data.title}`);
    }

    console.log("Seeding complete!");
  } catch (error) {
    console.error("SEEDING ERROR:", error);
  } finally {
    process.exit(0);
  }
}

seed();
