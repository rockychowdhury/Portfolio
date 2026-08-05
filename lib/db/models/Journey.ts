import mongoose, { Schema, model, models } from "mongoose";
import type { IJourney } from "@/types/journey";

export type { IJourney };

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
