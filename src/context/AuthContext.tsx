import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AdminUser, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tüm Axios isteklerine otomatik olarak Token ekleyen yapı
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('remax_admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('remax_admin_token');
    const userStr = localStorage.getItem('remax_admin_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AdminUser;
        setAuthState({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        logout();
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      // GERÇEK BACKEND'E İSTEK ATIYORUZ
      const response = await axios.post('/api/auth/login', { username, password });
      
      const { token, ...user } = response.data;

      localStorage.setItem('remax_admin_token', token);
      localStorage.setItem('remax_admin_user', JSON.stringify(user));

      setAuthState({ user, token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      console.error('Giriş Başarısız:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('remax_admin_token');
    localStorage.removeItem('remax_admin_user');
    setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};