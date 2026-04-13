import { Schema, model, models } from "mongoose";

export interface ITestimonial {
  name: string;
  role: string;
  relationship: "Colleague" | "Mentor" | "Classmate" | "Collaborator" | "Client";
  avatar_url?: string;
  quote: string;
  rating?: number;
  platform: "LinkedIn" | "Direct" | "Email" | "GitHub";
  linkedin_url?: string;
  is_approved: boolean;
  submitted_at: Date;
  approved_at?: Date;
}

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
    rating: { type: Number, min: 1, max: 5 },
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
