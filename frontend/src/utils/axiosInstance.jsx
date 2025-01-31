import axios from 'axios';

// Configure a reusable Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api', // Base URL for your API
    timeout: 5000, // Request timeout
});

// Add a request interceptor to include the token in all requests
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Or AuthContext
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
