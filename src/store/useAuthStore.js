import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        if (email === "test@example.com" && password === "password") {
          set({ user: { email }, isAuthenticated: true });
        } else {
          alert("Invalid credentials!");
        }
      },

      register: (userData) => set({ user: userData, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" } // Saves to localStorage
  )
);

export default useAuthStore;