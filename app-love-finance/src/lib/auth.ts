// Default user data
export const DEFAULT_USER = {
  email: "admin@admin",
  password: "123123",
  name: "Administrador",
  role: "admin"
};

// User type definition
export interface User {
  email: string;
  password: string;
  name: string;
  role: string;
}

// Authentication functions
export const authenticateUser = (email: string, password: string): User | null => {
  if (email === DEFAULT_USER.email && password === DEFAULT_USER.password) {
    return DEFAULT_USER;
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const login = (user: User): void => {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('user', JSON.stringify(user));
};

export const logout = (): void => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};
