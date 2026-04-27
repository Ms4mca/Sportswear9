import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest, API_ENDPOINTS } from "../../services/apiConfig";

// Thunk to fetch product details by UUID
export const fetchProductDetail = createAsyncThunk(
  "productDetail/fetchProductDetail",
  async (product_uuid, { rejectWithValue }) => {
    try {
      const data = await makeRequest(
        API_ENDPOINTS.PRODUCTS.DETAIL(product_uuid),
        {}, // Remove skipAuth: true to include token
        true
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch product details");
    }
  }
);

// Thunk to fetch complete look by product UUID
export const fetchCompleteLook = createAsyncThunk(
  "productDetail/fetchCompleteLook",
  async (product_uuid, { rejectWithValue }) => {
    try {
      const data = await makeRequest(
        API_ENDPOINTS.COMPLETE_LOOK(product_uuid),
        {}, // Remove skipAuth: true to include token
        true
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch complete look");
    }
  }
);

const Productdetailslice = createSlice({
  name: "productDetail",
  initialState: {
    data: null,
    loading: false,
    error: null,
    completeLook: null,
    completeLookLoading: false,
    completeLookError: null,
  },
  reducers: {
    clearProductDetail: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
      state.completeLook = null;
      state.completeLookError = null;
      state.completeLookLoading = false;
    },
    clearCompleteLook: (state) => {
      state.completeLook = null;
      state.completeLookError = null;
      state.completeLookLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCompleteLook.pending, (state) => {
        state.completeLookLoading = true;
        state.completeLookError = null;
      })
      .addCase(fetchCompleteLook.fulfilled, (state, action) => {
        state.completeLookLoading = false;
        state.completeLook = action.payload;
      })
      .addCase(fetchCompleteLook.rejected, (state, action) => {
        state.completeLookLoading = false;
        state.completeLookError = action.payload;
      });
  },
});

export const { clearProductDetail, clearCompleteLook } = Productdetailslice.actions;
export default Productdetailslice.reducer;
