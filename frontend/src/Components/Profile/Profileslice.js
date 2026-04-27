import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest, API_ENDPOINTS } from "../../services/apiConfig";

// Helper: Get token with validation
const getValidToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token || token.trim() === "" || token.split('.').length !== 3) {
    return null;
  }
  return token;
};

// Helper: Check if token is expired
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

// Fetch profile info
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = getValidToken();
      if (!token || isTokenExpired(token)) {
        throw new Error("Invalid or expired token");
      }

      const data = await makeRequest(API_ENDPOINTS.PROFILE.GET);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Recently Viewed Products
export const fetchRecentlyViewed = createAsyncThunk(
  "profile/fetchRecentlyViewed",
  async (_, { rejectWithValue }) => {
    try {
      const token = getValidToken();
      if (!token || isTokenExpired(token)) {
        return [];
      }

      const data = await makeRequest(API_ENDPOINTS.RECENTLY_VIEWED);
      
      console.log("🔍 Raw API Response:", data); // Add this to debug

      // Handle paginated response with 'results' array
      let items = [];
      if (data && data.results && Array.isArray(data.results)) {
        items = data.results;
      } else if (Array.isArray(data)) {
        items = data;
      } else {
        return [];
      }

      const transformed = items.map((item) => {
        const product = item.product || item;
        return {
          id: product.product_uuid || product.id,
          product_uuid: product.product_uuid,
          title: product.name || product.title,
          price: product.price,
          original: product.original || "",
          discount: product.discount || "",
          brand: product.brand?.name || product.brand || "",
          category: product.category?.name || "Uncategorized",
          img: product.img || product.image || "",
          img2: product.img2 || "",
          average_rating: product.average_rating || 4.5,
          isFeatured: product.is_featured || false,
          viewed_at: item.viewed_at,
        };
      });

      console.log("🔍 Transformed Data:", transformed); // Add this to debug
      return transformed;
    } catch (error) {
      console.error("Error fetching recently viewed:", error);
      return [];
    }
  }
);

// Fetch Product Recommendations
export const fetchRecommendations = createAsyncThunk(
  "profile/fetchRecommendations",
  async (_, { rejectWithValue }) => {
    try {
      const token = getValidToken();
      if (!token || isTokenExpired(token)) {
        return [];
      }

      const data = await makeRequest(API_ENDPOINTS.RECOMMENDATIONS);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }
);

// Fetch Product Suggestions by UUID
export const fetchSuggestions = createAsyncThunk(
  "profile/fetchSuggestions",
  async (uuid, { rejectWithValue }) => {
    try {
      const token = getValidToken();
      if (!token || isTokenExpired(token)) {
        return [];
      }

      const data = await makeRequest(API_ENDPOINTS.SUGGESTIONS(uuid));
      return data;
    } catch {
      return [];
    }
  }
);

// Update profile info
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = getValidToken();
      if (!token || isTokenExpired(token)) {
        throw new Error("Invalid or expired token");
      }

      const data = await makeRequest(API_ENDPOINTS.PROFILE.UPDATE, {
        method: "PATCH",
        body: JSON.stringify(profileData),
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch addresses
export const fetchAddresses = createAsyncThunk(
  "profile/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const token = getValidToken();
      if (!token || isTokenExpired(token)) {
        throw new Error("Invalid or expired token");
      }

      const data = await makeRequest('/profile/addresses/');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add new address
export const addAddress = createAsyncThunk(
  "profile/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const token = getValidToken();
      if (!token || isTokenExpired(token)) {
        throw new Error("Invalid or expired token");
      }

      const data = await makeRequest('/profile/addresses/', {
        method: "POST",
        body: JSON.stringify(addressData),
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update existing address
export const updateAddress = createAsyncThunk(
  "profile/updateAddress",
  async ({ addressId, updatedData }, { rejectWithValue }) => {
    try {
      const token = getValidToken();
      if (!token || isTokenExpired(token)) {
        throw new Error("Invalid or expired token");
      }

      const data = await makeRequest(`/profile/addresses/${addressId}/`, {
        method: "PATCH",
        body: JSON.stringify(updatedData),
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete address
export const deleteAddress = createAsyncThunk(
  "profile/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      const token = getValidToken();
      if (!token || isTokenExpired(token)) {
        throw new Error("Invalid or expired token");
      }

      await makeRequest(`/profile/addresses/${addressId}/`, {
        method: "DELETE",
      });
      return addressId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    addresses: [],
    addressPagination: { count: 0, next: null, previous: null },
    recentlyViewed: [],
    loadingRecentlyViewed: false,
    recentlyViewedError: null,
    recommendations: [],
    loadingRecommendations: false,
    recommendationsError: null,
    suggestions: [],
    loadingSuggestions: false,
    suggestionsError: null,
    loading: false,
    error: null,
    updateSuccess: false,
  },
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    clearInvalidToken: () => {
      localStorage.removeItem("access_token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = null;
      })

      // Recently Viewed
      .addCase(fetchRecentlyViewed.pending, (state) => {
        state.loadingRecentlyViewed = true;
        state.recentlyViewedError = null;
      })
      .addCase(fetchRecentlyViewed.fulfilled, (state, action) => {
        state.loadingRecentlyViewed = false;
        state.recentlyViewed = action.payload;
      })
      .addCase(fetchRecentlyViewed.rejected, (state, action) => {
        state.loadingRecentlyViewed = false;
        state.recentlyViewedError = action.payload;
        state.recentlyViewed = [];
      })

      // Recommendations
      .addCase(fetchRecommendations.pending, (state) => {
        state.loadingRecommendations = true;
        state.recommendationsError = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loadingRecommendations = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loadingRecommendations = false;
        state.recommendationsError = action.payload;
        state.recommendations = [];
      })

      // Suggestions
      .addCase(fetchSuggestions.pending, (state) => {
        state.loadingSuggestions = true;
        state.suggestionsError = null;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.loadingSuggestions = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.loadingSuggestions = false;
        state.suggestionsError = action.payload;
        state.suggestions = [];
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })

      // Fetch Addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        if (data && Array.isArray(data.results)) {
          state.addresses = data.results;
          state.addressPagination = {
            count: data.count || 0,
            next: data.next,
            previous: data.previous,
          };
        } else if (Array.isArray(data)) {
          state.addresses = data;
          state.addressPagination = {
            count: data.length,
            next: null,
            previous: null,
          };
        } else {
          state.addresses = [];
        }
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.addresses = [];
      })

      // Add Address
      .addCase(addAddress.fulfilled, (state, action) => {
        if (Array.isArray(state.addresses)) {
          state.addresses.push(action.payload);
        } else {
          state.addresses = [action.payload];
        }
      })

      // Update Address
      .addCase(updateAddress.fulfilled, (state, action) => {
        const updated = action.payload;
        state.addresses = state.addresses.map((addr) =>
          addr.address_id === updated.address_id ? updated : addr
        );
      })

      // Delete Address
      .addCase(deleteAddress.fulfilled, (state, action) => {
        const id = action.payload;
        state.addresses = state.addresses.filter(
          (addr) => addr.address_id !== id
        );
      });
  },
});

export const { clearProfileError, clearUpdateSuccess, clearInvalidToken } = profileSlice.actions;
export default profileSlice.reducer;
