import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data: { name: string; email: string; password: string }) =>
  api.post('/users/register', data);

export const login = (data: { email: string; password: string }) =>
  api.post('/users/login', data);

export const getTasks = () => api.get('/tasks');

export const createTask = (data: { title: string; description: string; dueDate: string }) =>
  api.post('/tasks', data);

export const updateTask = (id: string, data: Partial<{ title: string; description: string; status: string; dueDate: string }>) =>
  api.patch(`/tasks/${id}`, data);

export const deleteTask = (id: string) => api.delete(`/tasks/${id}`);