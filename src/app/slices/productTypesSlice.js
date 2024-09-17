import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/appBaseUrl";

const API_URL = "/product-types";

// Fetch product types with pagination and search
export const fetchProductTypes = createAsyncThunk(
  "productTypes/fetchProductTypes",
  async ({ page = 1, limit = 10, search = '' }) => {
    const response = await axios.get(`${BASE_URL}${API_URL}?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  }
);

// Create, Update, and Delete operations
export const createProductType = createAsyncThunk(
  "productTypes/createProductType",
  async (type) => {
    const response = await axios.post(`${BASE_URL}${API_URL}`, { type });
    return response.data;
  }
);

export const updateProductType = createAsyncThunk(
  "productTypes/updateProductType",
  async ({ id, type }) => {
    const response = await axios.put(`${BASE_URL}${API_URL}/${id}`, { type });
    return response.data;
  }
);

export const deleteProductType = createAsyncThunk(
  "productTypes/deleteProductType",
  async (id) => {
    await axios.delete(`${BASE_URL}${API_URL}/${id}`);
    return id;
  }
);

const productTypeSlice = createSlice({
  name: "productTypes",
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.productTypes;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchProductTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProductType.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProductType.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );
        state.items[index] = action.payload;
      })
      .addCase(deleteProductType.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { setPage, setSearch } = productTypeSlice.actions;
export default productTypeSlice.reducer;
