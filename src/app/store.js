import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import orderProductReducer from "./slices/orderProductSlice";
import mobileProductReducer from "./slices/mobileProductSlice";
import onlineProductReducer from "./slices/onlineProductSlice";
import passwordReducer from "./slices/passwordSlice";
import gtinReducer from "./slices/gtinSlice";
import shopifyReducer from "./slices/shopifySlice";
import productTypeReducer from "./slices/productTypesSlice";
import newMobileComingReducer from "./slices/newMobileComingSlice";
export const store = configureStore({
  reducer: {
    products: productsReducer,
    orderProducts: orderProductReducer,
    mobileProducts: mobileProductReducer,
    onlineProducts: onlineProductReducer,
    password: passwordReducer,
    gtin: gtinReducer,
    shopify: shopifyReducer,
    productTypes: productTypeReducer,
    newMobileComing: newMobileComingReducer,
  },
});
