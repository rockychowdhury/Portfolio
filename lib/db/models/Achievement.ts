import mongoose, { Schema, model, models } from "mongoose";

export interface IAchievement {
  title: string;
  date: string; // "MMM YYYY" format
  date_sortable: Date;
  img_url?: string;
  handle?: string;
  strength: number; // 1-5
}

const AchievementSchema = new Schema<IAchievement>(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    date_sortable: { type: Date, required: true },
    img_url: { type: String },
    handle: { type: String },
    strength: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

const Achievement = models.Achievement || model<IAchievement>("Achievement", AchievementSchema);

export default Achievement;
