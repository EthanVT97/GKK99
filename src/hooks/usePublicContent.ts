import { useState, useEffect, useCallback } from 'react';
import { ContentData } from '../types';
import { apiService } from '../services/api';

export const usePublicContent = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getPublicContent();
      
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

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
  };
};