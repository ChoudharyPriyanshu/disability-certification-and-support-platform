import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - Add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.patch('/auth/profile', data),
};

// Applications API
export const applicationsAPI = {
    submit: (data) => api.post('/applications', data),
    getAll: (params) => api.get('/applications', { params }),
    getById: (id) => api.get(`/applications/${id}`),
    uploadDocuments: (id, formData) =>
        api.patch(`/applications/${id}/documents`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
    updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data),
    assignDoctor: (id, doctorId) => api.patch(`/applications/${id}/assign-doctor`, { doctorId }),
    submitAssessment: (id, data) => api.patch(`/applications/${id}/assessment`, data),
};

// Certificates API
export const certificatesAPI = {
    issue: (applicationId) => api.post('/certificates/issue', { applicationId }),
    getById: (id) => api.get(`/certificates/${id}`),
    getByApplication: (applicationId) => api.get(`/certificates/application/${applicationId}`),
    getMyCertificates: () => api.get('/certificates/my-certificates'),
    verify: (params) => api.get('/certificates/verify', { params }),
};

// Schemes API
export const schemesAPI = {
    getAll: (params) => api.get('/schemes', { params }),
    getById: (id) => api.get(`/schemes/${id}`),
    create: (data) => api.post('/schemes', data),
    update: (id, data) => api.patch(`/schemes/${id}`, data),
    delete: (id) => api.delete(`/schemes/${id}`),
};

// Equipment API
export const equipmentAPI = {
    getAll: (params) => api.get('/equipment', { params }),
    getById: (id) => api.get(`/equipment/${id}`),
    create: (data) => api.post('/equipment', data),
    update: (id, data) => api.patch(`/equipment/${id}`, data),
    delete: (id) => api.delete(`/equipment/${id}`),
};
