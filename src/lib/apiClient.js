import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://seaside-backend-oh06.onrender.com/api/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default apiClient;
