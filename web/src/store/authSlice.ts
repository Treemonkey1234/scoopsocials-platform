import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Services
import { authAPI } from '../services/auth';

// Types
interface User {
  _id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  trustScore: {
    current: number;
    factors: any;
    lastCalculated: string;
  };
  socialAccounts: Array<{
    platform: string;
    username: string;
    profileUrl: string;
    verified: boolean;
  }>;
  isVerified: boolean;
  accountStatus: string;
  preferences: {
    privacy: {
      profileVisibility: string;
      showTrustScore: boolean;
      allowFriendRequests: boolean;
      showOnMap: boolean;
    };
    notifications: {
      email: boolean;
      push: boolean;
      friendRequests: boolean;
      eventInvites: boolean;
      trustScoreUpdates: boolean;
    };
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  bio?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      
      return {
        user: response.user,
        token: response.token,
        success: true,
      };
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Login failed',
      });
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      
      return {
        user: response.user,
        token: response.token,
        success: true,
      };
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Registration failed',
      });
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await authAPI.getProfile();
      
      return {
        user: response.user,
        token,
      };
    } catch (error: any) {
      // Clear invalid token
      localStorage.removeItem('token');
      return rejectWithValue({
        message: 'Authentication failed',
      });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      return response.user;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Profile update failed',
      });
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'auth/updatePreferences',
  async (preferences: Partial<User['preferences']>, { rejectWithValue }) => {
    try {
      const response = await authAPI.updatePreferences(preferences);
      return response.preferences;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Preferences update failed',
      });
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateTrustScore: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.trustScore.current = action.payload;
        state.user.trustScore.lastCalculated = new Date().toISOString();
      }
    },
    addSocialAccount: (state, action: PayloadAction<User['socialAccounts'][0]>) => {
      if (state.user) {
        state.user.socialAccounts.push(action.payload);
      }
    },
    removeSocialAccount: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.socialAccounts = state.user.socialAccounts.filter(
          account => account.platform !== action.payload
        );
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
      });

    // Check Auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Profile update failed';
      });

    // Update Preferences
    builder
      .addCase(updatePreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user.preferences = { ...state.user.preferences, ...action.payload };
        }
        state.error = null;
      })
      .addCase(updatePreferences.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Preferences update failed';
      });
  },
});

export const { 
  clearError, 
  updateUser, 
  updateTrustScore, 
  addSocialAccount, 
  removeSocialAccount,
  setLoading 
} = authSlice.actions;

export default authSlice.reducer;