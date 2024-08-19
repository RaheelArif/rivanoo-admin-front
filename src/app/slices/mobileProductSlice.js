import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define async thunks for CRUD operations
export const fetchMobileProducts = createAsyncThunk('mobileProducts/fetchMobileProducts', async () => {
  const response = await axios.get('http://localhost:5001/api/mobile_product');
  return response.data;
});

export const addMobileProduct = createAsyncThunk('mobileProducts/addMobileProduct', async (mobileProduct) => {
  const response = await axios.post('http://localhost:5001/api/mobile_product', mobileProduct);
  return response.data;
});

export const updateMobileProduct = createAsyncThunk('mobileProducts/updateMobileProduct', async ({ id, mobileProduct }) => {
  const response = await axios.put(`http://localhost:5001/api/mobile_product/${id}`, mobileProduct);
  return response.data;
});

export const deleteMobileProduct = createAsyncThunk('mobileProducts/deleteMobileProduct', async (id) => {
  await axios.delete(`http://localhost:5001/api/mobile_product/${id}`);
  return id;
});

// Create slice
const mobileProductSlice = createSlice({
  name: 'mobileProducts',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMobileProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMobileProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMobileProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addMobileProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMobileProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteMobileProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default mobileProductSlice.reducer;
