import mongoose, { Schema, model } from "mongoose";

const chapterSchema = new Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
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

export const Chapter = model("Chapter", chapterSchema);
