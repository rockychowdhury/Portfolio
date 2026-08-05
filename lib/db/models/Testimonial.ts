import { Schema, model, models } from "mongoose";
import type { ITestimonial } from "@/types/testimonial";

export type { ITestimonial };

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    relationship: { 
      type: String, 
      required: true,
      enum: ["Colleague", "Mentor", "Classmate", "Collaborator", "Client"]
    },
    avatar_url: { type: String },
    quote: { type: String, required: true, maxlength: 300 },
    platform: { 
      type: String, 
      required: true,
      enum: ["LinkedIn", "Direct", "Email", "GitHub"],
      default: "Direct"
    },
    linkedin_url: { type: String },
    is_approved: { type: Boolean, default: false },
    submitted_at: { type: Date, default: Date.now },
    approved_at: { type: Date },
  },
  { timestamps: true }
);

const Testimonial = models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
