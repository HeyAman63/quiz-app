// src/models/responseModel.js
import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  answer:     { type: String, required: true }
}, { _id: false });

const responseSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quizId:      { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  answers:     { type: [answerSchema], required: true },
  score:       { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Response", responseSchema);
