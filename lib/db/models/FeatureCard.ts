import mongoose, { Schema, model, models } from "mongoose";

export interface IFeatureCard {
  _id?: string;
  projectId: string;       // References parent project's slug id (e.g. "petcareplus")
  headline: string;        // e.g. "Real-time Queue with Redis"
  subtext: string;         // One concise sentence explaining the problem or impact
  image: string;           // Visual — screenshot, diagram, or icon illustration
  ctaLabel: string;        // e.g. "See how →" or "Read more"
  ctaLink: string;         // Links to the relevant section of the project detail page
  order: number;
}

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
