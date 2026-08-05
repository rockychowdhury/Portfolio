import connectDB from '../connect';
import StatsCache from '../models/StatsCache';
import { IStatsCache } from '@/types/stats-cache';

export async function getStats(): Promise<IStatsCache | null> {
  await connectDB();
  const stats = await StatsCache.findOne().lean();
  return stats ? JSON.parse(JSON.stringify(stats)) : null;
}
