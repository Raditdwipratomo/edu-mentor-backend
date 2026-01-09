import { Schema, model, Types } from "mongoose";

const QuizQuestionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },

    options: [
      {
        key: {
          type: String,
          enum: ["A", "B", "C", "D"],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
      },
    ],

    correctAnswer: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },

    explanation: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const QuizSchema = new Schema(
  {
    roadmapId: {
      type: Types.ObjectId,
      ref: "Roadmap",
      required: true,
      index: true,
    },

    chapterId: {
      type: Types.ObjectId,
      ref: "Chapter",
      required: true,
      unique: true, // 1 quiz per chapter
    },

    title: {
      type: String,
      required: true,
    },

    questions: {
      type: [QuizQuestionSchema],
      validate: [
        (v: any) => v.length > 0,
        "Quiz must have at least one question",
      ],
    },

    totalQuestions: Number,

    passingScore: {
      type: Number,
      default: 70,
    },

    createdBy: {
      type: String,
      enum: ["ai", "admin"],
      default: "ai",
    },
  },
  { timestamps: true }
);

export const QuizModel = model("Quiz", QuizSchema);
