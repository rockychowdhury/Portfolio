import mongoose, { Schema, model, models } from "mongoose";

export interface IProject {
  _id?: string;
  title: string;
  description: string;         // Internal reference only — never rendered in UI
  readmeLink: string;           // Raw GitHub README URL for the details page
  thumbnail: string;            // Static image URL — shown before video loads
  githubLink: string;           // CTA — links to GitHub repo
  liveLink: string;             // CTA — "Open" button target
  videoPreviewLink: string;     // Direct video file URL (MP4/WebM) — autoplay when in focus
  youtubeLink: string;          // CTA — YouTube demo video
  order: number;                // Controls left-to-right render order (ascending)
}

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
