import api from "../lib/api";

// 🧩 AUTH SERVICES
export const authService = {
  register: (username: string, email: string, password: string) =>
    api.post("/api/auth/register", { username, email, password }),

  login: (email: string, password: string) =>
    api.post("/api/auth/login", { email, password }),

  me: () => api.get("/api/auth/me"), // optional if backend supports
};

// 🧩 QUIZ SERVICES
export const quizService = { 
  getAll: () => api.get("/api/quizzes"),

  getById: (quizId: string) => api.get(`/api/quizzes/${quizId}`),

  create: (data: {
    title: string;
    description: string;
    questions: {
      question: string;
      options: string[];
      correctAnswer: string;
    }[];
  }) => api.post("/api/quizzes", data),

  update: (quizId: string, data: any) => api.put(`/api/quizzes/${quizId}`, data),

  delete: (quizId: string) => api.delete(`/api/quizzes/${quizId}`),
};

// 🧩 RESPONSE SERVICES
export const responseService = {
  submit: (quizId: string, answers: any[]) =>
    api.post("/api/responses/submit", { quizId, answers }),

  getMine: () => api.get("/api/responses/me"),

  getAll: () => api.get("/api/responses"), // Super Admin only
};

// 🧩 UTILITY SERVICES
export const utilityService = {
  healthCheck: () => api.get("/health"),
};
