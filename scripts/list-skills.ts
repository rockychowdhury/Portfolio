import connectDB from "../lib/db/connect";
import Skill from "../lib/db/models/Skill";

async function listSkills() {
  try {
    await connectDB();
    const skills = await Skill.find({});
    console.log("SKILLS_START");
    console.log(JSON.stringify(skills.map(s => ({ id: s._id, name: s.name })), null, 2));
    console.log("SKILLS_END");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

listSkills();
