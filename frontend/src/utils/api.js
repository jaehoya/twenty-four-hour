import axios from "axios";

// 프로덕션 환경에서는 자동으로 현재 도메인의 /api를 사용
// 개발 환경에서는 localhost 또는 환경 변수 사용
export const getBaseURL = () => {
    if (import.meta.env.VITE_API_ENDPOINT) {
        return import.meta.env.VITE_API_ENDPOINT;
    }
    
    // 프로덕션 환경 감지 (localhost가 아닌 경우)
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
        // 현재 도메인의 /api 사용
        return `${window.location.protocol}//${window.location.host}/api`;
    }
    
    // 개발 환경 기본값
    return 'http://localhost:4000/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
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