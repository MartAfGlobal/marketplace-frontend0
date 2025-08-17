"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/store/cart/cartSlice"
import { persistReducer, persistStore } from "redux-persist";
import counterReducer from "./slices/counterSlice";
import storage from "redux-persist/lib/storage";

import productReducer from "./user-data/products/product-slice";
import toastReducer from "./token/token-slice";
// import toastReducer from "./token/token-slice";
// import sellerReducer from "./user-data/seller/seller-slice";

const clientCartPersistConfig = {
  key: "token",
  storage,
};

const rootReducer = combineReducers({
  token: persistReducer(
    clientCartPersistConfig,
    toastReducer.reducer
  ),
   products: productReducer.reducer,
   counter: counterReducer,
     cart: cartReducer, 
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
