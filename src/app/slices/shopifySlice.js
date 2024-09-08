import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/appBaseUrl";

// Async thunks for CRUD operations
export const fetchProducts = createAsyncThunk(
  "shopify/fetchProducts",
  async ({ limit = 10, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/shopify/products`, {
        params: { limit, page },
      });
      return response.data; // Ensure this matches your API response structure
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "shopify/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/shopify/products/${id}`);
      return response.data; // Ensure this matches your API response structure
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addProduct = createAsyncThunk(
  "shopify/addProduct",
  async (newProduct, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/shopify/create`,
        newProduct
      );
      return response.data; // Ensure this matches your API response structure
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "shopify/updateProduct",
  async ({ id, updatedProduct }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/shopify/products/${id}`,
        updatedProduct
      );
      return response.data; // Ensure this matches your API response structure
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "shopify/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/shopify/products/${id}`);
      return { id }; // Return the deleted product's ID
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: "shopify",
  initialState: {
    products: [],
    selectedProduct: null, // Add this state to handle single product
    loading: false,
    error: null,
    total: 0,
    limit: 10,
    page: 1,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products; // Assuming response contains `products`
        state.total = action.payload.total; // Assuming response contains `total`
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Adjust as needed
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload.product; // Assuming response contains `product`
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Adjust as needed
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload.product); // Adjust if necessary
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Adjust as needed
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product.id === action.payload.product.id
        );
        if (index !== -1) {
          state.products[index] = action.payload.product; // Adjust if necessary
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Adjust as needed
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product.id !== action.payload.id
        ); // Adjust if necessary
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Adjust as needed
      });
  },
});

export const { setPage, setLimit } = productSlice.actions;

export default productSlice.reducer;
