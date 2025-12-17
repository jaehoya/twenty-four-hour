import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000/api',
});

// 요청마다 토큰을 동적으로 붙이기
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;