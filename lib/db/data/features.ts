import connectDB from '../connect';
import Feature from '../models/Feature';
import { IFeature } from '@/types/feature';

export async function getFeatures(): Promise<IFeature[]> {
  await connectDB();
  const features = await Feature.find({ isActive: true }).sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(features));
}
