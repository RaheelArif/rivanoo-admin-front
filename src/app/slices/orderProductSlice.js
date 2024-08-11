import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define async thunks for CRUD operations
export const fetchOrderProducts = createAsyncThunk('orderProducts/fetchOrderProducts', async () => {
  const response = await axios.get('http://localhost:5001/api/order_product');
  return response.data;
});

export const addOrderProduct = createAsyncThunk('orderProducts/addOrderProduct', async (orderProduct) => {
  const response = await axios.post('http://localhost:5001/api/order_product', orderProduct);
  return response.data;
});

export const updateOrderProduct = createAsyncThunk('orderProducts/updateOrderProduct', async ({ id, orderProduct }) => {
  const response = await axios.put(`http://localhost:5001/api/order_product/${id}`, orderProduct);
  return response.data;
});

export const deleteOrderProduct = createAsyncThunk('orderProducts/deleteOrderProduct', async (id) => {
  await axios.delete(`http://localhost:5001/api/order_product/${id}`);
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
