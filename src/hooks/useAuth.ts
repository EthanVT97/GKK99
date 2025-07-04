import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const storedUser = localStorage.getItem('admin_user');
      const token = localStorage.getItem('admin_token');

      if (!token || !storedUser) {
        setUser(null);
        return;
      }

      // Verify token with server
      const response = await apiService.verifyToken();
      
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        // Token invalid, clear storage
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setError('Authentication verification failed');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.login({ username, password });
      
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true };
      } else {
        setError(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = 'Login failed. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isMainAdmin: user?.role === 'main_admin',
    isSubAdmin: user?.role === 'sub_admin',
  };
};