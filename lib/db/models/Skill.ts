import mongoose, { Schema, model, models } from "mongoose";
import type { ISkill } from "@/types/skill";

export type { ISkill };

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    icon_group: { type: String, required: true, default: "si" },
    icon_type: {
      type: String,
      required: true,
      enum: ["icon", "text"],
      default: "icon",
    },
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
    color: { type: String },
  },
  { timestamps: true }
);

const Skill = models.Skill || model<ISkill>("Skill", SkillSchema);

export default Skill;

