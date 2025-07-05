import {
  User,
  LoginCredentials,
  AuthResponse,
  ContentData,
  ApiResponse
} from '../types';

// Mock users data
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    role: 'main_admin',
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'subadmin1',
    role: 'sub_admin',
    isActive: true,
    lastLogin: '2024-07-04T10:30:00Z',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    username: 'subadmin2',
    role: 'sub_admin',
    isActive: true,
    lastLogin: '2024-07-03T15:45:00Z',
    createdAt: '2024-02-01T00:00:00Z'
  }
];

// Mock passwords
const MOCK_PASSWORDS: Record<string, string> = {
  'admin': 'gkk99admin2024',
  'subadmin1': 'gkk99sub2024',
  'subadmin2': 'gkk99sub2024'
};

// Mock content data
const MOCK_CONTENT: ContentData = {
  id: '1',
  title: 'GKK99 - မြန်မာ AI ချတ်ဘော့ဝန်ဆောင်မှု',
  description: '၂၄ နာရီ အချိန်မရွေး သင့်အတွက် အဖြေများ ပေးနိုင်သော ဉာဏ်ရည်တုံ့ပြန်မှု စနစ်',
  gkk99Link: 'https://www.gkk99.com/',
  gkk777Link: 'https://7777gkkk.info/',
  viberLink: 'viber://pa?chatURI=chatbotnhantri',
  pricing: {
    slots: '20 Ks',
    freeSpin: '1000 Ks',
    winRate: '96.5%',
    gkk99Bonus: '30,000 Ks',
    gkk777Bonus: '30,000 Ks'
  },
  updatedAt: new Date().toISOString(),
  updatedBy: 'admin'
};

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

  private async mockDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateMockToken(user: User): string {
    return `mock_token_${user.id}_${Date.now()}`;
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
      // Mock delay to simulate network request
      await this.mockDelay();

      const user = MOCK_USERS.find(u => u.username === credentials.username);
      
      if (!user) {
        return {
          success: false,
          message: 'အသုံးပြုသူအမည် မတွေ့ရှိပါ',
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          message: 'သင့်အကောင့်ကို ပိတ်ထားပါသည်',
        };
      }

      const expectedPassword = MOCK_PASSWORDS[credentials.username];
      if (credentials.password !== expectedPassword) {
        return {
          success: false,
          message: 'စကားဝှက် မှားယွင်းနေပါသည်',
        };
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      
      // Generate token
      const token = this.generateMockToken(user);
      this.setToken(token);

      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_user', JSON.stringify(user));
      }

      return {
        success: true,
        user,
        token,
        message: 'အောင်မြင်စွာ ဝင်ရောက်ပြီးပါပြီ',
      };
    } catch (error) {
      return {
        success: false,
        message: 'ဝင်ရောက်ရာတွင် ပြဿနာရှိနေပါသည်။ ပြန်လည်ကြိုးစားပါ။',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.mockDelay(200);
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
    try {
      await this.mockDelay(300);

      if (!this.token || !this.token.startsWith('mock_token_')) {
        return {
          success: false,
          error: 'Invalid token',
        };
      }

      const storedUser = localStorage.getItem('admin_user');
      if (!storedUser) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      const user = JSON.parse(storedUser) as User;
      
      // Check if user still exists and is active
      const currentUser = MOCK_USERS.find(u => u.id === user.id);
      if (!currentUser || !currentUser.isActive) {
        return {
          success: false,
          error: 'User inactive or not found',
        };
      }

      return {
        success: true,
        data: currentUser,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Token verification failed',
      };
    }
  }

  // ===== Users =====

  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      await this.mockDelay();

      if (!this.token) {
        return {
          success: false,
          error: 'Unauthorized',
        };
      }

      return {
        success: true,
        data: MOCK_USERS,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch users',
      };
    }
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<ApiResponse<User>> {
    try {
      await this.mockDelay();

      const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Don't allow deactivating main admin
      if (MOCK_USERS[userIndex].role === 'main_admin' && !isActive) {
        return {
          success: false,
          error: 'Cannot deactivate main admin',
        };
      }

      MOCK_USERS[userIndex].isActive = isActive;

      return {
        success: true,
        data: MOCK_USERS[userIndex],
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update user status',
      };
    }
  }

  async createSubAdmin(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      await this.mockDelay();

      const newUser: User = {
        id: (MOCK_USERS.length + 1).toString(),
        username: userData.username || '',
        role: 'sub_admin',
        isActive: true,
        lastLogin: null,
        createdAt: new Date().toISOString(),
      };

      MOCK_USERS.push(newUser);

      return {
        success: true,
        data: newUser,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create sub-admin',
      };
    }
  }

  // ===== Content =====

  async getContent(): Promise<ApiResponse<ContentData>> {
    try {
      await this.mockDelay();

      return {
        success: true,
        data: MOCK_CONTENT,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch content',
      };
    }
  }

  async updateContent(content: Partial<ContentData>): Promise<ApiResponse<ContentData>> {
    try {
      await this.mockDelay();

      // Update mock content
      Object.assign(MOCK_CONTENT, content, {
        updatedAt: new Date().toISOString(),
      });

      return {
        success: true,
        data: MOCK_CONTENT,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update content',
      };
    }
  }

  // ===== Analytics =====

  async getAnalytics(): Promise<ApiResponse<any>> {
    try {
      await this.mockDelay();

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
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch analytics',
      };
    }
  }
}

export const apiService = new ApiService();