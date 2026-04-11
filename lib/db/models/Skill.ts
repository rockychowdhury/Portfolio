import mongoose, { Schema, model, models } from "mongoose";

export interface ISkill {
  name: string;
  category: "Top Skills" | "Backend" | "Frontend" | "Database" | "Devops" | "CS Fundamentals";
  icon?: string; // Icon name from lucide or URL
  proficiency?: number; // 0-100
  order: number;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Top Skills", "Backend", "Frontend", "Database", "Devops", "CS Fundamentals"],
    },
    icon: { type: String },
    proficiency: { type: Number, min: 0, max: 100 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Skill = models.Skill || model<ISkill>("Skill", SkillSchema);

export default Skill;
