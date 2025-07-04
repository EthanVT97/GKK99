export interface User {
  id: string;
  username: string;
  role: 'main_admin' | 'sub_admin';
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface ContentData {
  id: string;
  title: string;
  description: string;
  gkk99Link: string;
  gkk777Link: string;
  viberLink: string;
  pricing: {
    slots: string;
    freeSpin: string;
    winRate: string;
    gkk99Bonus: string;
    gkk777Bonus: string;
  };
  updatedAt: string;
  updatedBy: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}