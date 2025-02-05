import axios from 'axios';

console.log('Backend URL:', import.meta.env.BACKEND_URL);

const apiURL = 'http://localhost:3000/api';

const axiosInstance = axios.create({
    baseURL: apiURL,
    timeout: 5000,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;