import mongoose, { Schema, model, models } from "mongoose";

export interface ISkill {
  name: string;
  icon: string;
  description: string;
  group: string;
  is_top_skill: boolean;
  order: number;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    group: {
      type: String,
      required: true,
      enum: [
        "frontend",
        "backend",
        "devops",
        "database",
        "cs-fundamentals",
        "tools",
      ],
    },
    is_top_skill: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Skill = models.Skill || model<ISkill>("Skill", SkillSchema);

export default Skill;
