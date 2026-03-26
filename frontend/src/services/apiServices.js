import api from '../utils/api'

export const authService = {
    register: (data) => api.post('/auth/register', data),
    registerAdmin: (data) => api.post('/auth/admin/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
}

export const applicationService = {
    submit: (data) => api.post('/applications', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getMyApplications: () => api.get('/applications/my'),
    getById: (id) => api.get(`/applications/${id}`),
    uploadDocuments: (id, data) => api.post(`/applications/${id}/documents`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    // Admin
    getAll: (params) => api.get('/applications', { params }),
    review: (id, data) => api.put(`/applications/${id}/review`, data),
    assignDoctor: (id, data) => api.put(`/applications/${id}/assign-doctor`, data),
    schedule: (id, data) => api.put(`/applications/${id}/schedule`, data),
    approve: (id, data) => api.put(`/applications/${id}/approve`, data),
    reject: (id, data) => api.put(`/applications/${id}/reject`, data),
}

export const doctorService = {
    getCases: () => api.get('/doctor/cases'),
    getCaseDetail: (id) => api.get(`/doctor/cases/${id}`),
    evaluate: (id, data) => {
        const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        return api.put(`/doctor/cases/${id}/evaluate`, data, config);
    },
    verifyDocument: (id, docId, data) => api.put(`/doctor/cases/${id}/documents/${docId}/verify`, data),
}

export const certificateService = {
    generate: (applicationId) => api.post(`/certificates/generate/${applicationId}`),
    getMyCertificates: () => api.get('/certificates/my'),
    getAll: () => api.get('/certificates'),
    verify: (hash) => api.get(`/certificates/verify/${hash}`),
    getDownloadUrl: (id) => `/api/certificates/${id}/download`,
}

export const schemeService = {
    getAll: (params) => api.get('/schemes', { params }),
    getById: (id) => api.get(`/schemes/${id}`),
    create: (data) => api.post('/schemes', data),
    update: (id, data) => api.put(`/schemes/${id}`, data),
    remove: (id) => api.delete(`/schemes/${id}`),
}

export const productService = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    remove: (id) => api.delete(`/products/${id}`),
}

export const orderService = {
    placeOrder: (data) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders/my'),
    getById: (id) => api.get(`/orders/${id}`),
    createPayment: (id) => api.post(`/orders/${id}/payment`),
    verifyPayment: (id, data) => api.post(`/orders/${id}/verify-payment`, data),
    getAll: () => api.get('/orders'),
}
