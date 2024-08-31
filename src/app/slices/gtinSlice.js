// src/redux/gtinSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/appBaseUrl";

export const fetchGtins = createAsyncThunk(
  "gtin/fetchGtins",
  async ({ page = 1, status = "" }) => {
    const response = await axios.get(`${BASE_URL}/gtin`, {
      params: {
        page,
        status,
        size: 5,
      },
    });
    return response.data;
  }
);

export const addGtin = createAsyncThunk("gtin/addGtin", async (gtin) => {
  const response = await axios.post(`${BASE_URL}/gtin`, gtin);
  return response.data;
});

export const updateGtin = createAsyncThunk(
  "gtin/updateGtin",
  async ({ id, gtin }) => {
    const response = await axios.put(`${BASE_URL}/gtin/${id}`, gtin);
    return response.data;
  }
);

export const deleteGtin = createAsyncThunk("gtin/deleteGtin", async (id) => {
  await axios.delete(`${BASE_URL}/gtin/${id}`);
  return id;
});

const gtinSlice = createSlice({
  name: "gtin",
  initialState: {
    items: [],
    status: "idle",
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
      .addCase(fetchGtins.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGtins.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.gtins || [];
        state.total = action.payload.total;
      })
      .addCase(fetchGtins.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addGtin.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateGtin.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );
        state.items[index] = action.payload;
      })

      .addCase(deleteGtin.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { setPage } = gtinSlice.actions;

export default gtinSlice.reducer;
