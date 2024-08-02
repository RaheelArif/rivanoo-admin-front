import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    products: [],
    status: 'idle',
    error: null
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('http://localhost:5001/api/products');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const addProduct = createAsyncThunk('products/addProduct', async (product, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5001/api/products', product);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (product, { rejectWithValue }) => {
    try {
        const response = await axios.put(`http://localhost:5001/api/products/${product.id}`, product);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId, { rejectWithValue }) => {
    try {
        await axios.delete(`http://localhost:5001/api/products/${productId}`);
        return productId;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(product => product._id === action.payload._id);
                state.products[index] = action.payload;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(product => product._id !== action.payload);
            });
    }
});

export default productsSlice.reducer;
