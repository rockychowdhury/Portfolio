import mongoose, { Schema, model, models } from "mongoose";

export interface IJourney {
  title: string;
  organization: string;
  duration: string;
  description: string[];
  startDate: Date;
  icon?: string;
  type: "work" | "education" | "leadership" | "achievement";
}

const JourneySchema = new Schema<IJourney>(
  {
    title: { type: String, required: true },
    organization: { type: String, required: true },
    duration: { type: String, required: true },
    description: [{ type: String }],
    startDate: { type: Date, required: true },
    icon: { type: String },
    type: { type: String, enum: ["work", "education", "leadership", "achievement"], default: "achievement" },
  },
  { timestamps: true }
);

const Journey = models.Journey || model<IJourney>("Journey", JourneySchema);

export default Journey;
