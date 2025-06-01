import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true, // include if you’re using session cookies
});

export default apiClient;
