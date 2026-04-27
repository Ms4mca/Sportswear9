import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest, API_ENDPOINTS } from "../../services/apiConfig";

// Thunk for fetching homepage sections/levels
export const fetchHomepageLevels = createAsyncThunk(
  "homepage/fetchHomepageLevels",
  async (_, { rejectWithValue }) => {
    try {
      const data = await makeRequest(
        API_ENDPOINTS.HOMEPAGE.LEVELS,
        { skipAuth: true },
        true // Use cache
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch homepage data");
    }
  }
);

// Initial state
const initialState = {
  homepageLevels: [],
  loading: false,
  error: null,
};

// Slice
const homepageSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    clearHomepage: (state) => {
      state.homepageLevels = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomepageLevels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomepageLevels.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;

        // Ensure the structure is an array
        if (Array.isArray(data)) {
          state.homepageLevels = data;
        } else if (data?.results && Array.isArray(data.results)) {
          state.homepageLevels = data.results;
        } else if (data) {
          state.homepageLevels = [data];
        } else {
          state.homepageLevels = [];
        }
      })
      .addCase(fetchHomepageLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load homepage data";
      });
  },
});

// Selectors
export const selectHomepageLevels = (state) => state.homepage.homepageLevels;
export const selectHomepageLoading = (state) => state.homepage.loading;
export const selectHomepageError = (state) => state.homepage.error;

export const { clearHomepage } = homepageSlice.actions;

export default homepageSlice.reducer;
