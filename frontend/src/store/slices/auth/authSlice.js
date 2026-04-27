import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, storeTokens, clearTokens } from '../../../services/api';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  otpEmail: null,
  needsPasswordSet: false,
  sessionChecked: false,
};

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async ({ email }, { rejectWithValue }) => {
    try {
      await authAPI.sendOTP(email);
      return { email };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ fullName, gender, email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      await authAPI.register(fullName, gender, email, password, confirmPassword);
      return { email };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const data = await authAPI.verifyOTP(email, otp);

      if (data.next === 'set_password') {
        return { needsPasswordSet: true, email };
      }

      if (data.access && data.refresh) {
        storeTokens(data.access, data.refresh);
        return { needsPasswordSet: false, tokens: data };
      }

      return { needsPasswordSet: false };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setPassword = createAsyncThunk(
  'auth/setPassword',
  async ({ email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const data = await authAPI.setPassword(email, password, confirmPassword);

      if (data.access && data.refresh) {
        storeTokens(data.access, data.refresh);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authAPI.login(email, password);

      if (data.access && data.refresh) {
        storeTokens(data.access, data.refresh);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      clearTokens();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      await authAPI.forgotPassword(email);
      return { email };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const data = await authAPI.resetPassword(email, otp, newPassword, newPassword);

      if (data.access && data.refresh) {
        storeTokens(data.access, data.refresh);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async ({ accessToken }, { rejectWithValue }) => {
    try {
      const data = await authAPI.googleLogin(accessToken);

      if (data.access && data.refresh) {
        storeTokens(data.access, data.refresh);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Enhanced checkSession with token refresh logic
export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        return { user: null, isAuthenticated: false };
      }

      // First, try to get current user with existing token
      try {
        const user = await authAPI.getCurrentUser();
        return { user, isAuthenticated: true };
      } catch (error) {
        // If 401/403 error, try to refresh token
        if (error.message?.includes('401') || error.message?.includes('expired') || error.message?.includes('Unauthorized')) {
          try {
            const refreshData = await authAPI.refreshToken();
            
            if (refreshData.access) {
              storeTokens(refreshData.access, refreshData.refresh || localStorage.getItem('refresh_token'));
              
              // Retry getting user with new token
              const user = await authAPI.getCurrentUser();
              return { user, isAuthenticated: true };
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens
            clearTokens();
            return { user: null, isAuthenticated: false };
          }
        }
        
        // Other errors, clear tokens
        clearTokens();
        return { user: null, isAuthenticated: false };
      }
    } catch (error) {
      clearTokens();
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setOtpEmail: (state, action) => {
      state.otpEmail = action.payload;
    },
    resetSessionCheck: (state) => {
      state.sessionChecked = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpEmail = action.payload.email;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpEmail = action.payload.email;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.needsPasswordSet) {
          state.needsPasswordSet = true;
          state.otpEmail = action.payload.email;
        } else {
          state.isAuthenticated = true;
          state.otpEmail = null;
          state.needsPasswordSet = false;
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setPassword.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.needsPasswordSet = false;
        state.otpEmail = null;
      })
      .addCase(setPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.sessionChecked = false;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.otpEmail = action.payload.email;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.otpEmail = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionChecked = true;
        if (action.payload && action.payload.isAuthenticated) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkSession.rejected, (state) => {
        state.loading = false;
        state.sessionChecked = true;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setOtpEmail, resetSessionCheck } = authSlice.actions;
export default authSlice.reducer;
