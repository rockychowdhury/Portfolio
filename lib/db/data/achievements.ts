import connectDB from '../connect';
import Achievement from '../models/Achievement';
import { IAchievement } from '@/types/achievement';

export async function getAchievements(): Promise<IAchievement[]> {
  await connectDB();
  const achievements = await Achievement.find().sort({ date: -1 }).lean();
  return JSON.parse(JSON.stringify(achievements));
}
