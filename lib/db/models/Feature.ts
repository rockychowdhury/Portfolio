import mongoose from "mongoose";

const FeatureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    componentId: {
      type: String,
      required: true,
      unique: true,
    },
    order: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Feature = mongoose.models.Feature || mongoose.model("Feature", FeatureSchema);

export default Feature;