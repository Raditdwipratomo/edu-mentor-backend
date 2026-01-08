import mongoose, { model, Schema } from "mongoose";

const userProgress = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    roadmapId: {
      type: Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },

    progress: {
      completedMaterialIds: [
        {
          type: Schema.Types.ObjectId,
          ref: "Material",
        },
      ],

      lastMaterialId: {
        type: Schema.Types.ObjectId,
        ref: "Material",
      },
    },

    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },
  },
  { timestamps: true }
);

export const UserProgress = model("UserProgress", userProgress);
