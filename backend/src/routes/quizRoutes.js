// src/routes/quizRoutes.js
import express from "express";
import Quiz from "../models/quizModel.js";
import { protect, isSuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/quizzes
 * public - returns quizzes WITHOUT correctAnswer
 */
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "username role");
    const safe = quizzes.map(q => {
      const obj = q.toObject();
      obj.questions = obj.questions.map(({ _id, question, options }) => ({ _id, question, options }));
      return obj;
    });
    res.json(safe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/quizzes/:id
 * public - single quiz (no correctAnswer)
 */
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("createdBy", "username role");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const obj = quiz.toObject();
    obj.questions = obj.questions.map(({ _id, question, options }) => ({ _id, question, options }));
    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/quizzes
 * super_admin only
 * body: { title, description, questions: [{ question, options: [], correctAnswer }, ...] }
 */
router.post("/", protect, isSuperAdmin, async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    if (!title) return res.status(400).json({ message: "title required" });
    if (!Array.isArray(questions) || questions.length === 0)
      return res.status(400).json({ message: "questions array required" });

    // validate each question
    for (const q of questions) {
      if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || !q.correctAnswer) {
        return res.status(400).json({
          message: "Each question needs question, options (>=2) and correctAnswer"
        });
      }
      if (!q.options.includes(q.correctAnswer))
        return res.status(400).json({ message: "correctAnswer must be one of the options" });
    }

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      createdBy: req.user._id
    });

    // return created quiz without correctAnswer
    const obj = quiz.toObject();
    obj.questions = obj.questions.map(({ _id, question, options }) => ({ _id, question, options }));
    res.status(201).json(obj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT /api/quizzes/:id
 * super_admin only
 * body can include title, description, questions (replace entire questions array)
 */
router.put("/:id", protect, isSuperAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const { title, description, questions } = req.body;
    if (title !== undefined) quiz.title = title;
    if (description !== undefined) quiz.description = description;
    if (questions !== undefined) {
      if (!Array.isArray(questions)) return res.status(400).json({ message: "questions must be array" });
      for (const q of questions) {
        if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || !q.correctAnswer)
          return res.status(400).json({ message: "Invalid question format" });
        if (!q.options.includes(q.correctAnswer))
          return res.status(400).json({ message: "correctAnswer must be one of options" });
      }
      quiz.questions = questions;
    }

    await quiz.save();

    const obj = quiz.toObject();
    obj.questions = obj.questions.map(({ _id, question, options }) => ({ _id, question, options }));
    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * DELETE /api/quizzes/:id
 * super_admin only
 */
router.delete("/:id", protect, isSuperAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
