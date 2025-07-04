import {
  User,
  LoginCredentials,
  AuthResponse,
  ContentData,
  ApiResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.gkk99.com';

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
      const url = `${API_BASE_URL}${endpoint}`;

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
      const response = await this.request<AuthResponse>('/auth/login', {
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
        message: 'Login failed. Please try again.',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
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
    return this.request<User>('/auth/verify');
  }

  // ===== Users =====

  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/admin/users');
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<ApiResponse<User>> {
    return this.request<User>(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  async createSubAdmin(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // ===== Content =====

  async getContent(): Promise<ApiResponse<ContentData>> {
    return this.request<ContentData>('/content');
  }

  async updateContent(content: Partial<ContentData>): Promise<ApiResponse<ContentData>> {
    return this.request<ContentData>('/content', {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  }

  // ===== Analytics =====

  async getAnalytics(): Promise<ApiResponse<any>> {
    return this.request<any>('/analytics');
  }
}

export const apiService = new ApiService();