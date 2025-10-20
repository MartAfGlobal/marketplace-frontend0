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
import buyerReducer from "@/store/user-data/buyer/buyer-slice";
import sellerReducer from "@/store/user-data/seller/seller-slice";

// ✅ Persist configs
const tokenPersistConfig = {
  key: "token",
  storage,
};

const buyerPersistConfig = {
  key: "buyer",
  storage,
};

const sellerPersistConfig = {
  key: "seller",
  storage,
};

// ✅ Add persist config for cart
const cartPersistConfig = {
  key: "cart",
  storage,
};

// (Optional) You can persist wishlist too
const wishlistPersistConfig = {
  key: "wishlist",
  storage,
};

const productsPersistConfig = {
  key: "products",
  storage,
};

const rootReducer = combineReducers({
  token: persistReducer(tokenPersistConfig, tokenReducer.reducer),
  buyer: persistReducer(buyerPersistConfig, buyerReducer),
  seller: persistReducer(sellerPersistConfig, sellerReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
  wishlist: persistReducer(wishlistPersistConfig, wishlistReducer),
  products: persistReducer(productsPersistConfig, productReducer), // ✅ now persisted
  counter: counterReducer,
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
