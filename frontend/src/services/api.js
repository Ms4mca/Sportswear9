import { makeRequest, API_ENDPOINTS } from "./apiConfig";

// Token management
export const storeTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem('access_token', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const authAPI = {
  register: async (fullName, gender, email, password, confirmPassword) => {
  return makeRequest(API_ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    body: {
      full_name: fullName,
      gender: gender,  // Make sure this matches backend expected values (M/male/Male etc.)
      email: email,
      password: password,
      confirm_password: confirmPassword,  // Make sure field name matches exactly
    },
    skipAuth: true,
  });
},

  sendOTP: async (email) => {
    return makeRequest(API_ENDPOINTS.AUTH.SEND_OTP, {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
  },

  verifyOTP: async (email, otp) => {
    return makeRequest(API_ENDPOINTS.AUTH.VERIFY_OTP, {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
      skipAuth: true,
    });
  },

  setPassword: async (email, password, confirmPassword) => {
    return makeRequest(API_ENDPOINTS.AUTH.SET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        confirm_password: confirmPassword
      }),
      skipAuth: true,
    });
  },

  login: async (identifier, password) => {
    return makeRequest(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
      skipAuth: true,
    });
  },

  forgotPassword: async (email) => {
    return makeRequest(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
  },

  resetPassword: async (email, otp, password, confirmPassword) => {
    return makeRequest(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({
        email,
        otp,
        password,
        confirm_password: confirmPassword
      }),
      skipAuth: true,
    });
  },

  googleLogin: async (accessToken) => {
    return makeRequest(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
      method: 'POST',
      body: JSON.stringify({ access_token: accessToken }),
      skipAuth: true,
    });
  },

  getCurrentUser: async () => {
    return makeRequest('/profile/me/', {
      method: 'GET',
    });
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    return makeRequest(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
      skipAuth: true,
    });
  },
};

export const profileAPI = {
  getProfile: async () => {
    return makeRequest(API_ENDPOINTS.PROFILE.GET, {
      method: 'GET',
    });
  },

  updateProfile: async (profileData) => {
    return makeRequest(API_ENDPOINTS.PROFILE.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};
