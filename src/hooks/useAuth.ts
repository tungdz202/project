import { useState, useEffect } from 'react';
import { AuthState, User } from '../types';
import { mockUsers } from '../data/mockData';

// API service with token authentication
class ApiService {
  private baseURL = 'https://selected-duck-ethical.ngrok-free.app/api'; // Spring Boot backend URL
  
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async login(username: string, password: string) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      return { 
        user: data.user, 
        token: data.token || data.accessToken 
      };
    } catch (error) {
      // Fallback to mock authentication for demo
      console.warn('API login failed, using mock authentication:', error);
      const user = mockUsers.find(u => u.username === username);
      if (!user || password !== 'password123') {
        throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
      }
      
      // Mock token generation
      const token = `mock_token_${user.id}_${Date.now()}`;
      return { user, token };
    }
  }

  async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    });

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.reload();
      throw new Error('Authentication failed');
    }

    return response;
  }

  async get(endpoint: string) {
    const response = await this.fetchWithAuth(endpoint);
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await this.fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async put(endpoint: string, data: any) {
    const response = await this.fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async delete(endpoint: string) {
    const response = await this.fetchWithAuth(endpoint, {
      method: 'DELETE'
    });
    return response.json();
  }
}

export const apiService = new ApiService();

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Check for existing token and user
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (token && savedUser) {
      const user = JSON.parse(savedUser);
      // Verify token is still valid (you can add API call here)
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });
    } else {
      // Clear any stale data
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Login attempt for username:', username);
      const { user, token } = await apiService.login(username, password);

      // Store token and user info
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));

      console.log('Token stored, updating auth state...');
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });

      console.log('Auth state updated successfully');
      return { success: true };
    } catch (error) {
      console.log('Login error:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi trong quá trình đăng nhập' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  const checkSession = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (!token || !user) {
      logout();
      return false;
    }
    
    // You can add additional token validation here
    // For example, decode JWT and check expiration
    
    return true;
  };

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  return {
    ...authState,
    login,
    logout,
    checkSession,
    getAuthToken,
  };
};