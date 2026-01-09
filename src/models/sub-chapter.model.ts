import mongoose, { model, Schema } from "mongoose";

const subChapterSchema = new Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    material: [{ type: mongoose.Schema.Types.ObjectId, ref: "Material" }],
    learningObjective: String,
    aiPrompt: String,
  },
  {
    timestamps: true,
  }
);

export const Subchapter = model("SubChapter", subChapterSchema);
