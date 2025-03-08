import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const API_BASE_URL = 'https://webgis-django.onrender.com/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      csrfToken: null,

      setCsrfToken: async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/set-csrf-token`, {
            method: 'GET',
            credentials: 'include',
          });
          const data = await response.json();
          if (data.csrftoken) {
            set({ csrfToken: data.csrftoken });
          }
        } catch (error) {
          console.error('Failed to fetch CSRF token', error);
        }
      },

      register: async ({ email, password, first_name, last_name }) => {
        await get().setCsrfToken();
        await new Promise(resolve => setTimeout(resolve, 50));
        const csrftoken = get().csrfToken || getCSRFToken();

        if (!csrftoken || csrftoken === 'undefined') {
          console.error('🚨 CSRF token is missing or invalid. Cannot register.');
          return { success: false, message: 'CSRF token missing or invalid' };
        }

        try {
          const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({ email, password, first_name, last_name }),
            credentials: 'include',
          });

          const data = await response.json();

          if (response.ok) {
            set({ user: data.user, isAuthenticated: true });
            return { success: true, message: 'Registration successful! Check your email for confirmation' };
          } else {
            return { success: false, message: data.error || 'Registration failed' };
          }
        } catch (error) {
          console.error('🚨 Error during registration:', error);
          return { success: false, message: 'Server error. Please try again later.' };
        }
      },

      login: async (email, password) => {
        await get().setCsrfToken();
        const csrftoken = get().csrfToken || getCSRFToken();

        if (!csrftoken) {
          console.error('CSRF token is missing. Cannot log in.');
          return { success: false, message: 'CSRF token missing' };
        }

        try {
          console.log('CSRF Token: ', csrftoken);
          const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
          });

          const data = await response.json();

          if (response.ok) {
            set({ user: data.user, isAuthenticated: true });
            return { success: true, message: 'Login successful!' };
          } else {
            return { success: false, message: data.error || 'Invalid credentials' };
          }
        } catch (error) {
          console.error('Login failed:', error);
          return { success: false, message: 'Server error. Please try again later.' };
        }
      },

      logout: async () => {
        try {
          await get().setCsrfToken();
          const updatedCsrfToken = get().csrfToken || getCSRFToken();

          if (!updatedCsrfToken) {
            console.error('🚨 CSRF token missing. Cannot log out.');
            return { success: false, message: 'CSRF token missing. Cannot log out.' };
          }

          const response = await fetch(`${API_BASE_URL}/logout`, {
            method: 'POST',
            headers: {
              'X-CSRFToken': updatedCsrfToken,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          set(() => ({ user: null, isAuthenticated: false, csrfToken: null }));

          if (response.ok) {
            return { success: true, message: 'Logout successful!' };
          } else {
            return { success: false, message: 'Logout completed, but API returned an error.' };
          }
        } catch (error) {
          console.error('🚨 Logout error:', error);
          return { success: false, message: 'Server error. Try again later.' };
        }
      },

      fetchUser: async () => {
        try {
          await get().setCsrfToken();
          const csrftoken = get().csrfToken || getCSRFToken();

          const response = await fetch(`${API_BASE_URL}/user`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken,
            },
          });

          if (response.ok) {
            const data = await response.json();
            set({ user: data, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error('Failed to fetch user', error);
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Improved CSRF Token Retrieval Function
export const getCSRFToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue || null; // Return null instead of throwing an error
};