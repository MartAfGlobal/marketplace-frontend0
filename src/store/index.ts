"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/store/cart/cartSlice";
import wishlistReducer from "@/store/cart/wishlist-slice";
import { persistReducer, persistStore } from "redux-persist";
import counterReducer from "./slices/counterSlice";
import storage from "redux-persist/lib/storage";

import productReducer from "./user-data/products/product-slice"; 
import selectedProductReducer from "@/store/user-data/products/selectedProduct-slice"; 
import tokenReducer from "@/store/token/token-slice";
import buyerReducer from "@/store/user-data/buyer/buyer-slice"; // ✅ import buyer slicese
import sellerReducer from "@/store/user-data/seller/seller-slice"

// Persist config for token
const tokenPersistConfig = {
  key: "token",
  storage,
};

// (Optional) Persist config for buyer (if you want buyer data saved after reload)
const buyerPersistConfig = {
  key: "buyer",
  storage,
};

const sellerPersistConfig ={
  key: "seller",
  storage,
}

const rootReducer = combineReducers({
  token: persistReducer(tokenPersistConfig, tokenReducer.reducer),
  buyer: persistReducer(buyerPersistConfig, buyerReducer),
  seller: persistReducer(sellerPersistConfig, sellerReducer),
  products: productReducer,
  counter: counterReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  selectedProduct: selectedProductReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
