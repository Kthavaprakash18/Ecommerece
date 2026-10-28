import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — normalise errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// Products
export const getProducts = (params = {}) =>
  api.get('/products', { params }).then((r) => r.data);

export const getProductById = (id) =>
  api.get(`/products/${id}`).then((r) => r.data);

// Categories
export const getCategories = () =>
  api.get('/categories').then((r) => r.data);

// Orders
export const placeOrder = (payload) =>
  api.post('/orders', payload).then((r) => r.data);

export const getUserOrders = (userId) =>
  api.get(`/orders/${userId}`).then((r) => r.data);

// Health
export const checkHealth = () =>
  api.get('/health').then((r) => r.data);

export default api;
