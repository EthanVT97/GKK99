import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getUsers();
      
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Users fetch failed:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await apiService.updateUserStatus(userId, isActive);
      
      if (response.success && response.data) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? response.data! : user
        ));
        return { success: true };
      } else {
        setError(response.error || 'Failed to update user status');
        return { success: false, message: response.error };
      }
    } catch (error) {
      const message = 'Failed to update user status';
      setError(message);
      return { success: false, message };
    }
  };

  const createSubAdmin = async (userData: Partial<User>) => {
    try {
      const response = await apiService.createSubAdmin(userData);
      
      if (response.success && response.data) {
        setUsers(prev => [...prev, response.data!]);
        return { success: true };
      } else {
        setError(response.error || 'Failed to create sub-admin');
        return { success: false, message: response.error };
      }
    } catch (error) {
      const message = 'Failed to create sub-admin';
      setError(message);
      return { success: false, message };
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    updateUserStatus,
    createSubAdmin,
    refetch: fetchUsers,
  };
};