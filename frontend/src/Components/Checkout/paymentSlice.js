import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest, API_ENDPOINTS } from "../../services/apiConfig";

// Create Razorpay order
export const createRazorpayOrder = createAsyncThunk(
  "payment/createRazorpayOrder",
  async (order_uuid, { rejectWithValue }) => {
    try {
      const data = await makeRequest(API_ENDPOINTS.PAYMENTS.CREATE_ORDER, {
        method: "POST",
        body: JSON.stringify({ order_uuid }),
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create Razorpay order");
    }
  }
);

// Verify payment after Razorpay checkout
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const data = await makeRequest(API_ENDPOINTS.PAYMENTS.VERIFY, {
        method: "POST",
        body: JSON.stringify(paymentData),
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Payment verification failed");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    // Razorpay order creation
    razorpayOrder: null,
    razorpayLoading: false,
    razorpayError: null,
    
    // Payment verification
    verificationResult: null,
    verificationLoading: false,
    verificationError: null,
    
    // Payment status
    paymentStatus: null,
    paymentMethod: null,
  },

  reducers: {
    resetPaymentState: (state) => {
      state.razorpayOrder = null;
      state.razorpayLoading = false;
      state.razorpayError = null;
      state.verificationResult = null;
      state.verificationLoading = false;
      state.verificationError = null;
      state.paymentStatus = null;
      state.paymentMethod = null;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Create Razorpay Order
    builder
      .addCase(createRazorpayOrder.pending, (state) => {
        state.razorpayLoading = true;
        state.razorpayError = null;
        state.razorpayOrder = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.razorpayLoading = false;
        state.razorpayOrder = action.payload;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.razorpayLoading = false;
        state.razorpayError = action.payload || "Failed to create Razorpay order";
      });

    // Verify Payment
    builder
      .addCase(verifyPayment.pending, (state) => {
        state.verificationLoading = true;
        state.verificationError = null;
        state.paymentStatus = 'processing';
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verificationLoading = false;
        state.verificationResult = action.payload;
        state.paymentStatus = 'success';
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verificationLoading = false;
        state.verificationError = action.payload || "Payment verification failed";
        state.paymentStatus = 'failed';
      });
  },
});

export const { resetPaymentState, setPaymentStatus, setPaymentMethod } = paymentSlice.actions;
export default paymentSlice.reducer;
