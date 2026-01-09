import { Schema, model, Types } from "mongoose";

const QuizAnswerSchema = new Schema(
  {
    questionIndex: {
      type: Number,
      required: true,
    },

    selectedAnswer: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },
  },
  { _id: false }
);

const QuizAttemptSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    quizId: {
      type: Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },

    answers: {
      type: [QuizAnswerSchema],
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    passed: {
      type: Boolean,
      required: true,
    },

    attemptNumber: {
      type: Number,
      default: 1,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

QuizAttemptSchema.index({ userId: 1, quizId: 1 });

export const QuizAttemptModel = model("QuizAttempt", QuizAttemptSchema);
