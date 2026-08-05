import connectDB from '../connect';
import Certification from '../models/Certification';
import { ICertification } from '@/types/certification';

export async function getEducation(): Promise<ICertification[]> {
  await connectDB();
  const certs = await Certification.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(certs));
}
