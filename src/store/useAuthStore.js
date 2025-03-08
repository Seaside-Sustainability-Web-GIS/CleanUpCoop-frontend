import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

const API_BASE_URL = 'https://webgis-django.onrender.com/api';

/**
 * Helper to read the `csrftoken` value from `document.cookie`
 * so we can pass it as needed if the store isn't updated yet.
 */
export const getCSRFToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue || null;
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      csrfToken: null,

      /**
       * 1) Grabs a CSRF token from the server (GET /set-csrf-token)
       * 2) Stores it in the Zustand state if present
       *
       * The server must also set a "Set-Cookie: csrftoken=..." header
       * to allow cross-site cookies in the browser.
       */
      setCsrfToken: async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/set-csrf-token`, {
            withCredentials: true, // Allows cross-site cookie exchange
          });
          const data = response.data;
          // If the API returns { csrftoken: "..." } in JSON
          if (data.csrftoken) {
            set({ csrfToken: data.csrftoken });
          }
        } catch (error) {
          console.error('Failed to fetch CSRF token', error);
        }
      },

      /**
       * Registers a new user
       */
      register: async ({ email, password, first_name, last_name }) => {
        // Ensure we have a fresh CSRF token in state (and in cookies)
        await get().setCsrfToken();
        const csrftoken = get().csrfToken || getCSRFToken();

        if (!csrftoken || csrftoken === 'undefined') {
          console.error('🚨 CSRF token is missing or invalid. Cannot register.');
          return { success: false, message: 'CSRF token missing or invalid' };
        }

        try {
          const response = await axios.post(
            `${API_BASE_URL}/register`,
            { email, password, first_name, last_name },
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
              },
            }
          );

          const data = response.data;
          if (response.status === 200) {
            set({ user: data.user, isAuthenticated: true });
            return {
              success: true,
              message: 'Registration successful! Check your email for confirmation',
            };
          } else {
            return {
              success: false,
              message: data.error || 'Registration failed',
            };
          }
        } catch (error) {
          console.error('🚨 Error during registration:', error);
          return {
            success: false,
            message: 'Server error. Please try again later.',
          };
        }
      },

      /**
       * Logs the user in
       */
      login: async (email, password) => {
        // Ensure we have a fresh CSRF token
        await get().setCsrfToken();
        const csrftoken = get().csrfToken || getCSRFToken();

        if (!csrftoken) {
          console.error('CSRF token is missing. Cannot log in.');
          return { success: false, message: 'CSRF token missing' };
        }

        try {
          console.log('CSRF Token: ', csrftoken);
          const response = await axios.post(
            `${API_BASE_URL}/login`,
            { email, password },
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
              },
            }
          );

          const data = response.data;
          if (response.status === 200) {
            set({ user: data.user, isAuthenticated: true });
            return { success: true, message: 'Login successful!' };
          } else {
            return { success: false, message: data.error || 'Invalid credentials' };
          }
        } catch (error) {
          console.error('Login failed:', error);
          return {
            success: false,
            message: 'Server error. Please try again later.',
          };
        }
      },

      /**
       * Logs the user out
       */
      logout: async () => {
        try {
          // Refresh CSRF token if needed
          await get().setCsrfToken();
          const updatedCsrfToken = get().csrfToken || getCSRFToken();

          if (!updatedCsrfToken) {
            console.error('🚨 CSRF token missing. Cannot log out.');
            return {
              success: false,
              message: 'CSRF token missing. Cannot log out.',
            };
          }

          const response = await axios.post(
            `${API_BASE_URL}/logout`,
            {},
            {
              withCredentials: true,
              headers: {
                'X-CSRFToken': updatedCsrfToken,
                'Content-Type': 'application/json',
              },
            }
          );

          // Clear local user state regardless of the API response
          set({ user: null, isAuthenticated: false, csrfToken: null });

          if (response.status === 200) {
            return { success: true, message: 'Logout successful!' };
          } else {
            return {
              success: false,
              message: 'Logout completed, but API returned an error.',
            };
          }
        } catch (error) {
          console.error('🚨 Logout error:', error);
          return {
            success: false,
            message: 'Server error. Try again later.',
          };
        }
      },

      /**
       * Fetches the current user's info from the server
       */
      fetchUser: async () => {
        try {
          await get().setCsrfToken();
          const csrftoken = get().csrfToken || getCSRFToken();

          const response = await axios.get(`${API_BASE_URL}/user`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken,
            },
          });

          if (response.status === 200) {
            const data = response.data;
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
