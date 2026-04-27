import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest, API_ENDPOINTS } from "../../services/apiConfig";

/* ---------------------------------------------------
   FETCH CART ITEMS
----------------------------------------------------- */
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const data = await makeRequest(API_ENDPOINTS.CART.GET);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch cart");
    }
  }
);

/* ---------------------------------------------------
   ADD TO CART
----------------------------------------------------- */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartData, { rejectWithValue }) => {
    try {
      const data = await makeRequest(API_ENDPOINTS.CART.ADD, {
        method: 'POST',
        body: JSON.stringify(cartData),
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to add item");
    }
  }
);

/* ---------------------------------------------------
   UPDATE CART ITEM (PATCH)
----------------------------------------------------- */
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const data = await makeRequest(API_ENDPOINTS.CART.UPDATE(id), {
        method: 'PATCH',
        body: JSON.stringify({ quantity: quantity.toString() }),
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update cart");
    }
  }
);

/* ---------------------------------------------------
   DELETE CART ITEM
----------------------------------------------------- */
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue }) => {
    try {
      await makeRequest(API_ENDPOINTS.CART.REMOVE(id), {
        method: 'DELETE',
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete item");
    }
  }
);

/* ---------------------------------------------------
   SLICE - COMPLETE WITH FEES SUPPORT
----------------------------------------------------- */
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    subtotal: 0,
    total_price: 0,
    total_items: 0,
    applied_fees: {},
    total_fees: 0,
    discount_amount: 0,
    loading: false,
    error: null,
  },

  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.total_price = 0;
      state.total_items = 0;
      state.applied_fees = {};
      state.total_fees = 0;
      state.discount_amount = 0;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------------- FETCH CART ---------------- */
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = action.payload.items || [];
        state.subtotal = Number(action.payload.subtotal) || 0;
        state.total_price = Number(action.payload.total_price) || 0;
        state.total_items = action.payload.total_items || 0;
        state.applied_fees = action.payload.applied_fees || {};
        state.total_fees = Number(action.payload.total_fees) || 0;
        state.discount_amount = Number(action.payload.discount_amount) || 0;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- ADD TO CART ---------------- */
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items.push(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- UPDATE CART ITEM ---------------- */
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.items.findIndex(
          (item) => item.cart_item_id === updated.cart_item_id
        );
        if (index !== -1) {
          state.items[index] = updated;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- DELETE CART ITEM ---------------- */
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => item.cart_item_id !== action.payload
        );
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
