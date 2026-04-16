import mongoose, { Schema, model, models } from "mongoose";
import Skill, { ISkill } from "./Skill";

export interface IProject {
  _id?: string;
  title: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  skills: (string | ISkill)[];
  githubLink?: string;
  liveLink?: string;
  previewLink?: string;
  videoLink?: string;
  isFeatured: boolean;
  order: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    thumbnail: { type: String, required: true },
    skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    githubLink: { type: String },
    liveLink: { type: String },
    previewLink: { type: String },
    videoLink: { type: String },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { 
    timestamps: true,
    strictPopulate: false 
  }
);


// In development, we need to delete the model from mongoose.models 
// to ensure that the updated schema (especially the new 'skills' field) 
// is correctly registered and doesn't conflict with cached versions.
if (process.env.NODE_ENV === "development" && mongoose.models.Project) {
  delete mongoose.models.Project;
}

const Project = models.Project || model<IProject>("Project", ProjectSchema);


export default Project;

