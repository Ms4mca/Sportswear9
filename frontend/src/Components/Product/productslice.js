import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest, API_ENDPOINTS } from "../../services/apiConfig";

// Fetch Products — Supports Backend Filters
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const allowedFilters = [
        "gender",
        "brand",
        "price_min",
        "price_max",
        "discount_min",
        "discount_max",
        "ordering",
        "cursor",
        "page",
        "category",
        "search",
      ];

      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          allowedFilters.includes(key)
        ) {
          params.append(key, value);
        }
      });

      const endpoint = params.toString()
        ? `${API_ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`
        : API_ENDPOINTS.PRODUCTS.LIST;

      const data = await makeRequest(endpoint, { skipAuth: true }, true);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch products");
    }
  }
);

// Fetch Products by Category UUID
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (categoryUuid, { rejectWithValue }) => {
    try {
      const data = await makeRequest(
        API_ENDPOINTS.PRODUCTS.CATEGORY(categoryUuid),
        { skipAuth: true },
        true
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch products by category");
    }
  }
);

// Fetch Single Product Detail
export const fetchProductDetail = createAsyncThunk(
  "products/fetchProductDetail",
  async (uuid, { rejectWithValue }) => {
    try {
      const data = await makeRequest(
        API_ENDPOINTS.PRODUCTS.DETAIL(uuid),
        { skipAuth: true },
        true
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch product detail");
    }
  }
);

// Fetch All Categories
export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await makeRequest(
        API_ENDPOINTS.CATEGORIES, // Make sure this is defined in your apiConfig
        { skipAuth: true },
        true
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch categories");
    }
  }
);

// Initial State
const initialState = {
  products: [],
  count: 0,
  next: null,
  previous: null,
  productDetail: null,
  loading: false,
  error: null,
  categoryProducts: [],
  categoryLoading: false,
  categoryError: null,
  categories: [], // Added categories array
  categoriesLoading: false, // Added categories loading state
  categoriesError: null, // Added categories error state
};

// Slice
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.count = 0;
      state.next = null;
      state.previous = null;
      state.error = null;
    },
    clearCategoryProducts: (state) => {
      state.categoryProducts = [];
      state.categoryError = null;
    },
    clearCategories: (state) => { // Added clearCategories reducer
      state.categories = [];
      state.categoriesError = null;
    },
    updateProductInList: (state, action) => {
      const { uuid, updates } = action.payload;
      const index = state.products.findIndex(product => product.uuid === uuid);
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...updates };
      }
      const catIndex = state.categoryProducts.findIndex(product => product.uuid === uuid);
      if (catIndex !== -1) {
        state.categoryProducts[catIndex] = { ...state.categoryProducts[catIndex], ...updates };
      }
      if (state.productDetail?.uuid === uuid) {
        state.productDetail = { ...state.productDetail, ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH PRODUCTS
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;

        if (data && typeof data === 'object') {
          if (Array.isArray(data.results)) {
            state.products = data.results;
            state.count = data.count || data.results.length;
            state.next = data.next || null;
            state.previous = data.previous || null;
            return;
          }
          
          if (Array.isArray(data)) {
            state.products = data;
            state.count = data.length;
            state.next = null;
            state.previous = null;
            return;
          }
        }

        state.products = [];
        state.count = 0;
        state.next = null;
        state.previous = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load products";
      })

      // FETCH PRODUCTS BY CATEGORY
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
        const data = action.payload;

        if (data && typeof data === 'object') {
          if (Array.isArray(data.results)) {
            state.categoryProducts = data.results;
            return;
          }
          
          if (Array.isArray(data)) {
            state.categoryProducts = data;
            return;
          }
        }

        state.categoryProducts = [];
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.payload || "Failed to load products by category";
      })

      // FETCH PRODUCT DETAIL
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.productDetail = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load product detail";
      })

      // FETCH CATEGORIES
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        const data = action.payload;

        if (data && typeof data === 'object') {
          if (Array.isArray(data.results)) {
            state.categories = data.results;
            return;
          }
          
          if (Array.isArray(data)) {
            state.categories = data;
            return;
          }
          
          // Handle case where API returns an object with categories key
          if (data.categories && Array.isArray(data.categories)) {
            state.categories = data.categories;
            return;
          }
        }

        state.categories = [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload || "Failed to load categories";
      });
  },
});

// Exports
export const { 
  clearProducts, 
  clearCategoryProducts, 
  clearCategories, // Export the new reducer
  updateProductInList 
} = productsSlice.actions;
export default productsSlice.reducer;

// Selectors
export const selectAllProducts = (state) => state.product.products;
export const selectProductsLoading = (state) => state.product.loading;
export const selectProductsError = (state) => state.product.error;
export const selectProductsNext = (state) => state.product.next;
export const selectProductsPrevious = (state) => state.product.previous;
export const selectProductDetail = (state) => state.product.productDetail;

// Category product selectors
export const selectCategoryProducts = (state) => state.product.categoryProducts;
export const selectCategoryProductsLoading = (state) => state.product.categoryLoading;
export const selectCategoryProductsError = (state) => state.product.categoryError;

// Categories selectors
export const selectCategories = (state) => state.product.categories;
export const selectCategoriesLoading = (state) => state.product.categoriesLoading;
export const selectCategoriesError = (state) => state.product.categoriesError;

// Helper selector to get categories in a tree/hierarchical structure if needed
export const selectCategoriesTree = (state) => {
  const categories = selectCategories(state);
  
  // Create a map of categories by their UUID for easy lookup
  const categoryMap = {};
  categories.forEach(category => {
    categoryMap[category.uuid] = { ...category, children: [] };
  });
  
  // Build tree structure
  const tree = [];
  categories.forEach(category => {
    if (category.parent) {
      // If it has a parent, add it to parent's children
      if (categoryMap[category.parent]) {
        categoryMap[category.parent].children.push(categoryMap[category.uuid]);
      }
    } else {
      // If no parent, it's a root category
      tree.push(categoryMap[category.uuid]);
    }
  });
  
  return tree;
};

// New selector for client-side filtering if needed
export const selectFilteredProducts = (state, filters) => {
  const products = selectAllProducts(state);
  if (!filters || Object.keys(filters).length === 0) return products;
  
  return products.filter(product => {
    if (filters.gender && product.gender !== filters.gender) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    
    if (filters.price_min && product.price < filters.price_min) return false;
    if (filters.price_max && product.price > filters.price_max) return false;
    
    if (filters.discount_min && product.discount < filters.discount_min) return false;
    if (filters.discount_max && product.discount > filters.discount_max) return false;
    
    return true;
  });
};