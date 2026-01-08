import mongoose, { model, Schema } from "mongoose";

const materialSchema = new Schema(
  {
    subchapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubChapter",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      enum: ["article", "markdown"],
      default: "article",
    },
    aiModel: String,
    aiPrompt: String,
    tokenUsage: {
      type: Number,
      default: 0,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const Material = model("Material", materialSchema);
