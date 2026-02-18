import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
// 1. Create the Axios Instance
const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api', // Your Java Backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Request Interceptor: Attaches Token to Every Request
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor: Handle Global Errors (Optional)
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            console.error("Unauthorized! Redirecting to login...");
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;