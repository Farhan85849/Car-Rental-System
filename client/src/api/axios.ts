import axios from 'axios';

// In a real Vercel/Railway split deployment, VITE_API_URL would be the Railway URL.
// When running locally or in a single container, it falls back to '/api' or local URL.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
