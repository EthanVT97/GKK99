import { useState, useEffect, useCallback } from 'react';
import { ContentData } from '../types';
import { apiService } from '../services/api';

export const useContent = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getContent();
      
      if (response.success && response.data) {
        setContent(response.data);
      } else {
        setError(response.error || 'Failed to fetch content');
      }
    } catch (error) {
      console.error('Content fetch failed:', error);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContent = async (updates: Partial<ContentData>) => {
    try {
      setSaving(true);
      setError(null);

      const response = await apiService.updateContent(updates);
      
      if (response.success && response.data) {
        setContent(response.data);
        return { success: true };
      } else {
        setError(response.error || 'Failed to update content');
        return { success: false, message: response.error };
      }
    } catch (error) {
      const message = 'Failed to save changes';
      setError(message);
      return { success: false, message };
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    saving,
    updateContent,
    refetch: fetchContent,
  };
};