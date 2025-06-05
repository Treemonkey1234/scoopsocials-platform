import api from './api';

export const authAPI = {
  login: async (credentials: { emailOrUsername: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData: any) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  updatePreferences: async (preferences: any) => {
    const response = await api.put('/auth/preferences', preferences);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};