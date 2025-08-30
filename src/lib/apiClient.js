import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://cleanupcoop-backend.onrender.com/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

// Add request interceptor to include session token
apiClient.interceptors.request.use(
    (config) => {
        // Get session token from localStorage (auth store persistence)
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
            try {
                const authData = JSON.parse(authStorage);
                const sessionToken = authData.state?.sessionToken;
                if (sessionToken) {
                    config.headers['X-Session-Token'] = sessionToken;
                }
            } catch (error) {
                console.error('Error parsing auth storage:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
