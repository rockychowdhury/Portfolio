import { getProjects } from "@/lib/db/data/projects";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsSection() {
  const projects = await getProjects();
  return <ProjectsClient initialProjects={projects as any[]} />;
}