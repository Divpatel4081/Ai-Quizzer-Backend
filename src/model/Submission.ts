import mongoose, { Schema, Document, Model } from "mongoose";


export interface Submission extends Document {
  quizId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  responses: {
    questionId: mongoose.Types.ObjectId;
    userResponse: string;
    isCorrect: boolean;
  }[];
  score: number;
  submittedAt: Date;
  retried: boolean;
  createdAt: Date;
  updatedAt: Date;
  subject:string;
}

const SubmissionSchema: Schema<Submission> = new Schema(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    subject:{
      type:String,
      required:true,
    },
    responses: [
      {
        questionId: { type: Schema.Types.ObjectId, required: true },
        userResponse: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    score: {
      type: Number,
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    retried: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true
  },
);

const SubmissionModel = (mongoose.models.Submission as Model<Submission>) || mongoose.model<Submission>("Submission", SubmissionSchema);
export default SubmissionModel;
