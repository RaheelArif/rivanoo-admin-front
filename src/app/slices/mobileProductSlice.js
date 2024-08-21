import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define async thunks for CRUD operations
let initialState = {
  items: [],
  status: "idle",
  error: null,
  selectedStatus: "coming_soon",
  currentPage: 1,
  pageSize: 10,
};

export const fetchMobileProducts = createAsyncThunk(
  "mobileProducts/fetchMobileProducts",
  async ({ status, page = 1, size = 10 }) => {
    const response = await axios.get(`http://localhost:5001/api/mobile_product`, {
      params: {
        status,
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
      "http://localhost:5001/api/mobile_product",
      mobileProduct
    );
    return response.data;
  }
);

export const updateMobileProduct = createAsyncThunk(
  "mobileProducts/updateMobileProduct",
  async ({ id, mobileProduct }) => {
    const response = await axios.put(
      `http://localhost:5001/api/mobile_product/${id}`,
      mobileProduct
    );
    return response.data;
  }
);

export const deleteMobileProduct = createAsyncThunk(
  "mobileProducts/deleteMobileProduct",
  async (id) => {
    await axios.delete(`http://localhost:5001/api/mobile_product/${id}`);
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

export const { setSelectedStatus, setPage, setPageSize } =
  mobileProductSlice.actions;
export default mobileProductSlice.reducer;
