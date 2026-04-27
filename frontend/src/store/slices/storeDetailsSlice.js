import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_ENDPOINTS, makeRequest } from '../../services/apiConfig';

// Initial state
const initialState = {
  storeDetails: null,
  loading: false,
  error: null,
  lastFetched: null
};

// Async thunk for fetching store details
export const fetchStoreDetails = createAsyncThunk(
  'storeDetails/fetchStoreDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await makeRequest(API_ENDPOINTS.STORE_DETAILS, {
        method: 'GET',
      }, true); // Enable caching
      
      // The response is a single object with id, key, value, updated_at
      // The actual store details are in the 'value' property
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch store details');
    }
  }
);

// Store details slice
const storeDetailsSlice = createSlice({
  name: 'storeDetails',
  initialState,
  reducers: {
    clearStoreDetails: (state) => {
      state.storeDetails = null;
      state.error = null;
      state.lastFetched = null;
    },
    updateStoreDetails: (state, action) => {
      state.storeDetails = { ...state.storeDetails, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch store details
      .addCase(fetchStoreDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreDetails.fulfilled, (state, action) => {
        state.loading = false;
        // The store details are in the 'value' property of the response
        state.storeDetails = action.payload.value;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchStoreDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch store details';
      });
  },
});

// Selectors
export const selectStoreDetails = (state) => state.storeDetails?.storeDetails;
export const selectStoreDetailsLoading = (state) => state.storeDetails?.loading;
export const selectStoreDetailsError = (state) => state.storeDetails?.error;
export const selectStoreDetailsLastFetched = (state) => state.storeDetails?.lastFetched;

// Check if cache is valid (within 5 minutes)
export const selectIsStoreDetailsCacheValid = (state) => {
  const lastFetched = state.storeDetails?.lastFetched;
  if (!lastFetched) return false;
  
  const fiveMinutes = 5 * 60 * 1000;
  return Date.now() - lastFetched < fiveMinutes;
};

// Actions
export const { clearStoreDetails, updateStoreDetails } = storeDetailsSlice.actions;

// Reducer
export default storeDetailsSlice.reducer;