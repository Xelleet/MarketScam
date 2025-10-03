import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api';
const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token){
            config.headers.Authorization = `Token ${token}`;
        }
        return config
    },
    (errors) => {
        return Promise.reject(errors);
    }
)

export const authAPI = {
    login: (credentials) => api.post('/auth/login/', credentials),
    register: (userData) => api.post('/auth/register/', userData),
}