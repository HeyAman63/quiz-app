import api from "../lib/api";

interface Answer {
  questionId: string;
  answer: string;
}

export const responseService = {
  // Submit quiz answers
  submitAnswers: (quizId: string, answers: Answer[]) =>
    api.post("/api/responses/submit", { quizId, answers }),

  // Get logged-in user's quiz attempts
  getMyResponses: () => api.get("/api/responses/me"),

  // Get all responses (Super Admin only)
  getAllResponses: () => api.get("/api/responses"),
};
