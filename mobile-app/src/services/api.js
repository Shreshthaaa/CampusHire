import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// Opportunities API
export const opportunitiesAPI = {
    getAll: () => api.get('/opportunities'),
    getById: (id) => api.get(`/opportunities/${id}`),
    create: (data) => api.post('/opportunities', data),
    update: (id, data) => api.put(`/opportunities/${id}`, data),
    delete: (id) => api.delete(`/opportunities/${id}`),
    getApplicants: (id) => api.get(`/opportunities/${id}/applicants`),
};

// Applications API
export const applicationsAPI = {
    apply: (opportunityId) => api.post('/applications', { opportunityId }),
    getMyApplications: () => api.get('/applications/my-applications'),
    updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
};

// Admin API
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getAnalytics: () => api.get('/admin/analytics'),
};

export default api;
