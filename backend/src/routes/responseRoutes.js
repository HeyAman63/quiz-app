// src/routes/responseRoutes.js
import express from "express";
import Quiz from "../models/quizModel.js";
import Response from "../models/responseModel.js";
import { protect, isSuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/responses/submit
 * protected
 * body: { quizId, answers: [{ questionId, answer }, ...] }
 */
router.post("/submit", protect, async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    if (!quizId || !Array.isArray(answers)) return res.status(400).json({ message: "quizId and answers required" });

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // build map of correct answers: questionId -> correctAnswer
    const correctMap = new Map();
    for (const q of quiz.questions) {
      correctMap.set(String(q._id), q.correctAnswer);
    }

    // compute score
    let score = 0;
    for (const a of answers) {
      const qid = String(a.questionId);
      if (!correctMap.has(qid)) continue; // ignore mismatched question ids
      if (a.answer === correctMap.get(qid)) score += 1;
    }

    const responseDoc = await Response.create({
      userId: req.user._id,
      quizId,
      answers,
      score
    });

    // build plain object of correct answers to return to the client for result display
    const correctAnswers = {};
    for (const [qid, ans] of correctMap.entries()) {
      correctAnswers[qid] = ans;
    }

    return res.status(201).json({
      message: "Submitted",
      score,
      responseId: responseDoc._id,
      correctAnswers
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/responses/me
 * protected - get my responses
 */
router.get("/me", protect, async (req, res) => {
  try {
    const responses = await Response.find({ userId: req.user._id }).populate("quizId", "title");
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/responses
 * super_admin - view all responses
 */
router.get("/", protect, isSuperAdmin, async (req, res) => {
  try {
    const responses = await Response.find().populate("quizId", "title").populate("userId", "username email");
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
