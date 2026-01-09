import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const ResumeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "AI Generated Resume",
    },

    source: {
      type: String,
      enum: ["manual", "ai"],
      default: "ai",
    },

    version: {
      type: Number,
      default: 1,
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      // JSON resume
    },

    format: {
      type: String,
      enum: ["json", "markdown", "pdf"],
    },

    linkedRoadmaps: [
      {
        type: Schema.Types.ObjectId,
        ref: "Roadmap",
      },
    ],

    status: {
      type: String,
      enum: ["draft", "final"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export const Resume = model("Resume", ResumeSchema);
