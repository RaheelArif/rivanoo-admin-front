import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import orderProductReducer from './slices/orderProductSlice';
export const store = configureStore({
    reducer: {
        products: productsReducer,
        orderProducts: orderProductReducer,
    }
});
