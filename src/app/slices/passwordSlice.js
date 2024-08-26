// redux/passwordSlice.js
import { createSlice } from '@reduxjs/toolkit';

const passwordSlice = createSlice({
  name: 'password',
  initialState: {
    isAuthGermany: false,
  },
  reducers: {
    authenticateGer: (state) => {
      state.isAuthGermany = true;
    },
  },
});

export const { authenticateGer } = passwordSlice.actions;

export default passwordSlice.reducer;
