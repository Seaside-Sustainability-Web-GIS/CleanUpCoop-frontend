import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null, // Stores logged-in user info
  isAuthenticated: false,
  register: (userData) => set({ user: userData, isAuthenticated: true }),
  login: (email, password) => {
    // Dummy authentication logic
    if (email === "test@example.com" && password === "password") {
      set({ user: { email }, isAuthenticated: true });
    } else {
      alert("Invalid credentials!");
    }
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));

export default useAuthStore;
