import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received from: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      code: error.code
    });

    if (error.code === 'ECONNREFUSED') {
      console.error('💥 Backend server is not running or inaccessible');
      alert('Cannot connect to server. Please make sure the backend is running on port 5000.');
    }

    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  search: (name) => api.get(`/products/search?name=${encodeURIComponent(name)}`),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  import: (formData) => api.post('/products/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  export: () => api.get('/products/export', { responseType: 'blob' })
};

// Enhanced Inventory History API
export const inventoryAPI = {
  getHistory: (productId) => api.get(`/inventory/${productId}/history`),
  getAllHistory: (limit = 50) => api.get(`/inventory?limit=${limit}`),
  getStats: () => api.get('/inventory/stats/summary'),
  healthCheck: () => api.get('/inventory/health/check')
};

// Test connection
export const testConnection = async () => {
  try {
    const response = await api.get('/health');
    console.log('✅ Backend connection test:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Backend connection test failed:', error.message);
    return false;
  }
};

export default api;