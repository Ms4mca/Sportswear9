import BASE_URL from "../store/Baseurl";
// Centralized API Configuration

const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || BASE_URL,
  TIMEOUT: 30000,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// Cache implementation
class APICache {
  constructor() {
    this.cache = new Map();
  }

  set(key, data, duration = API_CONFIG.CACHE_DURATION) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      duration,
    });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const { data, timestamp, duration } = cached;
    const isExpired = Date.now() - timestamp > duration;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return data;
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}

export const apiCache = new APICache();

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register/',
    LOGIN: '/auth/login/',
    SEND_OTP: '/auth/send-otp/',
    VERIFY_OTP: '/auth/verify-otp/',
    SET_PASSWORD: '/auth/set-password/',
    FORGOT_PASSWORD: '/auth/forgot-password/',
    RESET_PASSWORD: '/auth/reset-password/',
    REFRESH_TOKEN: '/auth/token/refresh/',
    GOOGLE_LOGIN: '/auth/google/token/',
  },
  
  // Profile
  PROFILE: {
    GET: '/profile/me/',
    UPDATE: '/profile/me/',
  },
  
  // Products
  PRODUCTS: {
    LIST: '/api/products/',
    DETAIL: (uuid) => `/api/products/${uuid}/`,
    SEARCH: '/api/products/search/',
    FEATURED: '/api/products/featured/',
    CATEGORY: (catuuid) => `/api/products/?category=${catuuid}`,
    CATEGORIES: "/api/categories/",
  },
  
  // Brands
  BRANDS: {
    LIST: '/api/brands/',
    DETAIL: (name) => `/api/brands/${name}/`,
  },

  // Contact
  CONTACT: {
    SUBMIT: '/api/v1/contact/',
  },
  
  // Cart
  CART: {
    GET: '/api/v1/cart/',
    ADD: '/api/v1/cart/add/',
    UPDATE: (id) => `/api/v1/cart-items/${id}/`,
    REMOVE: (id) => `/api/v1/cart-items/${id}/`,
  },
  
  // Orders
  ORDERS: {
    LIST: '/api/v1/orders/',
    DETAIL: (id) => `/api/v1/orders/${id}/`,
    PLACE: '/api/v1/orders/place_order/',
    CHECK_TASK: '/api/v1/orders/check_task/',
  },
  
  // Reviews
  REVIEWS: {
    LIST: '/api/v1/reviews/',
    DETAIL: (id) => `/api/v1/reviews/${id}/`,
  },
  
  // Payments
  PAYMENTS: {
    CREATE_ORDER: '/api/v1/payments/create-razorpay-order/',
    VERIFY: '/api/v1/payments/verify/',
  },
  
  // Homepage
  HOMEPAGE: {
    LEVELS: '/api/main/levels/',
  },
  
  // Recently Viewed
  RECENTLY_VIEWED: '/api/v1/recently-viewed/',
  
  // Store Details
  STORE_DETAILS: '/api/v1/settings/store_details/',
  
  // Tickets
  TICKETS: {
    CREATE: '/api/v1/contact/tickets/',
    MY_TICKETS: '/api/v1/contact/tickets/my/',
    DETAIL: (ticketRef) => `/api/v1/contact/tickets/${ticketRef}/`,
    REPLY: (ticketRef) => `/api/v1/contact/tickets/${ticketRef}/reply/`,
    LOOKUP: '/api/v1/contact/tickets/lookup/',
    RATE: (ticketRef) => `/api/v1/contact/tickets/${ticketRef}/rate/`,
  },
  
  // Suggestions
  SUGGESTIONS: (uuid) => `/api/v1/suggestions/${uuid}/`,
  
  // Complete Look
  COMPLETE_LOOK: (uuid) => `/api/v1/complete-look/${uuid}/`,
};

// Request handler with caching
export const makeRequest = async (endpoint, options = {}, useCache = false) => {
  const token = localStorage.getItem('access_token');
  
  const { method = 'GET', body, headers = {}, isMultipart = false, ...rest } = options;

  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const cacheKey = `${method}_${url}`;

  // Prepare headers
  const requestHeaders = { ...headers };

  // Only set Content-Type for non-multipart JSON requests
  if (!isMultipart && !(body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  // Add auth token if needed
  if (token && !options.skipAuth) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions = {
    method,
    headers: requestHeaders,
    ...rest,
  };

  // FIXED: Handle body correctly - don't double stringify
  if (body) {
    if (body instanceof FormData) {
      // For FormData, pass as is (don't set Content-Type, browser will set it with boundary)
      fetchOptions.body = body;
      // Remove Content-Type header so browser can set it correctly with boundary
      delete fetchOptions.headers['Content-Type'];
    } else if (typeof body === 'string') {
      // If body is already a string (from JSON.stringify in api.js), use it as is
      fetchOptions.body = body;
    } else {
      // If body is an object, stringify it
      fetchOptions.body = JSON.stringify(body);
    }
  }

  // Check cache for GET requests (optional)
  if (useCache && method === 'GET') {
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 204 No Content (success with empty response)
    if (response.status === 204) {
      return null;
    }

    // Try to parse JSON; if content-type is not JSON, return text
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        data?.detail ||
        data?.message ||
        data?.error ||
        (typeof data === 'string' ? data : JSON.stringify(data)) ||
        response.statusText;
      throw new Error(errorMessage);
    }

    // Cache successful GET requests
    if (useCache && method === 'GET') {
      apiCache.set(cacheKey, data);
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    if (error instanceof TypeError) {
      throw new Error('Unable to reach API server. Check CORS, SSL, or backend availability.');
    }
    throw error;
  }
};

// Export base URL for media files
export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_CONFIG.BASE_URL}${path}`;
};

export default API_CONFIG;
