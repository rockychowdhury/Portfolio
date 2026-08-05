import { getTestimonials } from "@/lib/db/data/testimonials";
import TestimonialsClient from "./TestimonialsClient";

export default async function TestimonialsSection() {
  const data = await getTestimonials();
  return <TestimonialsClient initialData={data} />;
}
