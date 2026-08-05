import connectDB from '../connect';
import Testimonial from '../models/Testimonial';
import { ITestimonial } from '@/types/testimonial';

export async function getTestimonials(): Promise<ITestimonial[]> {
  await connectDB();
  const testimonials = await Testimonial.find({ is_approved: true }).sort({ submitted_at: -1 }).lean();
  return JSON.parse(JSON.stringify(testimonials));
}
