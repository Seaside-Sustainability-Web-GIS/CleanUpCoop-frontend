import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            csrfToken: null,

            // ✅ Set CSRF Token before making requests
            setCsrfToken: async () => {
                try {
                    const response = await fetch('http://localhost:8000/api/set-csrf-token', {
                        method: 'GET',
                        credentials: 'include'
                    });
                    const data = await response.json();
                    if (data.csrftoken) {
                        set({ csrfToken: data.csrftoken });
                    }
                } catch (error) {
                    console.error("Failed to fetch CSRF token", error);
                }
            },

            // ✅ Register User
            register: async ({ email, password, first_name, last_name }) => {
                await get().setCsrfToken(); // Ensure CSRF is set before proceeding
                const csrftoken = get().csrfToken || getCSRFToken();

                if (!csrftoken) {
                    console.error("CSRF token is missing. Cannot register.");
                    return { success: false, message: "CSRF token missing" };
                }

                try {
                    const response = await fetch('http://localhost:8000/api/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken
                        },
                        body: JSON.stringify({ email, password, first_name, last_name }),
                        credentials: 'include'
                    });

                    const data = await response.json();

                    if (response.ok) {
                        set({ user: data.user, isAuthenticated: true });
                        return { success: true, message: "Registration successful!" };
                    } else {
                        return { success: false, message: data.error || "Registration failed" };
                    }
                } catch (error) {
                    console.error("Error during registration:", error);
                    return { success: false, message: "Server error. Please try again later." };
                }
            },

            // ✅ Login User
            login: async (email, password) => {
                await get().setCsrfToken();
                const csrftoken = get().csrfToken || getCSRFToken();

                if (!csrftoken) {
                    console.error("CSRF token is missing. Cannot log in.");
                    return { success: false, message: "CSRF token missing" };
                }

                try {
                    const response = await fetch('http://localhost:8000/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken
                        },
                        body: JSON.stringify({ email, password }),
                        credentials: 'include'
                    });

                    const data = await response.json();
                    console.log("Response Status:", response.status);
                    console.log("Response Data:", data);
                    if (response.ok) {
                        console.log(response.ok);
                        set({ user: data.user, isAuthenticated: true });
                        return { success: true, message: "Login successful!" };
                    } else {
                        return { success: false, message: data.error || "Invalid credentials" };
                    }
                } catch (error) {
                    console.error("Login failed:", error);
                    return { success: false, message: "Server error. Please try again later." };
                }
            },

            // ✅ Logout User
            logout: async () => {
                try {
                    const { setCsrfToken, isAuthenticated } = get();

                    if (!isAuthenticated) {
                        return { success: false, message: "User is not logged in." };
                    }

                    await setCsrfToken();
                    const updatedCsrfToken = get().csrfToken || getCSRFToken();

                    if (!updatedCsrfToken) {
                        return { success: false, message: "CSRF token missing. Cannot log out." };
                    }

                    const response = await fetch('http://localhost:8000/api/logout', {
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': updatedCsrfToken,
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    });

                    if (!response.ok) {
                        return { success: false, message: "Logout failed. Try again later." };
                    }

                    set({ user: null, isAuthenticated: false, csrfToken: null });
                    return { success: true, message: "Logout successful!" };

                } catch (error) {
                    console.error('Logout error:', error);
                    return { success: false, message: "Server error. Try again later." };
                }
            },

            // ✅ Fetch User Session
            fetchUser: async () => {
                try {
                    await get().setCsrfToken();
                    const csrftoken = get().csrfToken || getCSRFToken();

                    const response = await fetch('http://localhost:8000/api/user', {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken
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

// ✅ Improved CSRF Token Retrieval Function
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
