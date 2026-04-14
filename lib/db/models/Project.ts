import mongoose, { Schema, model, models } from "mongoose";

export interface IProject {
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  isFeatured: boolean;
  order: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    image: { type: String, required: true },
    techStack: [{ type: String }],
    githubUrl: { type: String },
    liveUrl: { type: String },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Project = models.Project || model<IProject>("Project", ProjectSchema);

export default Project;
