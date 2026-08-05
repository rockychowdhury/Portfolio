import mongoose, { Schema, model, models } from "mongoose";
import type { IFeatureCard } from "@/types/feature-card";

export type { IFeatureCard };

const FeatureCardSchema = new Schema<IFeatureCard>(
  {
    projectId: { type: String, required: true },
    headline: { type: String, required: true },
    subtext: { type: String, required: true },
    image: { type: String, required: true },
    ctaLabel: { type: String, default: "See how →" },
    ctaLink: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// In development, delete cached model to ensure updated schema is registered
if (process.env.NODE_ENV === "development" && mongoose.models.FeatureCard) {
  delete mongoose.models.FeatureCard;
}

const FeatureCard = models.FeatureCard || model<IFeatureCard>("FeatureCard", FeatureCardSchema);

export default FeatureCard;
