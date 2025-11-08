import { create } from "zustand";
import api from "../lib/api";

interface AuthState {
  token: string | null;
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isLoading: false,

  // ✅ Register
  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/api/auth/register", { username, email, password });
      console.log("User registered:", res.data);
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Login (fixed)
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/api/auth/login", { email, password });

      // ✅ Your backend returns token + user fields (not user object)
      const { token, ...user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ token, user });
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },

  // ✅ Admin role checker
  isAdmin: () => {
    const user = get().user;
    return user?.role === "super_admin";
  },
}));
