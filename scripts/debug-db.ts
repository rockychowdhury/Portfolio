import connectDB from "../lib/db/connect";
import Project from "../lib/db/models/Project";
import Skill from "../lib/db/models/Skill";

async function debug() {
  try {
    console.log("Connecting to DB...");
    await connectDB();
    console.log("Connected!");

    console.log("Fetching projects...");
    const projects = await Project.find({}).populate("skills");
    console.log(`Found ${projects.length} projects.`);
    
    if (projects.length > 0) {
      console.log("First project structure:", JSON.stringify(projects[0], null, 2));
    } else {
      console.log("No projects found in database.");
    }

    console.log("Fetching skills...");
    const skills = await Skill.find({});
    console.log(`Found ${skills.length} skills.`);

  } catch (error) {
    console.error("DEBUG ERROR:", error);
  } finally {
    process.exit(0);
  }
}

debug();
