import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
});

export default api;