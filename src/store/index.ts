"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/store/cart/cartSlice";
import  wishlistReducer from "@/store/cart/wishlist-slice";
import { persistReducer, persistStore } from "redux-persist";
import counterReducer from "./slices/counterSlice";
import storage from "redux-persist/lib/storage";

import productReducer from "./user-data/products/product-slice"; 
import selectedProductReducer from "@/store/user-data/products/selectedProduct-slice"; // ✅ fixed import
import toastReducer from "@/store/token/token-slice"

const clientCartPersistConfig = {
  key: "token",
  storage,
};

const rootReducer = combineReducers({
  token: persistReducer(clientCartPersistConfig, toastReducer.reducer),
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
