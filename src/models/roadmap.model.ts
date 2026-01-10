import mongoose, { Schema, model } from "mongoose";

const roadmapSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    interest: String,
    description: String,

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    userPrompt: String,
    aiPrompt: String,
    aiModel: String,
    status: {
      type: String,
      enum: ["draft", "generated"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

export const Roadmap = model("Roadmap", roadmapSchema);
