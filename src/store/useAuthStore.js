import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            csrfToken: null,  // Store CSRF token

            setCsrfToken: async () => {
                try {
                    const response = await fetch('http://localhost:8000/api/set-csrf-token', {
                        method: 'GET',
                        credentials: 'include'
                    });
                    const data = await response.json();
                    if (data.csrftoken) {
                        set({csrfToken: data.csrftoken});
                    }
                } catch (error) {
                    console.error("Failed to fetch CSRF token", error);
                }
            },

            login: async (email, password) => {
                await get().setCsrfToken();
                const csrftoken = get().csrfToken || getCSRFToken();  // Fallback to cookie

                const response = await fetch('http://localhost:8000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({email, password}),
                    credentials: 'include'
                });

                const data = await response.json();
                if (response.ok) {
                    set({user: data.user, isAuthenticated: true});
                } else {
                    set({user: null, isAuthenticated: false});
                }
                return response.ok;
            },

logout: async () => {
    try {
        const { setCsrfToken, csrfToken, set, showSnackbar } = get();

        // Ensure CSRF token is up to date
        await setCsrfToken();
        const csrftoken = csrfToken || getCSRFToken();

        // Perform logout request
        const response = await fetch('http://localhost:8000/api/logout', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const responseData = await response.json();
            console.error("Logout failed:", responseData);
            showSnackbar("Logout failed. Please try again.", "error");
            return;
        }

        // Logout successful
        set({ user: null, isAuthenticated: false, csrfToken: null });
        showSnackbar("You are now logged out!", "info");

    } catch (error) {
        console.error('Logout error:', error);
        showSnackbar("An error occurred while logging out.", "error");
    }
},


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
                        set({user: data, isAuthenticated: true});
                    } else {
                        set({user: null, isAuthenticated: false});
                    }
                } catch (error) {
                    console.error('Failed to fetch user', error);
                    set({user: null, isAuthenticated: false});
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// ✅ Use this function to get CSRF from cookies
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
    if (!cookieValue) {
        throw new Error('Missing CSRF cookie.');
    }
    return cookieValue;
};
