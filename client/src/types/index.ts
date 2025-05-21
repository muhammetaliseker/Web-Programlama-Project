export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Book {
  _id: string;
  title: string;
  category: string;
  price: number;
  publisher: string;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Rental {
  _id: string;
  user: User;
  book: Book;
  rentedAt: string;
  returnedAt: string | null;
  status: 'active' | 'returned';
  dueDate: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
} 