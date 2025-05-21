import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterCredentials, Book, Rental } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', credentials),
  
  register: (credentials: RegisterCredentials) =>
    api.post<AuthResponse>('/auth/register', credentials),
};

export const books = {
  getAll: () => api.get<Book[]>('/books'),
  
  getById: (id: string) => api.get<Book>(`/books/${id}`),
  
  create: (bookData: Omit<Book, '_id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Book>('/books', bookData),
  
  update: (id: string, bookData: Partial<Book>) =>
    api.put<Book>(`/books/${id}`, bookData),
  
  delete: (id: string) => api.delete(`/books/${id}`),
  
  updateStock: (id: string, stockQuantity: number) =>
    api.patch<Book>(`/books/${id}/stock`, { stockQuantity }),
};

export const rentals = {
  getAll: () => api.get<Rental[]>('/rentals'),
  
  getUserRentals: () => api.get<Rental[]>('/rentals/my-rentals'),
  
  rentBook: (bookId: string) => api.post<Rental>('/rentals', { bookId }),
  
  returnBook: (rentalId: string) =>
    api.patch<Rental>(`/rentals/${rentalId}/return`),
  
  getUserHistory: (userId: string) =>
    api.get<Rental[]>(`/rentals/user/${userId}`),
};

export default api; 