import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import orderProductReducer from "./slices/orderProductSlice";
import mobileProductReducer from "./slices/mobileProductSlice";
import onlineProductReducer from "./slices/onlineProductSlice";
export const store = configureStore({
  reducer: {
    products: productsReducer,
    orderProducts: orderProductReducer,
    mobileProducts: mobileProductReducer,
    onlineProducts: onlineProductReducer,
  },
});
