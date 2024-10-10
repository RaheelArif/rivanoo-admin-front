import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/appBaseUrl";

// Async thunks for CRUD operations

// Fetch mobile products with pagination, search, and filter
export const fetchMobileProducts = createAsyncThunk(
  "newMobileComing/fetchMobileProducts",
  async ({ page = 1, size = 10, search = "", brand = "" }) => {
    const response = await axios.get(`${BASE_URL}/new_mobile_coming`, {
      params: { page, size, search, brand },
    });
    return response.data;
  }
);

// Add a new mobile product
export const addMobileProduct = createAsyncThunk(
  "newMobileComing/addMobileProduct",
  async (mobileProduct) => {
    const response = await axios.post(`${BASE_URL}/new_mobile_coming`, mobileProduct);
    return response.data;
  }
);

// Update an existing mobile product
export const updateMobileProduct = createAsyncThunk(
  "newMobileComing/updateMobileProduct",
  async ({ id, mobileProduct }) => {
    const response = await axios.put(`${BASE_URL}/new_mobile_coming/${id}`, mobileProduct);
    return response.data;
  }
);

// Delete a mobile product
export const deleteMobileProduct = createAsyncThunk(
  "newMobileComing/deleteMobileProduct",
  async (id) => {
    await axios.delete(`${BASE_URL}/new_mobile_coming/${id}`);
    return id;
  }
);

// Initial state
const initialState = {
  items: [],
  status: "idle",
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  search: "",
  brand: "",
};

// Create slice
const newMobileComingSlice = createSlice({
  name: "newMobileComing",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setBrand(state, action) {
      state.brand = action.payload;
    },
    setPage(state, action) {
      state.currentPage = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Mobile Products
      .addCase(fetchMobileProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMobileProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchMobileProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add Mobile Product
      .addCase(addMobileProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload); // Add to the beginning
        state.total += 1;
      })
      // Update Mobile Product
      .addCase(updateMobileProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Mobile Product
      .addCase(deleteMobileProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setSearch, setBrand, setPage, setPageSize } = newMobileComingSlice.actions;

export default newMobileComingSlice.reducer;
