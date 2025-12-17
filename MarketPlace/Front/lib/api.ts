import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string; phone?: string; city?: string; role?: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getMe: () => api.get('/auth/me'),

  updateProfile: (data: { name?: string; phone?: string; city?: string; avatar?: string; bio?: string; skills?: string[]; hourlyRate?: number }) =>
    api.put('/auth/profile', data),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),
};

// Services API
export const servicesApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/services', { params }),

  getById: (id: string) =>
    api.get(`/services/${id}`),

  getMy: (params?: Record<string, any>) =>
    api.get('/services/my', { params }),

  getByUser: (userId: string, params?: Record<string, any>) =>
    api.get(`/services/user/${userId}`, { params }),

  create: (data: FormData) =>
    api.post('/services', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: FormData) =>
    api.put(`/services/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id: string) =>
    api.delete(`/services/${id}`),
};

// Workers API
export const workersApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/workers', { params }),

  getById: (id: string) =>
    api.get(`/workers/${id}`),

  getTopRated: (params?: Record<string, any>) =>
    api.get('/workers/top-rated', { params }),

  becomeWorker: () =>
    api.put('/workers/become-worker'),

  updateProfile: (data: { bio?: string; skills?: string[]; hourlyRate?: number }) =>
    api.put('/workers/profile', data),
};

// Tasks API
export const tasksApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/tasks', { params }),

  getById: (id: string) =>
    api.get(`/tasks/${id}`),

  getMy: (params?: Record<string, any>) =>
    api.get('/tasks/user/my', { params }),

  create: (data: FormData) =>
    api.post('/tasks', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: any) =>
    api.put(`/tasks/${id}`, data),

  delete: (id: string) =>
    api.delete(`/tasks/${id}`),

  accept: (id: string) =>
    api.put(`/tasks/${id}/accept`),

  complete: (id: string) =>
    api.put(`/tasks/${id}/complete`),

  cancel: (id: string) =>
    api.put(`/tasks/${id}/cancel`),
};

// Favorites API
export const favoritesApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/favorites', { params }),

  add: (serviceId: string) =>
    api.post(`/favorites/${serviceId}`),

  remove: (serviceId: string) =>
    api.delete(`/favorites/${serviceId}`),

  check: (serviceId: string) =>
    api.get(`/favorites/check/${serviceId}`),
};

// Conversations API
export const conversationsApi = {
  getAll: () =>
    api.get('/conversations'),

  getById: (id: string) =>
    api.get(`/conversations/${id}`),

  create: (data: { serviceId: string; workerId: string }) =>
    api.post('/conversations', data),

  getMessages: (id: string, params?: Record<string, any>) =>
    api.get(`/conversations/${id}/messages`, { params }),

  sendMessage: (id: string, content: string) =>
    api.post(`/conversations/${id}/messages`, { content }),

  getUnreadCount: () =>
    api.get('/conversations/unread/count'),
};

// Reviews API
export const reviewsApi = {
  getByUser: (userId: string, params?: Record<string, any>) =>
    api.get(`/reviews/user/${userId}`, { params }),

  getByService: (serviceId: string, params?: Record<string, any>) =>
    api.get(`/reviews/service/${serviceId}`, { params }),

  getById: (id: string) =>
    api.get(`/reviews/${id}`),

  getMy: () =>
    api.get('/reviews/user/my/reviews'),

  create: (data: { reviewedId: string; serviceId?: string; taskId?: string; rating: number; comment: string }) =>
    api.post('/reviews', data),

  update: (id: string, data: { rating?: number; comment?: string }) =>
    api.put(`/reviews/${id}`, data),

  delete: (id: string) =>
    api.delete(`/reviews/${id}`),
};

// Admin API
export const adminApi = {
  getStats: () =>
    api.get('/admin/stats'),

  getUsers: (params?: Record<string, any>) =>
    api.get('/admin/users', { params }),

  getListings: (params?: Record<string, any>) =>
    api.get('/admin/listings', { params }),

  updateListingStatus: (id: string, status: string) =>
    api.put(`/admin/listings/${id}/status`, { status }),

  deleteListing: (id: string) =>
    api.delete(`/admin/listings/${id}`),

  updateUserRole: (id: string, role: string) =>
    api.put(`/admin/users/${id}/role`, { role }),
};
