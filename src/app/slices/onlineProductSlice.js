import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../utils/appBaseUrl';

export const fetchProducts = createAsyncThunk(
  'onlineProducts/fetchProducts',
  async ({ page, size, status }) => {
    const response = await axios.get(`${BASE_URL}/online/products`, {
      params: { page, size, status },
    });
    return response.data;
  }
);

export const addProduct = createAsyncThunk(
  'onlineProducts/addProduct',
  async (newProduct) => {
    const response = await axios.post(`${BASE_URL}/online/products`, newProduct);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  'onlineProducts/updateProduct',
  async ({ id, updatedProduct }) => {
    const response = await axios.put(`${BASE_URL}/online/products/${id}`, updatedProduct);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  'onlineProducts/deleteProduct',
  async (id) => {
    await axios.delete(`${BASE_URL}/online/products/${id}`);
    return id;
  }
);

const onlineProductSlice = createSlice({
  name: 'onlineProducts',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    total: 0,
    currentPage: 1,
    pageSize: 10,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((product) => product._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((product) => product._id !== action.payload);
      });
  },
});

export const { setPage, setPageSize, setStatusFilter } = onlineProductSlice.actions;

export default onlineProductSlice.reducer;
