import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/appBaseUrl";

// Define initial state for upcoming products
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

// Define async thunks for CRUD operations with search for upcoming products
export const fetchUpcomingProducts = createAsyncThunk(
  "upcomingProducts/fetchUpcomingProducts",
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

export const addUpcomingProduct = createAsyncThunk(
  "upcomingProducts/addUpcomingProduct",
  async (upcomingProduct) => {
    const response = await axios.post(
      `${BASE_URL}/mobile_product`,
      upcomingProduct
    );
    return response.data;
  }
);

export const updateUpcomingProduct = createAsyncThunk(
  "upcomingProducts/updateUpcomingProduct",
  async ({ id, upcomingProduct }) => {
    const response = await axios.put(
      `${BASE_URL}/mobile_product/${id}`,
      upcomingProduct
    );
    return response.data;
  }
);

export const deleteUpcomingProduct = createAsyncThunk(
  "upcomingProducts/deleteUpcomingProduct",
  async (id) => {
    await axios.delete(`${BASE_URL}/mobile_product/${id}`);
    return id;
  }
);

// Create upcomingSlice
const upcomingSlice = createSlice({
  name: "upcomingProducts",
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
      .addCase(fetchUpcomingProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUpcomingProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items; // Assuming the API returns data in { items: [], total: 0 } format
        state.total = action.payload.total;
      })
      .addCase(fetchUpcomingProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addUpcomingProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateUpcomingProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteUpcomingProduct.fulfilled, (state, action) => {
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
} = upcomingSlice.actions;
export default upcomingSlice.reducer;
