import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/appBaseUrl";

// Define initial state
let initialState = {
  items: [],
  status: "idle",
  error: null,
  selectedStatus: "",
  selectedBrand: "",
  searchQuery: "", // New state for search
  currentPage: 1,
  pageSize: 10,
};

// Define async thunks for CRUD operations with search
export const fetchMobileProducts = createAsyncThunk(
  "mobileProducts/fetchMobileProducts",
  async ({ status, brand, search, page = 1, size = 10 }) => {
    const response = await axios.get(`${BASE_URL}/mobile_product`, {
      params: {
        status,
        brand,
        search, // Include search in the API request
        page,
        size,
      },
    });
    return response.data;
  }
);

export const addMobileProduct = createAsyncThunk(
  "mobileProducts/addMobileProduct",
  async (mobileProduct) => {
    const response = await axios.post(
      `${BASE_URL}/mobile_product`,
      mobileProduct
    );
    return response.data;
  }
);

export const updateMobileProduct = createAsyncThunk(
  "mobileProducts/updateMobileProduct",
  async ({ id, mobileProduct }) => {
    const response = await axios.put(
      `${BASE_URL}/mobile_product/${id}`,
      mobileProduct
    );
    return response.data;
  }
);

export const deleteMobileProduct = createAsyncThunk(
  "mobileProducts/deleteMobileProduct",
  async (id) => {
    await axios.delete(`${BASE_URL}/mobile_product/${id}`);
    return id;
  }
);

// Create slice
const mobileProductSlice = createSlice({
  name: "mobileProducts",
  initialState,
  reducers: {
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    setSelectedBrands: (state, action) => {
      state.selectedBrand = action.payload;
    },
    setSearchQuery: (state, action) => {
      // New action for search query
      state.searchQuery = action.payload;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMobileProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMobileProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items; // Assuming the API returns data in { items: [], total: 0 } format
        state.total = action.payload.total;
      })
      .addCase(fetchMobileProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addMobileProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMobileProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteMobileProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

// Export actions and reducer
export const {
  setSelectedStatus,
  setPage,
  setPageSize,
  setSelectedBrands,
  setSearchQuery, // Export setSearchQuery action
} = mobileProductSlice.actions;
export default mobileProductSlice.reducer;
