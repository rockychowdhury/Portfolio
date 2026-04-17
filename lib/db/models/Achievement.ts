import mongoose, { Schema, model, models } from "mongoose";

export interface IAchievement {
  category: string;
  title: string;
  organization: string;
  date: string; // "MMM YYYY" format
  date_sortable: Date;
  details?: Record<string, any>;
  tags?: string[];
  img_url?: string;
  handle?: string;
  strength?: number; // 1-5
}

const AchievementSchema = new Schema<IAchievement>(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    organization: { type: String, required: true },
    date: { type: String, required: true },
    date_sortable: { type: Date, required: true },
    details: { type: Schema.Types.Mixed },
    tags: [{ type: String }],
    img_url: { type: String },
    handle: { type: String },
    strength: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

const Achievement = models.Achievement || model<IAchievement>("Achievement", AchievementSchema);

export default Achievement;
