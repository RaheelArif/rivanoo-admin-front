import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/appBaseUrl";

let initialState = {
  items: [],
  status: "idle",
  error: null,
  selectedStatus: "",
  selectedBrand: "",
  searchQuery: "",
  currentPage: 1,
  pageSize: 10,
};

export const fetchUpcomingProducts = createAsyncThunk(
  "upcomingProducts/fetchUpcomingProducts",
  async ({ status, brand, search, page = 1, size = 10 }) => {
    const response = await axios.get(`${BASE_URL}/mobile_product`, {
      params: { status, brand, search, page, size },
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
  async ({ id, mobileProduct }) => {
    const response = await axios.put(
      `${BASE_URL}/mobile_product/${id}`,
      mobileProduct
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
        state.items = action.payload.items;
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
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      .addCase(deleteUpcomingProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const {
  setSelectedStatus,
  setPage,
  setPageSize,
  setSelectedBrands,
  setSearchQuery,
} = upcomingSlice.actions;

export default upcomingSlice.reducer;
