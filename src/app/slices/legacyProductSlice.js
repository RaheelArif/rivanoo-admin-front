// src/redux/legacyProductSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from "../../utils/appBaseUrl";

export const fetchLegacyProducts = createAsyncThunk(
  'legacyProduct/fetchLegacyProducts',
  async (page = 1) => {
    const response = await axios.get(`${BASE_URL}/legacy_products?page=${page}&size=5`);
    return response.data;
  }
);

export const addLegacyProduct = createAsyncThunk(
  'legacyProduct/addLegacyProduct',
  async (legacyProduct) => {
    const response = await axios.post(`${BASE_URL}/legacy_products`, legacyProduct);
    return response.data;
  }
);

export const updateLegacyProduct = createAsyncThunk(
  'legacyProduct/updateLegacyProduct',
  async ({ id, legacyProduct }) => {
    const response = await axios.put(`${BASE_URL}/legacy_products/${id}`, legacyProduct);
    return response.data;
  }
);

export const deleteLegacyProduct = createAsyncThunk(
  'legacyProduct/deleteLegacyProduct',
  async (id) => {
    await axios.delete(`${BASE_URL}/legacy_products/${id}`);
    return id;
  }
);

const legacyProductSlice = createSlice({
  name: 'legacyProduct',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    page: 1,
    total: 0,
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLegacyProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLegacyProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.legacyProducts || [];
        state.total = action.payload.total;
      })
      .addCase(fetchLegacyProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addLegacyProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateLegacyProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        state.items[index] = action.payload;
      })
      .addCase(deleteLegacyProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const { setPage } = legacyProductSlice.actions;

export default legacyProductSlice.reducer;
