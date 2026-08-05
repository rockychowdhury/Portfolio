import connectDB from '../connect';
import Skill from '../models/Skill';
import { ISkill } from '@/types/skill';

export async function getSkills(): Promise<ISkill[]> {
  await connectDB();
  const skills = await Skill.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(skills));
}
