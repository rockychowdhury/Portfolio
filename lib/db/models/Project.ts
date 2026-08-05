import mongoose, { Schema, model, models } from "mongoose";
import type { IProject } from "@/types/project";

export type { IProject };

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    readmeLink: { type: String, required: true },
    thumbnail: { type: String, required: true },
    githubLink: { type: String, required: true },
    liveLink: { type: String, required: true },
    videoPreviewLink: { type: String, default: "" },
    youtubeLink: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// In development, delete cached model to ensure updated schema is registered
if (process.env.NODE_ENV === "development" && mongoose.models.Project) {
  delete mongoose.models.Project;
}

const Project = models.Project || model<IProject>("Project", ProjectSchema);

export default Project;
