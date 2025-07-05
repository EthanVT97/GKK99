import {
  User,
  LoginCredentials,
  AuthResponse,
  ContentData,
  ApiResponse
} from '../types';
import { supabase } from '../lib/supabase';

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token');
    }
  }

  // Type-safe token setter
  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('admin_token', token);
      } else {
        localStorage.removeItem('admin_token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1${endpoint}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // ===== Auth =====

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>('/auth-admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success && response.data?.token) {
        this.setToken(response.data.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_user', JSON.stringify(response.data.user));
        }
      }

      return response.data || response;
    } catch (error) {
      return {
        success: false,
        message: 'ဝင်ရောက်ရာတွင် ပြဿနာရှိနေပါသည်။ ပြန်လည်ကြိုးစားပါ။',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth-admin/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_user');
      }
    }
  }

  async verifyToken(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth-admin/verify');
  }

  // ===== Users =====

  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/admin-api/users');
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<ApiResponse<User>> {
    return this.request<User>(`/admin-api/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  async createSubAdmin(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/admin-api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // ===== Content =====

  async getContent(): Promise<ApiResponse<ContentData>> {
    return this.request<ContentData>('/admin-api/content');
  }

  async updateContent(content: Partial<ContentData>): Promise<ApiResponse<ContentData>> {
    return this.request<ContentData>('/admin-api/content', {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  }

  // ===== Public Content (for landing page) =====

  async getPublicContent(): Promise<ApiResponse<ContentData>> {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      const formattedContent: ContentData = {
        id: data.id,
        title: data.title,
        description: data.description,
        gkk99Link: data.gkk99_link,
        gkk777Link: data.gkk777_link,
        viberLink: data.viber_link,
        pricing: {
          slots: data.pricing_slots,
          freeSpin: data.pricing_free_spin,
          winRate: data.pricing_win_rate,
          gkk99Bonus: data.pricing_gkk99_bonus,
          gkk777Bonus: data.pricing_gkk777_bonus
        },
        updatedAt: data.updated_at,
        updatedBy: data.updated_by
      };

      return {
        success: true,
        data: formattedContent,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch public content',
      };
    }
  }

  // ===== Analytics =====

  async getAnalytics(): Promise<ApiResponse<any>> {
    // This would be implemented with real analytics data
    const mockAnalytics = {
      totalUsers: 1250,
      activeUsers: 890,
      totalSessions: 3420,
      conversionRate: 12.5,
      revenue: 45000,
      topPages: [
        { page: '/', views: 2100 },
        { page: '/features', views: 890 },
        { page: '/about', views: 430 },
      ],
    };

    return {
      success: true,
      data: mockAnalytics,
    };
  }
}

export const apiService = new ApiService();