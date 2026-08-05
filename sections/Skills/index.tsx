import { getSkills } from "@/lib/db/data/skills";
import SkillsClient from "./SkillsClient";

export default async function SkillsSection() {
  const skills = await getSkills();
  return <SkillsClient initialSkills={skills as any[]} />;
}
