import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest, API_ENDPOINTS } from "../../services/apiConfig";

// Place order thunk - FIXED: Accept an object with address_id and payment_method
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      // orderData should contain { address_id, payment_method }
      const data = await makeRequest(API_ENDPOINTS.ORDERS.PLACE, {
        method: "POST",
        body: JSON.stringify(orderData), // Send the entire object
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Fetch orders thunk
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const data = await makeRequest(API_ENDPOINTS.ORDERS.LIST);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch orders");
    }
  }
);

// Check task status thunk
export const checkTask = createAsyncThunk(
  "orders/checkTask",
  async (task_id, { rejectWithValue }) => {
    try {
      const data = await makeRequest(`${API_ENDPOINTS.ORDERS.CHECK_TASK}?task_id=${task_id}`);
      return { task_id, ...data };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to check task status");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    // Place order states
    loading: false,
    success: false,
    error: null,
    taskId: null,
    message: null,
    
    // Fetch orders states
    orders: [],
    ordersLoading: false,
    ordersError: null,
    
    // Check task states
    taskStatus: null,
    taskCheckLoading: false,
    taskCheckError: null,
  },

  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.taskId = null;
      state.message = null;
    },
    resetOrdersState: (state) => {
      state.orders = [];
      state.ordersLoading = false;
      state.ordersError = null;
    },
    resetTaskState: (state) => {
      state.taskStatus = null;
      state.taskCheckLoading = false;
      state.taskCheckError = null;
    },
    resetAllOrderState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.taskId = null;
      state.message = null;
      state.orders = [];
      state.ordersLoading = false;
      state.ordersError = null;
      state.taskStatus = null;
      state.taskCheckLoading = false;
      state.taskCheckError = null;
    }
  },

  extraReducers: (builder) => {
    // Place Order
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.taskId = null;
        state.message = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || null;
        state.taskId = action.payload?.task_id || null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Order failed";
      });

    // Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload?.results || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload || "Failed to fetch orders";
      });

    // Check Task
    builder
      .addCase(checkTask.pending, (state) => {
        state.taskCheckLoading = true;
        state.taskCheckError = null;
      })
      .addCase(checkTask.fulfilled, (state, action) => {
        state.taskCheckLoading = false;
        state.taskStatus = action.payload;
      })
      .addCase(checkTask.rejected, (state, action) => {
        state.taskCheckLoading = false;
        state.taskCheckError = action.payload || "Failed to check task status";
      });
  },
});

export const { 
  resetOrderState, 
  resetOrdersState, 
  resetTaskState,
  resetAllOrderState 
} = orderSlice.actions;

export default orderSlice.reducer;