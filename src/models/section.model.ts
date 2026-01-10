import mongoose, { model, Schema } from "mongoose";

const sectionSchema = new Schema(
  {
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
      index: true,
    },
    order: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    description: String,
    aiPrompt: String,
  },
  {
    timestamps: true,
  }
);

export const Section = model("Section", sectionSchema);
