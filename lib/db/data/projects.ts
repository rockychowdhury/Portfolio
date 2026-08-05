import connectDB from '../connect';
import Project from '../models/Project';
import { IProject } from '@/types/project';

export async function getProjects(): Promise<IProject[]> {
  await connectDB();
  const projects = await Project.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(projects));
}
