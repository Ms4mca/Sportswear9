import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { makeRequest, API_ENDPOINTS } from "../../services/apiConfig";
import { fetchProductDetail } from "./productslice";

// Helper to determine if data is FormData
const isFormData = (data) => data instanceof FormData;

// GET ALL REVIEWS (for admin or general listing)
export const getAllReviews = createAsyncThunk(
  "reviews/getAllReviews",
  async (_, { rejectWithValue }) => {
    try {
      const data = await makeRequest(
        API_ENDPOINTS.REVIEWS.LIST,
        { skipAuth: true },
        true
      );
      return data.results ? data.results : data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch reviews");
    }
  }
);

// GET REVIEWS BY PRODUCT
export const getReviewsByProduct = createAsyncThunk(
  "reviews/getReviewsByProduct",
  async (product_id, { rejectWithValue }) => {
    try {
      const data = await makeRequest(
        `${API_ENDPOINTS.REVIEWS.LIST}?product_id=${product_id}`,
        { skipAuth: true },
        true
      );
      return data.results ? data.results : data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch reviews");
    }
  }
);

// GET SINGLE REVIEW
export const getReviewById = createAsyncThunk(
  "reviews/getReviewById",
  async (review_id, { rejectWithValue }) => {
    try {
      const data = await makeRequest(
        API_ENDPOINTS.REVIEWS.DETAIL(review_id),
        { skipAuth: true }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch review");
    }
  }
);

// CREATE REVIEW
export const createReview = createAsyncThunk(
  "reviews/createReview",
  async ({ product_uuid, data: reviewData, isMultipart = false }, { dispatch, rejectWithValue }) => {
    try {
      const options = {
        method: 'POST',
        body: reviewData,
        isMultipart, // Pass flag to makeRequest
      };

      let data;
      try {
        data = await makeRequest(API_ENDPOINTS.REVIEWS.LIST, options);
      } catch (err) {
        // If the error is a JSON parse error, the response might be empty (success)
        if (err.message.includes('JSON')) {
          data = null; // assume success
        } else {
          throw err;
        }
      }

      // Refresh product details to show new review
      dispatch(fetchProductDetail(product_uuid));
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create review");
    }
  }
);

// PARTIAL UPDATE (PATCH) - used for updates
export const partialUpdateReview = createAsyncThunk(
  "reviews/partialUpdateReview",
  async ({ review_id, product_uuid, data: reviewData, isMultipart = false }, { dispatch, rejectWithValue }) => {
    try {
      const options = {
        method: 'PATCH',
        body: reviewData,
        isMultipart,
      };

      let data;
      try {
        data = await makeRequest(API_ENDPOINTS.REVIEWS.DETAIL(review_id), options);
      } catch (err) {
        if (err.message.includes('JSON')) {
          data = null; // assume success
        } else {
          throw err;
        }
      }

      dispatch(fetchProductDetail(product_uuid));
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to edit review");
    }
  }
);

// FULL UPDATE (PUT) - kept for completeness but not used
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ review_id, product_uuid, data: reviewData, isMultipart = false }, { dispatch, rejectWithValue }) => {
    try {
      const options = {
        method: 'PUT',
        body: reviewData,
        isMultipart,
      };
      const data = await makeRequest(API_ENDPOINTS.REVIEWS.DETAIL(review_id), options);
      dispatch(fetchProductDetail(product_uuid));
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update review");
    }
  }
);

// DELETE REVIEW
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async ({ review_id, product_uuid }, { dispatch, rejectWithValue }) => {
    try {
      await makeRequest(API_ENDPOINTS.REVIEWS.DETAIL(review_id), {
        method: 'DELETE',
      });

      dispatch(fetchProductDetail(product_uuid));
      return review_id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete review");
    }
  }
);

// NEW: FETCH ALL REVIEWS FOR HOMEPAGE
export const fetchAllReviews = createAsyncThunk(
  "reviews/fetchAllReviews",
  async (_, { rejectWithValue }) => {
    try {
      const data = await makeRequest(
        API_ENDPOINTS.REVIEWS.LIST,
        { skipAuth: true },
        true // Enable caching
      );
      return data.results ? data.results : data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch reviews");
    }
  }
);

// SLICE
const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    allReviews: [],
    productReviews: [],
    singleReview: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearReviewStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL REVIEWS
      .addCase(getAllReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.allReviews = action.payload;
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET PRODUCT REVIEWS
      .addCase(getReviewsByProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviewsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productReviews = action.payload;
      })
      .addCase(getReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET SINGLE REVIEW
      .addCase(getReviewById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleReview = action.payload;
      })
      .addCase(getReviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.loading = false;
        state.success = "Review created successfully";
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE (PUT)
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReview.fulfilled, (state) => {
        state.loading = false;
        state.success = "Review updated successfully";
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PARTIAL UPDATE (PATCH)
      .addCase(partialUpdateReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(partialUpdateReview.fulfilled, (state) => {
        state.loading = false;
        state.success = "Review edited successfully";
      })
      .addCase(partialUpdateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state) => {
        state.loading = false;
        state.success = "Review deleted successfully";
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // NEW: FETCH ALL REVIEWS FOR HOMEPAGE
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.allReviews = action.payload;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// SELECTORS

// Export the clearReviewStatus action
export const { clearReviewStatus } = reviewSlice.actions;

// Base selector to get all reviews
export const selectAllReviews = (state) => state.review.allReviews;

// NEW: Selector for filtered homepage reviews (rating >= 4 AND has images)
export const selectFilteredHomepageReviews = createSelector(
  [selectAllReviews],
  (allReviews) => {
    if (!Array.isArray(allReviews)) return [];
    
    return allReviews
      .filter(review => 
        review.rating >= 4 && 
        review.images && 
        review.images.length > 0
      )
      .map(review => ({
        id: review.review_id,
        rating: review.rating,
        comment: review.comment,
        userName: review.user_name,
        // Use the first image for the carousel
        image: review.images[0]?.image_url || '',
        product: review.product,
        allImages: review.images // Keep all images if needed
      }));
  }
);

// Selector for loading state
export const selectReviewsLoading = (state) => state.review.loading;

// Selector for error state
export const selectReviewsError = (state) => state.review.error;

// Selector for product reviews
export const selectProductReviews = (state) => state.review.productReviews;

// Selector for single review
export const selectSingleReview = (state) => state.review.singleReview;

// Selector for success message
export const selectReviewSuccess = (state) => state.review.success;

export default reviewSlice.reducer;