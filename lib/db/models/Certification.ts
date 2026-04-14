import mongoose, { Schema, model, models } from "mongoose";

export interface ICertification {
  _id: string;
  ins_name: string;
  certificate_name: string;
  certificate_link?: string;
  preview_link?: string;
  type: "education" | "certification";
  start_date?: string;
  end_date?: string;
  issue_date?: string;
  cgpa?: string;
  description?: string;
  ins_web?: string;
  ins_logo?: string;
  order: number;
}

const CertificationSchema = new Schema<ICertification>(
  {
    ins_name: { type: String, required: true },
    certificate_name: { type: String, required: true },
    certificate_link: { type: String },
    preview_link: { type: String },
    type: { type: String, enum: ["education", "certification"], required: true },
    start_date: { type: String },
    end_date: { type: String },
    issue_date: { type: String },
    cgpa: { type: String },
    description: { type: String },
    ins_web: { type: String },
    ins_logo: { type: String },
    order: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

const Certification = models.Certification || model<ICertification>("Certification", CertificationSchema);

export default Certification;
