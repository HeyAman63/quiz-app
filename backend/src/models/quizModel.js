// src/models/quizModel.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question:      { type: String, required: true },
  options:       { type: [String], required: true }, // array of option strings
  correctAnswer: { type: String, required: true }    // exact string matching one option
}, { timestamps: true });

const quizSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  description:{ type: String, default: "" },
  questions:  { type: [questionSchema], default: [] }, // embedded
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt:  { type: Date, default: Date.now }
});

export default mongoose.model("Quiz", quizSchema);
