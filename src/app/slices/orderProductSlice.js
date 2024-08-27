import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../utils/appBaseUrl';

// Define async thunks for CRUD operations
export const fetchOrderProducts = createAsyncThunk('orderProducts/fetchOrderProducts', async () => {
  const response = await axios.get(`${BASE_URL}/order_product`);
  return response.data;
});

export const addOrderProduct = createAsyncThunk('orderProducts/addOrderProduct', async (orderProduct) => {
  const response = await axios.post(`${BASE_URL}/order_product`, orderProduct);
  return response.data;
});

export const updateOrderProduct = createAsyncThunk('orderProducts/updateOrderProduct', async ({ id, orderProduct }) => {
  const response = await axios.put(`${BASE_URL}/order_product/${id}`, orderProduct);
  return response.data;
});

export const deleteOrderProduct = createAsyncThunk('orderProducts/deleteOrderProduct', async (id) => {
  await axios.delete(`${BASE_URL}/order_product/${id}`);
  return id;
});

// Create slice
const orderProductSlice = createSlice({
  name: 'orderProducts',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchOrderProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addOrderProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateOrderProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteOrderProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default orderProductSlice.reducer;
