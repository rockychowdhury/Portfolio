import connectDB from '../connect';
import Journey from '../models/Journey';
import { IJourney } from '@/types/journey';

export async function getJourney(): Promise<IJourney[]> {
  await connectDB();
  const journey = await Journey.find().sort({ year: -1, order: 1 }).lean();
  return JSON.parse(JSON.stringify(journey));
}
